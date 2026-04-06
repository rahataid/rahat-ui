'use client';

import { useState, useEffect } from 'react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Slider } from '@rahat-ui/shadcn/src/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { format } from 'date-fns';

interface TimeControlProps {
  currentTime: Date;
  onTimeChange: (time: Date) => void;
  opacity: number;
  onOpacityChange: (opacity: number) => void;
  availableTimes: Date[];
  forecastHour: number;
  maxForecastHours: number;
  handleForecastChange: (hour: number) => void;
}

export function TimeControl({
  currentTime,
  onTimeChange,
  opacity,
  onOpacityChange,
  availableTimes,
}: TimeControlProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Update current index when time changes
  useEffect(() => {
    if (availableTimes.length > 0) {
      const index = availableTimes.findIndex(
        (time) => time.getTime() === currentTime.getTime(),
      );
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [currentTime, availableTimes]);

  const handleIndexChange = (index: number) => {
    if (
      availableTimes.length > 0 &&
      index >= 0 &&
      index < availableTimes.length
    ) {
      setCurrentIndex(index);
      onTimeChange(availableTimes[index]);
    }
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStepForward = () => {
    const newIndex = Math.min(currentIndex + 1, availableTimes.length - 1);
    handleIndexChange(newIndex);
  };

  const handleStepBack = () => {
    const newIndex = Math.max(currentIndex - 1, 0);
    handleIndexChange(newIndex);
  };

  // Auto-play animation with optimized timing for preloaded tiles
  useEffect(() => {
    if (isPlaying && availableTimes.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => {
          const next = prev + 1;
          if (next >= availableTimes.length) {
            setIsPlaying(false);
            return prev;
          }
          return next;
        });
      }, 800); // Reduced to 800ms for smoother animation with preloaded tiles

      return () => clearInterval(interval);
    }
  }, [isPlaying, availableTimes]);

  // Separate effect to handle time changes when index updates during auto-play
  useEffect(() => {
    if (
      isPlaying &&
      availableTimes.length > 0 &&
      currentIndex < availableTimes.length
    ) {
      onTimeChange(availableTimes[currentIndex]);
    }
  }, [currentIndex, isPlaying, availableTimes, onTimeChange]);

  const maxIndex = availableTimes.length - 1;

  return (
    <div className="p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 rounded-lg border">
      <div className="flex items-center gap-6">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleStepBack}
            disabled={currentIndex === 0 || availableTimes.length === 0}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            size="icon"
            onClick={handlePlay}
            disabled={availableTimes.length === 0}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleStepForward}
            disabled={currentIndex === maxIndex || availableTimes.length === 0}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Time Display and Slider - Takes most space */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">
              {availableTimes.length > 0
                ? format(currentTime, 'MMMM dd, yyyy HH:mm')
                : 'Loading...'}
            </div>
            <div className="text-xs text-muted-foreground">
              {currentIndex + 1}/{availableTimes.length}
            </div>
          </div>

          {availableTimes.length > 0 && (
            <Slider
              value={[currentIndex]}
              onValueChange={(value: number[]) => handleIndexChange(value[0])}
              max={maxIndex}
              step={1}
              className="w-full"
              disabled={availableTimes.length === 0}
            />
          )}
        </div>

        {/* Opacity Control */}
        <div className="flex items-center gap-3 min-w-[200px]">
          <span className="text-sm font-medium whitespace-nowrap">Opacity</span>
          <Slider
            value={[opacity * 100]}
            onValueChange={(value: number[]) => onOpacityChange(value[0] / 100)}
            max={100}
            step={5}
            className="flex-1"
          />
          <span className="text-sm text-muted-foreground min-w-[3ch]">
            {Math.round(opacity * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
