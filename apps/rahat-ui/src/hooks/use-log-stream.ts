'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type LogEntry = {
  timestamp: string;
  level: 'log' | 'warn' | 'error' | 'debug' | 'verbose';
  context: string;
  message: string;
};

export type ConnectionState = 'connecting' | 'live' | 'offline';

/** Connect exposes its logs as SSE under its own `api/v1` global prefix. */
export const STREAM_URL =
  process.env.NEXT_PUBLIC_CONNECT_LOG_STREAM_URL ||
  `${process.env.NEXT_PUBLIC_API_COMMUNICATION_URL}/api/v1/logs/stream`;

const FLUSH_MS = 250;

/**
 * A new connection replays the last ~200 entries, so anything arriving right
 * after `open` may already be on screen after a reconnect.
 */
const REPLAY_WINDOW_MS = 2000;

function keyOf(entry: LogEntry): string {
  return `${entry.timestamp}|${entry.level}|${entry.context}|${entry.message}`;
}

export function useLogStream({
  paused,
  limit,
}: {
  paused: boolean;
  limit: number;
}) {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [status, setStatus] = useState<ConnectionState>('connecting');

  const pending = useRef<LogEntry[]>([]);
  const seen = useRef(new Set<string>());
  const replayUntil = useRef(0);
  // Read inside the EventSource handler, which is created once per mount.
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const clear = useCallback(() => {
    pending.current = [];
    seen.current.clear();
    setEntries([]);
  }, []);

  useEffect(() => {
    const source = new EventSource(STREAM_URL);

    source.onopen = () => {
      setStatus('live');
      replayUntil.current = Date.now() + REPLAY_WINDOW_MS;
    };

    // EventSource reconnects on its own; this only reports the gap.
    source.onerror = () => setStatus('offline');

    source.onmessage = (event) => {
      // Heartbeats carry no payload.
      if (!event.data) return;

      let entry: LogEntry;
      try {
        entry = JSON.parse(event.data);
      } catch {
        return;
      }

      if (Date.now() < replayUntil.current) {
        const key = keyOf(entry);
        if (seen.current.has(key)) return;
        seen.current.add(key);
      }

      pending.current.push(entry);
      // A long pause must not grow the backlog without bound.
      if (pending.current.length > limit) {
        pending.current = pending.current.slice(-limit);
      }
    };

    const timer = setInterval(() => {
      if (pausedRef.current || pending.current.length === 0) return;
      const incoming = pending.current;
      pending.current = [];
      setEntries((prev) => [...prev, ...incoming].slice(-limit));
    }, FLUSH_MS);

    return () => {
      clearInterval(timer);
      source.close();
    };
  }, [limit]);

  useEffect(() => {
    // Keys only guard the replay window, so the set can be dropped once past it.
    const timer = setInterval(() => {
      if (Date.now() > replayUntil.current) seen.current.clear();
    }, REPLAY_WINDOW_MS);
    return () => clearInterval(timer);
  }, []);

  return { entries, status, clear };
}
