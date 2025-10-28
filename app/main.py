# app/main.py
import logging, sys
from pythonjsonlogger import jsonlogger
from typing import Optional
import io, csv

from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

# relative imports (consistent inside the package)
from .schemas import Event, PredictRequest, PredictResponse
from .producer import producer
from .model_handler import model_handler
from .auth import require_auth, create_jwt
from .config import settings
from .db import SessionLocal
from .models_db import EventDB, ExportLog

from sqlalchemy import text

# -----------------------------------
# Logger setup
# -----------------------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()
handler = logging.StreamHandler(sys.stdout)
formatter = jsonlogger.JsonFormatter('%(levelname)s %(name)s %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)
logger.setLevel(logging.INFO)

# -----------------------------------
# FastAPI app setup
# -----------------------------------
app = FastAPI(title="PatternOS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------
# Base endpoints
# -----------------------------------
@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "PatternOS API",
        "database": "connected",
        "env": "dev"
    }

@app.post("/ingest")
def ingest(event: Event):
    payload = event.dict()
    ok = producer.send(payload)
    if not ok:
        raise HTTPException(status_code=500, detail="Unable to persist event")
    return {"status": "accepted"}


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest, current_user: dict = Depends(require_auth)):
    prob = model_handler.predict(req.features)
    return PredictResponse(probability=prob, model_version=model_handler.version)


# -----------------------------------
# Dev Token Generator (for testing)
# -----------------------------------
@app.post("/auth/token")
def token(role: str = Query("platform")):
    """
    Dev-only token generator.
    Use ?role=analyst or ?role=tenant_admin for testing.
    Disabled automatically in production.
    """
    if settings.ENV != "dev":
        raise HTTPException(status_code=403, detail="Token endpoint disabled in production")

    payload = {"sub": "patternos-dev", "role": role}
    token = create_jwt(payload)
    return {"access_token": token, "token_type": "bearer"}


# -----------------------------------
# Protected Segments Endpoint
# -----------------------------------
@app.get("/segments")
def list_segments(current_user: dict = Depends(require_auth)):
    return {
        "segments": [
            {"id": "s1", "name": "Eco-Seekers", "size": 120000},
            {"id": "s2", "name": "Quick-Buyers", "size": 34000},
        ]
    }


# -----------------------------------
# Role-based export limits
# -----------------------------------
ROLE_EXPORT_LIMITS = {
    "platform": 200000,     # full-power role
    "tenant_admin": 50000,  # mid-level role
    "analyst": 5000,        # limited analyst role
    "viewer": 1000,         # read-only
}


# -----------------------------------
# Audience Aggregation (protected)
# -----------------------------------
@app.get("/audience")
def audience(
    tenant_id: Optional[str] = Query(None),
    event_type: Optional[str] = Query(None),
    min_events: int = Query(1, ge=1),
    start_ts: Optional[float] = Query(None),
    end_ts: Optional[float] = Query(None),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    current_user: dict = Depends(require_auth),
):
    """
    Return users aggregated by event counts with optional filters.
    Requires authentication (so role-based limits can apply).
    """
    role = current_user.get("role", "viewer") if current_user else "viewer"
    max_allowed = ROLE_EXPORT_LIMITS.get(role, 1000)

    if limit > max_allowed:
        raise HTTPException(
            status_code=403,
            detail=f"Export limit exceeded for role '{role}'. Max allowed: {max_allowed}",
        )

    db = SessionLocal()
    try:
        where_clauses = []
        params = {"min": min_events, "lim": limit, "off": offset}

        if tenant_id:
            where_clauses.append("tenant_id = :tenant_id")
            params["tenant_id"] = tenant_id
        if event_type:
            where_clauses.append("event_type = :event_type")
            params["event_type"] = event_type
        if start_ts is not None:
            where_clauses.append("timestamp >= :start_ts")
            params["start_ts"] = float(start_ts)
        if end_ts is not None:
            where_clauses.append("timestamp <= :end_ts")
            params["end_ts"] = float(end_ts)

        where_sql = ""
        if where_clauses:
            where_sql = "WHERE " + " AND ".join(where_clauses)

        stmt = text(
            "SELECT user_id, COUNT(*) AS cnt "
            "FROM events "
            f"{where_sql} "
            "GROUP BY user_id "
            "HAVING COUNT(*) >= :min "
            "ORDER BY cnt DESC "
            "LIMIT :lim OFFSET :off"
        )
        rows = db.execute(stmt, params).fetchall()
        result = [{"user_id": r[0], "events": r[1]} for r in rows]
        return {"audience": result, "count": len(result)}
    finally:
        db.close()


