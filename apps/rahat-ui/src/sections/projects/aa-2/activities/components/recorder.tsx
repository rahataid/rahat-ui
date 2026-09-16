'use client';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';
import { cn } from '@rahat-ui/shadcn/src';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Mic,
  Trash,
  StopCircle,
  UploadIcon,
  PauseIcon,
  PlayIcon,
  MicIcon,
  CheckCircle,
  Dot,
} from 'lucide-react';
import { Label } from '@radix-ui/react-dropdown-menu';

type Props = {
  isRecording: boolean;
  isFinished: boolean;
  timer: string;
  recordedFile: string | null;
  chunks: Blob[];
  setChunks: React.Dispatch<React.SetStateAction<Blob[]>>;
  startRecording: () => void;
  stopRecording: () => void;
  resetRecording: () => void;
  resumeRecording: () => void;
  pauseRecording: () => void;
  isPaused: boolean;
  handleUpload: VoidFunction;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  className?: string;
  timerClassName?: string;
  animationRef: React.MutableRefObject<number | null>;
  analyserRef: React.MutableRefObject<AnalyserNode | null>;
  fileUploadPending: any;
};

export const AudioRecorder = ({
  isRecording,
  isFinished,
  timer,
  recordedFile,
  chunks,
  setChunks,
  startRecording,
  stopRecording,
  resetRecording,
  handleUpload,
  canvasRef,
  className,
  timerClassName,
  analyserRef,
  animationRef,
  isPaused,
  pauseRecording,
  resumeRecording,
  fileUploadPending,
}: Props) => {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  useEffect(() => {
    if (!isRecording || !canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    ctx.scale(dpr, dpr);

    const draw = () => {
      if (!isRecording || !analyserRef.current) return;

      animationRef.current = requestAnimationFrame(draw);

      const buffer = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(buffer);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / buffer.length) * 2.5;
      let x = 0;

      for (let i = 0; i < buffer.length; i++) {
        const height = (buffer[i] / 255) * canvas.height;
        const red = (height / canvas.height) * 255;
        const green = 250 - red;
        const blue = 150;

        ctx.fillStyle = `rgb(${red},${green},${blue})`;
        ctx.fillRect(x, canvas.height - height, barWidth, height);

        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRecording, canvasRef, analyserRef, animationRef]);

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4 w-full  mx-auto p-4 border rounded-xl bg-muted/30',
        className,
      )}
    >
      <div className="flex gap-4 item-center justify-center">
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          height={50}
          className={cn('w-full transition-all duration-300', {
            hidden: !isRecording,
          })}
        />
        {/* Timer */}
        {isRecording && (
          <div
            className={cn(
              'font-mono text-base  px-1 py-1 rounded-md  text-foreground flex items-center justify-center',
              timerClassName,
            )}
          >
            <span className="mr-1">
              {' '}
              <Dot color="red" className="w-8 h-8" />
            </span>{' '}
            {timer} <span className="text-xs ml-1">{t('RECORDING')}</span>
          </div>
        )}
      </div>
      {isFinished && recordedFile && (
        <audio controls src={recordedFile} className="w-full" />
      )}
      {/* Buttons */}
      <div className="flex gap-3">
        {isRecording && (
          <>
            {isPaused ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={resumeRecording}
                      variant="outline"
                      className="rounded-sm gap-2"
                      type="button"
                    >
                      <PlayIcon size={16} /> {t('RESUME')}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t('RESUME')}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={pauseRecording}
                      variant="outline"
                      className="rounded-sm gap-2"
                      type="button"
                    >
                      <PauseIcon size={16} /> {t('PAUSE')}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t('PAUSE')}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={stopRecording}
                    variant="destructive"
                    type="button"
                    className="rounded-sm gap-2"
                  >
                      <StopCircle size={16} /> {t('STOP')}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t('STOP')}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={resetRecording}
                    variant="destructive"
                    type="button"
                    className="rounded-sm gap-2"
                  >
              <Trash size={16} /> {tg('DELETE')}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t('RESET')}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}

          {!isRecording && (
          <div className="flex flex-col">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={startRecording}
                    size="icon"
                    type="button"
                    disabled={fileUploadPending}
                  >
                    <Mic size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t('START')}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {isFinished && recordedFile && (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      handleUpload();
                    }}
                    type="button"
                    variant={'outline'}
                    className="rounded-sm gap-2"
                    disabled={fileUploadPending}
                  >
                      <UploadIcon size={16} /> {t('UPLOAD')}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t('UPLOAD')}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                {fileUploadPending ? (
                  <div>
                    <Button
                      variant="destructive"
                      type="button"
                      className="rounded-sm gap-2 opacity-50 cursor-not-allowed"
                      disabled
                    >
                      <Trash size={16} /> {tg('DELETE')}
                    </Button>
                  </div>
                ) : (
                  <TooltipTrigger asChild>
                    <Button
                      onClick={resetRecording}
                      variant="destructive"
                      type="button"
                      className="rounded-sm gap-2"
                    >
                      <Trash size={16} /> {tg('DELETE')}
                    </Button>
                  </TooltipTrigger>
                )}
                <TooltipContent>{t('RESET')}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={resetRecording}
                    variant="destructive"
                    type="button"
                    className="rounded-sm gap-2"
                    disabled={fileUploadPending}
                  >
                    <Trash size={16} /> Delete
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset</TooltipContent>
              </Tooltip>
            </TooltipProvider> */}
          </>
        )}
      </div>

      {!isPaused && isRecording && (
        <div className="flex text  gap-3">
          <MicIcon color="green" />
          <Label className="text-green-500">
            {t('RECORDING_IN_PROGRESS')}
          </Label>
        </div>
      )}
      {isPaused && isRecording && (
        <div className="flex text  gap-3">
          <PauseIcon color="yellow" />
          <Label className="text-yellow-400">
            {t('RECORDING_PAUSE')}
          </Label>
        </div>
      )}
      {isFinished && recordedFile && (
        <div className="flex text  gap-3">
          <CheckCircle color="green" />
          <Label className="text-green-400">
            {t('RECORDING_COMPLETED')}
          </Label>
        </div>
      )}

      {!isRecording && !recordedFile && (
        <div className="flex text  gap-3">{t('RECORD_AUDIO_AND_UPLOAD')}</div>
      )}
    </div>
  );
};
