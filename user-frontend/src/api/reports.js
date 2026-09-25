import { request } from './client';
export const submitReport = (payload) => request('/api/reports', { method: 'POST', body: payload });
export const getReports = () => request('/api/reports');
export const getReport = (id) => request(`/api/reports/${encodeURIComponent(id)}`);
export const verifyReport = (id, action, token) => request(`/api/reports/${encodeURIComponent(id)}/verify`, { method: 'PATCH', token, body: { action } });
