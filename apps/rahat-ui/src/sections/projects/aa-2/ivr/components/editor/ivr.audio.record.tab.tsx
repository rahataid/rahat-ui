'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Mic, Square } from 'lucide-react';
import { useUploadFile } from '@rahat-ui/query';
import { useTranslations } from 'next-intl';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';
import { AudioPreviewPlayer } from '../ivr.audio.preview';

type AudioRecordTabProps = {
  prompt: string;
  onUpdate: (updates: { prompt: string }) => void;
  onUploadingChange?: (pending: boolean) => void;
};

export default function AudioRecordTab({ prompt, onUpdate, onUploadingChange }: AudioRecordTabProps) {
  const t = useTranslations('AA_PROJECT');
  const formatLabel = useLabelDigits();
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return formatLabel(`${m}:${s.toString().padStart(2, '0')}`);
  };
  const [phase, setPhase] = useState<'idle' | 'recording' | 'done'>('idle');
  const [timer, setTimer] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadLabel, setUploadLabel] = useState(t('UPLOAD'));
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
      setUploadLabel(t('UPLOADED'));
      setTimeout(() => setUploadLabel(t('UPLOAD')), 2000);
    } catch {
      onUploadingChange?.(false);
      cancelRecording();
    }
  };

  return (
    <div className="space-y-2">
      {phase === 'idle' && (
        <div
          className="border-2 border-dashed border-muted-foreground/30 rounded-sm p-4 md:p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
          onClick={startRecording}
        >
          <Mic className="w-6 h-6 md:w-8 md:h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-[clamp(12px,1vw,14px)] text-muted-foreground">
            {t('CLICK_TO_START_RECORDING')}
          </p>
          <p className="text-[clamp(10px,0.9vw,12px)] text-muted-foreground mt-1">
            {t('BROWSER_WILL_ASK_MIC_ACCESS')}
          </p>
        </div>
      )}
      {phase === 'recording' && (
        <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-sm">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
          <span className="text-sm font-mono font-bold">
            {formatTime(timer)}
          </span>
          <Button
            size="sm"
            variant="destructive"
            className="gap-2 ml-auto rounded-sm h-[clamp(28px,2.5vw,36px)] text-[clamp(12px,1vw,14px)]"
            onClick={stopRecording}
          >
            <Square className="w-4 h-4" />
            {t('STOP')}
          </Button>
        </div>
      )}
      {phase === 'done' && previewUrl && (
        <AudioPreviewPlayer
          src={previewUrl}
          fileName={`${t('RECORDED')} ${formatTime(timer)}`}
          onUpload={uploadRecorded}
          onCancel={cancelRecording}
          uploadLabel={uploadLabel}
        />
      )}
      {prompt.startsWith('blob:') && phase === 'idle' && (
        <p className="text-xs text-green-600 text-center">
          {t('CURRENTLY_USING_RECORDED_AUDIO')}
        </p>
      )}
    </div>
  );
}
