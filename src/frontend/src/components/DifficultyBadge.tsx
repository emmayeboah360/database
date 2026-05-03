import { Badge } from "@/components/ui/badge";
import type { Difficulty } from "../types/course";

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

const config: Record<Difficulty, { label: string; classes: string }> = {
  Beginner: {
    label: "Beginner",
    classes:
      "bg-secondary/20 text-secondary border-secondary/30 hover:bg-secondary/30",
  },
  Intermediate: {
    label: "Intermediate",
    classes: "bg-primary/20 text-primary border-primary/30 hover:bg-primary/30",
  },
  Advanced: {
    label: "Advanced",
    classes: "bg-accent/20 text-accent border-accent/30 hover:bg-accent/30",
  },
};

export function DifficultyBadge({
  difficulty,
  className = "",
}: DifficultyBadgeProps) {
  const { label, classes } = config[difficulty];
  return (
    <Badge
      variant="outline"
      className={`text-xs font-semibold tracking-wide transition-colors ${classes} ${className}`}
    >
      {label}
    </Badge>
  );
}
