import Common "common";

module {
  public type UserId = Common.UserId;
  public type Timestamp = Common.Timestamp;
  public type LessonId = Common.LessonId;
  public type ModuleId = Common.ModuleId;
  public type CertificateId = Common.CertificateId;

  public type Difficulty = { #Beginner; #Intermediate; #Advanced };

  public type CertificateLevel = { #StandardLevel; #HigherLevel };

  public type Lesson = {
    id : LessonId;
    moduleId : ModuleId;
    title : Text;
    description : Text;
    content : Text;
    difficulty : Difficulty;
    durationMinutes : Nat;
    order : Nat;
    isHL : Bool;
  };

  public type Module = {
    id : ModuleId;
    title : Text;
    description : Text;
    order : Nat;
  };

  public type LessonWithStatus = {
    lesson : Lesson;
    completed : Bool;
    completedAt : ?Timestamp;
  };

  public type ModuleWithLessons = {
    module_ : Module;
    lessons : [LessonWithStatus];
    completedCount : Nat;
    totalCount : Nat;
  };

  public type Enrollment = {
    userId : UserId;
    enrolledAt : Timestamp;
  };

  public type LessonCompletion = {
    lessonId : LessonId;
    completedAt : Timestamp;
  };

  public type DashboardData = {
    completionPercentage : Nat;
    currentModuleId : ?ModuleId;
    nextLessonId : ?LessonId;
    totalLessons : Nat;
    completedLessons : Nat;
  };

  public type Certificate = {
    id : CertificateId;
    userId : UserId;
    learnerName : Text;
    courseTitle : Text;
    level : CertificateLevel;
    completedAt : Timestamp;
    issuedAt : Timestamp;
  };

  public type UserProfile = {
    userId : UserId;
    isEnrolled : Bool;
    overallProgressPercentage : Nat;
    certificates : [Certificate];
  };

  public type CourseOverview = {
    title : Text;
    description : Text;
    totalModules : Nat;
    totalLessons : Nat;
    estimatedHours : Nat;
  };
};
