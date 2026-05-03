import { Link } from "@tanstack/react-router";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import type { LessonWithStatus } from "../types/course";
import { DifficultyBadge } from "./DifficultyBadge";

interface LessonCardProps {
  lessonWithStatus: LessonWithStatus;
  isActive?: boolean;
  index: number;
}

export function LessonCard({
  lessonWithStatus,
  isActive = false,
  index,
}: LessonCardProps) {
  const { lesson, completed } = lessonWithStatus;

  return (
    <Link
      to="/db-lesson/$lessonId"
      params={{ lessonId: lesson.id }}
      data-ocid={`lesson_card.item.${index}`}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg
        border transition-smooth cursor-pointer select-none
        ${
          isActive
            ? "bg-primary/10 border-primary/40 text-foreground"
            : completed
              ? "bg-muted/40 border-border/50 text-muted-foreground hover:bg-muted/70"
              : "bg-card border-border hover:bg-muted/40 text-foreground"
        }
      `}
    >
      <div className="flex-shrink-0 mt-0.5">
        {completed ? (
          <CheckCircle2 className="w-4 h-4 text-secondary" />
        ) : isActive ? (
          <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary/30" />
        ) : (
          <Circle className="w-4 h-4 text-muted-foreground/50" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate ${isActive ? "text-foreground" : ""}`}
        >
          {lesson.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <DifficultyBadge difficulty={lesson.difficulty} />
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {lesson.durationMinutes}m
          </span>
        </div>
      </div>
    </Link>
  );
}
