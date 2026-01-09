import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { playBeep } from '@/utils/sound';

interface RestTimerProps {
  defaultSeconds?: number;
  autoStart?: boolean;
  onComplete?: () => void;
  compact?: boolean;
  soundEnabled?: boolean;
  vibrationEnabled?: boolean;
}

export function RestTimer({
  defaultSeconds = 90,
  autoStart = false,
  onComplete,
  compact = false,
  soundEnabled = true,
  vibrationEnabled = true,
}: RestTimerProps) {
  const [seconds, setSeconds] = useState(defaultSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [initialSeconds, setInitialSeconds] = useState(defaultSeconds);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1));
    }, 1000);

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  useEffect(() => {
    if (seconds !== 0 || !isRunning) return;

    setIsRunning(false);
    onComplete?.();

    if (soundEnabled) {
      playBeep();
    }

    if (vibrationEnabled && navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  }, [seconds, isRunning, onComplete, soundEnabled, vibrationEnabled]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const adjustTime = useCallback((amount: number) => {
    const newTime = Math.max(0, initialSeconds + amount);
    setInitialSeconds(newTime);
    if (!isRunning) {
      setSeconds(newTime);
    }
  }, [initialSeconds, isRunning]);

  const reset = () => {
    setIsRunning(false);
    setSeconds(initialSeconds);
  };

  const progress = initialSeconds > 0 ? (seconds / initialSeconds) * 100 : 0;

  if (compact) {
    return (
      <div className="flex items-center justify-between gap-4 p-3 bg-card border rounded-lg">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12">
            <svg className="w-full h-full -rotate-90">
              <circle cx="24" cy="24" r="20" stroke="hsl(var(--muted))" strokeWidth="4" fill="none" />
              <circle
                cx="24" cy="24" r="20"
                stroke="hsl(var(--primary))"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 20}`}
                strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={cn(
                "text-sm font-bold",
                seconds <= 10 && seconds > 0 && isRunning && "text-destructive animate-pulse"
              )}>
                {formatTime(seconds)}
              </span>
            </div>
          </div>
          <span className="text-sm text-muted-foreground">Rest Timer</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => adjustTime(-15)}>
            <Minus className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => adjustTime(15)}>
            <Plus className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={reset}>
            <RotateCcw className="h-3 w-3" />
          </Button>
          <Button size="sm" onClick={() => setIsRunning(!isRunning)} className="w-16">
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="hsl(var(--primary))"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 58}`}
              strokeDashoffset={`${2 * Math.PI * 58 * (1 - progress / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn(
              "text-3xl font-bold",
              seconds <= 10 && seconds > 0 && isRunning && "text-destructive animate-pulse"
            )}>
              {formatTime(seconds)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => adjustTime(-15)}>
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground w-16 text-center">
            {formatTime(initialSeconds)}
          </span>
          <Button variant="outline" size="icon" onClick={() => adjustTime(15)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={reset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button 
            size="lg" 
            onClick={() => setIsRunning(!isRunning)}
            className="w-24"
          >
            {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </Card>
  );
}
