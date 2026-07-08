const API = '/api';

export async function api(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API}${path}`, { ...options, headers });
  } catch (e) {
    throw new Error('Network error — is the backend running?');
  }

  if (res.status === 401) { localStorage.clear(); window.location.reload(); throw new Error('Unauthorized'); }
  if (res.status === 403) throw new Error('Access denied');

  // Try to parse JSON, fallback to text
  let data;
  const text = await res.text();
  try { data = JSON.parse(text); } catch { data = { message: text }; }

  if (!res.ok) throw new Error(data.error || data.message || `Request failed (${res.status})`);
  return data;
}

export const get = (path) => api(path);
export const post = (path, body) => api(path, { method: 'POST', body: JSON.stringify(body) });
export const put = (path, body) => api(path, { method: 'PUT', body: JSON.stringify(body) });
export const del = (path) => api(path, { method: 'DELETE' });
