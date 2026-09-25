import { request } from './client';
export const getSafeRoute = (origin, destination, vehicleClass = 'sedan') => request('/api/routing/safe-route', { method: 'POST', body: { origin, destination, vehicle_class: vehicleClass } });
