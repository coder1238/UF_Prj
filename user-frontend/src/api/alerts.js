import { request } from './client';
export const getAlerts = () => request('/api/alerts');
export const postAlert = (payload, token) => request('/api/alerts', { method: 'POST', token, body: payload });
