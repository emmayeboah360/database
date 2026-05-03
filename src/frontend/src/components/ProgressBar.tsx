interface ProgressBarProps {
  value: number; // 0–100
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "accent";
}

const sizeClasses = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-3.5",
};

const variantClasses = {
  default: "bg-primary",
  success: "bg-secondary",
  accent: "bg-accent",
};

export function ProgressBar({
  value,
  className = "",
  showLabel = false,
  size = "md",
  variant = "default",
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`flex-1 rounded-full bg-muted/60 overflow-hidden ${sizeClasses[size]}`}
        role="progressbar"
        tabIndex={0}
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${variantClasses[variant]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-mono text-muted-foreground w-9 text-right tabular-nums">
          {clamped}%
        </span>
      )}
    </div>
  );
}
