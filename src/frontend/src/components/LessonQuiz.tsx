import { Button } from "@/components/ui/button";
import type { QuizQuestion } from "@/types/course";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";
import { useState } from "react";

export interface LessonQuizProps {
  questions: QuizQuestion[];
}

type AnswerState = { selectedIndex: number; isCorrect: boolean } | null;

export default function LessonQuiz({ questions }: LessonQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerState>>({});
  const [showSummary, setShowSummary] = useState(false);

  const current = questions[currentIndex];
  const answer = answers[currentIndex] ?? null;
  const isAnswered = answer !== null;
  const totalAnswered = Object.keys(answers).length;
  const correctCount = Object.values(answers).filter(
    (a) => a?.isCorrect,
  ).length;
  const allAnswered = totalAnswered === questions.length;

  function handleOptionClick(optionIndex: number) {
    if (isAnswered) return;
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: {
        selectedIndex: optionIndex,
        isCorrect: optionIndex === current.correctIndex,
      },
    }));
  }

  function handleRetake() {
    setAnswers({});
    setCurrentIndex(0);
    setShowSummary(false);
  }

  function getOptionStyle(optionIndex: number): string {
    const base =
      "w-full text-left px-4 py-3 rounded-lg border text-sm transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
    if (!isAnswered) {
      return `${base} border-border bg-card text-card-foreground hover:border-primary/60 hover:bg-primary/5 cursor-pointer`;
    }
    if (optionIndex === current.correctIndex) {
      return `${base} border-[oklch(0.70_0.18_145)]/60 bg-[oklch(0.70_0.18_145)]/10 text-foreground cursor-default`;
    }
    if (optionIndex === answer?.selectedIndex) {
      return `${base} border-destructive/60 bg-destructive/10 text-foreground cursor-default`;
    }
    return `${base} border-border bg-card/50 text-muted-foreground cursor-default opacity-60`;
  }

  if (showSummary) {
    const pct = Math.round((correctCount / questions.length) * 100);
    const isPerfect = correctCount === questions.length;
    const isPass = pct >= 60;
    return (
      <section
        data-ocid="lesson_quiz.section"
        className="mt-8 rounded-xl border border-border bg-card p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-5 h-5 text-accent" />
          <h2 className="text-subheading text-foreground">Quiz Results</h2>
        </div>

        <div className="flex flex-col items-center py-6 gap-3">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold border-4 ${
              isPass
                ? "border-[oklch(0.70_0.18_145)] text-[oklch(0.70_0.18_145)] bg-[oklch(0.70_0.18_145)]/10"
                : "border-destructive text-destructive bg-destructive/10"
            }`}
          >
            {pct}%
          </div>
          <p className="text-xl font-semibold text-foreground">
            {correctCount} / {questions.length} correct
          </p>
          <p className="text-sm text-muted-foreground text-center max-w-xs">
            {isPerfect
              ? "Perfect score! You've mastered this topic."
              : isPass
                ? "Great work! Review any missed questions below."
                : "Keep practicing — revisit the lesson and try again."}
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {questions.map((q, i) => {
            const a = answers[i];
            return (
              <div
                key={q.id}
                data-ocid={`lesson_quiz.summary_item.${i + 1}`}
                className="flex items-start gap-3 p-3 rounded-lg bg-background border border-border"
              >
                {a?.isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-[oklch(0.70_0.18_145)] flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                )}
                <div className="min-w-0">
                  <p className="text-sm text-foreground font-medium truncate">
                    {q.question}
                  </p>
                  {!a?.isCorrect && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Correct:{" "}
                      <span className="text-[oklch(0.70_0.18_145)]">
                        {q.options[q.correctIndex]}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <Button
          data-ocid="lesson_quiz.retake_button"
          variant="outline"
          onClick={handleRetake}
          className="w-full gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Retake Quiz
        </Button>
      </section>
    );
  }

  return (
    <section
      data-ocid="lesson_quiz.section"
      className="mt-8 rounded-xl border border-border bg-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-primary/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <h2 className="text-subheading text-foreground">Knowledge Check</h2>
        </div>
        <span className="text-xs text-muted-foreground font-mono tabular-nums">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <div
          className="h-1 bg-primary transition-smooth"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="p-5">
        {/* Question */}
        <p
          data-ocid="lesson_quiz.question"
          className="text-base font-medium text-foreground mb-5 leading-relaxed"
        >
          {current.question}
        </p>

        {/* Options */}
        <div
          className="space-y-2"
          role="radiogroup"
          aria-label="Answer options"
        >
          {current.options.map((option, i) => (
            <button
              type="button"
              key={option}
              data-ocid={`lesson_quiz.option.${i + 1}`}
              className={getOptionStyle(i)}
              onClick={() => handleOptionClick(i)}
              aria-pressed={answer?.selectedIndex === i}
              disabled={isAnswered}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-6 h-6 rounded-full border flex-shrink-0 flex items-center justify-center text-xs font-semibold transition-smooth ${
                    isAnswered && i === current.correctIndex
                      ? "border-[oklch(0.70_0.18_145)] bg-[oklch(0.70_0.18_145)] text-white"
                      : isAnswered &&
                          i === answer?.selectedIndex &&
                          !answer.isCorrect
                        ? "border-destructive bg-destructive text-destructive-foreground"
                        : "border-border text-muted-foreground"
                  }`}
                >
                  {isAnswered && i === current.correctIndex ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : isAnswered &&
                    i === answer?.selectedIndex &&
                    !answer.isCorrect ? (
                    <XCircle className="w-3 h-3" />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </span>
                <span className="flex-1 text-left">{option}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Explanation */}
        {isAnswered && (
          <div
            data-ocid="lesson_quiz.explanation"
            className={`mt-4 p-4 rounded-lg border text-sm leading-relaxed transition-smooth ${
              answer.isCorrect
                ? "border-[oklch(0.70_0.18_145)]/40 bg-[oklch(0.70_0.18_145)]/8 text-foreground"
                : "border-destructive/40 bg-destructive/8 text-foreground"
            }`}
          >
            <div className="flex items-center gap-2 mb-1 font-semibold">
              {answer.isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[oklch(0.70_0.18_145)] flex-shrink-0" />
                  <span className="text-[oklch(0.70_0.18_145)]">Correct!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                  <span className="text-destructive">Not quite.</span>
                </>
              )}
            </div>
            <p className="text-muted-foreground">{current.explanation}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <Button
            data-ocid="lesson_quiz.prev_button"
            variant="ghost"
            size="sm"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex gap-1">
            {questions.map((_, i) => (
              <button
                type="button"
                key={questions[i].id}
                data-ocid={`lesson_quiz.dot.${i + 1}`}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to question ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  i === currentIndex
                    ? "bg-primary w-4"
                    : answers[i]?.isCorrect
                      ? "bg-[oklch(0.70_0.18_145)]"
                      : answers[i]
                        ? "bg-destructive"
                        : "bg-muted hover:bg-muted-foreground/40"
                }`}
              />
            ))}
          </div>

          {currentIndex < questions.length - 1 ? (
            <Button
              data-ocid="lesson_quiz.next_button"
              variant="ghost"
              size="sm"
              onClick={() => setCurrentIndex((i) => i + 1)}
              className="gap-1"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              data-ocid="lesson_quiz.finish_button"
              variant="default"
              size="sm"
              onClick={() => setShowSummary(true)}
              disabled={!allAnswered}
              className="gap-1 gradient-primary text-primary-foreground"
            >
              <Trophy className="w-4 h-4" />
              Finish
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
