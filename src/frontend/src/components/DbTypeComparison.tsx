import { cn } from "@/lib/utils";
import { CheckCircle2, X } from "lucide-react";
import { useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

interface DbTypeItem {
  type: string;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
  examples: string[];
  useCases: string[];
}

interface MatchChallenge {
  scenario: string;
  correctType: string;
  hint: string;
}

// ── Data ─────────────────────────────────────────────────────────────────────

const DB_TYPES: DbTypeItem[] = [
  {
    type: "Document",
    icon: "📄",
    color: "text-amber-400",
    bgColor: "bg-amber-400/10 border-amber-400/30",
    description:
      "Stores JSON-like documents — each document can have a different structure. No rigid schema.",
    examples: ["MongoDB", "CouchDB", "Firestore"],
    useCases: [
      "E-commerce product catalogues",
      "Content management",
      "User profiles with variable attributes",
    ],
  },
  {
    type: "Key-Value",
    icon: "🔑",
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10 border-cyan-400/30",
    description:
      "Stores simple key → value pairs. Extremely fast — ultra-low latency reads and writes.",
    examples: ["Redis", "DynamoDB", "Memcached"],
    useCases: [
      "Session management",
      "Caching",
      "Real-time leaderboards",
      "Rate limiting",
    ],
  },
  {
    type: "Wide-Column",
    icon: "📊",
    color: "text-violet-400",
    bgColor: "bg-violet-400/10 border-violet-400/30",
    description:
      "Stores data in column families. Optimised for massive-scale writes and time-series data.",
    examples: ["Apache Cassandra", "HBase", "Google Bigtable"],
    useCases: [
      "IoT sensor data",
      "Time-series analytics",
      "Write-heavy distributed workloads",
    ],
  },
  {
    type: "Graph",
    icon: "🕸️",
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10 border-emerald-400/30",
    description:
      "Models data as nodes (entities) and edges (relationships). Perfect for traversing connections.",
    examples: ["Neo4j", "Amazon Neptune", "ArangoDB"],
    useCases: [
      "Social networks",
      "Fraud detection",
      "Recommendation engines",
      "Knowledge graphs",
    ],
  },
  {
    type: "Cloud",
    icon: "☁️",
    color: "text-sky-400",
    bgColor: "bg-sky-400/10 border-sky-400/30",
    description:
      "Managed database services in the cloud with automatic scaling, backups, and high availability.",
    examples: ["Google BigQuery", "Amazon RDS", "Azure Cosmos DB"],
    useCases: [
      "SaaS applications",
      "Global-scale analytics",
      "Multi-region deployments",
    ],
  },
  {
    type: "Spatial",
    icon: "🗺️",
    color: "text-orange-400",
    bgColor: "bg-orange-400/10 border-orange-400/30",
    description:
      "Stores and queries geographical data — coordinates, shapes, distances.",
    examples: ["PostGIS", "MongoDB Geospatial", "Oracle Spatial"],
    useCases: [
      "Mapping & GIS",
      "Logistics routing",
      "Location-based services",
      "Find nearest X queries",
    ],
  },
  {
    type: "In-Memory",
    icon: "⚡",
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10 border-yellow-400/30",
    description:
      "All data lives in RAM for ultra-low latency. Millions of operations per second.",
    examples: ["Redis", "Memcached", "VoltDB"],
    useCases: [
      "Real-time analytics",
      "Gaming leaderboards",
      "Pub/sub messaging",
      "Hot cache layer",
    ],
  },
];

const MATCH_CHALLENGES: MatchChallenge[] = [
  {
    scenario:
      "An e-commerce site needs to store product listings where each product has different attributes (clothing has size/colour, electronics have wattage/voltage)",
    correctType: "Document",
    hint: "Think about flexible, schema-less data storage",
  },
  {
    scenario:
      "A social media platform needs to find 'friends of friends' and suggest connections within 3 hops across millions of users",
    correctType: "Graph",
    hint: "Think about traversing relationships between entities",
  },
  {
    scenario:
      "A gaming platform needs a real-time leaderboard that updates millions of scores per second with sub-millisecond response times",
    correctType: "Key-Value",
    hint: "Think about ultra-fast key → value lookups",
  },
  {
    scenario:
      "A logistics company needs to find all delivery vehicles within 10km of a warehouse and calculate optimal routes",
    correctType: "Spatial",
    hint: "Think about geographic data and distance queries",
  },
  {
    scenario:
      "An IoT platform ingests sensor readings from 1 million devices, storing timestamped temperature/pressure values at extreme write speeds",
    correctType: "Wide-Column",
    hint: "Think about massive write throughput and time-series data",
  },
];

// ── Main component ────────────────────────────────────────────────────────────

export function DbTypeComparison() {
  const [selected, setSelected] = useState<string | null>(null);
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [userChoice, setUserChoice] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const challenge = MATCH_CHALLENGES[challengeIdx];
  const isCorrect = userChoice === challenge.correctType;

  function handleTypeClick(type: string) {
    setSelected(selected === type ? null : type);
  }

  function handleChallengeChoice(type: string) {
    if (!revealed) {
      setUserChoice(type);
      setRevealed(true);
    }
  }

  function nextChallenge() {
    setChallengeIdx((i) => (i + 1) % MATCH_CHALLENGES.length);
    setUserChoice(null);
    setRevealed(false);
  }

  const selectedItem = selected
    ? DB_TYPES.find((d) => d.type === selected)
    : null;

  return (
    <div className="space-y-8" data-ocid="db_type_comparison">
      {/* DB Type Cards */}
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          Click any database type to explore its characteristics, examples, and
          use cases.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {DB_TYPES.map((db) => (
            <button
              key={db.type}
              type="button"
              onClick={() => handleTypeClick(db.type)}
              data-ocid={`db_type_comparison.type.${db.type.toLowerCase().replace(/[- ]/g, "_")}`}
              className={cn(
                "p-3 rounded-xl border text-left transition-all duration-200 group",
                selected === db.type
                  ? cn(db.bgColor, "scale-[1.02]")
                  : "bg-card border-border hover:bg-muted/20 hover:border-border hover:scale-[1.01]",
              )}
            >
              <div className="text-xl mb-1.5">{db.icon}</div>
              <div
                className={cn(
                  "text-xs font-bold",
                  selected === db.type ? db.color : "text-foreground",
                )}
              >
                {db.type}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                {db.examples[0]}, {db.examples[1]}
              </div>
            </button>
          ))}
        </div>

        {/* Expanded detail */}
        {selectedItem && (
          <div
            className={cn(
              "mt-3 p-4 rounded-xl border space-y-3",
              selectedItem.bgColor,
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedItem.icon}</span>
              <h4 className={cn("font-bold text-base", selectedItem.color)}>
                {selectedItem.type} Database
              </h4>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {selectedItem.description}
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                  Examples
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedItem.examples.map((ex) => (
                    <span
                      key={ex}
                      className="text-xs px-2 py-0.5 rounded-md bg-background/60 text-foreground border border-border"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                  Use Cases
                </p>
                <ul className="space-y-1">
                  {selectedItem.useCases.map((uc) => (
                    <li
                      key={uc}
                      className="flex items-start gap-1.5 text-xs text-foreground"
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex-shrink-0",
                          selectedItem.color,
                        )}
                      >
                        ▸
                      </span>
                      {uc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Match the use case challenge */}
      <div className="border-t border-border pt-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-foreground">
            Match the Use Case
          </h4>
          <span className="text-xs text-muted-foreground font-mono">
            {challengeIdx + 1} / {MATCH_CHALLENGES.length}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-muted/20 border border-border mb-4">
          <p className="text-sm text-foreground leading-relaxed">
            {challenge.scenario}
          </p>
          {!revealed && (
            <p className="text-xs text-muted-foreground mt-2 italic">
              💡 {challenge.hint}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DB_TYPES.slice(0, 7).map((db) => {
            let state: "default" | "correct" | "wrong" = "default";
            if (revealed) {
              if (db.type === challenge.correctType) state = "correct";
              else if (db.type === userChoice) state = "wrong";
            }
            return (
              <button
                key={db.type}
                type="button"
                disabled={revealed}
                onClick={() => handleChallengeChoice(db.type)}
                data-ocid={`db_type_comparison.challenge.${db.type.toLowerCase().replace(/[- ]/g, "_")}`}
                className={cn(
                  "p-2.5 rounded-lg border text-center text-xs font-medium transition-all duration-200",
                  state === "correct" &&
                    "bg-emerald-500/15 border-emerald-500/50 text-emerald-400",
                  state === "wrong" &&
                    "bg-red-500/15 border-red-500/50 text-red-400",
                  state === "default" &&
                    !revealed &&
                    "bg-card border-border hover:bg-muted/30 text-foreground cursor-pointer",
                  state === "default" &&
                    revealed &&
                    "bg-muted/20 border-border text-muted-foreground opacity-50 cursor-not-allowed",
                )}
              >
                <div className="text-lg mb-1">{db.icon}</div>
                {db.type}
                {state === "correct" && (
                  <CheckCircle2 className="w-3.5 h-3.5 mx-auto mt-1 text-emerald-400" />
                )}
                {state === "wrong" && (
                  <X className="w-3.5 h-3.5 mx-auto mt-1 text-red-400" />
                )}
              </button>
            );
          })}
        </div>

        {revealed && (
          <div
            className={cn(
              "mt-4 p-3 rounded-xl border text-sm",
              isCorrect
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400",
            )}
          >
            {isCorrect ? (
              <p>
                <strong>Correct!</strong> {challenge.correctType} databases are
                ideal for this scenario.
              </p>
            ) : (
              <p>
                <strong>Not quite.</strong> The best fit is a{" "}
                <strong>{challenge.correctType}</strong> database. The scenario
                requires{" "}
                {DB_TYPES.find(
                  (d) => d.type === challenge.correctType,
                )?.description.toLowerCase()}
                .
              </p>
            )}
            <button
              type="button"
              onClick={nextChallenge}
              data-ocid="db_type_comparison.next_challenge_button"
              className="mt-2 px-3 py-1 rounded-lg bg-background border border-border text-foreground text-xs font-medium hover:bg-muted/30 transition-colors"
            >
              Next Scenario →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
