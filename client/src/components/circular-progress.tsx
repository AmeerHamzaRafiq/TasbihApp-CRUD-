import * as React from "react";
import { Progress } from "@/components/ui/progress";

interface CircularProgressProps {
  current: number;
  total: number;
}

export function CircularProgress({ current, total }: CircularProgressProps) {
  const percentage = Math.round((current / total) * 100);
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-48 h-48">
        <Progress 
          value={percentage} 
          className="w-48 h-48 rounded-full [transform:rotate(-90deg)]"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="text-4xl font-bold">{current}</span>
            <span className="text-sm text-muted-foreground"> / {total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
