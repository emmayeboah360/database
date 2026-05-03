import { useState } from "react";

interface ClassifyItem {
  id: string;
  sql: string;
  correct: "DDL" | "DML";
  explanation: string;
}

const CLASSIFY_ITEMS: ClassifyItem[] = [
  {
    id: "c1",
    sql: "CREATE TABLE students (id INT PRIMARY KEY, name VARCHAR(100));",
    correct: "DDL",
    explanation:
      "CREATE TABLE defines the structure (schema) of a new table — that's DDL.",
  },
  {
    id: "c2",
    sql: "SELECT name, email FROM members WHERE join_date > '2023-01-01';",
    correct: "DML",
    explanation:
      "SELECT queries and retrieves data from existing tables — that's DML.",
  },
  {
    id: "c3",
    sql: "ALTER TABLE books ADD COLUMN publisher VARCHAR(200);",
    correct: "DDL",
    explanation:
      "ALTER TABLE modifies the schema (structure) of an existing table — DDL.",
  },
  {
    id: "c4",
    sql: "INSERT INTO orders (customer_id, total, status) VALUES (1, 49.99, 'pending');",
    correct: "DML",
    explanation: "INSERT INTO adds new data rows to a table — that's DML.",
  },
  {
    id: "c5",
    sql: "DROP TABLE temp_logs;",
    correct: "DDL",
    explanation: "DROP TABLE removes an entire table from the schema — DDL.",
  },
  {
    id: "c6",
    sql: "UPDATE products SET price = 29.99 WHERE id = 5;",
    correct: "DML",
    explanation: "UPDATE SET modifies existing data rows — that's DML.",
  },
  {
    id: "c7",
    sql: "DELETE FROM sessions WHERE expires_at < '2024-01-01';",
    correct: "DML",
    explanation: "DELETE FROM removes data rows from a table — that's DML.",
  },
  {
    id: "c8",
    sql: "CREATE INDEX idx_email ON members(email);",
    correct: "DDL",
    explanation:
      "CREATE INDEX creates a new database structure (an index) — DDL.",
  },
];

type GuessRecord = Record<string, "DDL" | "DML" | null>;

