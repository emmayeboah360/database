import { cn } from "@/lib/utils";
import { CheckCircle2, ChevronDown, ChevronUp, X } from "lucide-react";
import { useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

interface DistributedFeature {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  definition: string;
  detail: string;
  challenge: string;
}

interface PartitionQuizQ {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

// ── Data ─────────────────────────────────────────────────────────────────────

const FEATURES: DistributedFeature[] = [
  {
    id: "partitioning",
    name: "Partitioning (Sharding)",
    icon: "⚡",
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10 border-cyan-400/30",
    definition:
      "Data is divided across multiple nodes — each node stores a subset.",
    detail:
      "Horizontal partitioning splits rows across nodes by a partition key (e.g. customer region). Vertical partitioning splits columns. Each shard handles a fraction of the total load, enabling horizontal scale.",
    challenge:
      "Queries spanning multiple shards require merging results from several nodes.",
  },
  {
    id: "replication",
    name: "Replication",
    icon: "📋",
    color: "text-violet-400",
    bgColor: "bg-violet-400/10 border-violet-400/30",
    definition:
      "Data is copied to multiple nodes for fault tolerance and faster reads.",
    detail:
      "A primary node handles writes; read replicas serve read queries. If the primary fails, a replica is promoted. Replication lag can cause temporarily stale reads — a consistency trade-off.",
    challenge:
      "Keeping all replicas in sync (consistent) without introducing write bottlenecks.",
  },
  {
    id: "transparency",
    name: "Distribution Transparency",
    icon: "🪟",
    color: "text-sky-400",
    bgColor: "bg-sky-400/10 border-sky-400/30",
    definition:
      "Applications interact with the database as if it were a single unified system.",
    detail:
      "The complexity of routing queries to the correct shard, merging results, and handling node failures is hidden from the application layer. Developers write standard queries; the distributed layer handles the rest.",
    challenge:
      "Implementing transparent routing and result merging adds overhead to the database engine.",
  },
  {
    id: "fault_tolerance",
    name: "Fault Tolerance",
    icon: "🛡️",
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10 border-emerald-400/30",
    definition:
      "If one node fails, other nodes continue serving requests without downtime.",
    detail:
      "Achieved through replication and automatic failover. Health checks detect failed nodes; the load balancer redirects traffic to healthy nodes. Zero-downtime deployments and rolling updates are possible.",
    challenge:
      "Detecting failures accurately without false positives (split-brain problem).",
  },
  {
    id: "consistency",
    name: "Data Consistency",
    icon: "🔄",
    color: "text-amber-400",
    bgColor: "bg-amber-400/10 border-amber-400/30",
    definition:
      "All nodes must agree on the current state of data after every write.",
    detail:
      "Strong consistency means all reads see the latest write. Eventual consistency means nodes will agree given enough time. Most distributed systems trade strong consistency for availability and partition tolerance (CAP theorem).",
    challenge:
      "The CAP theorem: you can only guarantee 2 of Consistency, Availability, Partition tolerance simultaneously.",
  },
  {
    id: "concurrency",
    name: "Concurrency Control",
    icon: "🔐",
    color: "text-orange-400",
    bgColor: "bg-orange-400/10 border-orange-400/30",
    definition:
      "Multiple nodes must coordinate to prevent conflicting concurrent writes.",
    detail:
      "Distributed locking, two-phase locking (2PL), and optimistic concurrency control prevent race conditions across nodes. Two-phase commit (2PC) ensures atomic transactions span multiple shards.",
    challenge:
      "Distributed locks add latency; deadlocks across nodes are difficult to detect and resolve.",
  },
  {
    id: "scalability",
    name: "Scalability",
    icon: "📈",
    color: "text-rose-400",
    bgColor: "bg-rose-400/10 border-rose-400/30",
    definition:
      "Add more nodes to handle more data and more traffic — horizontally.",
    detail:
      "Horizontal scaling (scale out) adds commodity servers. This contrasts with vertical scaling (scale up) which adds more power to a single server. Distributed databases can grow to handle petabytes across thousands of nodes.",
    challenge:
      "Re-sharding (redistributing data as new nodes are added) is complex and may cause downtime.",
  },
  {
    id: "security",
    name: "Security",
    icon: "🔒",
    color: "text-pink-400",
    bgColor: "bg-pink-400/10 border-pink-400/30",
    definition:
      "Fine-grained access control per node, with encryption in transit between nodes.",
    detail:
      "TLS/SSL encrypts data between nodes. Role-based access control (RBAC) can restrict access at the row, column, or shard level. Authentication must work across all nodes consistently.",
    challenge:
      "Securing inter-node communication without adding excessive latency to every query.",
  },
];

const QUIZ: PartitionQuizQ[] = [
  {
    question:
      "A global e-commerce database stores European customer rows on EU servers and US customer rows on US servers. This is an example of:",
    options: [
      "Replication — copying data for fault tolerance",
      "Horizontal partitioning — splitting rows across nodes by a partition key",
      "Vertical partitioning — splitting columns across nodes",
      "Caching — storing hot data in memory",
    ],
    correct: 1,
    explanation:
      "Horizontal partitioning (sharding) distributes rows across nodes based on a partition key — here, the customer's region. Each shard holds a subset of rows but all columns for those rows.",
  },
  {
    question:
      "Two-phase commit (2PC) is used in distributed databases to ensure:",
    options: [
      "Faster query performance across shards",
      "That all replicas store the exact same data at all times",
      "Atomic transactions across multiple nodes — all commit or all rollback",
      "Data is encrypted during transmission between nodes",
    ],
    correct: 2,
    explanation:
      "2PC is a coordination protocol for distributed atomicity. Phase 1: the coordinator asks all nodes to prepare. Phase 2: if all agree, commit is sent to all; if any fail, rollback is sent to all. This guarantees the transaction either fully succeeds or fully fails across all participating nodes.",
  },
  {
    question:
      "The CAP theorem states a distributed system can only guarantee 2 of 3 properties. Which 3?",
    options: [
      "Concurrency, Availability, Performance",
      "Consistency, Availability, Partition tolerance",
      "Coherence, Atomicity, Portability",
      "Consistency, Accuracy, Performance",
    ],
    correct: 1,
    explanation:
      "CAP: Consistency (all nodes return the same data), Availability (every request gets a response), Partition tolerance (system survives network splits). Because network partitions are inevitable, most systems choose between CA or AP trade-offs.",
  },
  {
    question: "Distribution transparency means:",
    options: [
      "All data is visible to all users at all times",
      "Data is automatically encrypted and decrypted transparently",
      "Applications interact with the distributed database as if it were a single system",
      "The database log is publicly visible for auditing",
    ],
    correct: 2,
    explanation:
      "Transparency hides the complexity of distribution. The application writes standard SQL or API calls; the distributed engine handles routing to the correct shard, merging results, and failover — all invisibly.",
  },
];

// ── Node visualization ────────────────────────────────────────────────────────

interface NodeData {
  id: number;
  label: string;
  region: string;
  rows: string;
  alive: boolean;
  isReplica?: boolean;
}

const INITIAL_NODES: NodeData[] = [
  {
    id: 1,
    label: "Node A",
    region: "EU-West",
    rows: "Users 1–500k",
    alive: true,
  },
  {
    id: 2,
    label: "Node B",
    region: "US-East",
    rows: "Users 500k–1M",
    alive: true,
  },
  {
    id: 3,
    label: "Node C",
    region: "AP-South",
    rows: "Users 1M–1.5M",
    alive: true,
  },
  {
    id: 4,
    label: "Replica A′",
    region: "EU-West",
    rows: "Replica of A",
    alive: true,
    isReplica: true,
  },
];

function NodeBox({ node, onToggle }: { node: NodeData; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      data-ocid={`distributed_diagram.node.${node.id}`}
      className={cn(
        "p-3 rounded-xl border-2 text-left transition-all duration-300 w-full group",
        node.alive
          ? node.isReplica
            ? "border-violet-400/50 bg-violet-400/8"
            : "border-cyan-400/50 bg-cyan-400/8"
          : "border-red-500/50 bg-red-500/8 opacity-60",
      )}
      title={node.alive ? "Click to simulate failure" : "Click to restore node"}
    >
      <div className="flex items-center justify-between mb-1">
        <span
          className={cn(
            "text-xs font-bold",
            node.isReplica ? "text-violet-400" : "text-cyan-400",
          )}
        >
          {node.label}
        </span>
        <span
          className={cn(
            "w-2 h-2 rounded-full flex-shrink-0",
            node.alive
              ? "bg-emerald-400 shadow-[0_0_6px_oklch(var(--secondary)/0.6)]"
              : "bg-red-500",
          )}
        />
      </div>
      <p className="text-[10px] text-muted-foreground">{node.region}</p>
      <p className="text-[10px] text-foreground mt-0.5">{node.rows}</p>
      <p className="text-[10px] text-muted-foreground/60 mt-1 italic group-hover:text-muted-foreground transition-colors">
        {node.alive ? "Click to simulate failure" : "Click to restore"}
      </p>
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function DistributedDiagram() {
  const [expandedFeature, setExpandedFeature] = useState<string | null>(
    "partitioning",
  );
  const [nodes, setNodes] = useState<NodeData[]>(INITIAL_NODES);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const [quizRevealed, setQuizRevealed] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(
    new Set(),
  );

  const aliveNodes = nodes.filter((n) => n.alive).length;
  const q = QUIZ[quizIdx];

  function toggleNode(id: number) {
    setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, alive: !n.alive } : n)),
    );
  }

  function handleQuizChoice(idx: number) {
    if (quizRevealed) return;
    setQuizChoice(idx);
    setQuizRevealed(true);
    if (idx === q.correct && !answeredQuestions.has(quizIdx)) {
      setQuizScore((s) => s + 1);
      setAnsweredQuestions((prev) => new Set([...prev, quizIdx]));
    }
  }

  function nextQuestion() {
    setQuizIdx((i) => (i + 1) % QUIZ.length);
    setQuizChoice(null);
    setQuizRevealed(false);
  }

  return (
    <div className="space-y-8" data-ocid="distributed_diagram">
      {/* Interactive partition diagram */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-foreground">
            Partitioned + Replicated Cluster
          </h4>
          <span className="text-xs font-mono text-muted-foreground">
            {aliveNodes}/{nodes.length} nodes online
          </span>
        </div>

        {/* Coordinator */}
        <div className="flex justify-center mb-3">
          <div className="px-4 py-2 rounded-xl border-2 border-primary/50 bg-primary/8 text-center">
            <p className="text-xs font-bold text-primary">
              🖥️ Application / Load Balancer
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Routes queries to correct shard
            </p>
          </div>
        </div>

        {/* Connection lines visual */}
        <div className="flex justify-center mb-3">
          <div className="flex gap-3">
            {nodes.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "w-0.5 h-6 rounded-full transition-colors",
                  n.alive
                    ? n.isReplica
                      ? "bg-violet-400/40"
                      : "bg-cyan-400/40"
                    : "bg-red-500/30",
                )}
              />
            ))}
          </div>
        </div>

        {/* Nodes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          {nodes.map((node) => (
            <NodeBox
              key={node.id}
              node={node}
              onToggle={() => toggleNode(node.id)}
            />
          ))}
        </div>

        {/* Status messages */}
        {aliveNodes < nodes.length && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-400">
            <strong>⚠ Fault tolerance in action:</strong>{" "}
            {nodes.length - aliveNodes} node
            {nodes.length - aliveNodes > 1 ? "s" : ""} offline.
            {nodes.some(
              (n) =>
                !n.alive &&
                !n.isReplica &&
                nodes.some((r) => r.isReplica && r.alive),
            )
              ? " Replica A′ is serving requests originally handled by Node A — no data loss."
              : " Traffic is redistributed to remaining online nodes."}
          </div>
        )}
        {aliveNodes === nodes.length && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400">
            ✓ All nodes healthy. Click any node to simulate a failure and see
            fault tolerance in action.
          </div>
        )}
      </div>

      {/* Features accordion */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Key Features
        </p>
        <div className="space-y-1.5">
          {FEATURES.map((f) => (
            <div
              key={f.id}
              className={cn("rounded-xl border overflow-hidden", f.bgColor)}
            >
              <button
                type="button"
                onClick={() =>
                  setExpandedFeature(expandedFeature === f.id ? null : f.id)
                }
                data-ocid={`distributed_diagram.feature.${f.id}`}
                className="w-full flex items-center gap-3 p-3 text-left"
              >
                <span className="text-base flex-shrink-0">{f.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-xs font-bold", f.color)}>{f.name}</p>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    {f.definition}
                  </p>
                </div>
                {expandedFeature === f.id ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                )}
              </button>
              {expandedFeature === f.id && (
                <div className="px-4 pb-3 space-y-2">
                  <p className="text-xs text-foreground leading-relaxed">
                    {f.detail}
                  </p>
                  <div className="flex items-start gap-2 p-2 rounded-lg bg-background/40 border border-border/40">
                    <span className="text-amber-400 flex-shrink-0 text-xs">
                      ⚡
                    </span>
                    <p className="text-xs text-muted-foreground">
                      <strong className="text-amber-400">Challenge:</strong>{" "}
                      {f.challenge}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quiz */}
      <div className="border-t border-border pt-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-foreground">Quick Check</h4>
          <span className="text-xs font-semibold text-primary">
            Score: {quizScore}/{QUIZ.length}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border mb-4">
          <p className="text-sm font-medium text-foreground leading-relaxed">
            {quizIdx + 1}. {q.question}
          </p>
        </div>

        <div className="space-y-2 mb-4">
          {q.options.map((opt, i) => {
            let state: "default" | "correct" | "wrong" = "default";
            if (quizRevealed) {
              if (i === q.correct) state = "correct";
              else if (i === quizChoice) state = "wrong";
            }
            return (
              <button
                key={opt}
                type="button"
                disabled={quizRevealed}
                onClick={() => handleQuizChoice(i)}
                data-ocid={`distributed_diagram.quiz_option.${i + 1}`}
                className={cn(
                  "w-full p-3 rounded-xl border text-left text-sm transition-all duration-200",
                  state === "correct" &&
                    "bg-emerald-500/15 border-emerald-500/50 text-emerald-300",
                  state === "wrong" &&
                    "bg-red-500/15 border-red-500/50 text-red-300",
                  state === "default" &&
                    !quizRevealed &&
                    "bg-card border-border hover:bg-muted/30 text-foreground cursor-pointer",
                  state === "default" &&
                    quizRevealed &&
                    "bg-muted/10 border-border text-muted-foreground opacity-40 cursor-not-allowed",
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground flex-shrink-0">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  <span>{opt}</span>
                  {state === "correct" && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto flex-shrink-0" />
                  )}
                  {state === "wrong" && (
                    <X className="w-4 h-4 text-red-400 ml-auto flex-shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {quizRevealed && (
          <div
            className={cn(
              "p-3 rounded-xl border text-xs mb-3",
              quizChoice === q.correct
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-red-500/10 border-red-500/30 text-red-300",
            )}
          >
            <p className="font-semibold mb-1">
              {quizChoice === q.correct ? "✓ Correct!" : "✗ Incorrect"}
            </p>
            <p className="text-muted-foreground">{q.explanation}</p>
          </div>
        )}

        {quizRevealed && (
          <button
            type="button"
            onClick={nextQuestion}
            data-ocid="distributed_diagram.next_question_button"
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            {quizIdx < QUIZ.length - 1 ? "Next Question →" : "Restart Quiz"}
          </button>
        )}
      </div>
    </div>
  );
}
