import { useEffect, useRef } from 'react';

export function useScenarioSocket(onMessage, onStatus) {
  const messageRef = useRef(onMessage);
  const statusRef = useRef(onStatus);
  useEffect(() => { messageRef.current = onMessage; }, [onMessage]);
  useEffect(() => { statusRef.current = onStatus; }, [onStatus]);
  useEffect(() => {
    let socket; let reconnectTimer; let stopped = false; let delay = 1000;
    const url = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';
    const connect = () => {
      if (stopped) return;
      try { socket = new WebSocket(url); }
      catch (error) { statusRef.current?.(false); schedule(); return; }
      socket.onopen = () => { delay = 1000; statusRef.current?.(true); };
      socket.onmessage = (event) => {
        try { messageRef.current?.(JSON.parse(event.data)); }
        catch (error) { console.warn('[API] Ignoring malformed WebSocket message', error); }
      };
      socket.onerror = () => socket.close();
      socket.onclose = () => { statusRef.current?.(false); schedule(); };
    };
    const schedule = () => {
      if (stopped || reconnectTimer) return;
      reconnectTimer = setTimeout(() => { reconnectTimer = null; connect(); }, delay);
      delay = Math.min(delay * 2, 15000);
    };
    connect();
    return () => { stopped = true; clearTimeout(reconnectTimer); socket?.close(); };
  }, []);
}