# -----------------------------------
# Protected Audience Export (CSV + Parquet) - single endpoint
# -----------------------------------
@app.get("/audience/export_auth")
def audience_export_auth(
    tenant_id: Optional[str] = Query(None),
    event_type: Optional[str] = Query(None),
    min_events: int = Query(1, ge=1),
    start_ts: Optional[float] = Query(None),
    end_ts: Optional[float] = Query(None),
    limit: int = Query(10000, ge=1),
    format: str = Query("csv"),
    current_user: dict = Depends(require_auth),
):
    """
    Stream audience data as CSV or Parquet.
    Protected by JWT with role-based export limits and simple tenant scoping.
    """
    role = current_user.get("role", "viewer")
    sub = current_user.get("sub", "unknown")

    # Role-based max limit
    max_allowed = ROLE_EXPORT_LIMITS.get(role, 1000)
    if limit > max_allowed:
        raise HTTPException(status_code=403, detail=f"Export limit exceeded for role '{role}'. Max allowed: {max_allowed}")

     # Tenant scoping rules (stricter)
    # - tenant_admin must supply tenant_id
    # - analyst/viewer must supply tenant_id
    # - non-platform roles may not request a global export (tenant_id required)
    if role == "tenant_admin" and not tenant_id:
        raise HTTPException(status_code=400, detail="tenant_id required for tenant_admin")

    if role in ("analyst", "viewer") and not tenant_id:
        raise HTTPException(status_code=400, detail="tenant_id required for this role")

    # Platform may export across tenants; others cannot request a global export
    if role != "platform" and tenant_id is None:
        raise HTTPException(status_code=403, detail="tenant access restricted")
    
    # platform can proceed without tenant_id

    if format not in ("csv", "parquet"):
        raise HTTPException(status_code=400, detail="Unsupported format")

    db = SessionLocal()
    try:
        where_clauses = []
        params = {"min": min_events, "lim": limit}

        if tenant_id:
            where_clauses.append("tenant_id = :tenant_id")
            params["tenant_id"] = tenant_id
        if event_type:
            where_clauses.append("event_type = :event_type")
            params["event_type"] = event_type
        if start_ts is not None:
            where_clauses.append("timestamp >= :start_ts")
            params["start_ts"] = float(start_ts)
        if end_ts is not None:
            where_clauses.append("timestamp <= :end_ts")
            params["end_ts"] = float(end_ts)

        where_sql = ""
        if where_clauses:
            where_sql = "WHERE " + " AND ".join(where_clauses)

        stmt = text(
            "SELECT user_id, COUNT(*) AS cnt "
            "FROM events "
            f"{where_sql} "
            "GROUP BY user_id "
            "HAVING COUNT(*) >= :min "
            "ORDER BY cnt DESC "
            "LIMIT :lim"
        )
        rows = db.execute(stmt, params).fetchall()
        row_count = len(rows)

        # prepare audit log values
        audit = ExportLog(
            requested_by=sub,
            role=role,
            tenant_id=tenant_id,
            params={"min_events": min_events, "event_type": event_type, "start_ts": start_ts, "end_ts": end_ts, "limit": limit},
            format=format,
            row_count=row_count,
            note=None,
        )
        try:
            db.add(audit)
            db.commit()
            db.refresh(audit)
        except Exception as e:
            # log the issue but continue streaming the export
            logger.exception("Failed to write ExportLog (non-fatal): %s", e)
            db.rollback()
            audit = None

        # ---- CSV export ----
        if format == "csv":
            def iter_csv():
                out = io.StringIO()
                writer = csv.writer(out)
                writer.writerow(["user_id", "events"])
                yield out.getvalue()
                out.seek(0); out.truncate(0)
                for r in rows:
                    writer.writerow([r[0], r[1]])
                    yield out.getvalue()
                    out.seek(0); out.truncate(0)

            headers = {
                "Content-Disposition": f'attachment; filename="audience_export_{audit.id}.csv"'
            }
            return StreamingResponse(iter_csv(), media_type="text/csv", headers=headers)

        # ---- Parquet export ----
        if format == "parquet":
            try:
                import pandas as pd
                import pyarrow as pa
                import pyarrow.parquet as pq
            except Exception as e:
                audit.note = f"parquet_missing:{e}"
                db.add(audit); db.commit()
                raise HTTPException(status_code=500, detail=f"Parquet support missing: {e}")

            df = pd.DataFrame([(r[0], int(r[1])) for r in rows], columns=["user_id", "events"])
            table = pa.Table.from_pandas(df)
            bio = io.BytesIO()
            pq.write_table(table, bio)
            bio.seek(0)

            headers = {
                "Content-Disposition": f'attachment; filename="audience_export_{audit.id}.parquet"'
            }
            return StreamingResponse(bio, media_type="application/octet-stream", headers=headers)

    finally:
        db.close()
