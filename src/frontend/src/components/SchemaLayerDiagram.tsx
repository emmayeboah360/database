import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type LayerId = "conceptual" | "logical" | "physical";

interface SchemaLayer {
  id: LayerId;
  label: string;
  subtitle: string;
  color: string;
  borderColor: string;
  bgHover: string;
  icon: string;
  audience: string;
  description: string;
  example: string;
  exampleLabel: string;
  keyPoints: string[];
}

// ─── Layer Data ───────────────────────────────────────────────────────────────

const LAYERS: SchemaLayer[] = [
  {
    id: "conceptual",
    label: "Conceptual Schema",
    subtitle: "Business Concepts",
    color: "text-[oklch(0.72_0.19_40)]",
    borderColor: "border-[oklch(0.72_0.19_40)]",
    bgHover: "hover:bg-[oklch(0.72_0.19_40_/_0.08)]",
    icon: "🗺️",
    audience: "Stakeholders & analysts — no technical detail needed",
    description:
      "The highest-level view of the database. Describes WHAT data exists and the relationships between business entities. Technology-independent — expressed as Entity-Relationship Diagrams (ERDs) and plain language.",
    example:
      "A Student can enrol in many Courses. Each Course is taught by one Lecturer. A Lecturer may teach multiple Courses.",
    exampleLabel: "ERD description",
    keyPoints: [
      "Entities and relationships only — no columns or data types",
      "Expressed as ERDs or plain language",
      "Used to communicate with non-technical stakeholders",
      "Technology-independent (same for MySQL or PostgreSQL)",
    ],
  },
  {
    id: "logical",
    label: "Logical Schema",
    subtitle: "Table Structures",
    color: "text-primary",
    borderColor: "border-primary",
    bgHover: "hover:bg-primary/8",
    icon: "📐",
    audience: "Database designers & developers — DBMS-independent",
    description:
      "Maps the conceptual model to concrete database structures — tables, columns, data types, primary keys, foreign keys and constraints. Still independent of any specific database system (MySQL vs PostgreSQL).",
    example:
      "Students(student_id INT PK, name VARCHAR(100), dob DATE)\nCourses(course_id INT PK, title VARCHAR(150), credits INT)\nEnrollments(student_id INT FK, course_id INT FK, enrolled DATE)",
    exampleLabel: "Table definitions",
    keyPoints: [
      "Tables, columns, data types, and constraints defined",
      "Primary keys and foreign key relationships specified",
      "System-independent — no physical storage detail",
      "Used by developers to write CREATE TABLE statements",
    ],
  },
  {
    id: "physical",
    label: "Physical Schema",
    subtitle: "Storage Implementation",
    color: "text-secondary",
    borderColor: "border-secondary",
    bgHover: "hover:bg-secondary/8",
    icon: "💽",
    audience: "DBAs — database-system specific",
    description:
      "The lowest-level view describing exactly how data is physically stored on disk — file organisation, index structures, partitions, storage engines, and block sizes. Specific to the chosen DBMS.",
    example:
      "Students table: B-tree index on student_id\nStored in 8KB page blocks (InnoDB engine)\nPartitioned by enrollment_year",
    exampleLabel: "Physical storage detail",
    keyPoints: [
      "Index structures (B-tree, hash, clustered)",
      "Storage engine settings and page sizes",
      "Partitioning and file organisation",
      "DBMS-specific — different per system",
    ],
  },
];

// ─── Layer Card ───────────────────────────────────────────────────────────────

