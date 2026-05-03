import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Database,
  GitBranch,
  Lock,
  PlayCircle,
  Table2,
  Terminal,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { HLModuleBadge } from "../components/HLBadge";
import { getDbProgress } from "../types/database";
import {
  DATABASE_MODULES,
  type DbLesson,
  type DbModuleWithLessons,
} from "../types/db-course";

// ── Derived helpers ──────────────────────────────────────────────────────────

const ALL_DB_LESSONS: DbLesson[] = DATABASE_MODULES.flatMap((m) => m.lessons);

const TOTAL_DB_LESSONS = ALL_DB_LESSONS.length;
const TOTAL_DB_HL_LESSONS = ALL_DB_LESSONS.filter((l) => l.isHL).length;
const TOTAL_DB_SL_LESSONS = TOTAL_DB_LESSONS - TOTAL_DB_HL_LESSONS;

function totalDbHours(): number {
  const totalMin = ALL_DB_LESSONS.reduce((s, l) => s + l.duration, 0);
  return Math.round(totalMin / 60);
}

type LevelFilter = "all" | "sl" | "hl";

// Subtitle + color derived from module order
const MODULE_META: Record<
  number,
  { subtitle: string; color: "primary" | "secondary" | "accent" | "db-hl" }
> = {
  1: { subtitle: "A3.1 — Standard Level", color: "primary" },
  2: { subtitle: "A3.2 — Standard Level + HL", color: "secondary" },
  3: { subtitle: "A3.3 — Standard Level + HL", color: "accent" },
  4: { subtitle: "A3.4 — Higher Level Only", color: "db-hl" },
};

type ModuleColor = "primary" | "secondary" | "accent" | "db-hl";

// ── Circular progress ring ──────────────────────────────────────────────
function CircularProgress({ value }: { value: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const isComplete = value === 100;

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg
        className="absolute inset-0 -rotate-90"
        width="128"
        height="128"
        viewBox="0 0 128 128"
        aria-label={`${value}% complete`}
        role="img"
      >
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="oklch(var(--muted))"
          strokeWidth="10"
        />
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke={
            isComplete ? "oklch(var(--secondary))" : "oklch(var(--primary))"
          }
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <div className="flex flex-col items-center leading-none">
        <span className="text-2xl font-display font-semibold text-foreground tabular-nums">
          {value}%
        </span>
        <span className="text-xs text-muted-foreground mt-0.5">complete</span>
      </div>
    </div>
  );
}

// ── Level filter tabs ───────────────────────────────────────────────────
const FILTERS: { value: LevelFilter; label: string }[] = [
  { value: "all", label: "All Topics" },
  { value: "sl", label: "Standard Level (SL)" },
  { value: "hl", label: "Higher Level (HL only)" },
];

