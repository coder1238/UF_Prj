import { request } from './client';
export const getScenarioCurrent = () => request('/api/scenario/current');
export const activateScenario = (token) => request('/api/scenario/activate', { method: 'POST', token });
export const resetScenario = (token) => request('/api/scenario/reset', { method: 'POST', token });
