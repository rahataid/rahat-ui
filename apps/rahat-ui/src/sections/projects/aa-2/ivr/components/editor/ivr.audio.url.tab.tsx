'use client';

import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';

type AudioUrlTabProps = {
  prompt: string;
  onUpdate: (updates: { prompt: string }) => void;
};

export default function AudioUrlTab({ prompt, onUpdate }: AudioUrlTabProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="prompt-url-input">Audio URL</Label>
      <Input
        id="prompt-url-input"
        value={prompt}
        onChange={(e) => onUpdate({ prompt: e.target.value })}
        placeholder="https://example.com/audio.mp3"
        className="text-xs"
      />
    </div>
  );
}
