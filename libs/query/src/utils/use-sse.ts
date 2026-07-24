'use client';

import { useEffect, useRef } from 'react';

type SSEEvent = {
  event: string;
  data: any;
  timestamp: string;
};

type SSEOptions = {
  url: string;
  getToken?: () => string | null;
  onMessage?: (event: SSEEvent) => void;
  onError?: (err: any) => void;
  enabled?: boolean;
};

function parseSSELine(line: string): SSEEvent | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith(':')) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

export function useSSE({
  url,
  getToken,
  onMessage,
  onError,
  enabled = true,
}: SSEOptions) {
  const onMessageRef = useRef(onMessage);
  const onErrorRef = useRef(onError);
  const getTokenRef = useRef(getToken);
  onMessageRef.current = onMessage;
  onErrorRef.current = onError;
  getTokenRef.current = getToken;

  useEffect(() => {
    if (!enabled || !url) return;

    let aborted = false;
    let reconnectTimer: ReturnType<typeof setTimeout>;

    const connect = async () => {
      const token = getTokenRef.current?.();
      const headers: Record<string, string> = {
        Accept: 'text/event-stream',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      try {
        const response = await fetch(url, { headers });
        if (!response.ok) throw new Error(`SSE: HTTP ${response.status}`);

        const reader = response.body?.getReader();
        if (!reader) return;

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done || aborted) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const parsed = parseSSELine(line);
            if (parsed) onMessageRef.current?.(parsed);
          }
        }
      } catch (err: any) {
        onErrorRef.current?.(err);
        if (!aborted) reconnectTimer = setTimeout(connect, 5000);
      }
    };

    connect();

    return () => {
      aborted = true;
      clearTimeout(reconnectTimer);
    };
  }, [url, enabled]);
}
