import { useAuth } from "./useAuth";
import { useCourse } from "./useCourse";

export function useDashboard() {
  const { isAuthenticated, principal } = useAuth();
  const {
    modules,
    completionPercentage,
    completedLessons,
    totalLessons,
    isCompleted,
  } = useCourse();

  const allLessons = modules.flatMap((m) => m.lessons);
  const firstIncomplete = allLessons.find((l) => !l.completed);
  const nextLessonId = firstIncomplete?.lesson.id;

  const currentModule = modules.find((m) =>
    m.lessons.some((l) => !l.completed),
  );
  const currentModuleId = currentModule?.module_.id;

  const dashboardData = {
    completionPercentage,
    currentModuleId,
    nextLessonId,
    totalLessons,
    completedLessons,
  };

  return {
    dashboardData,
    isAuthenticated,
    principal,
    modules,
    isCompleted,
  };
}
