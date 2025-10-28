import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, Clock } from "lucide-react";
import { format } from "date-fns";

interface TimelineScrubberProps {
  onTimeChange: (timestamp: number) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  currentTime: number;
  startTime: number;
  endTime: number;
}

export const TimelineScrubber = ({
  onTimeChange,
  isPlaying,
  onPlayPause,
  currentTime,
  startTime,
  endTime,
}: TimelineScrubberProps) => {
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const newTime = currentTime + (1000 * speed);
      onTimeChange(newTime > endTime ? startTime : newTime);
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, speed, currentTime, onTimeChange, startTime, endTime]);

  const handleReset = () => {
    onTimeChange(startTime);
  };

  const totalDuration = endTime - startTime;
  const progress = ((currentTime - startTime) / totalDuration) * 100;

  const handleSliderChange = (value: number[]) => {
    const newTime = startTime + (value[0] / 100) * totalDuration;
    onTimeChange(newTime);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onPlayPause}
            className="w-9 h-9 p-0"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            className="w-9 h-9 p-0"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1">
          <Slider
            value={[progress]}
            onValueChange={handleSliderChange}
            max={100}
            step={0.1}
            className="cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-[180px]">
          <Clock className="w-4 h-4" />
          <span>{format(new Date(currentTime), "MMM dd, HH:mm:ss")}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Speed:</span>
          {[0.5, 1, 2, 4].map((s) => (
            <Button
              key={s}
              size="sm"
              variant={speed === s ? "default" : "outline"}
              onClick={() => setSpeed(s)}
              className="w-9 h-7 p-0 text-xs"
            >
              {s}x
            </Button>
          ))}
        </div>
      </div>

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{format(new Date(startTime), "MMM dd, HH:mm")}</span>
        <span>{format(new Date(endTime), "MMM dd, HH:mm")}</span>
      </div>
    </div>
  );
};
