import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type NF = "1NF" | "2NF" | "3NF";

interface TableDef {
  name: string;
  columns: string[];
  rows: string[][];
  pkCols?: number[];
  fkCols?: number[];
  violationCols?: number[];
  resolvedCols?: number[];
}

interface NFStep {
  nf: NF;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  beforeTables: TableDef[];
  afterTables: TableDef[];
}

interface ExerciseData {
  exerciseId: string;
  scenario: string;
  targetNF: NF;
  unnormalized: TableDef;
  steps: NFStep[];
}

// ─── Exercise Data ────────────────────────────────────────────────────────────

const EXERCISES: Record<string, ExerciseData> = {
  "orders-1nf": {
    exerciseId: "orders-1nf",
    scenario: "Order Management System",
    targetNF: "3NF",
    unnormalized: {
      name: "Orders (Unnormalized)",
      columns: [
        "order_id",
        "customer_name",
        "customer_email",
        "product1_name",
        "product1_price",
        "product2_name",
        "product2_price",
        "order_date",
        "delivery_address",
      ],
      violationCols: [3, 4, 5, 6],
      rows: [
        [
          "1001",
          "Alice Chen",
          "alice@example.com",
          "Laptop",
          "999.00",
          "Mouse",
          "29.99",
          "2024-01-15",
          "42 Elm St",
        ],
        [
          "1002",
          "Bob Kim",
          "bob@example.com",
          "Keyboard",
          "79.99",
          "",
          "",
          "2024-01-16",
          "7 Oak Ave",
        ],
        [
          "1003",
          "Carol Ray",
          "carol@example.com",
          "Monitor",
          "349.00",
          "HDMI Cable",
          "15.00",
          "2024-01-17",
          "99 Pine Rd",
        ],
        [
          "1004",
          "David Wu",
          "david@example.com",
          "Webcam",
          "119.00",
          "USB Hub",
          "39.99",
          "2024-01-18",
          "3 Maple Dr",
        ],
      ],
    },
    steps: [
      {
        nf: "1NF",
        question: "What 1NF violation do you see in the Orders table?",
        options: [
          "The primary key is missing",
          "Repeating column groups (product1_*, product2_*) store multiple values of the same concept",
          "customer_email contains non-atomic data",
          "order_date should be stored as a number",
        ],
        correctIndex: 1,
        explanation:
          "1NF requires each column to hold a single, atomic value — no repeating groups. " +
          "product1_name / product2_name represent the same concept (a product in an order) repeated across columns. " +
          "The fix is to create a separate OrderItems table where each product gets its own row.",
        beforeTables: [
          {
            name: "Orders (violates 1NF)",
            columns: [
              "order_id",
              "customer_name",
              "customer_email",
              "product1_name",
              "product1_price",
              "product2_name",
              "product2_price",
              "order_date",
              "delivery_address",
            ],
            pkCols: [0],
            violationCols: [3, 4, 5, 6],
            rows: [
              [
                "1001",
                "Alice Chen",
                "alice@example.com",
                "Laptop",
                "999.00",
                "Mouse",
                "29.99",
                "2024-01-15",
                "42 Elm St",
              ],
              [
                "1002",
                "Bob Kim",
                "bob@example.com",
                "Keyboard",
                "79.99",
                "",
                "",
                "2024-01-16",
                "7 Oak Ave",
              ],
              [
                "1003",
                "Carol Ray",
                "carol@example.com",
                "Monitor",
                "349.00",
                "HDMI Cable",
                "15.00",
                "2024-01-17",
                "99 Pine Rd",
              ],
            ],
          },
        ],
        afterTables: [
          {
            name: "Orders (1NF ✓)",
            columns: [
              "order_id",
              "customer_name",
              "customer_email",
              "order_date",
              "delivery_address",
            ],
            pkCols: [0],
            resolvedCols: [0, 1, 2, 3, 4],
            rows: [
              [
                "1001",
                "Alice Chen",
                "alice@example.com",
                "2024-01-15",
                "42 Elm St",
              ],
              ["1002", "Bob Kim", "bob@example.com", "2024-01-16", "7 Oak Ave"],
              [
                "1003",
                "Carol Ray",
                "carol@example.com",
                "2024-01-17",
                "99 Pine Rd",
              ],
            ],
          },
          {
            name: "OrderItems (1NF ✓)",
            columns: ["order_id", "product_name", "product_price"],
            pkCols: [0, 1],
            fkCols: [0],
            resolvedCols: [0, 1, 2],
            rows: [
              ["1001", "Laptop", "999.00"],
              ["1001", "Mouse", "29.99"],
              ["1002", "Keyboard", "79.99"],
              ["1003", "Monitor", "349.00"],
              ["1003", "HDMI Cable", "15.00"],
            ],
          },
        ],
      },
      {
        nf: "2NF",
        question:
          "OrderItems has a composite PK (order_id + product_name). Does product_price have a partial dependency?",
        options: [
          "No — product_price depends on both order_id and product_name together",
          "Yes — product_price depends only on product_name (not on order_id)",
          "Yes — product_price depends only on order_id",
          "2NF doesn't apply to this table",
        ],
        correctIndex: 1,
        explanation:
          "2NF removes partial-key dependencies. product_price is a property of the product itself, " +
          "not of a specific order. It depends only on product_name (part of the composite PK), " +
          "making it a partial dependency. Fix: extract a Products table and add a surrogate item_id key.",
        beforeTables: [
          {
            name: "OrderItems (violates 2NF)",
            columns: ["order_id", "product_name", "product_price"],
            pkCols: [0, 1],
            fkCols: [0],
            violationCols: [2],
            rows: [
              ["1001", "Laptop", "999.00"],
              ["1001", "Mouse", "29.99"],
              ["1002", "Keyboard", "79.99"],
              ["1003", "Monitor", "349.00"],
              ["1003", "HDMI Cable", "15.00"],
            ],
          },
        ],
        afterTables: [
          {
            name: "OrderItems (2NF ✓)",
            columns: ["item_id", "order_id", "product_name"],
            pkCols: [0],
            fkCols: [1],
            resolvedCols: [0, 1, 2],
            rows: [
              ["1", "1001", "Laptop"],
              ["2", "1001", "Mouse"],
              ["3", "1002", "Keyboard"],
              ["4", "1003", "Monitor"],
              ["5", "1003", "HDMI Cable"],
            ],
          },
          {
            name: "Products (2NF ✓)",
            columns: ["product_name", "product_price"],
            pkCols: [0],
            resolvedCols: [0, 1],
            rows: [
              ["Laptop", "999.00"],
              ["Mouse", "29.99"],
              ["Keyboard", "79.99"],
              ["Monitor", "349.00"],
              ["HDMI Cable", "15.00"],
            ],
          },
        ],
      },
      {
        nf: "3NF",
        question:
          "In the Products table, product_price depends on product_name — is this a 3NF issue?",
        options: [
          "No — product_price is a direct attribute of the product",
          "Yes — product_price is a transitive dependency and should be in a separate table",
          "Yes — we need to add a surrogate product_id primary key and remove the name dependency",
          "3NF only applies to non-key columns in multi-table joins",
        ],
        correctIndex: 2,
        explanation:
          "3NF removes transitive (non-key) dependencies. Using product_name as the PK means product_price " +
          "indirectly depends on order_id via product_name → product_price. Adding a surrogate product_id " +
          "ensures every non-key column depends solely on the PK, not on another non-key column.",
        beforeTables: [
          {
            name: "Products (violates 3NF)",
            columns: ["product_name", "product_price"],
            pkCols: [0],
            violationCols: [0],
            rows: [
              ["Laptop", "999.00"],
              ["Mouse", "29.99"],
              ["Keyboard", "79.99"],
              ["Monitor", "349.00"],
            ],
          },
        ],
        afterTables: [
          {
            name: "Products (3NF ✓)",
            columns: ["product_id", "product_name", "product_price"],
            pkCols: [0],
            resolvedCols: [0, 1, 2],
            rows: [
              ["P1", "Laptop", "999.00"],
              ["P2", "Mouse", "29.99"],
              ["P3", "Keyboard", "79.99"],
              ["P4", "Monitor", "349.00"],
            ],
          },
          {
            name: "OrderItems (final 3NF ✓)",
            columns: ["item_id", "order_id", "product_id"],
            pkCols: [0],
            fkCols: [1, 2],
            resolvedCols: [0, 1, 2],
            rows: [
              ["1", "1001", "P1"],
              ["2", "1001", "P2"],
              ["3", "1002", "P3"],
              ["4", "1003", "P4"],
            ],
          },
        ],
      },
    ],
  },

  "library-3nf": {
    exerciseId: "library-3nf",
    scenario: "Library Book Lending",
    targetNF: "3NF",
    unnormalized: {
      name: "BookLoans (Unnormalized)",
      columns: [
        "loan_id",
        "book_title",
        "book_author",
        "author_country",
        "author_email",
        "member_name",
        "member_email",
        "member_city",
        "loan_date",
        "return_date",
      ],
      rows: [
        [
          "L001",
          "Clean Code",
          "Robert Martin",
          "USA",
          "rmartin@dev.com",
          "Alice Chen",
          "alice@lib.org",
          "Chicago",
          "2024-02-01",
          "2024-02-15",
        ],
        [
          "L002",
          "The Pragmatic Programmer",
          "Andy Hunt",
          "USA",
          "ahunt@dev.com",
          "Bob Kim",
          "bob@lib.org",
          "Boston",
          "2024-02-03",
          "2024-02-17",
        ],
        [
          "L003",
          "Clean Code",
          "Robert Martin",
          "USA",
          "rmartin@dev.com",
          "Carol Ray",
          "carol@lib.org",
          "Austin",
          "2024-02-10",
          "2024-02-24",
        ],
        [
          "L004",
          "Refactoring",
          "Martin Fowler",
          "UK",
          "mfowler@dev.com",
          "Alice Chen",
          "alice@lib.org",
          "Chicago",
          "2024-02-12",
          "2024-02-26",
        ],
      ],
    },
    steps: [
      {
        nf: "1NF",
        question:
          "Checking 1NF: does the BookLoans table contain any repeating groups or multi-valued columns?",
        options: [
          "Yes — book_title and book_author violate atomicity",
          "Yes — loan_date and return_date should be a single date range column",
          "No — all columns hold a single atomic value; the table passes 1NF",
          "Yes — member_city is a multi-valued attribute",
        ],
        correctIndex: 2,
        explanation:
          "All values in BookLoans are atomic — each column holds exactly one value per row. " +
          "There are no repeating groups or multi-valued cells. The table already satisfies 1NF.",
        beforeTables: [
          {
            name: "BookLoans",
            columns: [
              "loan_id",
              "book_title",
              "book_author",
              "author_country",
              "member_name",
              "member_email",
              "member_city",
              "loan_date",
              "return_date",
            ],
            pkCols: [0],
            resolvedCols: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            rows: [
              [
                "L001",
                "Clean Code",
                "Robert Martin",
                "USA",
                "Alice Chen",
                "alice@lib.org",
                "Chicago",
                "2024-02-01",
                "2024-02-15",
              ],
              [
                "L002",
                "The Pragmatic Programmer",
                "Andy Hunt",
                "USA",
                "Bob Kim",
                "bob@lib.org",
                "Boston",
                "2024-02-03",
                "2024-02-17",
              ],
              [
                "L003",
                "Clean Code",
                "Robert Martin",
                "USA",
                "Carol Ray",
                "carol@lib.org",
                "Austin",
                "2024-02-10",
                "2024-02-24",
              ],
            ],
          },
        ],
        afterTables: [
          {
            name: "BookLoans (1NF ✓ — no change needed)",
            columns: [
              "loan_id",
              "book_title",
              "book_author",
              "author_country",
              "member_name",
              "member_email",
              "member_city",
              "loan_date",
              "return_date",
            ],
            pkCols: [0],
            resolvedCols: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            rows: [
              [
                "L001",
                "Clean Code",
                "Robert Martin",
                "USA",
                "Alice Chen",
                "alice@lib.org",
                "Chicago",
                "2024-02-01",
                "2024-02-15",
              ],
              [
                "L002",
                "The Pragmatic Programmer",
                "Andy Hunt",
                "USA",
                "Bob Kim",
                "bob@lib.org",
                "Boston",
                "2024-02-03",
                "2024-02-17",
              ],
              [
                "L003",
                "Clean Code",
                "Robert Martin",
                "USA",
                "Carol Ray",
                "carol@lib.org",
                "Austin",
                "2024-02-10",
                "2024-02-24",
              ],
            ],
          },
        ],
      },
      {
        nf: "2NF",
        question:
          "BookLoans has a single-column PK (loan_id). Can partial dependencies exist?",
        options: [
          "Yes — book_title partially depends on loan_id",
          "Yes — member_city depends on loan_id and member_email",
          "No — partial dependencies only occur with composite primary keys; BookLoans passes 2NF automatically",
          "Yes — author_country is a partial dependency",
        ],
        correctIndex: 2,
        explanation:
          "Partial dependencies only occur when a non-key attribute depends on part of a composite primary key. " +
          "Since loan_id is a single-column PK, all non-key attributes must depend on it in full — " +
          "there is no 'part of the PK' to partially depend on. 2NF is automatically satisfied.",
        beforeTables: [
          {
            name: "BookLoans (single PK = no partial deps)",
            columns: [
              "loan_id",
              "book_title",
              "book_author",
              "author_country",
              "member_name",
              "member_email",
              "member_city",
              "loan_date",
              "return_date",
            ],
            pkCols: [0],
            resolvedCols: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            rows: [
              [
                "L001",
                "Clean Code",
                "Robert Martin",
                "USA",
                "Alice Chen",
                "alice@lib.org",
                "Chicago",
                "2024-02-01",
                "2024-02-15",
              ],
              [
                "L002",
                "The Pragmatic Programmer",
                "Andy Hunt",
                "USA",
                "Bob Kim",
                "bob@lib.org",
                "Boston",
                "2024-02-03",
                "2024-02-17",
              ],
            ],
          },
        ],
        afterTables: [
          {
            name: "BookLoans (2NF ✓ — no change needed)",
            columns: [
              "loan_id",
              "book_title",
              "book_author",
              "author_country",
              "member_name",
              "member_email",
              "member_city",
              "loan_date",
              "return_date",
            ],
            pkCols: [0],
            resolvedCols: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            rows: [
              [
                "L001",
                "Clean Code",
                "Robert Martin",
                "USA",
                "Alice Chen",
                "alice@lib.org",
                "Chicago",
                "2024-02-01",
                "2024-02-15",
              ],
              [
                "L002",
                "The Pragmatic Programmer",
                "Andy Hunt",
                "USA",
                "Bob Kim",
                "bob@lib.org",
                "Boston",
                "2024-02-03",
                "2024-02-17",
              ],
            ],
          },
        ],
      },
      {
        nf: "3NF",
        question: "Which transitive dependencies exist in BookLoans?",
        options: [
          "loan_date → return_date (dates depend on each other)",
          "author_country depends on book_author (not loan_id); member_city depends on member_email (not loan_id)",
          "book_title → book_author is a transitive dependency",
          "There are no transitive dependencies — the table is already in 3NF",
        ],
        correctIndex: 1,
        explanation:
          "3NF demands every non-key attribute depend directly on the PK — not on another non-key attribute. " +
          "Here: author_country and author_email depend on book_author (the author, not the loan). " +
          "member_city depends on member_email (a member's own attribute). " +
          "Fix: extract Authors, Books, and Members tables.",
        beforeTables: [
          {
            name: "BookLoans (violates 3NF)",
            columns: [
              "loan_id",
              "book_title",
              "book_author",
              "author_country",
              "author_email",
              "member_name",
              "member_email",
              "member_city",
              "loan_date",
              "return_date",
            ],
            pkCols: [0],
            violationCols: [3, 4, 7],
            rows: [
              [
                "L001",
                "Clean Code",
                "Robert Martin",
                "USA",
                "rmartin@dev.com",
                "Alice Chen",
                "alice@lib.org",
                "Chicago",
                "2024-02-01",
                "2024-02-15",
              ],
              [
                "L002",
                "The Pragmatic Programmer",
                "Andy Hunt",
                "USA",
                "ahunt@dev.com",
                "Bob Kim",
                "bob@lib.org",
                "Boston",
                "2024-02-03",
                "2024-02-17",
              ],
              [
                "L003",
                "Clean Code",
                "Robert Martin",
                "USA",
                "rmartin@dev.com",
                "Carol Ray",
                "carol@lib.org",
                "Austin",
                "2024-02-10",
                "2024-02-24",
              ],
            ],
          },
        ],
        afterTables: [
          {
            name: "Authors (3NF ✓)",
            columns: ["author_id", "name", "country", "email"],
            pkCols: [0],
            resolvedCols: [0, 1, 2, 3],
            rows: [
              ["A1", "Robert Martin", "USA", "rmartin@dev.com"],
              ["A2", "Andy Hunt", "USA", "ahunt@dev.com"],
              ["A3", "Martin Fowler", "UK", "mfowler@dev.com"],
            ],
          },
          {
            name: "Books (3NF ✓)",
            columns: ["book_id", "title", "author_id"],
            pkCols: [0],
            fkCols: [2],
            resolvedCols: [0, 1, 2],
            rows: [
              ["B1", "Clean Code", "A1"],
              ["B2", "The Pragmatic Programmer", "A2"],
              ["B3", "Refactoring", "A3"],
            ],
          },
          {
            name: "Members (3NF ✓)",
            columns: ["member_id", "name", "email", "city"],
            pkCols: [0],
            resolvedCols: [0, 1, 2, 3],
            rows: [
              ["M1", "Alice Chen", "alice@lib.org", "Chicago"],
              ["M2", "Bob Kim", "bob@lib.org", "Boston"],
              ["M3", "Carol Ray", "carol@lib.org", "Austin"],
            ],
          },
          {
            name: "Loans (3NF ✓)",
            columns: [
              "loan_id",
              "book_id",
              "member_id",
              "loan_date",
              "return_date",
            ],
            pkCols: [0],
            fkCols: [1, 2],
            resolvedCols: [0, 1, 2, 3, 4],
            rows: [
              ["L001", "B1", "M1", "2024-02-01", "2024-02-15"],
              ["L002", "B2", "M2", "2024-02-03", "2024-02-17"],
              ["L003", "B1", "M3", "2024-02-10", "2024-02-24"],
            ],
          },
        ],
      },
    ],
  },
};

