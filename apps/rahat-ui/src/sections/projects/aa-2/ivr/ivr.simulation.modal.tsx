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
    stopAudio();
    setCallLog((prev) => [
      ...prev,
      `[END] Call ended. Total inputs: ${totalInputs}`,
    ]);
    setTimeout(() => onClose(), 1500);
  };

  const dialPad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold">IVR Simulation</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-1 flex-wrap text-xs font-mono bg-muted p-2 rounded">
              {callPath.map((nodeId, idx) => {
                const node = findNodeById(flow.rootMenu, nodeId);
                return (
                  <div key={nodeId} className="flex items-center gap-1">
                    <span className="truncate max-w-[100px]">
                      {node?.label}
                    </span>
                    {idx < callPath.length - 1 && (
                      <span className="text-muted-foreground">&rarr;</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="bg-primary/10 p-4 rounded-lg border border-primary">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-muted-foreground font-semibold">
                  Playing:
                </div>
                {audioUrl && (
                  <div className="flex items-center gap-2">
                    {isPlaying ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={stopAudio}
                        className="h-6 w-6 p-0"
                      >
                        <Pause className="w-3 h-3" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => playAudio(audioUrl)}
                        className="h-6 w-6 p-0"
                      >
                        <Play className="w-3 h-3" />
                      </Button>
                    )}
                    {isPlaying && (
                      <Volume2 className="w-3 h-3 text-green-600 animate-pulse" />
                    )}
                  </div>
                )}
              </div>
              <div className="text-lg font-semibold">{currentNode?.label}</div>
              {audioUrl ? (
                <div className="text-xs mt-1 text-muted-foreground truncate">
                  {audioUrl}
                </div>
              ) : (
                <div className="text-xs mt-1 text-yellow-600">
                  No audio URL set — no audio to play
                </div>
              )}
              {audioError && (
                <div className="text-xs mt-1 text-red-500">
                  Failed to load audio from URL
                </div>
              )}
              {availableOptions.length > 0 && (
                <div className="mt-3 space-y-1">
                  <div className="text-xs text-muted-foreground font-semibold">
                    Available Options:
                  </div>
                  {availableOptions.map((opt) => (
                    <div key={opt.digit} className="text-sm">
                      <Badge variant="outline" className="mr-2">
                        {opt.digit}
                      </Badge>
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
              {currentNode?.hangup && (
                <div className="mt-2 text-xs text-red-500 font-semibold">
                  This node will hang up after playing
                </div>
              )}
            </div>

            <div className="bg-secondary p-3 rounded-lg border border-secondary/50">
              <div className="text-xs text-muted-foreground mb-1 font-semibold">
                Entered:
              </div>
              <div className="text-3xl font-mono font-bold tracking-wider">
                {inputBuffer || '\u2014'}
              </div>
            </div>

            <div className="bg-muted p-3 rounded-lg max-h-36 overflow-y-auto border border-border">
              <div className="text-xs text-muted-foreground mb-2 font-semibold">
                Call Log:
              </div>
              <div className="space-y-1 font-mono text-xs">
                {callLog.map((log, idx) => (
                  <div key={idx} className="text-muted-foreground">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {dialPad.map((key) => (
                <Button
                  key={key}
                  onClick={() => handleDTMF(key)}
                  variant="outline"
                  className="h-12 text-lg font-bold hover:bg-primary hover:text-primary-foreground"
                >
                  {key}
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleBackspace}
                variant="outline"
                className="flex-1"
              >
                <Delete className="w-4 h-4 mr-2" />
                Clear
              </Button>
              <Button
                onClick={handleBack}
                disabled={callPath.length <= 1}
                variant="outline"
                className="flex-1"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleHangup}
                variant="destructive"
                className="flex-1"
              >
                <Phone className="w-4 h-4 mr-2" />
                Hangup
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
