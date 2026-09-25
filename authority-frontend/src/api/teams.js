import { request } from './client';
export const getTeams = () => request('/api/teams');
export const patchTeam = (id, payload, token) => request(`/api/teams/${encodeURIComponent(id)}`, { method: 'PATCH', token, body: payload });