// ─── DataTable ─────────────────────────────────────────────────────────────────

function DataTable({ table }: { table: TableDef }) {
  const {
    name,
    columns,
    rows,
    pkCols = [],
    fkCols = [],
    violationCols = [],
    resolvedCols = [],
  } = table;

  function headerClass(i: number): string {
    if (pkCols.includes(i))
      return "bg-primary/20 text-primary font-semibold border-b border-primary/30";
    if (fkCols.includes(i))
      return "bg-secondary/20 text-secondary font-semibold border-b border-secondary/30";
    return "bg-muted text-muted-foreground border-b border-border";
  }

  function cellClass(colIdx: number, value: string): string {
    const base =
      "px-3 py-2 text-xs font-mono border-b border-border whitespace-nowrap";
    if (!value) return `${base} text-muted-foreground/40 italic`;
    if (violationCols.includes(colIdx))
      return `${base} bg-destructive/10 text-destructive border-l-2 border-l-destructive/60`;
    if (resolvedCols.includes(colIdx)) return `${base} text-foreground`;
    return `${base} text-muted-foreground`;
  }

  const hasPk = pkCols.length > 0;
  const hasFk = fkCols.length > 0;

  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold text-foreground mb-1.5 font-mono">
        {name}
      </p>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th
                  key={col}
                  className={`px-3 py-2 text-left text-xs whitespace-nowrap ${headerClass(i)}`}
                >
                  <span className="flex items-center gap-1">
                    {pkCols.includes(i) && <span title="Primary Key">🔑</span>}
                    {fkCols.includes(i) && !pkCols.includes(i) && (
                      <span title="Foreign Key">🔗</span>
                    )}
                    {col}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr
                key={`row-${ri}-${row[0]}`}
                className="db-table-row hover:bg-muted/30 transition-smooth"
              >
                {row.map((cell, ci) => (
                  <td
                    key={`${columns[ci]}-${ri}`}
                    className={cellClass(ci, cell)}
                  >
                    {cell || <span className="opacity-40">—</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(hasPk || hasFk) && (
        <div className="flex gap-3 mt-1.5">
          {hasPk && (
            <span className="text-[10px] text-muted-foreground">
              🔑 Primary Key
            </span>
          )}
          {hasFk && (
            <span className="text-[10px] text-muted-foreground">
              🔗 Foreign Key
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── StepDots ─────────────────────────────────────────────────────────────────

function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={`step-dot-${i === current ? "active" : i < current ? `done-${i}` : `todo-${i}`}`}
          className={`h-2 rounded-full transition-smooth ${
            i < current
              ? "w-4 bg-secondary"
              : i === current
                ? "w-4 bg-primary animate-pulse"
                : "w-2 bg-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export interface NormalizationExerciseProps {
  exerciseId: string;
  scenario?: string;
  targetNF?: NF;
}

type Phase = "intro" | "question" | "reveal" | "complete";

export default function NormalizationExercise({
  exerciseId,
}: NormalizationExerciseProps) {
  const data = EXERCISES[exerciseId] ?? EXERCISES["orders-1nf"];
  const [phase, setPhase] = useState<Phase>("intro");
  const [stepIndex, setStepIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const step = data.steps[stepIndex];
  const isAnswered = selected !== null;
  const isCorrect = selected === step?.correctIndex;
  const isLastStep = stepIndex === data.steps.length - 1;

  function handleSelect(i: number) {
    if (isAnswered) return;
    setSelected(i);
    setPhase("reveal");
  }

  function handleContinue() {
    if (isLastStep) {
      setPhase("complete");
    } else {
      setStepIndex((s) => s + 1);
      setSelected(null);
      setPhase("question");
    }
  }

  function handleRestart() {
    setPhase("intro");
    setStepIndex(0);
    setSelected(null);
  }

  function optionStyle(i: number): string {
    const base =
      "w-full text-left px-4 py-3 rounded-lg border text-sm transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
    if (!isAnswered)
      return `${base} border-border bg-card text-card-foreground hover:border-primary/60 hover:bg-primary/5 cursor-pointer`;
    if (i === step.correctIndex)
      return `${base} border-secondary/60 bg-secondary/10 text-foreground cursor-default`;
    if (i === selected)
      return `${base} border-destructive/60 bg-destructive/10 text-foreground cursor-default`;
    return `${base} border-border bg-card/50 text-muted-foreground cursor-default opacity-60`;
  }

  // ── Intro ──
  if (phase === "intro") {
    return (
      <section
        data-ocid="norm_exercise.section"
        className="rounded-xl border border-border bg-card overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-primary/5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <h2 className="text-subheading text-foreground">
              Normalization Exercise
            </h2>
          </div>
          <span className="db-hl-badge">{data.targetNF}</span>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Scenario
            </p>
            <p className="text-base font-semibold text-foreground">
              {data.scenario}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-3">
              Study the unnormalized table, then step through normalizing it to{" "}
              <span className="font-semibold text-primary">
                {data.targetNF}
              </span>
              .
            </p>
            <div className="overflow-x-auto">
              <DataTable table={data.unnormalized} />
            </div>
          </div>

          <div className="rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-foreground">
            <span className="font-semibold text-accent">Goal:</span> Walk
            through {data.steps.length} normalization steps, identifying
            violations and applying fixes.
          </div>

          <Button
            data-ocid="norm_exercise.start_button"
            className="w-full gradient-primary text-primary-foreground gap-2"
            onClick={() => setPhase("question")}
          >
            Start Exercise
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </section>
    );
  }

  // ── Complete ──
  if (phase === "complete") {
    return (
      <section
        data-ocid="norm_exercise.complete_section"
        className="rounded-xl border border-secondary/40 bg-card overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-secondary/30 bg-secondary/5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-secondary" />
            <h2 className="text-subheading text-foreground">
              Normalization Complete!
            </h2>
          </div>
          <span className="db-hl-badge">{data.targetNF} ✓</span>
        </div>

        <div className="p-5 space-y-5">
          <div className="flex flex-col items-center py-4 gap-2 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-secondary/20 border-4 border-secondary">
              <CheckCircle2 className="w-8 h-8 text-secondary" />
            </div>
            <p className="text-xl font-semibold text-foreground">Well done!</p>
            <p className="text-sm text-muted-foreground max-w-sm">
              You successfully normalized the{" "}
              <span className="font-semibold text-foreground">
                {data.scenario}
              </span>{" "}
              database to{" "}
              <span className="font-semibold text-secondary">
                {data.targetNF}
              </span>{" "}
              by eliminating all normalization anomalies.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-background p-4 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Summary of Steps
            </p>
            {data.steps.map((s, i) => (
              <div
                key={`summary-${s.nf}-step-${i}`}
                className="flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-secondary/20 border border-secondary/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {s.nf} — {s.question.split(":")[0]?.replace(/\?/g, "")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {s.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Button
            data-ocid="norm_exercise.restart_button"
            variant="outline"
            className="w-full gap-2"
            onClick={handleRestart}
          >
            <RotateCcw className="w-4 h-4" />
            Restart Exercise
          </Button>
        </div>
      </section>
    );
  }

  // ── Question / Reveal ──
  return (
    <section
      data-ocid="norm_exercise.section"
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-primary/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <h2 className="text-subheading text-foreground">
            Normalization Exercise
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground font-mono tabular-nums">
            Step {stepIndex + 1} of {data.steps.length}
          </span>
          <StepDots total={data.steps.length} current={stepIndex} />
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <div
          className="h-1 bg-primary transition-smooth"
          style={{
            width: `${((stepIndex + (isAnswered ? 1 : 0)) / data.steps.length) * 100}%`,
          }}
        />
      </div>

      <div className="p-5 space-y-5">
        {/* NF badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-primary/10 border border-primary/30 text-xs font-semibold text-primary font-mono">
            {step.nf}
          </span>
          <span className="text-xs text-muted-foreground">
            Checking for violations…
          </span>
        </div>

        {/* Before tables */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Current table structure
          </p>
          <div className="grid gap-4">
            {step.beforeTables.map((t) => (
              <div key={t.name} className="overflow-x-auto">
                <DataTable table={t} />
              </div>
            ))}
          </div>
          {step.beforeTables.some(
            (t) => (t.violationCols ?? []).length > 0,
          ) && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
              <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Highlighted cells indicate normalization violations</span>
            </div>
          )}
        </div>

        {/* Question */}
        <div>
          <p
            data-ocid="norm_exercise.question"
            className="text-base font-medium text-foreground mb-4 leading-relaxed"
          >
            {step.question}
          </p>

          <div
            className="space-y-2"
            role="radiogroup"
            aria-label="Answer options"
          >
            {step.options.map((opt, i) => (
              <button
                type="button"
                key={opt}
                data-ocid={`norm_exercise.option.${i + 1}`}
                className={optionStyle(i)}
                onClick={() => handleSelect(i)}
                aria-pressed={selected === i}
                disabled={isAnswered}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full border flex-shrink-0 flex items-center justify-center text-xs font-semibold transition-smooth ${
                      isAnswered && i === step.correctIndex
                        ? "border-secondary bg-secondary text-secondary-foreground"
                        : isAnswered && i === selected && !isCorrect
                          ? "border-destructive bg-destructive text-destructive-foreground"
                          : "border-border text-muted-foreground"
                    }`}
                  >
                    {isAnswered && i === step.correctIndex ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : isAnswered && i === selected && !isCorrect ? (
                      <XCircle className="w-3 h-3" />
                    ) : (
                      String.fromCharCode(65 + i)
                    )}
                  </span>
                  <span className="flex-1 text-left">{opt}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Explanation + after tables */}
        {isAnswered && (
          <div data-ocid="norm_exercise.explanation" className="space-y-4">
            <div
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
              <p className="text-muted-foreground">{step.explanation}</p>
            </div>

            {/* Normalized tables */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                After applying {step.nf}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {step.afterTables.map((t) => (
                  <div key={t.name} className="overflow-x-auto">
                    <DataTable table={t} />
                  </div>
                ))}
              </div>
            </div>

            <Button
              data-ocid="norm_exercise.continue_button"
              className="w-full gradient-primary text-primary-foreground gap-2"
              onClick={handleContinue}
            >
              {isLastStep ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  Complete Exercise
                </>
              ) : (
                <>
                  Continue to {data.steps[stepIndex + 1]?.nf}
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        )}

        {/* Restart link */}
        <div className="flex justify-end pt-1">
          <button
            type="button"
            data-ocid="norm_exercise.restart_button"
            className="text-xs text-muted-foreground hover:text-foreground transition-smooth flex items-center gap-1"
            onClick={handleRestart}
          >
            <RotateCcw className="w-3 h-3" />
            Restart
          </button>
        </div>
      </div>
    </section>
  );
}
