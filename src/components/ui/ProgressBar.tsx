interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({ value, max, className = '', showLabel = true }: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  
  return (
    <div className={`w-full ${className}`}>
      <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-xs text-neutral-600">
          {value} / {max} ({percentage}%)
        </div>
      )}
    </div>
  );
}
