'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Mic, Square } from 'lucide-react';
import { useUploadFile } from '@rahat-ui/query';
import { AudioPreviewPlayer } from '../ivr.audio.preview';

function formatTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

type AudioRecordTabProps = {
  prompt: string;
  onUpdate: (updates: { prompt: string }) => void;
  onUploadingChange?: (pending: boolean) => void;
};

export default function AudioRecordTab({ prompt, onUpdate, onUploadingChange }: AudioRecordTabProps) {
  const [phase, setPhase] = useState<'idle' | 'recording' | 'done'>('idle');
  const [timer, setTimer] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadLabel, setUploadLabel] = useState('Upload');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const uploadFileMutation = useUploadFile();

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  };

  useEffect(() => {
    return () => cleanup();
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      setTimer(0);
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(blob);
        setPreviewUrl(URL.createObjectURL(blob));
        setPhase('done');
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setPhase('recording');
      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } catch {
      setPhase('idle');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  };

  const cancelRecording = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    cleanup();
    setPhase('idle');
    setTimer(0);
    setRecordedBlob(null);
    setPreviewUrl('');
  };

  const uploadRecorded = async () => {
    if (!recordedBlob) return;
    try {
      const file = new File([recordedBlob], `recording_${Date.now()}.webm`, {
        type: 'audio/webm',
      });
      const formData = new FormData();
      formData.append('file', file);
      onUploadingChange?.(true);
      const { data: afterUpload } = await uploadFileMutation.mutateAsync(formData);
      onUploadingChange?.(false);
      onUpdate({ prompt: afterUpload.mediaURL });
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      cleanup();
      setPhase('idle');
      setTimer(0);
      setRecordedBlob(null);
      setPreviewUrl('');
      setUploadLabel('Uploaded');
      setTimeout(() => setUploadLabel('Upload'), 2000);
    } catch {
      onUploadingChange?.(false);
      cancelRecording();
    }
  };

  return (
    <div className="space-y-2">
      {phase === 'idle' && (
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-full"
          onClick={startRecording}
        >
          <Mic className="w-4 h-4" />
        </Button>
      )}
      {phase === 'recording' && (
        <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-sm">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-mono font-bold">
            {formatTime(timer)}
          </span>
          <Button
            size="sm"
            variant="destructive"
            className="gap-2 ml-auto rounded-sm"
            onClick={stopRecording}
          >
            <Square className="w-4 h-4" />
            Stop
          </Button>
        </div>
      )}
      {phase === 'done' && previewUrl && (
        <AudioPreviewPlayer
          src={previewUrl}
          fileName={`Recorded ${formatTime(timer)}`}
          onUpload={uploadRecorded}
          onCancel={cancelRecording}
          uploadLabel={uploadLabel}
        />
      )}
      {prompt.startsWith('blob:') && phase === 'idle' && (
        <p className="text-xs text-green-600 text-center">
          Currently using recorded audio
        </p>
      )}
    </div>
  );
}
