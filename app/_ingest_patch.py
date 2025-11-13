# helper to patch main.py ingest function: replace the ingest route to persist to DB
patch='''@app.post("/ingest")
def ingest(event: Event):
    payload = event.dict()
    ok = producer.send(payload)
    # persist to SQL DB
    try:
        from .db import SessionLocal, init_db
        from .models_db import EventDB
        import json
        init_db()  # creates tables if not present
        db = SessionLocal()
        evt = EventDB(
            tenant_id=payload["tenant_id"],
            user_id=payload["user_id"],
            event_type=payload["event_type"],
            product_id=payload.get("product_id"),
            properties=json.dumps(payload.get("properties", {})),
            timestamp=payload.get("timestamp", 0.0)
        )
        db.add(evt)
        db.commit()
        db.refresh(evt)
        db.close()
    except Exception as e:
        # log but don't fail the ingest - fallback behavior
        import logging
        logging.getLogger("patternos").exception("DB persist failed: %s", e)
    if not ok:
        raise HTTPException(status_code=500, detail="Unable to persist event")
    return {"status": "accepted"}'''
# apply patch by replacing the function block
python - <<'PY'
import re, sys, io
p = open('app/main.py','r',encoding='utf8').read()
# replace the old ingest route block (simple approach: match @app.post("/ingest") through return)
new = re.sub(r'@app.post\\(\"/ingest\"\\)[\\s\\S]*?return \\{[\\s\\S]*?\\}', patch, p, count=1)
open('app/main.py','w',encoding='utf8').write(new)
print("Patched app/main.py ingest()")
