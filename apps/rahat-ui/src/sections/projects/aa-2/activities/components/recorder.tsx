'use client';
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
}: Props) => {
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
            {timer} <span className="text-xs ml-1">Recording</span>
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
                      <PlayIcon size={16} /> Resume
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Resume</TooltipContent>
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
                      <PauseIcon size={16} /> Pause
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Pause</TooltipContent>
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
                    <StopCircle size={16} /> Stop
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Stop</TooltipContent>
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
                    <Trash size={16} /> Delete
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}

        {!isRecording && (
          <div className="flex flex-col">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={startRecording} size="icon" type="button">
                    <Mic size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Start</TooltipContent>
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
                  >
                    <UploadIcon size={16} /> Upload
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Upload</TooltipContent>
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
                    <Trash size={16} /> Delete
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
      </div>

      {!isPaused && isRecording && (
        <div className="flex text  gap-3">
          <MicIcon color="green" />
          <Label className="text-green-500">
            Recording in Progress. You can stop or pause anytime
          </Label>
        </div>
      )}
      {isPaused && isRecording && (
        <div className="flex text  gap-3">
          <PauseIcon color="yellow" />
          <Label className="text-yellow-400">
            Recording Pause. click Resume to continue or stop to finish
          </Label>
        </div>
      )}
      {isFinished && recordedFile && (
        <div className="flex text  gap-3">
          <CheckCircle color="green" />
          <Label className="text-green-400">
            Recording Completed. Press Upload to submit or delete to Record
            again
          </Label>
        </div>
      )}

      {!isRecording && !recordedFile && (
        <div className="flex text  gap-3">Record audio and upload</div>
      )}
    </div>
  );
};
