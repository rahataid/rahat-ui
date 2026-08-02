'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { X, Play, Pause, PhoneOff } from 'lucide-react';
import { IvrFlow } from '../types/ivr.flow.types';
import { findNodeById, flattenOptions, DIAL_PAD } from '../utils/utils';

interface SimulationModalProps {
  flow: IvrFlow;
  onClose: () => void;
}

export default function SimulationModal({
  flow,
  onClose,
}: SimulationModalProps) {
  const [currentNodeId, setCurrentNodeId] = useState<string>(flow.rootMenu.id);
  const [callLog, setCallLog] = useState<string[]>([
    `[START] ${flow.rootMenu.label}`,
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [lastDigit, setLastDigit] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hangupRef = useRef(false);
  const inputsRef = useRef(0);

  const currentNode = findNodeById(flow.rootMenu, currentNodeId);
  const availableOptions = currentNode ? flattenOptions(currentNode) : [];
  const audioUrl = currentNode?.prompt || '';

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      setIsPlaying(false);
    }
  }, []);

  const endCall = useCallback(
    (finalCount: number) => {
      setCallEnded(true);
      stopAudio();
      setCallLog((prev) => [
        ...prev,
        `[END] Call ended. Total inputs: ${finalCount}`,
      ]);
    },
    [stopAudio],
  );

  const playAudio = useCallback(
    (url: string) => {
      setIsPlaying(false);
      setAudioError(false);

      if (!url) {
        if (hangupRef.current) endCall(inputsRef.current);
        return;
      }

      if (audioRef.current) audioRef.current.pause();

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onplay = () => {
        if (audioRef.current === audio) {
          setIsPlaying(true);
          setAudioError(false);
        }
      };
      audio.onended = () => {
        if (audioRef.current === audio) {
          setIsPlaying(false);
          if (hangupRef.current) endCall(inputsRef.current);
        }
      };
      audio.onerror = () => {
        if (audioRef.current === audio) {
          setIsPlaying(false);
          setAudioError(true);
        }
      };
      audio.play().catch(() => {
        if (audioRef.current === audio) {
          setIsPlaying(false);
          setAudioError(true);
        }
      });
    },
    [endCall],
  );

  useEffect(() => {
    hangupRef.current = currentNode?.hangup || false;
  });

  useEffect(() => {
    playAudio(audioUrl);
    return () => stopAudio();
  }, [currentNodeId, playAudio, stopAudio, audioUrl]);

  const handleDTMF = (key: string) => {
    setLastDigit(key);

    if (currentNode?.children) {
      const target = currentNode.children.find((child) => child.digit === key);
      if (target) {
        setCurrentNodeId(target.id);
        setCallLog((prev) => [...prev, `[INPUT] ${key} → ${target.label}`]);
      } else {
        setCallLog((prev) => [...prev, `[INVALID] Key ${key} not recognized`]);
      }
      inputsRef.current += 1;
    }
  };

  const handleHangup = () => {
    setCallEnded(true);
    stopAudio();
    setCallLog((prev) => [
      ...prev,
      `[END] Call ended. Total inputs: ${inputsRef.current}`,
    ]);
  };

  const handleReset = () => {
    stopAudio();
    setCallEnded(false);
    setLastDigit('');
    setCurrentNodeId(flow.rootMenu.id);
    inputsRef.current = 0;
    setCallLog([`[START] ${flow.rootMenu.label}`]);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 md:p-4">
      <div className="bg-background rounded-sm shadow-lg w-full max-w-[clamp(320px,90vw,500px)]">
        <div className="flex justify-between items-start border-b p-4">
          <div>
            <h2 className="text-lg font-bold">IVR Flow Simulator</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Test your IVR flow by navigating through it.
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-sm"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              className="rounded-sm"
              onClick={handleReset}
            >
              Reset
            </Button>
            {!callEnded && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-sm"
                  onClick={() =>
                    isPlaying ? stopAudio() : playAudio(audioUrl)
                  }
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-sm text-red-500 hover:text-red-600"
                  onClick={handleHangup}
                >
                  <PhoneOff className="w-4 h-4 mr-1" />
                  End Call
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium">Status</span>
            <Badge
              className={
                callEnded ? 'bg-red-500 text-white' : 'bg-black text-white'
              }
            >
              {callEnded ? 'Ended' : 'Active'}
            </Badge>
          </div>

          <div className="rounded-sm border bg-muted/30 p-3 space-y-3">
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                Current Prompt
              </div>
              <div className="text-sm truncate">{audioUrl || 'No prompt'}</div>
            </div>
            <div className="flex justify-between items-center">
              <Badge variant="outline">
                {audioError ? 'Failed' : isPlaying ? 'Playing' : 'Ready'}
              </Badge>
              {lastDigit && <Badge variant="secondary">{lastDigit}</Badge>}
            </div>
          </div>

          {!callEnded && (
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                {DIAL_PAD.map((key) => {
                  const hasOption = availableOptions.some(
                    (opt) => opt.digit === key,
                  );
                  return (
                    <Button
                      key={key}
                      variant={hasOption ? 'default' : 'outline'}
                      className="h-12 text-lg font-semibold rounded-sm"
                      onClick={() => handleDTMF(key)}
                    >
                      {key}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <div className="font-medium mb-2">Call History</div>
            <div className="rounded-sm border bg-muted/30 p-3 max-h-40 overflow-y-auto space-y-2">
              {callLog.map((log, index) => (
                <div
                  key={index}
                  className={`text-xs ${
                    log.includes('[END]')
                      ? 'text-red-500'
                      : 'text-muted-foreground'
                  }`}
                >
                  {log
                    .replace('[START]', 'Started call')
                    .replace('[INPUT]', 'Pressed')
                    .replace('[BACK]', 'Back')
                    .replace('[INVALID]', 'Invalid')
                    .replace('[END]', 'Call ended')}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="rounded-sm"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
