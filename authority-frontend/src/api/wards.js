import { request } from './client';
export const getWards = () => request('/api/wards');
export const getWard = (id) => request(`/api/wards/${encodeURIComponent(id)}`);
