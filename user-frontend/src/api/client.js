const REMOTE_PROD_URL = 'https://uf-prj.onrender.com';

function resolveApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocalhost && (!envUrl || envUrl.includes('localhost'))) {
      return REMOTE_PROD_URL;
    }
  }
  return (envUrl || 'http://localhost:8000').replace(/\/$/, '');
}

const API_BASE_URL = resolveApiBaseUrl();
const REQUEST_TIMEOUT_MS = 4000;

export async function request(path, { method = 'GET', body, token, headers = {}, timeout = REQUEST_TIMEOUT_MS } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const requestHeaders = { Accept: 'application/json', ...headers };
  if (body !== undefined && !(body instanceof URLSearchParams)) requestHeaders['Content-Type'] = 'application/json';
  if (token) requestHeaders.Authorization = `Bearer ${token}`;
  try {
    let response;
    try {
      response = await fetch(`${API_BASE_URL}${path}`, {
        method, headers: requestHeaders,
        body: body === undefined ? undefined : body instanceof URLSearchParams ? body : JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (fetchErr) {
      if (API_BASE_URL.includes('localhost') && fetchErr.name !== 'AbortError') {
        response = await fetch(`${REMOTE_PROD_URL}${path}`, {
          method, headers: requestHeaders,
          body: body === undefined ? undefined : body instanceof URLSearchParams ? body : JSON.stringify(body),
          signal: controller.signal,
        });
      } else {
        throw fetchErr;
      }
    }
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

