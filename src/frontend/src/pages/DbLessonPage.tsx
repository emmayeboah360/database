import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Database,
  GraduationCap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import AcidExplainer from "../components/AcidExplainer";
import { DataMiningMatcher } from "../components/DataMiningMatcher";
import DataTypeExercise from "../components/DataTypeExercise";
import { DbTypeComparison } from "../components/DbTypeComparison";
import { DifficultyBadge } from "../components/DifficultyBadge";
import { DistributedDiagram } from "../components/DistributedDiagram";
import { ERDViewer } from "../components/ERDViewer";
import LessonQuiz from "../components/LessonQuiz";
import NormalizationExercise from "../components/NormalizationExercise";
import { RelationalDiagram } from "../components/RelationalDiagram";
import SQLPlayground from "../components/SQLPlayground";
import SchemaLayerDiagram from "../components/SchemaLayerDiagram";
import SqlClassifier from "../components/SqlClassifier";
import { DATABASE_MODULES, type DbLesson } from "../types/db-course";

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

const DB_PROGRESS_KEY = "db-progress";

function getCompletedIds(): string[] {
  try {
    const stored = localStorage.getItem(DB_PROGRESS_KEY);
    return stored ? (JSON.parse(stored) as string[]) : [];
  } catch {
    return [];
  }
}

function markComplete(lessonId: string): void {
  const ids = getCompletedIds();
  if (!ids.includes(lessonId)) {
    localStorage.setItem(DB_PROGRESS_KEY, JSON.stringify([...ids, lessonId]));
  }
}

const ALL_DB_LESSONS: DbLesson[] = DATABASE_MODULES.flatMap((m) => m.lessons);

function findModuleForLesson(lessonId: string) {
  return DATABASE_MODULES.find((m) => m.lessons.some((l) => l.id === lessonId));
}

// ──────────────────────────────────────────────────────────────────────────────
// Content renderer
// ──────────────────────────────────────────────────────────────────────────────

type TextSegment = { type: "bold" | "code" | "plain"; text: string };

function parseInline(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  const regex = /\*\*(.*?)\*\*|`(.*?)`/g;
  let last = 0;
  let m: RegExpExecArray | null = regex.exec(text);
  while (m !== null) {
    if (m.index > last)
      segments.push({ type: "plain", text: text.slice(last, m.index) });
    if (m[1] !== undefined) segments.push({ type: "bold", text: m[1] });
    else if (m[2] !== undefined) segments.push({ type: "code", text: m[2] });
    last = m.index + m[0].length;
    m = regex.exec(text);
  }
  if (last < text.length)
    segments.push({ type: "plain", text: text.slice(last) });
  return segments;
}

function InlineText({ text }: { text: string }) {
  const segs = parseInline(text);
  return (
    <>
      {segs.map((seg) => {
        const k = `${seg.type}-${seg.text.slice(0, 16)}`;
        if (seg.type === "bold")
          return (
            <strong key={k} className="font-semibold text-foreground">
              {seg.text}
            </strong>
          );
        if (seg.type === "code")
          return (
            <code
              key={k}
              className="font-mono text-xs bg-muted/60 px-1.5 py-0.5 rounded text-foreground border border-border/40"
            >
              {seg.text}
            </code>
          );
        return <span key={k}>{seg.text}</span>;
      })}
    </>
  );
}

function SqlCodeBlock({ code }: { code: string }) {
  return (
    <div className="my-4 rounded-xl overflow-hidden border db-sql-block">
      <div
        className="flex items-center gap-2 px-3 py-2 border-b text-xs font-mono font-semibold"
        style={{
          background: "oklch(var(--db-sql) / 0.08)",
          borderColor: "oklch(var(--db-sql) / 0.25)",
          color: "oklch(var(--db-sql))",
        }}
      >
        <Database className="w-3 h-3" />
        SQL
      </div>
      <pre
        className="p-4 text-xs overflow-x-auto font-mono leading-relaxed text-foreground"
        style={{ background: "oklch(var(--card))" }}
      >
        {code}
      </pre>
    </div>
  );
}

