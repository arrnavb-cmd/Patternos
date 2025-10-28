# scripts/seed_events.py
import time, random, requests, os

# From host use 127.0.0.1:8000 (when backend runs on host)
# If running script inside container, use http://localhost:8000
BASE = os.environ.get("PATTERNOS_BASE", "http://127.0.0.1:8000")

def make_event(user_id, tenant="t1", event_type="purchase"):
    return {
        "user_id": user_id,
        "tenant_id": tenant,
        "event_type": event_type,
        "timestamp": time.time()
    }

def main():
    for i in range(1, 301):  # create 300 events across ~50 users
        uid = f"user_{random.randint(1,50)}"
        e = make_event(uid, tenant="t1", event_type=random.choice(["view","purchase","signup"]))
        try:
            r = requests.post(f"{BASE}/ingest", json=e, timeout=5)
            print(i, r.status_code, r.text.strip())
        except Exception as exc:
            print("ERR", exc)

if __name__ == "__main__":
    main()
