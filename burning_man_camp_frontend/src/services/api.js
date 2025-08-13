/**
 * PUBLIC_INTERFACE
 * apiRequest
 * Generic fetch wrapper for REST API calls.
 * - Honors process.env.REACT_APP_API_BASE_URL
 * - Sends/receives JSON
 * - Throws on non-2xx responses
 */
const API_BASE = process.env.REACT_APP_API_BASE_URL || '';

async function handleResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  const isJSON = contentType.includes('application/json');
  const data = isJSON ? await res.json().catch(() => ({})) : await res.text();

  if (!res.ok) {
    const message = (data && data.message) || res.statusText || 'Request failed';
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// PUBLIC_INTERFACE
export async function apiGet(path) {
  /** HTTP GET helper */
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
    credentials: 'include',
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function apiPost(path, body) {
  /** HTTP POST helper */
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body ?? {}),
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function apiPut(path, body) {
  /** HTTP PUT helper */
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body ?? {}),
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function apiDelete(path) {
  /** HTTP DELETE helper */
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'DELETE',
    headers: { 'Accept': 'application/json' },
    credentials: 'include',
  });
  return handleResponse(res);
}
