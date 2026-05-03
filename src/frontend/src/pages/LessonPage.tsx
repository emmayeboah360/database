import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Lock,
} from "lucide-react";
import { motion } from "motion/react";
import { CodeBlock } from "../components/CodeBlock";
import CodePlayground from "../components/CodePlayground";
import { DifficultyBadge } from "../components/DifficultyBadge";
import LessonQuiz from "../components/LessonQuiz";
import { ProgressBar } from "../components/ProgressBar";
import { useCourse } from "../hooks/useCourse";

// ──────────────────────────────────────────────────────────────────────────────
// Content parser
// ──────────────────────────────────────────────────────────────────────────────

type ContentPart =
  | { type: "text"; content: string; key: string }
  | { type: "code"; content: string; key: string };

function parseContent(content: string): ContentPart[] {
  const parts: ContentPart[] = [];
  const codeRegex = /```python\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let partIndex = 0;
  let match: RegExpExecArray | null = codeRegex.exec(content);

  while (match !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: content.slice(lastIndex, match.index).trim(),
        key: `text-${partIndex++}`,
      });
    }
    parts.push({ type: "code", content: match[1], key: `code-${partIndex++}` });
    lastIndex = match.index + match[0].length;
    match = codeRegex.exec(content);
  }
  if (lastIndex < content.length) {
    const remaining = content.slice(lastIndex).trim();
    if (remaining) {
      parts.push({
        type: "text",
        content: remaining,
        key: `text-${partIndex++}`,
      });
    }
  }
  return parts.filter((p) => p.content.length > 0);
}

// ──────────────────────────────────────────────────────────────────────────────
// Inline text renderer
// ──────────────────────────────────────────────────────────────────────────────

interface TextSegment {
  type: "bold" | "code" | "plain";
  text: string;
}

function parseInline(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  const regex = /\*\*(.*?)\*\*|`(.*?)`/g;
  let last = 0;
  let m: RegExpExecArray | null = regex.exec(text);
  while (m !== null) {
    if (m.index > last) {
      segments.push({ type: "plain", text: text.slice(last, m.index) });
    }
    if (m[1] !== undefined) {
      segments.push({ type: "bold", text: m[1] });
    } else if (m[2] !== undefined) {
      segments.push({ type: "code", text: m[2] });
    }
    last = m.index + m[0].length;
    m = regex.exec(text);
  }
  if (last < text.length) {
    segments.push({ type: "plain", text: text.slice(last) });
  }
  return segments;
}

function InlineText({ text }: { text: string }) {
  const segments = parseInline(text);
  return (
    <>
      {segments.map((seg) => {
        const k = `${seg.type}-${seg.text.slice(0, 12)}`;
        if (seg.type === "bold") {
          return (
            <strong key={k} className="font-semibold text-foreground">
              {seg.text}
            </strong>
          );
        }
        if (seg.type === "code") {
          return (
            <code
              key={k}
              className="font-mono text-xs bg-muted/60 px-1.5 py-0.5 rounded text-foreground border border-border/40"
            >
              {seg.text}
            </code>
          );
        }
        return <span key={k}>{seg.text}</span>;
      })}
    </>
  );
}

function TextBlock({ text }: { text: string }) {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("## ")) {
      nodes.push(
        <h2
          key={`h2-${i}`}
          className="font-display text-xl font-medium text-foreground mt-8 mb-3 first:mt-0"
        >
          {line.slice(3)}
        </h2>,
      );
    } else if (line.startsWith("# ")) {
      nodes.push(
        <h1 key={`h1-${i}`} className="text-display text-foreground mb-4">
          {line.slice(2)}
        </h1>,
      );
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      nodes.push(
        <ul key={`ul-${i}`} className="list-none space-y-2 mb-5">
          {items.map((item) => (
            <li
              key={item.slice(0, 24)}
              className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed"
            >
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary/70 flex-shrink-0" />
              <InlineText text={item} />
            </li>
          ))}
        </ul>,
      );
      continue;
    } else if (line.trim().length > 0) {
      nodes.push(
        <p
          key={`p-${i}`}
          className="text-sm text-muted-foreground leading-7 mb-4"
        >
          <InlineText text={line} />
        </p>,
      );
    }
    i++;
  }

  return <>{nodes}</>;
}

// ──────────────────────────────────────────────────────────────────────────────
// Sidebar — module outline
// ──────────────────────────────────────────────────────────────────────────────

interface SidebarProps {
  currentLessonId: string;
  moduleId: string;
}

function LessonSidebar({ currentLessonId, moduleId }: SidebarProps) {
  const { modules } = useCourse();
  const mod = modules.find((m) => m.module_.id === moduleId);
  if (!mod) return null;

  const completedCount = mod.lessons.filter((l) => l.completed).length;

  return (
    <aside className="hidden lg:flex flex-col w-72 xl:w-80 flex-shrink-0 border-l border-border bg-card/40">
      <div className="sticky top-0 h-screen overflow-y-auto">
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Module
            </span>
          </div>
          <p className="text-sm font-semibold text-foreground leading-snug mb-3">
            {mod.module_.title}
          </p>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">
              {completedCount} / {mod.totalCount} lessons
            </span>
            <span className="text-xs font-mono tabular-nums text-muted-foreground">
              {Math.round((completedCount / mod.totalCount) * 100)}%
            </span>
          </div>
          <ProgressBar
            value={Math.round((completedCount / mod.totalCount) * 100)}
            size="sm"
            variant="default"
            data-ocid="lesson.module_progress"
          />
        </div>

        <nav className="p-3" aria-label="Module lessons">
          {mod.lessons.map((ls, idx) => {
            const isCurrent = ls.lesson.id === currentLessonId;
            return (
              <Link
                key={ls.lesson.id}
                to="/db-lesson/$lessonId"
                params={{ lessonId: ls.lesson.id }}
                data-ocid={`lesson.sidebar_item.${idx + 1}`}
                className={`flex items-start gap-3 w-full px-3 py-2.5 rounded-lg mb-1 text-left transition-smooth group ${
                  isCurrent
                    ? "bg-primary/15 border border-primary/25"
                    : "hover:bg-muted/50 border border-transparent"
                }`}
              >
                <div
                  className={`mt-0.5 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold transition-colors ${
                    ls.completed
                      ? "bg-secondary/20 text-secondary"
                      : isCurrent
                        ? "bg-primary/25 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {ls.completed ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    idx + 1
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-xs font-medium leading-snug truncate ${
                      isCurrent
                        ? "text-primary"
                        : ls.completed
                          ? "text-foreground/70"
                          : "text-foreground"
                    }`}
                  >
                    {ls.lesson.title}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {ls.lesson.durationMinutes} min
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Locked lesson guard
// ──────────────────────────────────────────────────────────────────────────────

function LockedLessonView({ title }: { title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[55vh] px-6 text-center"
      data-ocid="lesson.locked_state"
    >
      <div className="w-16 h-16 rounded-2xl bg-muted/60 border border-border flex items-center justify-center mb-5">
        <Lock className="w-7 h-7 text-muted-foreground" />
      </div>
      <h2 className="font-display text-2xl font-medium text-foreground mb-2">
        Lesson Locked
      </h2>
      <p className="text-sm text-muted-foreground max-w-sm mb-1">
        <span className="font-semibold text-foreground">{title}</span> is not
        yet available.
      </p>
      <p className="text-sm text-muted-foreground max-w-sm mb-7">
        Complete earlier lessons first to unlock this content and continue your
        Python journey.
      </p>
      <Link
        to="/db-course"
        data-ocid="lesson.locked_back_button"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold transition-smooth hover:opacity-90"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Course
      </Link>
    </motion.div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Main page
// ──────────────────────────────────────────────────────────────────────────────

export function LessonPage() {
  const { lessonId } = useParams({ from: "/db-lesson/$lessonId" });
  const navigate = useNavigate();
  const {
    getLesson,
    getNextLesson,
    completeLesson,
    completionPercentage,
    modules,
  } = useCourse();

  const lessonWithStatus = getLesson(lessonId);

  // Lesson not found
  if (!lessonWithStatus) {
    return (
      <div
        className="flex items-center justify-center min-h-[50vh]"
        data-ocid="lesson.error_state"
      >
        <div className="text-center space-y-3">
          <p className="text-muted-foreground text-sm">Lesson not found.</p>
          <Link
            to="/db-course"
            className="text-primary hover:underline text-sm inline-block"
          >
            Back to course
          </Link>
        </div>
      </div>
    );
  }

  const { lesson, completed } = lessonWithStatus;
  const mod = modules.find((m) => m.module_.id === lesson.moduleId);

  // Compute previous lesson
  const flatLessons = modules.flatMap((m) => m.lessons);
  const currentIdx = flatLessons.findIndex((l) => l.lesson.id === lessonId);
  const prevLessonId =
    currentIdx > 0 ? flatLessons[currentIdx - 1].lesson.id : undefined;
  const nextLessonId = getNextLesson(lessonId);

  // Module progress
  const moduleCompletedCount = mod
    ? mod.lessons.filter((l) => l.completed).length
    : 0;
  const moduleTotalCount = mod ? mod.totalCount : 0;
  const moduleProgressPct =
    moduleTotalCount > 0
      ? Math.round((moduleCompletedCount / moduleTotalCount) * 100)
      : 0;

  // Check if lesson is locked: first incomplete must be this or earlier
  // A lesson is locked if a preceding lesson in the same module is not completed
  // Strategy: lesson is accessible if all preceding lessons are completed
  const isLocked =
    currentIdx > 0 && !flatLessons[currentIdx - 1].completed && !completed;

  if (isLocked) {
    return <LockedLessonView title={lesson.title} />;
  }

  const handleComplete = () => {
    completeLesson(lessonId);
    if (nextLessonId) {
      void navigate({
        to: "/db-lesson/$lessonId",
        params: { lessonId: nextLessonId },
      });
    } else {
      void navigate({ to: "/certificate" });
    }
  };

  const contentParts = parseContent(lesson.content);

  return (
    <div className="flex min-h-full" data-ocid="lesson.page">
      {/* Main content column */}
      <div className="flex-1 min-w-0">
        <div className="max-w-2xl xl:max-w-3xl mx-auto px-4 sm:px-6 py-8">
          {/* ── Breadcrumb ── */}
          <nav
            className="flex items-center gap-1.5 text-xs text-muted-foreground mb-7 flex-wrap"
            aria-label="Breadcrumb"
            data-ocid="lesson.breadcrumb"
          >
            <Link
              to="/"
              className="hover:text-foreground transition-colors"
              data-ocid="lesson.breadcrumb_home"
            >
              Course
            </Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0 opacity-50" />
            {mod && (
              <>
                <Link
                  to="/db-course"
                  className="hover:text-foreground transition-colors truncate max-w-[120px]"
                  data-ocid="lesson.breadcrumb_module"
                >
                  {mod.module_.title}
                </Link>
                <ChevronRight className="w-3 h-3 flex-shrink-0 opacity-50" />
              </>
            )}
            <span
              className="text-foreground/80 truncate max-w-[160px]"
              aria-current="page"
            >
              {lesson.title}
            </span>
          </nav>

          {/* ── Lesson header ── */}
          <motion.header
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-8"
            data-ocid="lesson.header"
          >
            {/* Tags row */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="px-2 py-0.5 rounded-md bg-primary/15 text-primary text-xs font-semibold tracking-wide">
                Python
              </span>
              {mod && (
                <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-xs font-medium">
                  {mod.module_.title}
                </span>
              )}
              {completed && (
                <span className="flex items-center gap-1 text-secondary text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Completed
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl lg:text-4xl font-medium text-foreground leading-tight mb-3">
              {lesson.title}
            </h1>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-xl">
              {lesson.description}
            </p>

            {/* Meta row */}
            <div className="flex items-center gap-4 flex-wrap">
              <DifficultyBadge difficulty={lesson.difficulty} />
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {lesson.durationMinutes} min read
              </span>
            </div>

            {/* Module progress bar */}
            {mod && (
              <div className="mt-5 p-3.5 rounded-xl bg-muted/30 border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Module Progress
                  </span>
                  <span className="text-xs font-mono tabular-nums text-muted-foreground">
                    {moduleCompletedCount} / {moduleTotalCount} lessons
                  </span>
                </div>
                <ProgressBar
                  value={moduleProgressPct}
                  size="sm"
                  variant={moduleProgressPct === 100 ? "success" : "default"}
                  data-ocid="lesson.module_progress_bar"
                />
              </div>
            )}

            <div className="mt-6 h-px bg-border" />
          </motion.header>

          {/* ── Lesson body ── */}
          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12 }}
            className="prose-lesson"
            data-ocid="lesson.content"
          >
            {contentParts.map((part) =>
              part.type === "code" ? (
                <div key={part.key}>
                  <CodeBlock code={part.content} />
                  <CodePlayground
                    initialCode={part.content}
                    title="Try it yourself"
                  />
                </div>
              ) : (
                <TextBlock key={part.key} text={part.content} />
              ),
            )}
          </motion.article>

          {/* ── Knowledge Check Quiz ── */}
          {lesson.quiz && lesson.quiz.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <LessonQuiz questions={lesson.quiz} />
            </motion.div>
          )}

          {/* ── Bottom nav ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 pt-6 border-t border-border space-y-5"
            data-ocid="lesson.actions"
          >
            {/* Overall course progress */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Overall Course Progress</span>
              <span className="font-mono tabular-nums">
                {completionPercentage}%
              </span>
            </div>
            <ProgressBar
              value={completionPercentage}
              size="md"
              variant={completionPercentage === 100 ? "success" : "default"}
              data-ocid="lesson.course_progress_bar"
            />

            {/* Navigation row */}
            <div className="flex gap-3 items-center">
              {/* Previous button */}
              {prevLessonId ? (
                <Link
                  to="/db-lesson/$lessonId"
                  params={{ lessonId: prevLessonId }}
                  data-ocid="lesson.prev_button"
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-border text-foreground text-sm font-medium transition-smooth hover:bg-muted/40 flex-shrink-0"
                  aria-label="Previous lesson"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </Link>
              ) : (
                <Link
                  to="/db-course"
                  data-ocid="lesson.back_to_course"
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-border text-foreground text-sm font-medium transition-smooth hover:bg-muted/40 flex-shrink-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Course</span>
                </Link>
              )}

              {/* Complete / Next CTA */}
              {completed ? (
                nextLessonId ? (
                  <Link
                    to="/db-lesson/$lessonId"
                    params={{ lessonId: nextLessonId }}
                    data-ocid="lesson.next_button"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-primary/30 bg-primary/10 text-primary text-sm font-semibold transition-smooth hover:bg-primary/20"
                  >
                    Next Lesson
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link
                    to="/certificate"
                    data-ocid="lesson.view_certificate_button"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold transition-smooth hover:opacity-90"
                  >
                    View Certificate
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )
              ) : (
                <button
                  type="button"
                  onClick={handleComplete}
                  data-ocid="lesson.complete_button"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold transition-smooth hover:opacity-90 active:scale-[0.98] cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {nextLessonId
                    ? "Mark Complete & Next"
                    : "Complete & Get Certificate"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Keyboard hint */}
            <p className="text-center text-xs text-muted-foreground/50">
              Lesson {currentIdx + 1} of {flatLessons.length}
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Sidebar ── */}
      <LessonSidebar currentLessonId={lessonId} moduleId={lesson.moduleId} />
    </div>
  );
}
