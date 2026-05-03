import { cn } from "@/lib/utils";
import { CheckCircle2, RefreshCw, X } from "lucide-react";
import { useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

interface MiningTechnique {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
  example: string;
}

interface MiningScenario {
  id: string;
  scenario: string;
  context: string;
  correct: string;
  explanation: string;
}

// ── Data ─────────────────────────────────────────────────────────────────────

const MINING_TECHNIQUES: MiningTechnique[] = [
  {
    id: "classification",
    name: "Classification",
    icon: "🏷️",
    color: "text-sky-400",
    bgColor: "bg-sky-400/10 border-sky-400/30",
    description:
      "Assigns items to predefined categories based on learned patterns.",
    example: "Spam detection — classify emails as 'spam' or 'not spam'",
  },
  {
    id: "clustering",
    name: "Clustering",
    icon: "🫧",
    color: "text-violet-400",
    bgColor: "bg-violet-400/10 border-violet-400/30",
    description: "Groups similar items together without predefined labels.",
    example: "Customer segmentation — group buyers with similar behaviour",
  },
  {
    id: "regression",
    name: "Regression",
    icon: "📈",
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10 border-emerald-400/30",
    description: "Predicts a continuous numeric value from input variables.",
    example: "House price prediction from area, location, age",
  },
  {
    id: "association",
    name: "Association Rules",
    icon: "🔗",
    color: "text-amber-400",
    bgColor: "bg-amber-400/10 border-amber-400/30",
    description: "Finds items that frequently occur together in transactions.",
    example: "Market basket: customers who buy bread also buy butter",
  },
  {
    id: "sequential",
    name: "Sequential Patterns",
    icon: "⏱️",
    color: "text-orange-400",
    bgColor: "bg-orange-400/10 border-orange-400/30",
    description:
      "Finds ordered patterns occurring over time in event sequences.",
    example: "Website click paths: homepage → products → cart → checkout",
  },
  {
    id: "anomaly",
    name: "Anomaly Detection",
    icon: "🚨",
    color: "text-red-400",
    bgColor: "bg-red-400/10 border-red-400/30",
    description:
      "Identifies unusual data points that deviate from normal patterns.",
    example:
      "Credit card fraud — flag transactions that don't match spending habits",
  },
];

const SCENARIOS: MiningScenario[] = [
  {
    id: "s1",
    scenario:
      "Group customers into segments based on purchasing behaviour — without deciding in advance how many groups or what they represent.",
    context:
      "An e-commerce company wants to understand distinct customer profiles.",
    correct: "clustering",
    explanation:
      "Clustering discovers natural groupings in data without predefined labels. Unlike classification, the categories emerge from the data itself — ideal for customer segmentation.",
  },
  {
    id: "s2",
    scenario:
      "Predict whether a loan applicant will default on their repayments based on credit history, income, and employment status.",
    context: "A bank is building an automated risk assessment system.",
    correct: "classification",
    explanation:
      "Classification assigns items to predefined categories. Here, the output is 'will default' or 'will not default' — a discrete class label. The model learns from historical loan outcomes.",
  },
  {
    id: "s3",
    scenario:
      "A streaming platform analyses what users watch after completing a series — to automatically queue related content.",
    context: "Netflix-style recommendation engine based on viewing order.",
    correct: "sequential",
    explanation:
      "Sequential pattern discovery finds ordered patterns over time. The order matters here — what you watch after finishing one show predicts what to recommend next, not just what you watch in general.",
  },
  {
    id: "s4",
    scenario:
      "Forecast next quarter's sales revenue based on historical figures, marketing spend, and economic indicators.",
    context: "Finance team building a quarterly planning tool.",
    correct: "regression",
    explanation:
      "Regression predicts a continuous numeric value. Sales revenue is a number on a continuous scale — not a category. Regression fits a mathematical function to historical data to extrapolate predictions.",
  },
  {
    id: "s5",
    scenario:
      "A supermarket discovers that customers who buy nappies on Friday evenings also frequently buy beer.",
    context: "Retail chain analysing 2 million transaction records.",
    correct: "association",
    explanation:
      "Association rule discovery (market basket analysis) finds items that co-occur in transactions. The famous 'beer and nappies' pattern is the classic example — revealing unexpected co-purchasing behaviour.",
  },
  {
    id: "s6",
    scenario:
      "A bank's system flags a transaction of £3,000 at a foreign ATM at 3am — the account holder's usual pattern is small UK purchases.",
    context: "Real-time fraud prevention system.",
    correct: "anomaly",
    explanation:
      "Anomaly detection identifies data points that deviate significantly from established patterns. The unusual time, location, and amount all deviate from the normal baseline, triggering an alert.",
  },
];

// ── Main component ────────────────────────────────────────────────────────────

export function DataMiningMatcher() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userChoice, setUserChoice] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<Set<number>>(new Set());

  const scenario = SCENARIOS[currentIdx];
  const isCorrect = userChoice === scenario.correct;

  function handleChoice(techniqueId: string) {
    if (revealed) return;
    setUserChoice(techniqueId);
    setRevealed(true);
    if (techniqueId === scenario.correct && !answered.has(currentIdx)) {
      setScore((s) => s + 1);
      setAnswered((prev) => new Set([...prev, currentIdx]));
    }
  }

  function goNext() {
    setCurrentIdx((i) => (i + 1) % SCENARIOS.length);
    setUserChoice(null);
    setRevealed(false);
  }

  function reset() {
    setCurrentIdx(0);
    setUserChoice(null);
    setRevealed(false);
    setScore(0);
    setAnswered(new Set());
  }

  return (
    <div className="space-y-6" data-ocid="data_mining_matcher">
      {/* Technique reference cards */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Data Mining Techniques
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {MINING_TECHNIQUES.map((t) => (
            <div key={t.id} className={cn("p-3 rounded-xl border", t.bgColor)}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">{t.icon}</span>
                <span className={cn("text-xs font-bold", t.color)}>
                  {t.name}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight">
                {t.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scenario matcher */}
      <div className="border-t border-border pt-5">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-bold text-foreground">
            Identify the Technique
          </h4>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-muted-foreground">
              {currentIdx + 1}/{SCENARIOS.length}
            </span>
            <span className="text-xs font-semibold text-primary">
              Score: {score}/{SCENARIOS.length}
            </span>
          </div>
        </div>

        {/* Scenario card */}
        <div className="p-4 rounded-xl bg-card border border-border mb-4">
          <p className="text-xs text-muted-foreground italic mb-2">
            {scenario.context}
          </p>
          <p className="text-sm text-foreground leading-relaxed font-medium">
            {scenario.scenario}
          </p>
        </div>

        {/* Answer choices */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          {MINING_TECHNIQUES.map((t) => {
            let state: "default" | "correct" | "wrong" = "default";
            if (revealed) {
              if (t.id === scenario.correct) state = "correct";
              else if (t.id === userChoice) state = "wrong";
            }
            return (
              <button
                key={t.id}
                type="button"
                disabled={revealed}
                onClick={() => handleChoice(t.id)}
                data-ocid={`data_mining_matcher.choice.${t.id}`}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all duration-200",
                  state === "correct" &&
                    "bg-emerald-500/15 border-emerald-500/50",
                  state === "wrong" && "bg-red-500/15 border-red-500/50",
                  state === "default" &&
                    !revealed &&
                    "bg-card border-border hover:bg-muted/30 cursor-pointer",
                  state === "default" &&
                    revealed &&
                    "bg-muted/10 border-border opacity-40 cursor-not-allowed",
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base">{t.icon}</span>
                  {state === "correct" && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  {state === "wrong" && (
                    <X className="w-3.5 h-3.5 text-red-400" />
                  )}
                </div>
                <p
                  className={cn(
                    "text-xs font-semibold",
                    state === "correct" && "text-emerald-400",
                    state === "wrong" && "text-red-400",
                    state === "default" && "text-foreground",
                  )}
                >
                  {t.name}
                </p>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {revealed && (
          <div
            className={cn(
              "p-4 rounded-xl border text-sm leading-relaxed mb-4",
              isCorrect
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-red-500/10 border-red-500/30 text-red-300",
            )}
          >
            <p className="font-semibold mb-1">
              {isCorrect
                ? "✓ Correct!"
                : `✗ Not quite — the answer is ${MINING_TECHNIQUES.find((t) => t.id === scenario.correct)?.name}`}
            </p>
            <p className="text-muted-foreground text-xs">
              {scenario.explanation}
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2">
          {revealed && (
            <button
              type="button"
              onClick={goNext}
              data-ocid="data_mining_matcher.next_button"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              {currentIdx < SCENARIOS.length - 1
                ? "Next Scenario →"
                : "Start Over"}
            </button>
          )}
          <button
            type="button"
            onClick={reset}
            data-ocid="data_mining_matcher.reset_button"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted/30 border border-border text-muted-foreground text-xs font-medium hover:bg-muted/50 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
