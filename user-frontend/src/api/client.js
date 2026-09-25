const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');
const REQUEST_TIMEOUT_MS = 4000;

export async function request(path, { method = 'GET', body, token, headers = {}, timeout = REQUEST_TIMEOUT_MS } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const requestHeaders = { Accept: 'application/json', ...headers };
  if (body !== undefined && !(body instanceof URLSearchParams)) requestHeaders['Content-Type'] = 'application/json';
  if (token) requestHeaders.Authorization = `Bearer ${token}`;
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method, headers: requestHeaders,
      body: body === undefined ? undefined : body instanceof URLSearchParams ? body : JSON.stringify(body),
      signal: controller.signal,
    });
    const contentType = response.headers.get('content-type') || '';
    const data = response.status === 204 ? null : contentType.includes('application/json') ? await response.json() : await response.text();
    if (!response.ok) {
      const message = data && typeof data === 'object' ? data.detail || data.message : data;
      throw new Error(message || `Request failed (${response.status})`);
    }
    return data;
  } catch (error) {
    if (error.name === 'AbortError') throw new Error(`Backend request timed out after ${timeout}ms`);
    throw error;
  } finally { clearTimeout(timer); }
}

