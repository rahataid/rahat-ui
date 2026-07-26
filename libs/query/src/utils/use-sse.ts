'use client';

import { useEffect, useRef } from 'react';

type SSEEvent = {
  event: string;
  data: any;
  timestamp: string;
};

type SSEOptions = {
  url: string;
  onMessage?: (event: SSEEvent) => void;
  onError?: (err: Event) => void;
  enabled?: boolean;
};

export function useSSE({
  url,
  onMessage,
  onError,
  enabled = true,
}: SSEOptions) {
  const onMessageRef = useRef(onMessage);
  const onErrorRef = useRef(onError);
  onMessageRef.current = onMessage;
  onErrorRef.current = onError;

  useEffect(() => {
    if (!enabled || !url) return;

    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const parsed: SSEEvent = JSON.parse(event.data);
        onMessageRef.current?.(parsed);
      } catch {
        console.error('SSE: failed to parse message', event.data);
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE connection error');
      onErrorRef.current?.(err);
    };

    return () => {
      eventSource.close();
    };
  }, [url, enabled]);
}
