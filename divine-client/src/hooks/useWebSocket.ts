"use client";

import { useEffect, useState } from "react";

type ConnectionStatus = "connecting" | "connected" | "disconnected";

const RECONNECT_DELAY_MS = 5000;
const MAX_RECONNECT_ATTEMPTS = 7;

export const useWebSocket = () => {
  const [status, setStatus] = useState<ConnectionStatus>("connecting");

  useEffect(() => {
    let ws: WebSocket | null = null;
    let isMounted = true;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let attemptCount = 0;

    const connect = () => {
      setStatus("connecting");

      ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/v1/ws`);

      ws.onopen = () => {
        if (!isMounted) return;
        attemptCount = 0;
        setStatus("connected");
      };

      ws.onclose = () => {
        if (!isMounted) return;
        attemptCount += 1;
        setStatus("disconnected");

        if (attemptCount >= MAX_RECONNECT_ATTEMPTS) return;
        reconnectTimer = setTimeout(connect, RECONNECT_DELAY_MS);
      };

      ws.onerror = () => {
        ws?.close();
      };
    };

    connect();

    return () => {
      isMounted = false;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      ws?.close();
    };
  }, []);

  return {
    status,
    isConnected: status === "connected",
  };
};
