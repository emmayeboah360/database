import { useState } from "react";

type AcidStep =
  | "idle"
  | "begin"
  | "op1"
  | "op2"
  | "committing"
  | "committed"
  | "error"
  | "rolledback";

interface StepInfo {
  label: string;
  sql: string;
  description: string;
  accountA: number;
  accountB: number;
  status: string;
  statusColor: "neutral" | "active" | "success" | "danger";
}

const STEPS: Record<AcidStep, StepInfo> = {
  idle: {
    label: "Initial State",
    sql: "-- Bank transfer: £500 from Account A → Account B",
    description:
      "The database is in a stable, consistent state. Account A has £1,000 and Account B has £200. We want to transfer £500.",
    accountA: 1000,
    accountB: 200,
    status: "Ready",
    statusColor: "neutral",
  },
  begin: {
    label: "Step 1: BEGIN TRANSACTION",
    sql: "BEGIN TRANSACTION;",
    description:
      "A new transaction is started. All following operations are now part of this atomic unit — they will ALL succeed or ALL be undone.",
    accountA: 1000,
    accountB: 200,
    status: "Transaction open",
    statusColor: "active",
  },
  op1: {
    label: "Step 2: Debit Account A",
    sql: "UPDATE accounts SET balance = balance - 500\n  WHERE id = 1;  -- Account A: 1000 → 500",
    description:
      "£500 is deducted from Account A. The database now shows A with £500 — but this change is NOT yet permanent. It's still part of the open transaction.",
    accountA: 500,
    accountB: 200,
    status: "Pending (not committed)",
    statusColor: "active",
  },
  op2: {
    label: "Step 3: Credit Account B",
    sql: "UPDATE accounts SET balance = balance + 500\n  WHERE id = 2;  -- Account B: 200 → 700",
    description:
      "£500 is added to Account B. Both operations are now pending inside the transaction. No other users can see these intermediate values (Isolation).",
    accountA: 500,
    accountB: 700,
    status: "Pending (not committed)",
    statusColor: "active",
  },
  committing: {
    label: "Step 4: COMMIT",
    sql: "COMMIT;  -- make all changes permanent",
    description:
      "COMMIT makes both changes permanent and visible to all other users. The transaction completes successfully — data is written to disk (Durability).",
    accountA: 500,
    accountB: 700,
    status: "Committing…",
    statusColor: "success",
  },
  committed: {
    label: "✓ Transaction Committed",
    sql: "-- Transfer complete. Both changes are permanent.",
    description:
      "The transaction committed successfully. Account A now has £500, Account B has £700. The total is still £1,200 — Consistency is maintained. Data is durable even if the server crashes now.",
    accountA: 500,
    accountB: 700,
    status: "Committed ✓",
    statusColor: "success",
  },
  error: {
    label: "Error: Credit Failed!",
    sql: "-- ERROR: Account B does not exist!\n-- The credit operation failed.",
    description:
      "An error occurred during the credit operation (e.g. Account B doesn't exist). Atomicity requires that NEITHER operation takes effect.",
    accountA: 500,
    accountB: 200,
    status: "Error — rolling back…",
    statusColor: "danger",
  },
  rolledback: {
    label: "✗ Rolled Back",
    sql: "ROLLBACK;  -- undo all changes",
    description:
      "ROLLBACK undoes ALL changes since BEGIN TRANSACTION. Account A is restored to £1,000. The money was never lost — Atomicity saved us from a corrupt state.",
    accountA: 1000,
    accountB: 200,
    status: "Rolled back ✗",
    statusColor: "danger",
  },
};

const COMMIT_SEQUENCE: AcidStep[] = [
  "begin",
  "op1",
  "op2",
  "committing",
  "committed",
];
const ROLLBACK_SEQUENCE: AcidStep[] = ["begin", "op1", "error", "rolledback"];

interface AcidProperty {
  letter: string;
  name: string;
  description: string;
  icon: string;
}

const ACID_PROPS: AcidProperty[] = [
  {
    letter: "A",
    name: "Atomicity",
    description:
      "All-or-nothing. Either every operation succeeds and commits, or none of them do. No partial results.",
    icon: "⚛",
  },
  {
    letter: "C",
    name: "Consistency",
    description:
      "The database moves from one valid state to another. All rules, constraints, and cascades are satisfied after commit.",
    icon: "⚖",
  },
  {
    letter: "I",
    name: "Isolation",
    description:
      "Concurrent transactions cannot see each other's intermediate (uncommitted) state. They execute as if serial.",
    icon: "🔒",
  },
  {
    letter: "D",
    name: "Durability",
    description:
      "Once committed, changes are permanent — written to disk. Data survives crashes, power cuts, and restarts.",
    icon: "💾",
  },
];

