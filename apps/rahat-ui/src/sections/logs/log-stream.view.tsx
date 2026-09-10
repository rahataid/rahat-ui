'use client';

import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Card } from '@rahat-ui/shadcn/src/components/ui/card';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { cn } from '@rahat-ui/shadcn/src/utils';
import { Pause, Play, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  STREAM_URL,
  useLogStream,
  type ConnectionState,
  type LogEntry,
} from '../../hooks/use-log-stream';

/** Older lines are dropped: this is a tail, not an archive. */
const LIMIT = 2000;

const LEVELS = ['error', 'warn', 'log', 'debug', 'verbose'] as const;

const LEVEL_STYLE: Record<LogEntry['level'], string> = {
  error: 'text-red-600 dark:text-red-400',
  warn: 'text-amber-600 dark:text-amber-400',
  log: 'text-foreground',
  debug: 'text-muted-foreground',
  verbose: 'text-muted-foreground',
};

const STATUS_LABEL: Record<ConnectionState, string> = {
  connecting: 'Connecting',
  live: 'Live',
  offline: 'Reconnecting',
};

function ConnectionBadge({ status }: { status: ConnectionState }) {
  const live = status === 'live';
  return (
    <Badge
      className={cn(
        'flex items-center rounded font-normal',
        live
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      )}
    >
      <span
        className={cn(
          'mr-1.5 h-1.5 w-1.5 rounded-full',
          live ? 'bg-green-600' : 'bg-amber-600',
        )}
        aria-hidden
      />
      {STATUS_LABEL[status]}
    </Badge>
  );
}

/** `HH:MM:SS.mmm` — the date is noise when you are watching a live tail. */
function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;
  return (
    date.toTimeString().slice(0, 8) +
    `.${String(date.getMilliseconds()).padStart(3, '0')}`
  );
}

export default function LogStreamView() {
  const [paused, setPaused] = useState(false);
  const [level, setLevel] = useState<'all' | LogEntry['level']>('all');
  const [search, setSearch] = useState('');

  const { entries, status, clear } = useLogStream({ paused, limit: LIMIT });

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return entries.filter((entry) => {
      if (level !== 'all' && entry.level !== level) return false;
      if (!needle) return true;
      return (
        entry.message?.toLowerCase().includes(needle) ||
        entry.context?.toLowerCase().includes(needle)
      );
    });
  }, [entries, level, search]);

  const scroller = useRef<HTMLDivElement>(null);
  const pinned = useRef(true);

  // Follow the tail only while the viewer is already at the bottom, so
  // scrolling back to read something does not get yanked away.
  useEffect(() => {
    const node = scroller.current;
    if (node && pinned.current) node.scrollTop = node.scrollHeight;
  }, [visible]);

  return (
    <div className="p-4 space-y-4 bg-secondary">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Log Stream</h1>
          <p className="text-muted-foreground text-sm">
            Live output from the Connect API, as it happens.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ConnectionBadge status={status} />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPaused((value) => !value)}
          >
            {paused ? (
              <Play className="mr-1.5 h-4 w-4" />
            ) : (
              <Pause className="mr-1.5 h-4 w-4" />
            )}
            {paused ? 'Resume' : 'Pause'}
          </Button>
          <Button variant="outline" size="sm" onClick={clear}>
            <Trash2 className="mr-1.5 h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b p-3">
          <Select
            value={level}
            onValueChange={(value) => setLevel(value as typeof level)}
          >
            <SelectTrigger className="w-36" aria-label="Level">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
              {LEVELS.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            className="w-64"
            placeholder="Filter by message or context..."
            aria-label="Filter logs"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <span className="ml-auto text-sm text-muted-foreground">
            {visible.length === entries.length
              ? `${entries.length} lines`
              : `${visible.length} of ${entries.length} lines`}
            {paused ? ' · paused' : ''}
          </span>
        </div>

        <div
          ref={scroller}
          onScroll={(event) => {
            const node = event.currentTarget;
            pinned.current =
              node.scrollHeight - node.scrollTop - node.clientHeight < 40;
          }}
          className="h-[65vh] overflow-auto bg-muted/30 p-3 font-mono text-xs leading-relaxed"
          role="log"
          aria-live="polite"
        >
          {visible.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-1 text-center">
              <p className="text-sm font-medium">
                {entries.length
                  ? 'Nothing matches'
                  : status === 'offline'
                  ? 'Cannot reach the stream'
                  : 'Waiting for output'}
              </p>
              <p className="text-xs text-muted-foreground">
                {entries.length
                  ? 'No lines match the current filter.'
                  : status === 'offline'
                  ? 'The endpoint below did not respond. It only exists on Connect builds that include the log-stream library.'
                  : 'Lines appear here as the Connect API logs them.'}
              </p>
              {!entries.length && (
                // The endpoint is a build-time env var, so naming it here is
                // the difference between "it is broken" and "it is misconfigured".
                <p className="mt-1 break-all font-mono text-[11px] text-muted-foreground">
                  {STREAM_URL}
                </p>
              )}
            </div>
          ) : (
            visible.map((entry, index) => (
              <div
                key={`${entry.timestamp}-${index}`}
                className="flex gap-2 whitespace-pre-wrap break-words py-0.5"
              >
                <span className="shrink-0 text-muted-foreground">
                  {formatTime(entry.timestamp)}
                </span>
                <span
                  className={cn(
                    'w-14 shrink-0 uppercase',
                    LEVEL_STYLE[entry.level],
                  )}
                >
                  {entry.level}
                </span>
                <span className="shrink-0 text-primary">[{entry.context}]</span>
                <span className={LEVEL_STYLE[entry.level]}>
                  {entry.message}
                </span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
