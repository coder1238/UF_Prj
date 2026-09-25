import { request, setSessionToken } from './client';
export async function login(username, password) {
  const form = new URLSearchParams({ username, password });
  const result = await request('/api/auth/login', { method: 'POST', body: form });
  setSessionToken(result.access_token);
  return result;
}
export const getMe = (token) => request('/api/auth/me', { token });
export { setSessionToken };