function DbTable({ rows }: { rows: string[] }) {
  if (rows.length < 2) return null;
  const headers = rows[0]
    .split("|")
    .slice(1, -1)
    .map((h) => h.trim());
  const dataRows = rows.slice(2).map((r) =>
    r
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim()),
  );
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-xs">
        <thead>
          <tr className="db-table-row">
            {headers.map((h) => (
              <th
                key={h}
                className="px-3 py-2 text-left font-semibold text-foreground"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row) => (
            <tr
              key={row.join("-").slice(0, 24)}
              className="border-b border-border/40 last:border-0"
            >
              {row.map((cell) => (
                <td
                  key={cell.slice(0, 16)}
                  className="px-3 py-2 text-muted-foreground"
                >
                  <InlineText text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DbTextBlock({ text }: { text: string }) {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("### ")) {
      nodes.push(
        <h3
          key={`h3-${i}`}
          className="font-display text-lg font-medium text-foreground mt-6 mb-2"
        >
          {line.slice(4)}
        </h3>,
      );
    } else if (line.startsWith("## ")) {
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
        <h1
          key={`h1-${i}`}
          className="font-display text-2xl font-medium text-foreground mb-4"
        >
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
              key={item.slice(0, 28)}
              className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed"
            >
              <span
                className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: "oklch(var(--db-sql))" }}
              />
              <InlineText text={item} />
            </li>
          ))}
        </ul>,
      );
      continue;
    } else if (line.startsWith("| ")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      nodes.push(<DbTable key={`tbl-${i}`} rows={tableLines} />);
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

type ContentPart =
  | { type: "text"; content: string; key: string }
  | { type: "sql"; content: string; key: string };

function parseDbContent(content: string): ContentPart[] {
  const parts: ContentPart[] = [];
  const sqlRegex = /```sql\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let idx = 0;
  let match: RegExpExecArray | null = sqlRegex.exec(content);
  while (match !== null) {
    if (match.index > lastIndex) {
      const txt = content.slice(lastIndex, match.index).trim();
      if (txt) parts.push({ type: "text", content: txt, key: `t-${idx++}` });
    }
    parts.push({
      type: "sql",
      content: match[1].trim(),
      key: `s-${idx++}`,
    });
    lastIndex = match.index + match[0].length;
    match = sqlRegex.exec(content);
  }
  if (lastIndex < content.length) {
    const txt = content.slice(lastIndex).trim();
    if (txt) parts.push({ type: "text", content: txt, key: `t-${idx++}` });
  }
  return parts;
}

// ──────────────────────────────────────────────────────────────────────────────
// Module sidebar
// ──────────────────────────────────────────────────────────────────────────────

function DbSidebar({
  currentLessonId,
  completedIds,
}: {
  currentLessonId: string;
  completedIds: string[];
}) {
  const mod = findModuleForLesson(currentLessonId);
  if (!mod) return null;
  const done = mod.lessons.filter((l) => completedIds.includes(l.id)).length;

  return (
    <aside className="hidden lg:flex flex-col w-72 xl:w-80 flex-shrink-0 border-l border-border bg-card/40">
      <div className="sticky top-0 h-screen overflow-y-auto">
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen
              className="w-4 h-4"
              style={{ color: "oklch(var(--db-sql))" }}
            />
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "oklch(var(--db-sql))" }}
            >
              Module
            </span>
          </div>
          <p className="text-sm font-semibold text-foreground leading-snug mb-3">
            {mod.module.title}
          </p>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">
              {done} / {mod.lessons.length} lessons
            </span>
            <span className="text-xs font-mono tabular-nums text-muted-foreground">
              {Math.round((done / mod.lessons.length) * 100)}%
            </span>
          </div>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: "oklch(var(--muted))" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.round((done / mod.lessons.length) * 100)}%`,
                background: "oklch(var(--db-sql))",
              }}
            />
          </div>
        </div>
        <nav className="p-3" aria-label="Module lessons">
          {mod.lessons.map((lesson, idx) => {
            const isCurrent = lesson.id === currentLessonId;
            const isDone = completedIds.includes(lesson.id);
            return (
              <Link
                key={lesson.id}
                to="/db-lesson/$lessonId"
                params={{ lessonId: lesson.id }}
                data-ocid={`db_lesson.sidebar_item.${idx + 1}`}
                className={`flex items-start gap-3 w-full px-3 py-2.5 rounded-lg mb-1 text-left transition-smooth group ${
                  isCurrent
                    ? "border"
                    : "hover:bg-muted/50 border border-transparent"
                }`}
                style={
                  isCurrent
                    ? {
                        background: "oklch(var(--db-sql) / 0.08)",
                        borderColor: "oklch(var(--db-sql) / 0.3)",
                      }
                    : {}
                }
              >
                <div
                  className="mt-0.5 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                  style={{
                    background: isDone
                      ? "oklch(var(--secondary) / 0.2)"
                      : isCurrent
                        ? "oklch(var(--db-sql) / 0.2)"
                        : "oklch(var(--muted))",
                    color: isDone
                      ? "oklch(var(--secondary))"
                      : isCurrent
                        ? "oklch(var(--db-sql))"
                        : "oklch(var(--muted-foreground))",
                  }}
                >
                  {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-xs font-medium leading-snug truncate"
                    style={{
                      color: isCurrent
                        ? "oklch(var(--db-sql))"
                        : isDone
                          ? "oklch(var(--foreground) / 0.7)"
                          : "oklch(var(--foreground))",
                    }}
                  >
                    {lesson.title}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {lesson.duration} min
                    {lesson.isHL && (
                      <span
                        className="ml-1.5 px-1.5 py-0.5 rounded text-xs font-semibold"
                        style={{
                          background: "oklch(var(--db-hl) / 0.15)",
                          color: "oklch(var(--db-hl))",
                        }}
                      >
                        HL
                      </span>
                    )}
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
// Interactive section wrapper
// ──────────────────────────────────────────────────────────────────────────────

type SectionVariant =
  | "sql"
  | "erd"
  | "norm"
  | "schema"
  | "datatype"
  | "relational"
  | "quiz";

const SECTION_META: Record<
  SectionVariant,
  { label: string; colorVar: string; icon: React.ReactNode }
> = {
  sql: {
    label: "SQL Playground",
    colorVar: "--db-sql",
    icon: <Database className="w-4 h-4" />,
  },
  erd: {
    label: "ERD Viewer",
    colorVar: "--db-erd",
    icon: <BookOpen className="w-4 h-4" />,
  },
  norm: {
    label: "Normalisation Exercise",
    colorVar: "--db-hl",
    icon: <GraduationCap className="w-4 h-4" />,
  },
  schema: {
    label: "Schema Layer Explorer",
    colorVar: "--accent",
    icon: <BookOpen className="w-4 h-4" />,
  },
  relational: {
    label: "Interactive Diagram",
    colorVar: "--db-sql",
    icon: <Database className="w-4 h-4" />,
  },
  datatype: {
    label: "Data Type Exercise",
    colorVar: "--db-sql",
    icon: <GraduationCap className="w-4 h-4" />,
  },
  quiz: {
    label: "Knowledge Check",
    colorVar: "--primary",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
};

function InteractiveSection({
  variant,
  children,
}: {
  variant: SectionVariant;
  children: React.ReactNode;
}) {
  const meta = SECTION_META[variant];
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mt-8 rounded-2xl border border-border overflow-hidden"
      style={{ background: "oklch(var(--card))" }}
    >
      <div
        className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border"
        style={{
          background: `oklch(var(${meta.colorVar}) / 0.07)`,
          borderBottomColor: `oklch(var(${meta.colorVar}) / 0.2)`,
        }}
      >
        <span style={{ color: `oklch(var(${meta.colorVar}))` }}>
          {meta.icon}
        </span>
        <span
          className="text-sm font-semibold"
          style={{ color: `oklch(var(${meta.colorVar}))` }}
        >
          {meta.label}
        </span>
      </div>
      <div className="p-5">{children}</div>
    </motion.section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Main page
// ──────────────────────────────────────────────────────────────────────────────

export function DbLessonPage() {
  const { lessonId } = useParams({ from: "/db-lesson/$lessonId" });
  const navigate = useNavigate();
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: lessonId intentionally triggers a localStorage re-read when navigating between lessons
  useEffect(() => {
    setCompletedIds(getCompletedIds());
  }, [lessonId]);

  const lesson = ALL_DB_LESSONS.find((l) => l.id === lessonId);
  const mod = findModuleForLesson(lessonId);
  const currentIdx = ALL_DB_LESSONS.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIdx > 0 ? ALL_DB_LESSONS[currentIdx - 1] : null;
  const nextLesson =
    currentIdx >= 0 && currentIdx < ALL_DB_LESSONS.length - 1
      ? ALL_DB_LESSONS[currentIdx + 1]
      : null;
  const isCompleted = completedIds.includes(lessonId);

  if (!lesson || !mod) {
    return (
      <div
        className="flex items-center justify-center min-h-[50vh]"
        data-ocid="db_lesson.error_state"
      >
        <div className="text-center space-y-3">
          <p className="text-muted-foreground text-sm">Lesson not found.</p>
          <Link
            to="/db-course"
            className="text-primary hover:underline text-sm"
          >
            Back to Database Course
          </Link>
        </div>
      </div>
    );
  }

  const handleComplete = () => {
    markComplete(lessonId);
    setCompletedIds(getCompletedIds());
    if (nextLesson) {
      void navigate({
        to: "/db-lesson/$lessonId",
        params: { lessonId: nextLesson.id },
      });
    } else {
      void navigate({ to: "/db-course" });
    }
  };

  const contentParts = parseDbContent(lesson.content);

  return (
    <div className="flex min-h-full" data-ocid="db_lesson.page">
      <div className="flex-1 min-w-0">
        <div className="max-w-2xl xl:max-w-3xl mx-auto px-4 sm:px-6 py-8">
          {/* HL banner */}
          {lesson.isHL && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-6 px-4 py-3 rounded-xl border"
              data-ocid="db_lesson.hl_banner"
              style={{
                background: "oklch(var(--db-hl) / 0.08)",
                borderColor: "oklch(var(--db-hl) / 0.3)",
              }}
            >
              <AlertTriangle
                className="w-4 h-4 flex-shrink-0"
                style={{ color: "oklch(var(--db-hl))" }}
              />
              <p
                className="text-sm font-medium"
                style={{ color: "oklch(var(--db-hl))" }}
              >
                <span className="font-bold">Higher Level (HL) Topic</span> —
                This content is required for HL students only.
              </p>
            </motion.div>
          )}

          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-1.5 text-xs text-muted-foreground mb-7 flex-wrap"
            aria-label="Breadcrumb"
            data-ocid="db_lesson.breadcrumb"
          >
            <Link
              to="/"
              className="hover:text-foreground transition-colors"
              data-ocid="db_lesson.breadcrumb_home"
            >
              Courses
            </Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0 opacity-50" />
            <Link
              to="/db-course"
              className="hover:text-foreground transition-colors"
              data-ocid="db_lesson.breadcrumb_course"
            >
              A3 Databases
            </Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0 opacity-50" />
            <span
              className="text-muted-foreground/70 truncate max-w-[140px]"
              title={mod.module.title}
            >
              {mod.module.title}
            </span>
            <ChevronRight className="w-3 h-3 flex-shrink-0 opacity-50" />
            <span
              className="text-foreground/80 truncate max-w-[160px]"
              aria-current="page"
            >
              {lesson.title}
            </span>
          </nav>

          {/* Lesson header */}
          <motion.header
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-8"
            data-ocid="db_lesson.header"
          >
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span
                className="px-2 py-0.5 rounded-md text-xs font-semibold"
                style={{
                  background: "oklch(var(--db-sql) / 0.12)",
                  color: "oklch(var(--db-sql))",
                }}
              >
                A3 Databases
              </span>
              <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-xs font-medium">
                {mod.module.title}
              </span>
              {lesson.isHL && <span className="db-hl-badge">HL Only</span>}
              {isCompleted && (
                <span
                  className="flex items-center gap-1 text-xs font-semibold"
                  style={{ color: "oklch(var(--secondary))" }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Completed
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl lg:text-4xl font-medium text-foreground leading-tight mb-3">
              {lesson.title}
            </h1>

            <div className="flex items-center gap-4 flex-wrap">
              <DifficultyBadge difficulty={lesson.difficulty} />
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {lesson.duration} min
              </span>
              <span className="text-xs text-muted-foreground">
                Lesson {currentIdx + 1} of {ALL_DB_LESSONS.length}
              </span>
            </div>

            <div className="mt-6 h-px bg-border" />
          </motion.header>

          {/* Lesson body */}
          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="prose-lesson"
            data-ocid="db_lesson.content"
          >
            {contentParts.map((part) =>
              part.type === "sql" ? (
                <SqlCodeBlock key={part.key} code={part.content} />
              ) : (
                <DbTextBlock key={part.key} text={part.content} />
              ),
            )}
          </motion.article>

          {/* Schema Layer Diagram */}
          {lesson.schemaLayerDiagram && (
            <InteractiveSection variant="schema">
              <SchemaLayerDiagram />
            </InteractiveSection>
          )}

          {/* Relational Diagram (A3.1 interactive) */}
          {lesson.interactiveType && (
            <InteractiveSection variant="relational">
              <RelationalDiagram variant={lesson.interactiveType} />
            </InteractiveSection>
          )}

          {/* ERD Viewer */}
          {lesson.erdSchema && (
            <InteractiveSection variant="erd">
              <ERDViewer
                schemaId={lesson.erdSchema.schemaId}
                highlightEntities={lesson.erdSchema.highlightEntities}
              />
            </InteractiveSection>
          )}

          {/* SQL Playground */}
          {lesson.sqlChallenge && (
            <InteractiveSection variant="sql">
              <SQLPlayground
                dbName={lesson.sqlChallenge.db}
                initialSql={lesson.sqlChallenge.initialSql}
                description={lesson.sqlChallenge.description}
                hints={lesson.sqlChallenge.hints}
              />
            </InteractiveSection>
          )}

          {/* Data Type Exercise */}
          {lesson.dataTypeExercise && (
            <InteractiveSection variant="datatype">
              <DataTypeExercise />
            </InteractiveSection>
          )}

          {/* Normalisation Exercise */}
          {lesson.normalizationExercise && (
            <InteractiveSection variant="norm">
              <NormalizationExercise
                exerciseId={lesson.normalizationExercise.exerciseId}
                scenario={lesson.normalizationExercise.scenario}
                targetNF={lesson.normalizationExercise.targetNF}
              />
            </InteractiveSection>
          )}

          {/* SQL Classifier (A3.3.1) */}
          {lesson.sqlClassifier && (
            <InteractiveSection variant="sql">
              <SqlClassifier />
            </InteractiveSection>
          )}

          {/* ACID Explainer (A3.3.5) */}
          {lesson.acidExplainer && (
            <InteractiveSection variant="norm">
              <AcidExplainer />
            </InteractiveSection>
          )}

          {/* DB Type Comparison (A3.4.1) */}
          {lesson.dbTypeComparison && (
            <InteractiveSection variant="sql">
              <DbTypeComparison />
            </InteractiveSection>
          )}

          {/* Data Mining Matcher (A3.4.3) */}
          {lesson.dataMiningMatcher && (
            <InteractiveSection variant="norm">
              <DataMiningMatcher />
            </InteractiveSection>
          )}

          {/* Distributed Database Diagram (A3.4.4) */}
          {lesson.distributedDiagram && (
            <InteractiveSection variant="erd">
              <DistributedDiagram />
            </InteractiveSection>
          )}

          {/* Knowledge Check */}
          {lesson.quiz.length > 0 && (
            <InteractiveSection variant="quiz">
              <LessonQuiz questions={lesson.quiz} />
            </InteractiveSection>
          )}

          {/* Navigation footer */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 pt-6 border-t border-border space-y-4"
            data-ocid="db_lesson.actions"
          >
            <div className="flex gap-3 items-center">
              {prevLesson ? (
                <Link
                  to="/db-lesson/$lessonId"
                  params={{ lessonId: prevLesson.id }}
                  data-ocid="db_lesson.prev_button"
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-border text-foreground text-sm font-medium transition-smooth hover:bg-muted/40 flex-shrink-0"
                  aria-label="Previous lesson"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </Link>
              ) : (
                <Link
                  to="/db-course"
                  data-ocid="db_lesson.back_to_course"
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-border text-foreground text-sm font-medium transition-smooth hover:bg-muted/40 flex-shrink-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Course</span>
                </Link>
              )}

              {isCompleted ? (
                nextLesson ? (
                  <Link
                    to="/db-lesson/$lessonId"
                    params={{ lessonId: nextLesson.id }}
                    data-ocid="db_lesson.next_button"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-smooth border"
                    style={{
                      background: "oklch(var(--db-sql) / 0.1)",
                      borderColor: "oklch(var(--db-sql) / 0.3)",
                      color: "oklch(var(--db-sql))",
                    }}
                  >
                    Next Lesson
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link
                    to="/db-course"
                    data-ocid="db_lesson.finished_button"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold transition-smooth hover:opacity-90"
                  >
                    Back to Course Overview
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )
              ) : (
                <button
                  type="button"
                  onClick={handleComplete}
                  data-ocid="db_lesson.complete_button"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold transition-smooth hover:opacity-90 active:scale-[0.98] cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {nextLesson ? "Mark Complete & Next" : "Mark as Complete"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            <p className="text-center text-xs text-muted-foreground/50">
              Lesson {currentIdx + 1} of {ALL_DB_LESSONS.length} — A3 Databases
            </p>
          </motion.div>
        </div>
      </div>

      <DbSidebar currentLessonId={lessonId} completedIds={completedIds} />
    </div>
  );
}
