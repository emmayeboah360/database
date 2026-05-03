import { cn } from "@/lib/utils";

interface HLBadgeProps {
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Consistent amber Higher Level badge used across all HL-marked content.
 * Renders an inline pill with bold "HL" (or custom label) in amber.
 */
export function HLBadge({
  label = "HL",
  size = "sm",
  className,
}: HLBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-bold uppercase tracking-wide rounded-sm",
        "bg-db-hl text-db-hl-foreground border border-db-hl/40 flex-shrink-0",
        size === "sm" && "text-[10px] px-1.5 py-0.5",
        size === "md" && "text-xs px-2 py-1",
        size === "lg" && "text-sm px-3 py-1.5",
        className,
      )}
    >
      {label}
    </span>
  );
}

/**
 * Full "Higher Level" pill label for module headers and section headings.
 */
export function HLModuleBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold",
        "bg-db-hl/15 text-db-hl border border-db-hl/30",
        className,
      )}
    >
      <span className="text-[10px] font-black tracking-wider">HL</span>
      Higher Level
    </span>
  );
}
