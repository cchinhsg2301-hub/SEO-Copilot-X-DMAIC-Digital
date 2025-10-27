
import React from 'react';

interface ScoreGaugeProps {
  score: number;
  className?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, className }) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (value: number) => {
    if (value >= 75) return 'stroke-green-400';
    if (value >= 40) return 'stroke-yellow-400';
    return 'stroke-red-500';
  };

  return (
    <div className={`relative w-36 h-36 ${className}`}>
      <svg className="w-full h-full" viewBox="0 0 120 120">
        <circle
          className="stroke-gray-700"
          strokeWidth="8"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
        <circle
          className={`${getColor(score)} transition-all duration-1000 ease-out`}
          strokeWidth="8"
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
          }}
        />
      </svg>
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <span className="text-3xl font-bold text-white">{score}</span>
      </div>
    </div>
  );
};
