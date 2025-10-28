import React, { useEffect, useState } from "react";

/**
 * Simple dashboard (frontend/src/App.jsx)
 * - uses full BACKEND URL to avoid relative-path issues in dev
 * - fetches token from backend, then calls protected endpoints
 */
// use Vite env if provided, otherwise fall back to relative '' for nginx proxying
const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export default function App() {
  const [segments, setSegments] = useState([]);
  const [audience, setAudience] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // attempt to get token and then fetch data
    getTokenAndLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getTokenAndLoad(role = "platform") {
    try {
      const tokenUrl = `${BACKEND}/auth/token?role=${encodeURIComponent(role)}`;
      const res = await fetch(tokenUrl, { method: "POST" });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`token fetch failed: ${res.status} ${txt}`);
      }
      const j = await res.json();
      if (!j.access_token) throw new Error("no access_token in response");
      setToken(j.access_token);
      // load protected data
      await fetchSegments(j.access_token);
      await fetchAudience(j.access_token);
    } catch (err) {
      console.error("Failed to get token:", err);
      alert("Failed to get token. Backend may not be running.");
    }
  }

  async function fetchSegments(authToken) {
    try {
      const url = `${BACKEND}/segments`;
      const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
      const r = await fetch(url, { headers });
      if (!r.ok) {
        console.warn("segments fetch not ok", r.status);
        return;
      }
      const j = await r.json();
      setSegments(j.segments || []);
    } catch (e) {
      console.error("fetchSegments error", e);
    }
  }

  async function fetchAudience(authToken) {
    setLoading(true);
    try {
      const url = `${BACKEND}/audience?min_events=1&limit=10`;
      const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
      const r = await fetch(url, { headers });
      if (!r.ok) {
        console.warn("audience fetch not ok", r.status);
        setAudience([]);
        return;
      }
      const j = await r.json();
      setAudience(j.audience || []);
    } catch (e) {
      console.error("fetchAudience error", e);
      setAudience([]);
    } finally {
      setLoading(false);
    }
  }

  async function downloadExport(format = "csv") {
    try {
      if (!token) {
        alert("Missing token; refresh the page to obtain one.");
        return;
      }
      const url = `${BACKEND}/audience/export_auth?min_events=1&limit=1000&format=${encodeURIComponent(
        format
      )}`;
      const resp = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`Export failed: ${resp.status} ${txt}`);
      }
      const cd = resp.headers.get("content-disposition") || "";
      const match = cd.match(/filename="([^"]+)"/);
      const filename = match ? match[1] : `audience_export.${format === "parquet" ? "parquet" : "csv"}`;

      const blob = await resp.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error(err);
      alert("Export failed: " + err.message);
    }
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: 20 }}>
      <h1>PatternOS Dashboard</h1>

      <section style={{ marginBottom: 20 }}>
        <button onClick={() => fetchAudience(token)} disabled={loading}>
          {loading ? "Loading..." : "Refresh Audience"}
        </button>
        <button onClick={() => downloadExport("csv")} style={{ marginLeft: 10 }}>
          Download CSV
        </button>
        <button onClick={() => downloadExport("parquet")} style={{ marginLeft: 10 }}>
          Download Parquet
        </button>
      </section>

      <section style={{ display: "flex", gap: 40 }}>
        <div style={{ flex: 1 }}>
          <h2>Segments</h2>
          <ul>
            {segments.map((s) => (
              <li key={s.id}>
                {s.name} — size: {s.size}
              </li>
            ))}
            {segments.length === 0 && <li>No segments</li>}
          </ul>
        </div>

        <div style={{ flex: 2 }}>
          <h2>Top audience</h2>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <table border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Events</th>
                </tr>
              </thead>
              <tbody>
                {audience.map((a) => (
                  <tr key={a.user_id}>
                    <td>{a.user_id}</td>
                    <td>{a.events}</td>
                  </tr>
                ))}
                {audience.length === 0 && (
                  <tr>
                    <td colSpan="2">No audience (ingest some events)</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
