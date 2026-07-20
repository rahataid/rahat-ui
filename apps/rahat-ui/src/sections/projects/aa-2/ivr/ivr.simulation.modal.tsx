'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { IvrFlow } from './ivr.flow.types';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  X,
  Phone,
  Delete,
  ChevronLeft,
  Play,
  Pause,
  Volume2,
} from 'lucide-react';

function findNodeById(root: any, id: string): any {
  if (root.id === id) return root;
  for (const child of root.children || []) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
}

function flattenOptions(node: any): { digit: string; label: string }[] {
  return (node.children || []).map((child: any) => ({
    digit: child.digit || '?',
    label: child.label,
  }));
}

interface SimulationModalProps {
  flow: IvrFlow;
  onClose: () => void;
}

export default function SimulationModal({
  flow,
  onClose,
}: SimulationModalProps) {
  const [currentNodeId, setCurrentNodeId] = useState<string>(flow.rootMenu.id);
  const [callPath, setCallPath] = useState<string[]>([flow.rootMenu.id]);
  const [inputBuffer, setInputBuffer] = useState('');
  const [callLog, setCallLog] = useState<string[]>([
    `[START] ${flow.rootMenu.label}`,
  ]);
  const [totalInputs, setTotalInputs] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [lastDigit, setLastDigit] = useState('');
  const [callStarted, setCallStarted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentNode = findNodeById(flow.rootMenu, currentNodeId);
  const availableOptions = currentNode ? flattenOptions(currentNode) : [];
  const audioUrl = currentNode?.prompt || '';

  const playAudio = useCallback((url: string) => {
    if (!url) return;
    setAudioError(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onplay = () => setIsPlaying(true);
    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => {
      setIsPlaying(false);
      setAudioError(true);
    };
    audio.play().catch(() => {
      setIsPlaying(false);
      setAudioError(true);
    });
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      setIsPlaying(false);
    }
  }, []);

  useEffect(() => {
    playAudio(audioUrl);
    return () => stopAudio();
  }, [currentNodeId, playAudio, stopAudio, audioUrl]);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  const handleDTMF = (key: string) => {
    setLastDigit(key);
    setInputBuffer((prev) => prev + key);
    setTotalInputs((prev) => prev + 1);

    if (currentNode?.children) {
      const target = currentNode.children.find(
        (child: any) => child.digit === key,
      );
      if (target) {
        setCurrentNodeId(target.id);
        setCallPath((prev) => [...prev, target.id]);
        setCallLog((prev) => [...prev, `[INPUT] ${key} → ${target.label}`]);
        setInputBuffer('');
      } else {
        setCallLog((prev) => [...prev, `[INVALID] Key ${key} not recognized`]);
      }
    }
  };

  const handleBackspace = () => {
    setInputBuffer((prev) => prev.slice(0, -1));
  };

  const handleBack = useCallback(() => {
    if (callPath.length > 1) {
      stopAudio();
      const previousPath = callPath.slice(0, -1);
      const previousNodeId = previousPath[previousPath.length - 1];
      const previousNode = findNodeById(flow.rootMenu, previousNodeId);

      setCurrentNodeId(previousNodeId);
      setCallPath(previousPath);
      setCallLog((prev) => [
        ...prev,
        `[BACK] Returned to ${previousNode?.label}`,
      ]);
      setInputBuffer('');
    }
  }, [callPath, flow.rootMenu, stopAudio]);

  const handleHangup = () => {
    setCallEnded(true);
    stopAudio();
    stopAudio();
    setCallLog((prev) => [
      ...prev,
      `[END] Call ended. Total inputs: ${totalInputs}`,
    ]);
    setTimeout(() => onClose(), 1500);
  };

  const dialPad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  const handleReset = () => {
    stopAudio();
    setCallEnded(false);
    setLastDigit('');
    setCurrentNodeId(flow.rootMenu.id);
    setCallPath([flow.rootMenu.id]);
    setInputBuffer('');
    setTotalInputs(0);
    setCallLog([`[START] ${flow.rootMenu.label}`]);
  };
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-start border-b p-4">
          <div>
            <h2 className="text-lg font-bold">IVR Flow Simulator</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Test your IVR flow by navigating through it.
            </p>
          </div>

          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          {/* Controls */}
          <div className="flex justify-between items-center">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset
            </Button>

            {!callEnded && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
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

                <Button variant="destructive" size="sm" onClick={handleHangup}>
                  <Phone className="w-4 h-4 mr-1" />
                  End
                </Button>
              </div>
            )}
          </div>

          {/* Status */}
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

          {/* Prompt */}
          <div className="rounded-lg border bg-muted/30 p-3 space-y-3">
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

          {/* Keypad */}
          {!callEnded && (
            <div className="grid grid-cols-3 gap-2">
              {dialPad.map((key) => (
                <Button
                  key={key}
                  variant="outline"
                  className="h-12 text-lg font-semibold"
                  onClick={() => handleDTMF(key)}
                >
                  {key}
                </Button>
              ))}
            </div>
          )}

          {/* History */}
          <div>
            <div className="font-medium mb-2">Call History</div>

            <div className="rounded-lg border bg-muted/30 p-3 max-h-40 overflow-y-auto space-y-2">
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

          {/* Footer */}
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
