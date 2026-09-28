import { useTranslations } from "next-intl";

import React, { useState, useRef, useCallback } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@rahat-ui/shadcn/src/components/ui/tabs';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { CloudUpload, Mic } from 'lucide-react';
import { AudioRecorder } from '../../activities/components/recorder';
import { useFormContext } from 'react-hook-form';
import { cn } from '@rahat-ui/shadcn/src/utils';

export function VoiceMessageSource() {
  const t = useTranslations("AA_PROJECT");
  const { setValue, watch, formState: { errors } } = useFormContext<any>();
  const audioFileVal = watch('audioFile');
  const [isRecording, setIsRecording] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timer, setTimer] = useState(0);
  const [recordedFile, setRecordedFile] = useState<string | null>(null);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  const mediaRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const isResettingRef = useRef(false);

  const pad = (num: number) => String(num).padStart(2, '0');
  const hh = pad(Math.floor(timer / 3600));
  const mm = pad(Math.floor((timer % 3600) / 60));
  const ss = pad(timer % 60);

  const updateTimer = () => {
    setTimer((t) => t + 1);
    timerRef.current = setTimeout(updateTimer, 1000);
  };

  const startRecording = async () => {
    try {
      isResettingRef.current = false;
      setRecordedFile(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      analyserRef.current = analyser;
      audioCtxRef.current = ctx;

      const recorder = new MediaRecorder(stream);
      mediaRef.current = recorder;

      const localChunks: Blob[] = [];
      recorder.ondataavailable = (e) => localChunks.push(e.data);
      recorder.onstop = () => {
        if (isResettingRef.current) {
          isResettingRef.current = false;
          return;
        }
        const blob = new Blob(localChunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setRecordedFile(url);
        setChunks(localChunks);
        setIsFinished(true);
        setValue('audioFile', blob, { shouldValidate: true });
      };

      recorder.start();
      setIsRecording(true);
      setTimer(0);
      updateTimer();
    } catch (error) {
      console.error(error);
      alert(t('MICROPHONE_ACCESS_REQUIRED'));
    }
  };

  const stopAll = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsRecording(false);
    analyserRef.current?.disconnect();
    audioCtxRef.current?.close();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  const stopRecording = () => {
    if (mediaRef.current?.state !== 'inactive') mediaRef.current?.stop();
    if (animationRef.current) { cancelAnimationFrame(animationRef.current); animationRef.current = null; }
    stopAll();
    setIsPaused(false);
  };

  const resetRecording = () => {
    isResettingRef.current = true;
    mediaRef.current?.stop();
    stopAll();
    setChunks([]);
    setRecordedFile(null);
    setIsFinished(false);
    setIsPaused(false);
    setValue('audioFile', undefined, { shouldValidate: true });
  };

  const pauseRecording = useCallback(() => {
    if (mediaRef.current?.state === 'recording') {
      mediaRef.current.pause();
      setIsPaused(true);
      clearTimeout(timerRef.current);
    }
  }, []);

  const resumeRecording = () => {
    if (mediaRef.current?.state === 'paused') {
      mediaRef.current.resume();
      setIsPaused(false);
      updateTimer();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-1">
        <Label>{t('VOICE_MESSAGE_SOURCE')}</Label>
        {errors.audioFile && (
          <p className="text-sm font-medium text-destructive">{errors.audioFile.message as string}</p>
        )}
      </div>
      <Tabs defaultValue="upload" className="w-full border rounded-md p-4 bg-slate-50">
        <TabsList className="mb-4">
          <TabsTrigger value="upload" className="gap-2"><CloudUpload className="w-4 h-4" /> {t('UPLOAD_AUDIO')}</TabsTrigger>
          <TabsTrigger value="record" className="gap-2"><Mic className="w-4 h-4" /> {t('RECORD_AUDIO')}</TabsTrigger>
        </TabsList>
        <TabsContent value="upload" className="space-y-4">
          <div className="space-y-2">
            <Input 
              type="file" 
              accept="audio/*" 
              className={cn(
                errors.audioFile && "shadow-[inset_4px_0_0_0_hsl(var(--destructive))] bg-red-50 focus-visible:ring-2 focus-visible:ring-destructive",
                !errors.audioFile && !!audioFileVal && "shadow-[inset_4px_0_0_0_hsl(var(--primary))] bg-blue-50 pl-2"
              )}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setValue('audioFile', e.target.files[0], { shouldValidate: true });
                } else {
                  setValue('audioFile', undefined, { shouldValidate: true });
                }
              }}
            />
          </div>
        </TabsContent>
        <TabsContent value="record" className="space-y-4">
          <AudioRecorder
            isRecording={isRecording} isFinished={isFinished} timer={`${hh}:${mm}:${ss}`} recordedFile={recordedFile}
            chunks={chunks} setChunks={setChunks} startRecording={startRecording} stopRecording={stopRecording}
            resetRecording={resetRecording} animationRef={animationRef} analyserRef={analyserRef}
            resumeRecording={resumeRecording} pauseRecording={pauseRecording} isPaused={isPaused}
            handleUpload={() => { }} canvasRef={canvasRef} fileUploadPending={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
