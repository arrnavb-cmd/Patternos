# tests/test_api_smoke.py
import requests
import os

BASE = os.environ.get("BASE", "http://127.0.0.1:8000")

def test_health_and_token_and_audience():
    # 1) health endpoint should be up
    r = requests.get(f"{BASE}/health", timeout=5)
    assert r.status_code == 200
    j = r.json()
    assert "status" in j and j["status"] == "ok"

    # 2) request a dev token (only works if server ENV=dev)
    tr = requests.post(f"{BASE}/auth/token?role=platform", timeout=5)
    assert tr.status_code == 200, f"token endpoint returned {tr.status_code} {tr.text}"
    token = tr.json().get("access_token")
    assert token, "no access_token returned"

    # 3) call a protected endpoint using token (audience)
    headers = {"Authorization": f"Bearer {token}"}
    ar = requests.get(f"{BASE}/audience?min_events=1&limit=10", headers=headers, timeout=5)
    # OK if 200 with empty list or with rows, but should be authorized
    assert ar.status_code == 200, f"audience failed: {ar.status_code} {ar.text}"
    j = ar.json()
    assert "audience" in j and "count" in j
