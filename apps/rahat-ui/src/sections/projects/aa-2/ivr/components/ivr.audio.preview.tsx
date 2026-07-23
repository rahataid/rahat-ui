'use client';

import { useRef, useState } from 'react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Play, Pause, Upload } from 'lucide-react';

type AudioPreviewPlayerProps = {
  src: string;
  fileName: string;
  onUpload: () => void;
  onCancel: () => void;
  uploadLabel?: string;
};

export function AudioPreviewPlayer({
  src,
  fileName,
  onUpload,
  onCancel,
}: AudioPreviewPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setPlaying(true))
        .catch(() => undefined);
    }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrent(val);
    }
  };

  return (
    <div className="p-4 border rounded-sm space-y-2">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 shrink-0"
          onClick={toggle}
        >
          {playing ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </Button>
        <span className="text-xs text-muted-foreground w-10 tabular-nums shrink-0">
          {fmt(current)}
        </span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={current}
          onChange={seek}
          className="flex-1 h-1 accent-primary cursor-pointer"
        />
        <span className="text-xs text-muted-foreground w-10 tabular-nums shrink-0">
          {fmt(duration)}
        </span>
      </div>
      <div className="text-xs text-muted-foreground truncate">{fileName}</div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="rounded-sm flex-1"
          onClick={onCancel}
        >
          Discard
        </Button>
        <Button
          size="sm"
          variant="default"
          className="gap-2 rounded-sm flex-1"
          onClick={onUpload}
        >
          <Upload className="w-4 h-4" />
          Upload
        </Button>
      </div>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={() => setCurrent(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => setPlaying(false)}
        preload="metadata"
        className="hidden"
      />
    </div>
  );
}
