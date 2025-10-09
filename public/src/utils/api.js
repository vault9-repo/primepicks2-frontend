// central place to manage backend base URL + simple wrappers
export const API_BASE = "https://primepickstip.onrender.com";

async function checkRes(res) {
  if (!res.ok) {
    const text = await res.text().catch(()=>"");
    const err = new Error(`HTTP ${res.status}: ${text || res.statusText}`);
    err.status = res.status;
    throw err;
  }
  return res.json().catch(()=>null);
}

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, { credentials: "omit" });
  return checkRes(res);
}

export async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return checkRes(res);
}

export async function apiDelete(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return checkRes(res);
}
