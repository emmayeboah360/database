import { BookOpen, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { ModuleWithLessons } from "../types/course";
import { LessonCard } from "./LessonCard";
import { ProgressBar } from "./ProgressBar";

interface ModuleSectionProps {
  moduleWithLessons: ModuleWithLessons;
  activeLessonId?: string;
  defaultOpen?: boolean;
  index: number;
}

export function ModuleSection({
  moduleWithLessons,
  activeLessonId,
  defaultOpen = false,
  index,
}: ModuleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const { module_, lessons, completedCount, totalCount } = moduleWithLessons;
  const progress =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isFullyComplete = completedCount === totalCount && totalCount > 0;

  return (
    <div
      data-ocid={`module_section.item.${index}`}
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        data-ocid={`module_section.toggle.${index}`}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-muted/30 transition-smooth"
        aria-expanded={open}
      >
        <div className="flex-shrink-0 mt-0.5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isFullyComplete ? "bg-secondary/20" : "bg-primary/15"
            }`}
          >
            <BookOpen
              className={`w-4 h-4 ${isFullyComplete ? "text-secondary" : "text-primary"}`}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-foreground">
              Module {index}: {module_.title}
            </h3>
            <span className="text-xs text-muted-foreground shrink-0">
              {completedCount}/{totalCount}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {module_.description}
          </p>
          <ProgressBar
            value={progress}
            size="sm"
            variant={isFullyComplete ? "success" : "default"}
            className="mt-2"
          />
        </div>

        <div className="flex-shrink-0 mt-1 text-muted-foreground">
          {open ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </div>
      </button>

      {open && (
        <div className="px-3 pb-3 flex flex-col gap-1.5 border-t border-border/50 pt-3">
          {lessons.map((ls, i) => (
            <LessonCard
              key={ls.lesson.id}
              lessonWithStatus={ls}
              isActive={ls.lesson.id === activeLessonId}
              index={i + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