export default function SqlClassifier() {
  const [guesses, setGuesses] = useState<GuessRecord>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleGuess = (id: string, choice: "DDL" | "DML") => {
    if (submitted) return;
    setGuesses((prev) => ({ ...prev, [id]: choice }));
  };

  const handleReveal = (id: string) => {
    if (!submitted) return;
    setRevealed((prev) => ({ ...prev, [id]: true }));
  };

  const handleSubmit = () => {
    let correct = 0;
    for (const item of CLASSIFY_ITEMS) {
      if (guesses[item.id] === item.correct) correct++;
    }
    setScore(correct);
    setSubmitted(true);
  };

  const handleReset = () => {
    setGuesses({});
    setRevealed({});
    setScore(0);
    setSubmitted(false);
  };

  const allAnswered = CLASSIFY_ITEMS.every((item) => guesses[item.id] != null);

  return (
    <div
      className="rounded-xl border overflow-hidden my-4"
      style={{ borderColor: "oklch(var(--db-sql) / 0.3)" }}
      data-ocid="sql_classifier.container"
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between border-b"
        style={{
          background: "oklch(var(--db-sql) / 0.08)",
          borderColor: "oklch(var(--db-sql) / 0.25)",
        }}
      >
        <div>
          <h3
            className="font-semibold text-sm"
            style={{ color: "oklch(var(--db-sql))" }}
          >
            DDL vs DML Classifier
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Classify each SQL statement as Data Definition Language (DDL) or
            Data Manipulation Language (DML)
          </p>
        </div>
        {submitted && (
          <div
            className="text-right text-sm font-bold"
            style={{
              color:
                score >= 7
                  ? "oklch(var(--db-sql))"
                  : score >= 5
                    ? "oklch(var(--accent))"
                    : "oklch(var(--destructive))",
            }}
          >
            {score}/{CLASSIFY_ITEMS.length}
          </div>
        )}
      </div>

      {/* Items */}
      <div className="divide-y" style={{ borderColor: "oklch(var(--border))" }}>
        {CLASSIFY_ITEMS.map((item, idx) => {
          const guess = guesses[item.id];
          const isCorrect = submitted && guess === item.correct;
          const isWrong = submitted && guess != null && guess !== item.correct;
          const isUnanswered = submitted && guess == null;
          const showExplanation = revealed[item.id];

          return (
            <div
              key={item.id}
              className="px-4 py-3"
              style={{
                background: isCorrect
                  ? "oklch(var(--db-sql) / 0.05)"
                  : isWrong || isUnanswered
                    ? "oklch(var(--destructive) / 0.04)"
                    : "transparent",
              }}
              data-ocid={`sql_classifier.item.${idx + 1}`}
            >
              <div className="flex items-start gap-3">
                {/* Status indicator */}
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{
                    background: isCorrect
                      ? "oklch(var(--db-sql) / 0.2)"
                      : isWrong || isUnanswered
                        ? "oklch(var(--destructive) / 0.15)"
                        : "oklch(var(--muted))",
                    color: isCorrect
                      ? "oklch(var(--db-sql))"
                      : isWrong || isUnanswered
                        ? "oklch(var(--destructive))"
                        : "oklch(var(--muted-foreground))",
                  }}
                >
                  {isCorrect ? "✓" : isWrong ? "✗" : idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  {/* SQL code */}
                  <div
                    className="font-mono text-xs px-3 py-2 rounded-md mb-2 leading-relaxed break-all"
                    style={{
                      background: "oklch(var(--card))",
                      color: "oklch(var(--foreground))",
                      border: "1px solid oklch(var(--border))",
                    }}
                  >
                    {item.sql}
                  </div>

                  {/* Choice buttons */}
                  <div className="flex gap-2 flex-wrap">
                    {(["DDL", "DML"] as const).map((choice) => {
                      const isSelected = guess === choice;
                      const isThisCorrect = item.correct === choice;
                      let btnStyle: React.CSSProperties = {};
                      let btnClass =
                        "px-3 py-1.5 rounded-md text-xs font-semibold font-mono border transition-smooth cursor-pointer";

                      if (submitted) {
                        if (isThisCorrect) {
                          btnStyle = {
                            background: "oklch(var(--db-sql) / 0.2)",
                            borderColor: "oklch(var(--db-sql))",
                            color: "oklch(var(--db-sql))",
                          };
                        } else if (isSelected && !isThisCorrect) {
                          btnStyle = {
                            background: "oklch(var(--destructive) / 0.15)",
                            borderColor: "oklch(var(--destructive))",
                            color: "oklch(var(--destructive))",
                          };
                        } else {
                          btnStyle = {
                            background: "oklch(var(--muted))",
                            borderColor: "oklch(var(--border))",
                            color: "oklch(var(--muted-foreground))",
                            opacity: 0.5,
                          };
                        }
                        btnClass += " cursor-default";
                      } else if (isSelected) {
                        btnStyle = {
                          background: "oklch(var(--db-sql) / 0.2)",
                          borderColor: "oklch(var(--db-sql))",
                          color: "oklch(var(--db-sql))",
                        };
                      } else {
                        btnStyle = {
                          background: "oklch(var(--muted))",
                          borderColor: "oklch(var(--border))",
                          color: "oklch(var(--muted-foreground))",
                        };
                        btnClass +=
                          " hover:border-[oklch(var(--db-sql)/0.5)] hover:text-foreground";
                      }

                      return (
                        <button
                          key={choice}
                          type="button"
                          onClick={() => handleGuess(item.id, choice)}
                          disabled={submitted}
                          className={btnClass}
                          style={btnStyle}
                          data-ocid={`sql_classifier.choice_${choice.toLowerCase()}.${idx + 1}`}
                        >
                          {choice}
                        </button>
                      );
                    })}

                    {submitted && (
                      <button
                        type="button"
                        onClick={() => handleReveal(item.id)}
                        className="px-3 py-1.5 rounded-md text-xs font-mono border transition-smooth ml-auto"
                        style={{
                          background: "oklch(var(--muted))",
                          borderColor: "oklch(var(--border))",
                          color: "oklch(var(--muted-foreground))",
                        }}
                        data-ocid={`sql_classifier.explain_button.${idx + 1}`}
                      >
                        {showExplanation ? "Hide" : "Why?"}
                      </button>
                    )}
                  </div>

                  {/* Explanation */}
                  {showExplanation && (
                    <div
                      className="mt-2 px-3 py-2 rounded-md text-xs"
                      style={{
                        background: "oklch(var(--db-sql) / 0.08)",
                        color: "oklch(var(--foreground))",
                        border: "1px solid oklch(var(--db-sql) / 0.2)",
                      }}
                      data-ocid={`sql_classifier.explanation.${idx + 1}`}
                    >
                      <span
                        className="font-semibold mr-1"
                        style={{ color: "oklch(var(--db-sql))" }}
                      >
                        Answer: {item.correct}.
                      </span>
                      {item.explanation}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer controls */}
      <div
        className="px-4 py-3 flex items-center justify-between border-t"
        style={{
          background: "oklch(var(--muted) / 0.4)",
          borderColor: "oklch(var(--border))",
        }}
      >
        {!submitted ? (
          <>
            <p className="text-xs text-muted-foreground">
              {Object.keys(guesses).length}/{CLASSIFY_ITEMS.length} classified
            </p>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!allAnswered}
              data-ocid="sql_classifier.submit_button"
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-smooth disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: allAnswered
                  ? "oklch(var(--db-sql))"
                  : "oklch(var(--muted))",
                color: allAnswered
                  ? "oklch(var(--db-sql-foreground))"
                  : "oklch(var(--muted-foreground))",
              }}
            >
              Check Answers
            </button>
          </>
        ) : (
          <>
            <p
              className="text-sm font-semibold"
              style={{
                color:
                  score >= 7
                    ? "oklch(var(--db-sql))"
                    : score >= 5
                      ? "oklch(var(--accent))"
                      : "oklch(var(--destructive))",
              }}
              data-ocid="sql_classifier.score"
            >
              {score >= 7
                ? `🎉 Excellent! ${score}/${CLASSIFY_ITEMS.length} correct`
                : score >= 5
                  ? `Good effort — ${score}/${CLASSIFY_ITEMS.length} correct`
                  : `${score}/${CLASSIFY_ITEMS.length} — review DDL vs DML above`}
            </p>
            <button
              type="button"
              onClick={handleReset}
              data-ocid="sql_classifier.reset_button"
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-smooth border"
              style={{
                background: "oklch(var(--muted))",
                borderColor: "oklch(var(--border))",
                color: "oklch(var(--muted-foreground))",
              }}
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
