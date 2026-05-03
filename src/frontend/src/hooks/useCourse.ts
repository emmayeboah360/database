import { useCallback, useState } from "react";
import {
  type LessonWithStatus,
  type ModuleWithLessons,
  PYTHON_MODULES,
} from "../types/course";

const PROGRESS_KEY = "codex_python_progress";

function loadProgress(): Record<string, boolean> {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    return stored ? (JSON.parse(stored) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress: Record<string, boolean>): void {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

function applyProgress(
  modules: ModuleWithLessons[],
  progress: Record<string, boolean>,
): ModuleWithLessons[] {
  return modules.map((mod) => {
    const lessons: LessonWithStatus[] = mod.lessons.map((ls) => ({
      ...ls,
      completed: progress[ls.lesson.id] ?? ls.completed,
    }));
    const completedCount = lessons.filter((l) => l.completed).length;
    return { ...mod, lessons, completedCount };
  });
}

export function useCourse() {
  const [progress, setProgress] =
    useState<Record<string, boolean>>(loadProgress);

  const modules = applyProgress(PYTHON_MODULES, progress);

  const totalLessons = modules.reduce((sum, m) => sum + m.totalCount, 0);
  const completedLessons = modules.reduce(
    (sum, m) => sum + m.completedCount,
    0,
  );
  const completionPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const isCompleted = completedLessons === totalLessons && totalLessons > 0;

  const allLessons = modules.flatMap((m) => m.lessons);

  const getLesson = useCallback(
    (lessonId: string): LessonWithStatus | undefined => {
      return allLessons.find((l) => l.lesson.id === lessonId);
    },
    [allLessons],
  );

  const getNextLesson = useCallback(
    (currentLessonId: string): string | undefined => {
      const idx = allLessons.findIndex((l) => l.lesson.id === currentLessonId);
      if (idx === -1 || idx >= allLessons.length - 1) return undefined;
      return allLessons[idx + 1].lesson.id;
    },
    [allLessons],
  );

  const completeLesson = useCallback((lessonId: string) => {
    setProgress((prev) => {
      const next = { ...prev, [lessonId]: true };
      saveProgress(next);
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress({});
    saveProgress({});
  }, []);

  const courseOverview = {
    title: "Python Mastery: Beginner to Advanced",
    description:
      "A comprehensive, project-driven Python curriculum covering fundamentals, data structures, OOP, and advanced patterns. Earn a certificate on completion.",
    totalModules: modules.length,
    totalLessons,
    estimatedHours: Math.ceil(
      modules
        .flatMap((m) => m.lessons)
        .reduce((s, l) => s + l.lesson.durationMinutes, 0) / 60,
    ),
  };

  return {
    modules,
    courseOverview,
    totalLessons,
    completedLessons,
    completionPercentage,
    isCompleted,
    getLesson,
    getNextLesson,
    completeLesson,
    resetProgress,
  };
}
