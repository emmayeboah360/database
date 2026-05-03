import List "mo:core/List";
import Map "mo:core/Map";
import CourseLib "lib/course-and-progress";
import CourseApi "mixins/course-and-progress-api";
import Migration "migration";

(with migration = Migration.run)
actor {
  // ─── Course Catalogue (seeded at deploy time) ────────────────────────────
  let modules : List.List<CourseLib.Module> = List.empty<CourseLib.Module>();
  let lessons : List.List<CourseLib.Lesson> = List.empty<CourseLib.Lesson>();

  // ─── Seed course content once (idempotent via size check) ────────────────
  if (modules.size() == 0) {
    CourseLib.seedCourseData(modules, lessons);
  };

  // ─── User State ──────────────────────────────────────────────────────────
  let enrollments : Map.Map<CourseLib.UserId, CourseLib.Enrollment> = Map.empty<CourseLib.UserId, CourseLib.Enrollment>();
  let completions : Map.Map<CourseLib.UserId, List.List<CourseLib.LessonCompletion>> = Map.empty<CourseLib.UserId, List.List<CourseLib.LessonCompletion>>();
  let certificates : Map.Map<CourseLib.UserId, CourseLib.Certificate> = Map.empty<CourseLib.UserId, CourseLib.Certificate>();

  // ─── Mixin Composition ───────────────────────────────────────────────────
  include CourseApi(modules, lessons, enrollments, completions, certificates);
};
