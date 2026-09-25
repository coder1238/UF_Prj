import { useEffect, useRef } from 'react';

const REMOTE_WS_URL = 'wss://uf-prj.onrender.com/ws';

function getDefaultWsUrl() {
  const envWs = import.meta.env.VITE_WS_URL;
  const envApi = import.meta.env.VITE_API_BASE_URL;
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocalhost || window.location.protocol === 'https:') {
      if (!envWs || envWs.includes('localhost') || envWs.startsWith('ws://')) {
        return REMOTE_WS_URL;
      }
    }
  }
  if (envWs) return envWs;
  if (envApi) {
    return envApi.replace(/^http/, 'ws').replace(/\/$/, '') + '/ws';
  }
  return 'ws://localhost:8000/ws';
}

export function useScenarioSocket(onMessage, onStatus) {
  const messageRef = useRef(onMessage);
  const statusRef = useRef(onStatus);
  useEffect(() => { messageRef.current = onMessage; }, [onMessage]);
  useEffect(() => { statusRef.current = onStatus; }, [onStatus]);
  useEffect(() => {
    let socket; let reconnectTimer; let stopped = false; let delay = 1000;
    let currentUrl = getDefaultWsUrl();
    let triedFallback = false;
    const connect = () => {
      if (stopped) return;
      try { socket = new WebSocket(currentUrl); }
      catch (error) {
        if (!triedFallback && currentUrl.includes('localhost')) {
          triedFallback = true;
          currentUrl = REMOTE_WS_URL;
          try { socket = new WebSocket(currentUrl); }
          catch { statusRef.current?.(false); schedule(); return; }
        } else {
          statusRef.current?.(false); schedule(); return;
        }
      }
      socket.onopen = () => { delay = 1000; statusRef.current?.(true); };
      socket.onmessage = (event) => {
        try { messageRef.current?.(JSON.parse(event.data)); }
        catch (error) { console.warn('[API] Ignoring malformed WebSocket message', error); }
      };
      socket.onerror = () => {
        if (!triedFallback && currentUrl.includes('localhost')) {
          triedFallback = true;
          currentUrl = REMOTE_WS_URL;
        }
      };
      socket.onclose = () => { statusRef.current?.(false); schedule(); };
    };
    const schedule = () => {
      if (stopped || reconnectTimer) return;
      reconnectTimer = setTimeout(() => { reconnectTimer = null; connect(); }, delay);
      delay = Math.min(delay * 2, 15000);
    };
    connect();
    return () => {
      stopped = true;
      clearTimeout(reconnectTimer);
      if (socket) {
        socket.onopen = null;
        socket.onmessage = null;
        socket.onerror = null;
        socket.onclose = null;
        if (socket.readyState === WebSocket.OPEN) {
          socket.close();
        } else if (socket.readyState === WebSocket.CONNECTING) {
          socket.onopen = () => {
            try { socket.close(); } catch {}
          };
        }
      }
    };
  }, []);
}
