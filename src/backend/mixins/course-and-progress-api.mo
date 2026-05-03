import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import CourseLib "../lib/course-and-progress";

mixin (
  modules : List.List<CourseLib.Module>,
  lessons : List.List<CourseLib.Lesson>,
  enrollments : Map.Map<CourseLib.UserId, CourseLib.Enrollment>,
  completions : Map.Map<CourseLib.UserId, List.List<CourseLib.LessonCompletion>>,
  certificates : Map.Map<CourseLib.UserId, CourseLib.Certificate>
) {
  // ─── Public Queries ──────────────────────────────────────────────────────

  /// Unauthenticated: returns high-level course overview
  public query func getCourseOverview() : async CourseLib.CourseOverview {
    CourseLib.getCourseOverview(modules, lessons)
  };

  /// Authenticated: all modules with per-user lesson completion status
  public shared query ({ caller }) func getModulesWithStatus() : async [CourseLib.ModuleWithLessons] {
    CourseLib.getModulesWithStatus(modules, lessons, completions, caller)
  };

  /// Authenticated: dashboard — percentage, current module, next lesson
  public shared query ({ caller }) func getDashboard() : async ?CourseLib.DashboardData {
    CourseLib.getDashboard(enrollments, completions, modules, lessons, caller)
  };

  /// Authenticated: list of completed lessons with completion dates
  public shared query ({ caller }) func getProgressHistory() : async [CourseLib.LessonWithStatus] {
    CourseLib.getProgressHistory(completions, lessons, caller)
  };

  /// Authenticated: retrieve certificate (if course completed)
  public shared query ({ caller }) func getCertificate() : async ?CourseLib.Certificate {
    CourseLib.getCertificate(certificates, caller)
  };

  /// Authenticated: user profile — enrollment, progress %, certificates
  public shared query ({ caller }) func getUserProfile() : async CourseLib.UserProfile {
    CourseLib.getUserProfile(enrollments, completions, certificates, lessons, caller)
  };

  // ─── Updates ─────────────────────────────────────────────────────────────

  /// Enroll the caller in the course
  public shared ({ caller }) func enrollInCourse() : async { #ok; #err : Text } {
    let enrolled = CourseLib.enrollUser(enrollments, caller, Time.now());
    if (enrolled) #ok else #err("You are already enrolled in this course.")
  };

  /// Mark a lesson as complete (sequential enforcement)
  public shared ({ caller }) func completeLesson(lessonId : CourseLib.LessonId, learnerName : Text) : async { #ok; #certificateIssued : CourseLib.Certificate; #err : Text } {
    let now = Time.now();
    let result = CourseLib.completeLesson(enrollments, completions, lessons, caller, lessonId, now);
    switch (result) {
      case (#err(msg)) #err(msg);
      case (#ok) {
        let certOpt = CourseLib.maybeIssueCertificate(
          completions,
          certificates,
          lessons,
          caller,
          learnerName,
          now
        );
        switch (certOpt) {
          case (?cert) #certificateIssued(cert);
          case null #ok;
        };
      };
    };
  };
};
