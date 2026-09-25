import { request } from './client';
export const getIncidents = () => request('/api/incidents');
export const assignIncident = (id, teamId, token) => request(`/api/incidents/${encodeURIComponent(id)}/assign`, { method: 'PATCH', token, body: { team_id: teamId } });
