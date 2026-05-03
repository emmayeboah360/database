import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DataTypeQuestion {
  id: string;
  fieldName: string;
  description: string;
  exampleValue: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
}

// ─── Question Data ────────────────────────────────────────────────────────────

const QUESTIONS: DataTypeQuestion[] = [
  {
    id: "dt-1",
    fieldName: "student_age",
    description: "The age of a student in whole years",
    exampleValue: "17",
    options: ["VARCHAR(3)", "INT", "DECIMAL(4,1)", "BOOLEAN"],
    correctIndex: 1,
    explanation:
      "INT stores whole numbers with no decimal point. Age is always a whole number and fits comfortably within INT range. VARCHAR would allow non-numeric input, and DECIMAL is for fractional values.",
    hint: "Age is always a whole number — no decimals needed.",
  },
  {
    id: "dt-2",
    fieldName: "product_price",
    description: "A product's price — must be exact to 2 decimal places",
    exampleValue: "£49.99",
    options: ["FLOAT", "INT", "DECIMAL(10,2)", "TEXT"],
    correctIndex: 2,
    explanation:
      "DECIMAL(10,2) stores exact decimal values — critical for money. FLOAT uses binary approximation causing rounding errors (e.g. £49.99 may store as £49.990000001). Never use FLOAT for financial data.",
    hint: "Money needs exact decimals — binary floating point can't represent 0.1 exactly.",
  },
  {
    id: "dt-3",
    fieldName: "member_email",
    description: "An email address, up to 150 characters",
    exampleValue: "alice@example.com",
    options: ["CHAR(150)", "INT", "VARCHAR(150)", "BLOB"],
    correctIndex: 2,
    explanation:
      "VARCHAR(150) stores variable-length text up to 150 characters — email addresses vary in length so VARCHAR is more storage-efficient than CHAR, which pads every value to the full 150 characters.",
    hint: "Email addresses vary in length — use the type that only stores what's needed.",
  },
  {
    id: "dt-4",
    fieldName: "loan_date",
    description: "The date a book was borrowed from the library",
    exampleValue: "2024-03-15",
    options: ["VARCHAR(20)", "INT", "DATE", "TEXT"],
    correctIndex: 2,
    explanation:
      "DATE stores a calendar date (YYYY-MM-DD) natively. Using VARCHAR means date comparisons and sorting fail — '2024-12-01' sorts before '2024-2-01' as a string but not as a date.",
    hint: "Use the type that lets you compare and sort dates correctly.",
  },
  {
    id: "dt-5",
    fieldName: "is_available",
    description: "Whether a book is currently available to borrow",
    exampleValue: "true",
    options: ["INT", "VARCHAR(5)", "TEXT", "BOOLEAN"],
    correctIndex: 3,
    explanation:
      "BOOLEAN stores TRUE/FALSE values directly. Using INT (0/1) works but is less readable. VARCHAR('true'/'false') is error-prone — typos like 'True' or 'TRUE' bypass validation.",
    hint: "This field only has two possible states.",
  },
  {
    id: "dt-6",
    fieldName: "phone_number",
    description: "A customer's phone number, including country code",
    exampleValue: "+44 07700 900123",
    options: ["INT", "BIGINT", "VARCHAR(25)", "FLOAT"],
    correctIndex: 2,
    explanation:
      "Phone numbers are identifiers, not quantities — never store them as numeric types. INT/BIGINT drop leading zeros (+44 → 44, 07700 → 7700) and cannot store the '+' or spaces. VARCHAR(25) stores the exact string.",
    hint: "Phone numbers have leading zeros and special characters — think about what gets lost with numeric types.",
  },
  {
    id: "dt-7",
    fieldName: "book_description",
    description:
      "A detailed description of a book — potentially thousands of words",
    exampleValue: "An exhaustive guide covering...",
    options: ["VARCHAR(255)", "CHAR(500)", "TEXT", "INT"],
    correctIndex: 2,
    explanation:
      "TEXT stores unlimited-length text — ideal for long-form content like descriptions, articles, or notes. VARCHAR has a maximum length cap (255 or 65,535 bytes depending on the DBMS) which may be insufficient.",
    hint: "This content could be any length — potentially thousands of characters.",
  },
  {
    id: "dt-8",
    fieldName: "country_code",
    description: "A 2-character ISO country code (always exactly 2 characters)",
    exampleValue: "GB",
    options: ["VARCHAR(2)", "CHAR(2)", "TEXT", "INT"],
    correctIndex: 1,
    explanation:
      "CHAR(2) is ideal for fixed-length values that are always exactly the same length. It's marginally more storage-efficient than VARCHAR for fixed-length strings since there's no length overhead byte.",
    hint: "Every value will always be exactly the same length.",
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "intro" | "question" | "complete";

// ─── Field Preview ────────────────────────────────────────────────────────────

function FieldPreview({
  fieldName,
  exampleValue,
}: {
  fieldName: string;
  exampleValue: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-3 font-mono text-xs">
      <span className="text-muted-foreground">COLUMN: </span>
      <span className="text-primary font-semibold">{fieldName}</span>
      <span className="text-muted-foreground"> · Example value: </span>
      <span className="text-accent font-semibold">"{exampleValue}"</span>
    </div>
  );
}

// ─── Option Button ────────────────────────────────────────────────────────────

function OptionButton({
  option,
  index,
  selected,
  answered,
  correctIndex,
  onSelect,
}: {
  option: string;
  index: number;
  selected: number | null;
  answered: boolean;
  correctIndex: number;
  onSelect: (i: number) => void;
}) {
  const isCorrect = index === correctIndex;
  const isSelected = index === selected;

  let cls =
    "w-full text-left px-4 py-3 rounded-lg border text-sm font-mono transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  if (!answered) {
    cls +=
      " border-border bg-card text-foreground hover:border-primary/60 hover:bg-primary/5 cursor-pointer";
  } else if (isCorrect) {
    cls +=
      " border-secondary/60 bg-secondary/10 text-foreground cursor-default";
  } else if (isSelected) {
    cls +=
      " border-destructive/60 bg-destructive/10 text-foreground cursor-default";
  } else {
    cls +=
      " border-border bg-card/50 text-muted-foreground cursor-default opacity-50";
  }

  return (
    <button
      type="button"
      data-ocid={`datatype_exercise.option.${index + 1}`}
      className={cls}
      onClick={() => onSelect(index)}
      disabled={answered}
      aria-pressed={isSelected}
    >
      <div className="flex items-center gap-3">
        <span
          className={`w-6 h-6 rounded-full border flex-shrink-0 flex items-center justify-center text-xs font-semibold
            ${
              answered && isCorrect
                ? "border-secondary bg-secondary text-secondary-foreground"
                : answered && isSelected && !isCorrect
                  ? "border-destructive bg-destructive text-destructive-foreground"
                  : "border-border text-muted-foreground"
            }`}
        >
          {answered && isCorrect ? (
            <CheckCircle2 className="w-3 h-3" />
          ) : answered && isSelected && !isCorrect ? (
            <XCircle className="w-3 h-3" />
          ) : (
            String.fromCharCode(65 + index)
          )}
        </span>
        <span className="font-bold text-sm">{option}</span>
      </div>
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DataTypeExercise() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);

  const question = QUESTIONS[qIndex];
  const answered = selected !== null;
  const isCorrect = selected === question?.correctIndex;
  const isLast = qIndex === QUESTIONS.length - 1;

  function handleSelect(i: number) {
    if (answered) return;
    setSelected(i);
    if (i === question.correctIndex) setScore((s) => s + 1);
  }

  function handleNext() {
    if (isLast) {
      setPhase("complete");
    } else {
      setQIndex((q) => q + 1);
      setSelected(null);
      setShowHint(false);
    }
  }

  function handleRestart() {
    setPhase("intro");
    setQIndex(0);
    setSelected(null);
    setShowHint(false);
    setScore(0);
  }

  // ── Intro ──
  if (phase === "intro") {
    return (
      <div
        data-ocid="datatype_exercise.section"
        className="rounded-xl border border-border bg-card overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-border bg-primary/5 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <h2 className="text-subheading text-foreground">
            Data Type Exercise
          </h2>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            For each field definition, choose the most appropriate SQL data
            type. You will see the column name and an example value — pick the
            type that stores data correctly, efficiently, and safely.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "🔢", label: "INT", desc: "Whole numbers" },
              { icon: "💰", label: "DECIMAL", desc: "Exact decimals (money)" },
              { icon: "📝", label: "VARCHAR", desc: "Variable text" },
              { icon: "📅", label: "DATE", desc: "Calendar dates" },
              { icon: "✔", label: "BOOLEAN", desc: "True / False" },
              { icon: "📄", label: "TEXT", desc: "Long text" },
            ].map(({ icon, label, desc }) => (
              <div
                key={label}
                className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 text-xs"
              >
                <span>{icon}</span>
                <span className="font-mono font-semibold text-foreground">
                  {label}
                </span>
                <span className="text-muted-foreground">{desc}</span>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 text-sm">
            <span className="font-semibold text-accent">Goal:</span>{" "}
            <span className="text-foreground">
              {QUESTIONS.length} questions — choose the best data type for each
              field. Hints available if you're stuck.
            </span>
          </div>

          <Button
            data-ocid="datatype_exercise.start_button"
            className="w-full gradient-primary text-primary-foreground gap-2"
            onClick={() => setPhase("question")}
          >
            Start Exercise
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  // ── Complete ──
  if (phase === "complete") {
    const pct = Math.round((score / QUESTIONS.length) * 100);
    const grade =
      pct === 100
        ? "Perfect score!"
        : pct >= 75
          ? "Great work!"
          : pct >= 50
            ? "Good effort!"
            : "Keep practising!";

    return (
      <div
        data-ocid="datatype_exercise.complete_section"
        className="rounded-xl border border-secondary/40 bg-card overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-secondary/30 bg-secondary/5 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-secondary" />
          <h2 className="text-subheading text-foreground">
            Exercise Complete!
          </h2>
        </div>
        <div className="p-5 space-y-5">
          <div className="flex flex-col items-center py-4 gap-3 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-secondary/15 border-4 border-secondary">
              <span className="text-3xl font-black text-secondary">
                {score}/{QUESTIONS.length}
              </span>
            </div>
            <p className="text-xl font-semibold text-foreground">{grade}</p>
            <p className="text-sm text-muted-foreground">
              You scored{" "}
              <span className="font-bold text-foreground">{pct}%</span> on the
              data types exercise
            </p>
          </div>

          {/* Score bar */}
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Score</span>
              <span>{score} correct</span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-secondary transition-smooth"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <Button
            data-ocid="datatype_exercise.restart_button"
            variant="outline"
            className="w-full gap-2"
            onClick={handleRestart}
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // ── Question ──
  return (
    <div
      data-ocid="datatype_exercise.section"
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-primary/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <h2 className="text-subheading text-foreground">
            Data Type Exercise
          </h2>
        </div>
        <span className="text-xs font-mono text-muted-foreground tabular-nums">
          {qIndex + 1} / {QUESTIONS.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <div
          className="h-1 bg-primary transition-smooth"
          style={{
            width: `${((qIndex + (answered ? 1 : 0)) / QUESTIONS.length) * 100}%`,
          }}
        />
      </div>

      <div className="p-5 space-y-5">
        {/* Field preview */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Field definition
          </p>
          <FieldPreview
            fieldName={question.fieldName}
            exampleValue={question.exampleValue}
          />
          <p className="text-sm text-foreground mt-2 leading-relaxed">
            {question.description}
          </p>
        </div>

        {/* Question prompt */}
        <p
          data-ocid="datatype_exercise.question"
          className="text-base font-semibold text-foreground"
        >
          What is the most appropriate SQL data type?
        </p>

        {/* Options */}
        <div
          className="grid grid-cols-2 gap-2"
          role="radiogroup"
          aria-label="Data type options"
        >
          {question.options.map((opt, i) => (
            <OptionButton
              key={opt}
              option={opt}
              index={i}
              selected={selected}
              answered={answered}
              correctIndex={question.correctIndex}
              onSelect={handleSelect}
            />
          ))}
        </div>

        {/* Hint */}
        {!answered && (
          <div className="flex justify-end">
            <button
              type="button"
              data-ocid="datatype_exercise.hint_button"
              className="text-xs text-muted-foreground hover:text-foreground transition-smooth flex items-center gap-1"
              onClick={() => setShowHint((s) => !s)}
            >
              {showHint ? "🙈 Hide hint" : "💡 Show hint"}
            </button>
          </div>
        )}
        {showHint && !answered && (
          <div
            data-ocid="datatype_exercise.hint"
            className="rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-foreground"
          >
            <span className="font-semibold text-accent">Hint: </span>
            {question.hint}
          </div>
        )}

        {/* Explanation after answer */}
        {answered && (
          <div
            data-ocid="datatype_exercise.explanation"
            className={`p-4 rounded-lg border text-sm leading-relaxed ${
              isCorrect
                ? "border-secondary/40 bg-secondary/8 text-foreground"
                : "border-destructive/40 bg-destructive/8 text-foreground"
            }`}
          >
            <div className="flex items-center gap-2 mb-2 font-semibold">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span className="text-secondary">Correct!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                  <span className="text-destructive">
                    Not quite — see the correct answer above.
                  </span>
                </>
              )}
            </div>
            <p className="text-muted-foreground">{question.explanation}</p>
          </div>
        )}

        {/* Continue */}
        {answered && (
          <Button
            data-ocid="datatype_exercise.continue_button"
            className="w-full gradient-primary text-primary-foreground gap-2"
            onClick={handleNext}
          >
            {isLast ? (
              <>
                <Trophy className="w-4 h-4" />
                See Results
              </>
            ) : (
              <>
                Next question
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        )}

        {/* Restart link */}
        <div className="flex justify-end pt-1">
          <button
            type="button"
            data-ocid="datatype_exercise.restart_button"
            className="text-xs text-muted-foreground hover:text-foreground transition-smooth flex items-center gap-1"
            onClick={handleRestart}
          >
            <RotateCcw className="w-3 h-3" />
            Restart
          </button>
        </div>
      </div>
    </div>
  );
}
