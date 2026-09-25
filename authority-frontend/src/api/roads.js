import { request } from './client';
export const getRoads = () => request('/api/roads');
export const patchRoadStatus = (id, status, token) => request(`/api/roads/${encodeURIComponent(id)}/status?status=${encodeURIComponent(status)}`, { method: 'PATCH', token });
