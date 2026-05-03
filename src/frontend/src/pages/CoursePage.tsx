import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  ChevronRight,
  Clock,
  Flame,
  PlayCircle,
  Trophy,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { DifficultyBadge } from "../components/DifficultyBadge";
import { ModuleSection } from "../components/ModuleSection";
import { ProgressBar } from "../components/ProgressBar";
import { useDashboard } from "../hooks/useDashboard";

// Circular progress ring SVG
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
        {/* Track */}
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="oklch(var(--muted))"
          strokeWidth="10"
        />
        {/* Progress arc */}
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
      {/* Center label */}
      <div className="flex flex-col items-center leading-none">
        <span className="text-2xl font-display font-semibold text-foreground tabular-nums">
          {value}%
        </span>
        <span className="text-xs text-muted-foreground mt-0.5">complete</span>
      </div>
    </div>
  );
}

// Skeleton for the stats row while data loads
function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {["stat-a", "stat-b", "stat-c", "stat-d"].map((k) => (
        <Skeleton key={k} className="h-24 rounded-xl" />
      ))}
    </div>
  );
}

export function CoursePage() {
  const { dashboardData, modules, isCompleted } = useDashboard();
  const { completionPercentage, completedLessons, totalLessons, nextLessonId } =
    dashboardData;

  // Find full lesson object for the resume card
  const nextLessonWithStatus = nextLessonId
    ? modules
        .flatMap((m) => m.lessons)
        .find((l) => l.lesson.id === nextLessonId)
    : undefined;
  const nextLesson = nextLessonWithStatus?.lesson;

  // Find the module the next lesson belongs to
  const nextModule = nextLessonId
    ? modules.find((m) => m.lessons.some((l) => l.lesson.id === nextLessonId))
    : undefined;

  const totalMinutes = modules
    .flatMap((m) => m.lessons)
    .reduce((s, l) => s + l.lesson.durationMinutes, 0);

  const completedMinutes = modules
    .flatMap((m) => m.lessons)
    .filter((l) => l.completed)
    .reduce((s, l) => s + l.lesson.durationMinutes, 0);

  const isLoading = modules.length === 0;

  const statItems = [
    {
      icon: Clock,
      label: "Total Time",
      value: `~${Math.ceil(totalMinutes / 60)}h`,
      sub: `${completedMinutes}m done`,
      color: "text-primary",
      bg: "bg-primary/10",
      ocid: "course.stats.hours",
    },
    {
      icon: BookOpen,
      label: "Lessons",
      value: `${completedLessons}/${totalLessons}`,
      sub: "completed",
      color: "text-secondary",
      bg: "bg-secondary/10",
      ocid: "course.stats.completed",
    },
    {
      icon: Flame,
      label: "Modules",
      value: `${modules.filter((m) => m.completedCount === m.totalCount && m.totalCount > 0).length}/${modules.length}`,
      sub: "finished",
      color: "text-accent",
      bg: "bg-accent/10",
      ocid: "course.stats.modules",
    },
    {
      icon: Award,
      label: "Certificate",
      value: isCompleted ? "Earned!" : "In Progress",
      sub: isCompleted ? "View now →" : `${100 - completionPercentage}% left`,
      color: isCompleted ? "text-secondary" : "text-muted-foreground",
      bg: isCompleted ? "bg-secondary/10" : "bg-muted/50",
      ocid: "course.stats.certificate",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-16" data-ocid="course.page">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
          Your Learning Journey
        </p>
        <h1 className="text-display text-foreground">Course Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Python Mastery: Beginner to Advanced
        </p>
      </motion.div>

      {/* Completion celebration banner */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          data-ocid="course.completion_banner"
          className="mb-8 p-6 rounded-2xl border border-secondary/40 bg-secondary/10 flex items-center gap-5"
        >
          <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
            <Trophy className="w-7 h-7 text-secondary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-lg text-foreground">
              Course Complete — You did it! 🎉
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              All {totalLessons} lessons finished. Your certificate is ready to
              download.
            </p>
          </div>
          <Link
            to="/certificate"
            data-ocid="course.view_certificate_button"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-semibold transition-smooth hover:opacity-90 flex-shrink-0"
          >
            View Certificate
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      )}

      {/* Hero stats section: circular progress + stat cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="bg-card border border-border rounded-2xl p-6 mb-6 elevation-card"
      >
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Circular progress */}
          <div className="flex flex-col items-center gap-2">
            <CircularProgress value={completionPercentage} />
            <span className="text-xs text-muted-foreground font-medium">
              Overall Progress
            </span>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px self-stretch bg-border" />

          {/* Detailed progress bar */}
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">
                Completion
              </span>
              <span className="text-sm font-mono text-muted-foreground tabular-nums">
                {completedLessons} of {totalLessons} lessons
              </span>
            </div>
            <ProgressBar
              value={completionPercentage}
              size="lg"
              variant={completionPercentage === 100 ? "success" : "default"}
              showLabel
            />

            {/* Module-level mini bars */}
            <div className="mt-4 space-y-2">
              {modules.map((mod) => {
                const pct =
                  mod.totalCount > 0
                    ? Math.round((mod.completedCount / mod.totalCount) * 100)
                    : 0;
                return (
                  <div key={mod.module_.id} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-32 truncate flex-shrink-0">
                      {mod.module_.title}
                    </span>
                    <ProgressBar
                      value={pct}
                      size="sm"
                      variant={pct === 100 ? "success" : "default"}
                      className="flex-1"
                    />
                    <span className="text-xs font-mono text-muted-foreground w-10 text-right tabular-nums">
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stat cards row */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statItems.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.06, duration: 0.35 }}
              data-ocid={stat.ocid}
              className="bg-card border border-border rounded-xl p-4 elevation-subtle hover:elevation-card transition-smooth"
            >
              <div
                className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}
              >
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-xs text-muted-foreground mb-0.5">
                {stat.label}
              </p>
              <p className="text-xl font-display font-semibold text-foreground tabular-nums">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Resume / Next lesson CTA */}
      {nextLessonId && !isCompleted && nextLesson && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="mb-8"
          data-ocid="course.resume_section"
        >
          <h2 className="text-subheading text-foreground mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" />
            Continue Learning
          </h2>

          <Link
            to="/db-lesson/$lessonId"
            params={{ lessonId: nextLessonId }}
            data-ocid="course.next_lesson_button"
            className="group block rounded-2xl border border-primary/30 bg-card hover:bg-card/80 transition-smooth elevation-card overflow-hidden"
          >
            {/* Gradient top bar */}
            <div className="h-1.5 w-full gradient-primary" />

            <div className="p-5 flex items-start gap-4">
              {/* Play icon */}
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-smooth">
                <PlayCircle className="w-6 h-6 text-primary-foreground" />
              </div>

              <div className="flex-1 min-w-0">
                {/* Module label */}
                {nextModule && (
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
                    {nextModule.module_.title}
                  </p>
                )}
                {/* Lesson title */}
                <p className="font-semibold text-foreground text-base truncate">
                  {nextLesson.title}
                </p>
                {/* Description */}
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                  {nextLesson.description}
                </p>
                {/* Meta row */}
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <DifficultyBadge difficulty={nextLesson.difficulty} />
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    {nextLesson.durationMinutes} min
                  </span>
                </div>
              </div>

              {/* Arrow CTA */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0 pl-2">
                <span className="text-xs font-semibold text-primary group-hover:text-foreground transition-colors">
                  Resume
                </span>
                <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {/* Curriculum / Modules list */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        data-ocid="course.modules_list"
      >
        <h2 className="text-subheading text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          Curriculum
          <span className="ml-auto text-xs font-normal text-muted-foreground">
            {modules.length} modules · {totalLessons} lessons
          </span>
        </h2>

        <div className="space-y-3">
          {modules.map((mod, i) => (
            <ModuleSection
              key={mod.module_.id}
              moduleWithLessons={mod}
              defaultOpen={i === 0}
              index={i + 1}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