function LayerCard({
  layer,
  isSelected,
  index,
  total,
  onSelect,
}: {
  layer: SchemaLayer;
  isSelected: boolean;
  index: number;
  total: number;
  onSelect: (id: LayerId) => void;
}) {
  return (
    <button
      type="button"
      data-ocid={`schema_diagram.layer.${layer.id}`}
      aria-pressed={isSelected}
      className={`relative w-full text-left rounded-xl border-2 p-4 transition-smooth
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
        ${layer.bgHover}
        ${
          isSelected
            ? `${layer.borderColor} shadow-md bg-card`
            : "border-border bg-card/60"
        }`}
      onClick={() => onSelect(layer.id)}
    >
      {/* Layer number badge */}
      <div
        className={`absolute -top-3 left-4 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border
          ${
            isSelected
              ? `${layer.borderColor} ${layer.color} bg-background`
              : "border-border text-muted-foreground bg-background"
          }`}
      >
        Layer {index + 1} of {total}
      </div>

      <div className="flex items-start gap-3 mt-1">
        <span className="text-2xl flex-shrink-0 mt-0.5">{layer.icon}</span>
        <div className="min-w-0">
          <p
            className={`font-semibold text-sm leading-tight ${
              isSelected ? layer.color : "text-foreground"
            }`}
          >
            {layer.label}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {layer.subtitle}
          </p>
        </div>
        <span
          className={`ml-auto text-xs transition-smooth ${
            isSelected ? layer.color : "text-muted-foreground"
          }`}
        >
          {isSelected ? "▾" : "▸"}
        </span>
      </div>

      {/* Quick tag */}
      <p className="text-[11px] text-muted-foreground mt-2.5 pl-9 leading-snug">
        {layer.audience}
      </p>
    </button>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function LayerDetail({ layer }: { layer: SchemaLayer }) {
  return (
    <div data-ocid={`schema_diagram.detail.${layer.id}`} className="space-y-4">
      {/* Header */}
      <div className={`rounded-lg border-2 ${layer.borderColor} p-4 bg-card`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{layer.icon}</span>
          <h3 className={`font-bold text-base ${layer.color}`}>
            {layer.label}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {layer.description}
        </p>
      </div>

      {/* Example */}
      <div>
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
          {layer.exampleLabel}
        </p>
        <pre
          className={`rounded-lg border p-3 font-mono text-xs leading-relaxed
            bg-background ${layer.borderColor} whitespace-pre-wrap break-all`}
        >
          <code className="text-foreground/80">{layer.example}</code>
        </pre>
      </div>

      {/* Key points */}
      <div>
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Key characteristics
        </p>
        <ul className="space-y-1.5">
          {layer.keyPoints.map((point) => (
            <li key={point} className="flex items-start gap-2 text-sm">
              <span className={`mt-0.5 text-xs ${layer.color}`}>✦</span>
              <span className="text-foreground/80 leading-snug">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Connector Arrows ─────────────────────────────────────────────────────────

function LayerConnector({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 my-1 pl-4">
      <div className="flex flex-col items-center">
        <div className="w-0.5 h-3 bg-border" />
        <span className="text-muted-foreground/50 text-base leading-none">
          ▼
        </span>
      </div>
      <span className="text-[10px] font-mono text-muted-foreground/60 italic">
        {label}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SchemaLayerDiagram() {
  const [selectedId, setSelectedId] = useState<LayerId>("conceptual");

  const selectedLayer = LAYERS.find((l) => l.id === selectedId) ?? LAYERS[0];

  return (
    <div
      data-ocid="schema_diagram.section"
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border bg-primary/5 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <h2 className="text-subheading text-foreground">
          Schema Abstraction Layers
        </h2>
        <span className="ml-auto text-xs text-muted-foreground">
          Click a layer to explore
        </span>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Left: Layer selector stack */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Three-Level Schema Architecture
            </p>

            <div className="flex flex-col">
              {LAYERS.map((layer, index) => (
                <div key={layer.id}>
                  <LayerCard
                    layer={layer}
                    isSelected={selectedId === layer.id}
                    index={index}
                    total={LAYERS.length}
                    onSelect={setSelectedId}
                  />
                  {index < LAYERS.length - 1 && (
                    <LayerConnector
                      label={
                        index === 0
                          ? "maps to specific structures →"
                          : "maps to physical storage →"
                      }
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Data independence callout */}
            <div className="mt-4 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3">
              <p className="text-xs font-semibold text-accent mb-1">
                💡 Data Independence
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Separating schemas into layers means changing physical storage
                doesn't break application code — the logical layer stays stable.
              </p>
            </div>
          </div>

          {/* Right: Detail panel */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Layer Detail
            </p>
            <LayerDetail layer={selectedLayer} />
          </div>
        </div>

        {/* Comparison table */}
        <div className="mt-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Quick comparison
          </p>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-3 py-2 text-left text-muted-foreground font-semibold border-b border-border">
                    Schema Level
                  </th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-semibold border-b border-border">
                    Expressed As
                  </th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-semibold border-b border-border">
                    Audience
                  </th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-semibold border-b border-border">
                    DBMS-specific?
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Conceptual", "ERD / plain language", "Stakeholders", "No"],
                  ["Logical", "Table & column definitions", "Developers", "No"],
                  ["Physical", "Indexes, storage, partitions", "DBAs", "Yes"],
                ].map(([level, expr, audience, dbms]) => (
                  <tr
                    key={level}
                    className="db-table-row hover:bg-muted/20 transition-smooth"
                  >
                    <td className="px-3 py-2 font-semibold font-mono border-b border-border">
                      {level}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground border-b border-border">
                      {expr}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground border-b border-border">
                      {audience}
                    </td>
                    <td
                      className={`px-3 py-2 font-semibold border-b border-border ${
                        dbms === "Yes" ? "text-destructive" : "text-secondary"
                      }`}
                    >
                      {dbms}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
