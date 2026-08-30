"use client";

import { useEffect, useRef, useState } from "react";

import type { WebSocketMessage } from "@/types/ws.type";

type ConnectionStatus = "connecting" | "connected" | "disconnected";

interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
}

const RECONNECT_DELAY_MS = 5000;
const MAX_RECONNECT_ATTEMPTS = 7;

export const useWebSocket = ({ onMessage }: UseWebSocketOptions = {}) => {
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

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

      ws.onmessage = (event) => {
        if (!isMounted) return;

        let message: WebSocketMessage;
        try {
          message = JSON.parse(event.data as string);
        } catch {
          return;
        }

        onMessageRef.current?.(message);
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