function AccountCard({
  label,
  balance,
  changed,
  danger,
}: {
  label: string;
  balance: number;
  changed: boolean;
  danger?: boolean;
}) {
  return (
    <div
      className="flex-1 rounded-lg px-4 py-3 border text-center transition-smooth"
      style={{
        background: danger
          ? "oklch(var(--destructive) / 0.08)"
          : changed
            ? "oklch(var(--db-sql) / 0.12)"
            : "oklch(var(--card))",
        borderColor: danger
          ? "oklch(var(--destructive) / 0.4)"
          : changed
            ? "oklch(var(--db-sql) / 0.4)"
            : "oklch(var(--border))",
      }}
    >
      <div className="text-xs text-muted-foreground mb-1 font-mono">
        {label}
      </div>
      <div
        className="text-xl font-bold font-mono"
        style={{
          color: danger
            ? "oklch(var(--destructive))"
            : changed
              ? "oklch(var(--db-sql))"
              : "oklch(var(--foreground))",
        }}
      >
        £{balance.toLocaleString()}
      </div>
    </div>
  );
}

export default function AcidExplainer() {
  const [currentStep, setCurrentStep] = useState<AcidStep>("idle");
  const [mode, setMode] = useState<"commit" | "rollback">("commit");
  const [stepIndex, setStepIndex] = useState(0);
  const [started, setStarted] = useState(false);

  const sequence = mode === "commit" ? COMMIT_SEQUENCE : ROLLBACK_SEQUENCE;
  const info = STEPS[currentStep];
  const prevInfo = STEPS.idle;

  const handleStart = (m: "commit" | "rollback") => {
    setMode(m);
    setStepIndex(0);
    setCurrentStep(sequence[0]);
    setStarted(true);
  };

  const handleNext = () => {
    const seq = mode === "commit" ? COMMIT_SEQUENCE : ROLLBACK_SEQUENCE;
    if (stepIndex < seq.length - 1) {
      const next = stepIndex + 1;
      setStepIndex(next);
      setCurrentStep(seq[next]);
    }
  };

  const handleReset = () => {
    setCurrentStep("idle");
    setStepIndex(0);
    setStarted(false);
  };

  const isFinished =
    currentStep === "committed" || currentStep === "rolledback";
  const seq = mode === "commit" ? COMMIT_SEQUENCE : ROLLBACK_SEQUENCE;
  const canNext = started && !isFinished && stepIndex < seq.length - 1;

  const statusColors = {
    neutral: {
      bg: "oklch(var(--muted))",
      text: "oklch(var(--muted-foreground))",
      border: "oklch(var(--border))",
    },
    active: {
      bg: "oklch(var(--accent) / 0.15)",
      text: "oklch(var(--accent))",
      border: "oklch(var(--accent) / 0.4)",
    },
    success: {
      bg: "oklch(var(--db-sql) / 0.15)",
      text: "oklch(var(--db-sql))",
      border: "oklch(var(--db-sql) / 0.4)",
    },
    danger: {
      bg: "oklch(var(--destructive) / 0.12)",
      text: "oklch(var(--destructive))",
      border: "oklch(var(--destructive) / 0.4)",
    },
  };

  const sc = statusColors[info.statusColor];

  return (
    <div
      className="rounded-xl border overflow-hidden my-4"
      style={{ borderColor: "oklch(var(--db-sql) / 0.3)" }}
      data-ocid="acid_explainer.container"
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b"
        style={{
          background: "oklch(var(--db-sql) / 0.08)",
          borderColor: "oklch(var(--db-sql) / 0.25)",
        }}
      >
        <h3
          className="font-semibold text-sm"
          style={{ color: "oklch(var(--db-sql))" }}
        >
          Interactive ACID Transaction Explainer
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Step through a bank transfer to see how ACID properties protect your
          data
        </p>
      </div>

      {/* ACID cards */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-0 border-b"
        style={{ borderColor: "oklch(var(--border))" }}
      >
        {ACID_PROPS.map((prop) => (
          <div
            key={prop.letter}
            className="px-3 py-2.5 border-r last:border-r-0"
            style={{ borderColor: "oklch(var(--border))" }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className="text-base w-5 text-center"
                role="img"
                aria-label={prop.name}
              >
                {prop.icon}
              </span>
              <span
                className="font-black text-sm"
                style={{ color: "oklch(var(--db-sql))" }}
              >
                {prop.letter}
              </span>
              <span className="text-xs font-semibold">{prop.name}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-snug">
              {prop.description}
            </p>
          </div>
        ))}
      </div>

      {/* Simulation area */}
      <div className="p-4 space-y-4">
        {/* Mode selector */}
        {!started && (
          <div className="flex gap-3 flex-wrap">
            <p className="w-full text-sm text-muted-foreground">
              Choose a scenario to simulate:
            </p>
            <button
              type="button"
              onClick={() => handleStart("commit")}
              data-ocid="acid_explainer.commit_button"
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold border transition-smooth"
              style={{
                background: "oklch(var(--db-sql) / 0.15)",
                borderColor: "oklch(var(--db-sql) / 0.4)",
                color: "oklch(var(--db-sql))",
              }}
            >
              ✓ Successful Transfer (COMMIT)
            </button>
            <button
              type="button"
              onClick={() => handleStart("rollback")}
              data-ocid="acid_explainer.rollback_button"
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold border transition-smooth"
              style={{
                background: "oklch(var(--destructive) / 0.1)",
                borderColor: "oklch(var(--destructive) / 0.35)",
                color: "oklch(var(--destructive))",
              }}
            >
              ✗ Failed Transfer (ROLLBACK)
            </button>
          </div>
        )}

        {started && (
          <>
            {/* Step breadcrumb */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {seq.map((step, i) => (
                <div key={step} className="flex items-center gap-1.5">
                  <div
                    className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold border transition-smooth"
                    style={{
                      background:
                        i <= stepIndex
                          ? mode === "rollback" && i === seq.length - 1
                            ? "oklch(var(--destructive) / 0.15)"
                            : "oklch(var(--db-sql) / 0.15)"
                          : "oklch(var(--muted))",
                      borderColor:
                        i <= stepIndex
                          ? mode === "rollback" && i === seq.length - 1
                            ? "oklch(var(--destructive) / 0.4)"
                            : "oklch(var(--db-sql) / 0.4)"
                          : "oklch(var(--border))",
                      color:
                        i <= stepIndex
                          ? mode === "rollback" && i === seq.length - 1
                            ? "oklch(var(--destructive))"
                            : "oklch(var(--db-sql))"
                          : "oklch(var(--muted-foreground))",
                    }}
                    data-ocid={`acid_explainer.step.${i + 1}`}
                  >
                    {i + 1}
                  </div>
                  {i < seq.length - 1 && (
                    <span className="text-muted-foreground text-xs">→</span>
                  )}
                </div>
              ))}
            </div>

            {/* Step label + status */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h4 className="font-semibold text-sm">{info.label}</h4>
              <div
                className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold border"
                style={{
                  background: sc.bg,
                  borderColor: sc.border,
                  color: sc.text,
                }}
                data-ocid="acid_explainer.status"
              >
                {info.status}
              </div>
            </div>

            {/* SQL display */}
            <div
              className="rounded-lg px-4 py-3 font-mono text-xs leading-relaxed whitespace-pre"
              style={{
                background: "oklch(var(--card))",
                border: "1px solid oklch(var(--border))",
                color: "oklch(var(--foreground))",
                overflowX: "auto",
              }}
              data-ocid="acid_explainer.sql_display"
            >
              {info.sql}
            </div>

            {/* Description */}
            <p
              className="text-sm leading-relaxed"
              style={{ color: "oklch(var(--muted-foreground))" }}
              data-ocid="acid_explainer.description"
            >
              {info.description}
            </p>

            {/* Account balances */}
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Account Balances
              </p>
              <div className="flex gap-3">
                <AccountCard
                  label="Account A (sender)"
                  balance={info.accountA}
                  changed={info.accountA !== prevInfo.accountA}
                  danger={
                    mode === "rollback" &&
                    (currentStep === "error" || currentStep === "rolledback") &&
                    info.accountA !== STEPS.idle.accountA
                  }
                />
                <AccountCard
                  label="Account B (receiver)"
                  balance={info.accountB}
                  changed={info.accountB !== prevInfo.accountB}
                  danger={
                    mode === "rollback" &&
                    currentStep === "error" &&
                    info.accountB !== STEPS.idle.accountB
                  }
                />
                <div
                  className="flex-1 rounded-lg px-4 py-3 border text-center"
                  style={{
                    background: "oklch(var(--muted) / 0.3)",
                    borderColor: "oklch(var(--border))",
                  }}
                >
                  <div className="text-xs text-muted-foreground mb-1 font-mono">
                    Total
                  </div>
                  <div
                    className="text-xl font-bold font-mono"
                    style={{
                      color:
                        info.accountA + info.accountB === 1200
                          ? "oklch(var(--db-sql))"
                          : "oklch(var(--destructive))",
                    }}
                  >
                    £{(info.accountA + info.accountB).toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {info.accountA + info.accountB === 1200
                      ? "✓ Consistent"
                      : "✗ Inconsistent"}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={handleReset}
                data-ocid="acid_explainer.reset_button"
                className="px-4 py-2 rounded-lg text-sm border transition-smooth"
                style={{
                  background: "oklch(var(--muted))",
                  borderColor: "oklch(var(--border))",
                  color: "oklch(var(--muted-foreground))",
                }}
              >
                ← Reset
              </button>
              {canNext && (
                <button
                  type="button"
                  onClick={handleNext}
                  data-ocid="acid_explainer.next_button"
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-smooth"
                  style={{
                    background: "oklch(var(--db-sql))",
                    color: "oklch(var(--db-sql-foreground))",
                  }}
                >
                  Next Step →
                </button>
              )}
              {isFinished && (
                <button
                  type="button"
                  onClick={handleReset}
                  data-ocid="acid_explainer.restart_button"
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-smooth"
                  style={{
                    background: "oklch(var(--db-sql))",
                    color: "oklch(var(--db-sql-foreground))",
                  }}
                >
                  Try Other Scenario
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
