import * as React from "react";

interface CircularProgressProps {
  current: number;
  total: number;
}

export function CircularProgress({ current, total }: CircularProgressProps) {
  const percentage = Math.round((current / total) * 100);
  const radius = 120; // Increased radius for better visibility
  const strokeWidth = 4;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Generate tick marks
  const tickMarks = Array.from({ length: 60 }, (_, index) => {
    const rotation = (index * 360) / 60;
    return (
      <line
        key={index}
        x1={radius}
        y1={strokeWidth}
        x2={radius}
        y2={strokeWidth + 10}
        stroke="currentColor"
        strokeWidth={2}
        transform={`rotate(${rotation} ${radius} ${radius})`}
        className="text-red-500"
      />
    );
  });

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-[240px] h-[240px]">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            stroke="#f1f1f1"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Tick marks */}
          {tickMarks}
          {/* Progress circle */}
          <circle
            stroke="rgb(239 68 68)"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-300 ease-in-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="text-4xl font-bold text-red-500">{current}</span>
            <span className="text-sm text-gray-500"> / {total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}