import Map "mo:core/Map";
import List "mo:core/List";
import Types "types/course-and-progress";

module {
  // ─── Old inline types (pre-upgrade shape) ────────────────────────────────

  type OldCertificate = {
    id : Text;
    userId : Types.UserId;
    learnerName : Text;
    courseTitle : Text;
    completedAt : Types.Timestamp;
    issuedAt : Types.Timestamp;
  };

  type OldLesson = {
    id : Types.LessonId;
    moduleId : Types.ModuleId;
    title : Text;
    description : Text;
    content : Text;
    difficulty : Types.Difficulty;
    durationMinutes : Nat;
    order : Nat;
  };

  // ─── Actor state shapes ───────────────────────────────────────────────────

  type OldActor = {
    lessons : List.List<OldLesson>;
    certificates : Map.Map<Types.UserId, OldCertificate>;
  };

  type NewActor = {
    lessons : List.List<Types.Lesson>;
    certificates : Map.Map<Types.UserId, Types.Certificate>;
  };

  // ─── Migration function ───────────────────────────────────────────────────

  public func run(old : OldActor) : NewActor {
    // Migrate lessons: add isHL = false for all existing records
    let lessons = old.lessons.map<OldLesson, Types.Lesson>(
      func(l) { { l with isHL = false } }
    );

    // Migrate certificates: add level = #StandardLevel for all existing records
    let certificates = old.certificates.map<Types.UserId, OldCertificate, Types.Certificate>(
      func(_id, c) { { c with level = #StandardLevel } }
    );

    { lessons; certificates };
  };
};