// ── Lesson row card ─────────────────────────────────────────────────────
function LessonRow({
  lesson,
  index,
  completed,
  moduleIndex,
}: {
  lesson: DbLesson;
  index: number;
  completed: boolean;
  moduleIndex: number;
}) {
  return (
    <Link
      to="/db-lesson/$lessonId"
      params={{ lessonId: lesson.id }}
      data-ocid={`db_course.module.${moduleIndex}.lesson.${index}`}
      className="group flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-muted/30 transition-smooth border border-transparent hover:border-border"
    >
      {/* Completion indicator */}
      <div className="mt-0.5 flex-shrink-0">
        {completed ? (
          <CheckCircle2 className="w-5 h-5 text-secondary" />
        ) : (
          <div className="w-5 h-5 rounded-full border-2 border-border group-hover:border-primary transition-colors" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <p
            className={`text-sm font-medium leading-snug truncate ${
              completed
                ? "text-muted-foreground line-through decoration-muted-foreground/50"
                : "text-foreground"
            }`}
          >
            {lesson.title}
          </p>
          {lesson.isHL && <span className="db-hl-badge flex-shrink-0">HL</span>}
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {lesson.duration} min
          </span>
          {lesson.sqlChallenge && (
            <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-md">
              <Terminal className="w-3 h-3" />
              SQL
            </span>
          )}
          {lesson.erdSchema && (
            <span className="flex items-center gap-1 text-xs bg-secondary/10 text-secondary px-1.5 py-0.5 rounded-md">
              <GitBranch className="w-3 h-3" />
              ERD
            </span>
          )}
          {lesson.normalizationExercise && (
            <span className="flex items-center gap-1 text-xs bg-accent/10 text-accent px-1.5 py-0.5 rounded-md">
              <Table2 className="w-3 h-3" />
              Norm
            </span>
          )}
        </div>
      </div>

      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}

// ── Module accordion section ────────────────────────────────────────────
const MODULE_COLOR_CLASS: Record<ModuleColor, string> = {
  primary: "text-primary bg-primary/10 border-primary/20",
  secondary: "text-secondary bg-secondary/10 border-secondary/20",
  accent: "text-accent bg-accent/10 border-accent/20",
  "db-hl": "text-db-hl bg-db-hl/10 border-db-hl/20",
};

function ModuleCard({
  moduleData,
  completedIds,
  filter,
  index,
}: {
  moduleData: DbModuleWithLessons;
  completedIds: string[];
  filter: LevelFilter;
  index: number;
}) {
  const [open, setOpen] = useState(index === 0);
  const meta = MODULE_META[moduleData.module.order] ?? {
    subtitle: "",
    color: "primary" as ModuleColor,
  };

  const visibleLessons = moduleData.lessons.filter((l) => {
    if (filter === "sl") return !l.isHL;
    if (filter === "hl") return l.isHL;
    return true;
  });

  if (visibleLessons.length === 0) return null;

  const completedInModule = visibleLessons.filter((l) =>
    completedIds.includes(l.id),
  ).length;
  const pct =
    visibleLessons.length > 0
      ? Math.round((completedInModule / visibleLessons.length) * 100)
      : 0;

  const colorClass = MODULE_COLOR_CLASS[meta.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      className="bg-card border border-border rounded-2xl overflow-hidden elevation-subtle"
      data-ocid={`db_course.module.${index + 1}`}
    >
      {/* Module header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        data-ocid={`db_course.module.${index + 1}.toggle`}
        className="w-full flex items-start gap-4 p-5 text-left hover:bg-muted/20 transition-smooth"
        aria-expanded={open}
      >
        {/* Number badge */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-semibold text-sm border flex-shrink-0 mt-0.5 ${colorClass}`}
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h3 className="text-subheading text-foreground">
              {moduleData.module.title}
            </h3>
            {moduleData.module.isHL && (
              <span className="db-hl-badge">HL Only</span>
            )}
          </div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            {meta.subtitle}
          </p>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {moduleData.module.description}
          </p>
          {/* Mini progress */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs font-mono text-muted-foreground tabular-nums">
              {completedInModule}/{visibleLessons.length}
            </span>
          </div>
        </div>

        <ChevronRight
          className={`w-5 h-5 text-muted-foreground flex-shrink-0 mt-1 transition-transform duration-200 ${
            open ? "rotate-90" : ""
          }`}
        />
      </button>

      {/* Lessons list */}
      {open && (
        <div className="border-t border-border divide-y divide-border/40 px-2 pb-2">
          {visibleLessons.map((lesson, li) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              index={li + 1}
              completed={completedIds.includes(lesson.id)}
              moduleIndex={index + 1}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ── Main page ───────────────────────────────────────────────────────────
export function DbCoursePage() {
  const router = useRouter();
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<LevelFilter>("all");

  // Load progress from localStorage and refresh on visibility change
  useEffect(() => {
    function loadProgress() {
      setCompletedIds(getDbProgress());
    }
    loadProgress();
    window.addEventListener("focus", loadProgress);
    document.addEventListener("visibilitychange", loadProgress);
    return () => {
      window.removeEventListener("focus", loadProgress);
      document.removeEventListener("visibilitychange", loadProgress);
    };
  }, []);

  // Compute progress
  const visibleLessons =
    filter === "sl"
      ? ALL_DB_LESSONS.filter((l) => !l.isHL)
      : filter === "hl"
        ? ALL_DB_LESSONS.filter((l) => l.isHL)
        : ALL_DB_LESSONS;

  const completedCount = visibleLessons.filter((l) =>
    completedIds.includes(l.id),
  ).length;
  const completionPct =
    visibleLessons.length > 0
      ? Math.round((completedCount / visibleLessons.length) * 100)
      : 0;

  const allCompleted = completionPct === 100 && visibleLessons.length > 0;

  // Next lesson to resume
  const nextLesson = visibleLessons.find((l) => !completedIds.includes(l.id));

  const dbHours = totalDbHours();

  function handleCta() {
    if (nextLesson) {
      void router.navigate({
        to: "/db-lesson/$lessonId",
        params: { lessonId: nextLesson.id },
      });
    }
  }

  const ctaLabel = allCompleted
    ? "Course Complete! 🎉"
    : completedCount === 0
      ? "Start Learning"
      : "Continue Learning";

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-8 pb-16"
      data-ocid="db_course.page"
    >
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            IB Computer Science
          </span>
          <Badge className="bg-primary/15 text-primary border-primary/25 text-xs">
            A3
          </Badge>
        </div>
        <h1 className="text-display text-foreground">Databases</h1>
        <p className="text-muted-foreground mt-1 max-w-xl">
          Principles, structures, and operations that form the basis of modern
          database systems — from relational design to distributed
          architectures.
        </p>
      </motion.div>

      {/* Hero stats card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="bg-card border border-border rounded-2xl p-6 mb-6 elevation-card"
      >
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Progress ring */}
          <div className="flex flex-col items-center gap-2">
            <CircularProgress value={completionPct} />
            <span className="text-xs text-muted-foreground font-medium">
              Overall Progress
            </span>
          </div>

          <div className="hidden sm:block w-px self-stretch bg-border" />

          {/* Stats */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[
                {
                  label: "Total Lessons",
                  value: TOTAL_DB_LESSONS,
                  icon: BookOpen,
                  color: "text-primary",
                  bg: "bg-primary/10",
                },
                {
                  label: "Hours",
                  value: `~${dbHours}h`,
                  icon: Clock,
                  color: "text-secondary",
                  bg: "bg-secondary/10",
                },
                {
                  label: "SL Topics",
                  value: TOTAL_DB_SL_LESSONS,
                  icon: Database,
                  color: "text-accent",
                  bg: "bg-accent/10",
                },
                {
                  label: "HL Topics",
                  value: TOTAL_DB_HL_LESSONS,
                  icon: Award,
                  color: "text-db-hl",
                  bg: "bg-db-hl/10",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-background border border-border rounded-xl p-3 flex flex-col gap-1"
                >
                  <div
                    className={`w-7 h-7 rounded-lg ${stat.bg} flex items-center justify-center mb-1`}
                  >
                    <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-display font-semibold text-foreground tabular-nums">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            {!allCompleted && nextLesson && (
              <Button
                data-ocid="db_course.start_button"
                onClick={handleCta}
                className="gradient-primary text-primary-foreground font-semibold border-0 hover:opacity-90 gap-2 w-full sm:w-auto"
              >
                <PlayCircle className="w-4 h-4" />
                {ctaLabel}
              </Button>
            )}
            {allCompleted && (
              <div className="flex items-center gap-2 text-secondary text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5" />
                {ctaLabel}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Resume banner */}
      {nextLesson && !allCompleted && completedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          className="mb-6"
          data-ocid="db_course.resume_section"
        >
          <h2 className="text-subheading text-foreground mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" />
            Continue Learning
          </h2>
          <Link
            to="/db-lesson/$lessonId"
            params={{ lessonId: nextLesson.id }}
            data-ocid="db_course.next_lesson_button"
            className="group flex items-center gap-4 p-4 rounded-2xl border border-primary/30 bg-card hover:bg-card/80 transition-smooth elevation-card overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-smooth">
              <PlayCircle className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-0.5">
                Next up
              </p>
              <p className="font-semibold text-foreground text-sm truncate">
                {nextLesson.title}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      )}

      {/* Level filter tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.3 }}
        className="flex gap-1.5 mb-5 bg-muted/30 p-1 rounded-xl w-fit"
        role="tablist"
        aria-label="Level filter"
      >
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            role="tab"
            aria-selected={filter === f.value}
            data-ocid={`db_course.filter.${f.value}`}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-smooth ${
              filter === f.value
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </motion.div>

      {/* Modules */}
      <div className="space-y-3" data-ocid="db_course.modules_list">
        {DATABASE_MODULES.map((moduleData, i) => {
          // Gate HL-only modules when SL filter is active
          if (moduleData.module.isHL && filter === "sl") {
            return (
              <motion.div
                key={moduleData.module.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
                className="bg-card border border-db-hl/20 rounded-2xl p-6 flex items-start gap-4"
                data-ocid={`db_course.module.${i + 1}.hl_gate`}
              >
                <div className="w-10 h-10 rounded-xl bg-db-hl/15 border border-db-hl/30 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-db-hl" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-subheading text-foreground">
                      {moduleData.module.title}
                    </h3>
                    <HLModuleBadge />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Higher Level content — available to HL students only. Switch
                    to{" "}
                    <button
                      type="button"
                      onClick={() => setFilter("hl")}
                      data-ocid="db_course.hl_gate.switch_button"
                      className="text-db-hl font-semibold underline underline-offset-2 hover:text-db-hl/80 transition-colors"
                    >
                      Higher Level (HL only)
                    </button>{" "}
                    to unlock this module.
                  </p>
                </div>
              </motion.div>
            );
          }
          return (
            <ModuleCard
              key={moduleData.module.id}
              moduleData={moduleData}
              completedIds={completedIds}
              filter={filter}
              index={i}
            />
          );
        })}
      </div>
    </div>
  );
}
