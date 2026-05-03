import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  BarChart3,
  Binary,
  CheckCircle2,
  Database,
  FileQuestion,
  Globe,
  Key,
  Layers,
  Link2,
  Lock,
  RefreshCw,
  ShieldCheck,
  TreePine,
  TrendingUp,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────

export type DiagramVariant =
  | "features"
  | "benefits"
  | "limitations"
  | "scenarios";

interface RelationalDiagramProps {
  variant: DiagramVariant;
}

// ─── A3.1.1 Features: Visual Table Diagram ─────────────────────────────────────

const STUDENTS_TABLE = [
  {
    col: "student_id",
    type: "INT",
    pk: true,
    fk: false,
    note: "Primary Key — uniquely identifies each student",
  },
  {
    col: "name",
    type: "VARCHAR(100)",
    pk: false,
    fk: false,
    note: "Stores full name",
  },
  {
    col: "email",
    type: "VARCHAR(150)",
    pk: false,
    fk: false,
    note: "Unique email address",
  },
  {
    col: "grade",
    type: "INT",
    pk: false,
    fk: false,
    note: "Current year group",
  },
];

const ENROLLMENTS_TABLE = [
  {
    col: "student_id",
    type: "INT",
    pk: true,
    fk: true,
    note: "FK → students.student_id + part of composite PK",
  },
  {
    col: "course_id",
    type: "INT",
    pk: true,
    fk: true,
    note: "FK → courses.course_id + part of composite PK",
  },
  {
    col: "enroll_date",
    type: "DATE",
    pk: false,
    fk: false,
    note: "Date of enrollment",
  },
];

const COURSES_TABLE = [
  {
    col: "course_id",
    type: "INT",
    pk: true,
    fk: false,
    note: "Primary Key — uniquely identifies each course",
  },
  {
    col: "title",
    type: "VARCHAR(200)",
    pk: false,
    fk: false,
    note: "Course name",
  },
  {
    col: "department",
    type: "VARCHAR(80)",
    pk: false,
    fk: false,
    note: "Owning department",
  },
  {
    col: "teacher_id",
    type: "INT",
    pk: false,
    fk: true,
    note: "FK → teachers.teacher_id",
  },
];

function TableCard({
  name,
  rows,
  highlight,
  accent,
}: {
  name: string;
  rows: typeof STUDENTS_TABLE;
  highlight?: string[];
  accent: string;
}) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div
        className="flex items-center gap-2 px-3 py-2.5 border-b border-border"
        style={{ background: `oklch(${accent} / 0.10)` }}
      >
        <Database
          className="w-3.5 h-3.5"
          style={{ color: `oklch(${accent})` }}
        />
        <span
          className="font-mono text-sm font-semibold"
          style={{ color: `oklch(${accent})` }}
        >
          {name}
        </span>
      </div>
      <div className="bg-card">
        {rows.map((row) => {
          const isHighlighted = highlight?.includes(row.col);
          const isHovered = hoveredRow === row.col;
          return (
            <div
              key={row.col}
              className="relative flex items-center gap-2 px-3 py-2 border-b border-border/40 last:border-0 cursor-pointer transition-all duration-200"
              style={{
                background: isHovered
                  ? `oklch(${accent} / 0.07)`
                  : isHighlighted
                    ? `oklch(${accent} / 0.04)`
                    : undefined,
              }}
              onMouseEnter={() => setHoveredRow(row.col)}
              onMouseLeave={() => setHoveredRow(null)}
              onFocus={() => setHoveredRow(row.col)}
              onBlur={() => setHoveredRow(null)}
              aria-label={row.note}
            >
              <div className="flex items-center gap-1.5 min-w-[24px]">
                {row.pk && (
                  <span title="Primary Key">
                    <Key
                      className="w-3 h-3"
                      style={{ color: "oklch(0.72 0.19 40)" }}
                    />
                  </span>
                )}
                {row.fk && !row.pk && (
                  <span title="Foreign Key">
                    <Link2
                      className="w-3 h-3"
                      style={{ color: "oklch(0.58 0.22 195)" }}
                    />
                  </span>
                )}
                {row.pk && row.fk && (
                  <span
                    title="Part of Composite Key + Foreign Key"
                    className="-ml-1"
                  >
                    <Link2
                      className="w-3 h-3"
                      style={{ color: "oklch(0.58 0.22 195)" }}
                    />
                  </span>
                )}
              </div>
              <span className="font-mono text-xs font-medium text-foreground flex-1 truncate">
                {row.col}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {row.type}
              </span>

              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 right-0 top-full z-20 mx-2 px-3 py-2 rounded-lg border shadow-lg text-xs text-muted-foreground"
                    style={{
                      background: "oklch(var(--card))",
                      borderColor: `oklch(${accent} / 0.3)`,
                    }}
                  >
                    {row.note}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FeaturesView() {
  const SQL_ACCENT = "var(--db-sql)";
  const HL_ACCENT = "var(--db-hl)";
  const ERD_ACCENT = "var(--db-erd)";
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground leading-relaxed">
        Hover over any column to see how keys and relationships work. The
        <span className="font-mono mx-1 text-xs bg-muted px-1.5 py-0.5 rounded">
          enrollments
        </span>
        table uses a{" "}
        <strong className="text-foreground">composite primary key</strong> —
        neither column alone is unique, but together they are.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <TableCard
          name="students"
          rows={STUDENTS_TABLE}
          highlight={["student_id"]}
          accent={SQL_ACCENT}
        />
        <TableCard
          name="enrollments"
          rows={ENROLLMENTS_TABLE}
          highlight={["student_id", "course_id"]}
          accent={HL_ACCENT}
        />
        <TableCard
          name="courses"
          rows={COURSES_TABLE}
          highlight={["course_id"]}
          accent={ERD_ACCENT}
        />
      </div>

      <div className="flex flex-wrap gap-3 pt-1">
        {[
          {
            icon: <Key className="w-3 h-3" />,
            color: "0.72 0.19 40",
            label: "Primary Key — uniquely identifies each row",
          },
          {
            icon: <Link2 className="w-3 h-3" />,
            color: "0.58 0.22 195",
            label: "Foreign Key — links to another table",
          },
          {
            icon: <Layers className="w-3 h-3" />,
            color: "0.72 0.19 40",
            label: "Composite Key — two columns combined",
          },
        ].map(({ icon, color, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <span style={{ color: `oklch(${color})` }}>{icon}</span>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── A3.1.2 Benefits: Comparison Cards ────────────────────────────────────────

const BENEFITS = [
  {
    id: "concurrency",
    icon: <Users className="w-5 h-5" />,
    title: "Concurrency Control",
    without:
      "Two bank tellers withdraw £500 simultaneously from a £600 account — both see £600, both succeed, balance goes negative.",
    with: "Database locks the row during each transaction. Second teller sees updated balance before completing their withdrawal.",
    color: "0.58 0.22 195",
  },
  {
    id: "integrity",
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "Data Integrity",
    without:
      "Order placed for product_id = 9999 which doesn't exist. Application crashes; orphaned record stays in the orders table.",
    with: "Foreign key constraint rejects the insert immediately — 'product_id 9999 does not exist in products'. No orphaned records.",
    color: "0.52 0.18 282",
  },
  {
    id: "duplication",
    icon: <RefreshCw className="w-5 h-5" />,
    title: "Reduced Redundancy",
    without:
      "Customer address stored in Orders, Invoices, and Shipments. Customer moves: all 847 rows must be updated individually.",
    with: "Address stored once in Customers table. Update one row — all orders, invoices, and shipments instantly reflect the change.",
    color: "0.72 0.19 40",
  },
  {
    id: "security",
    icon: <Lock className="w-5 h-5" />,
    title: "Security Features",
    without:
      "All application users share one database login with full access to all tables including salaries and personal data.",
    with: "Roles define access: HR reads salary table, warehouse staff read/write inventory only, customers can only read their own orders.",
    color: "0.65 0.19 40",
  },
  {
    id: "retrieval",
    icon: <Zap className="w-5 h-5" />,
    title: "Powerful Data Retrieval",
    without:
      "To find all orders over £100 placed by customers in London, you scan every CSV file line-by-line across three spreadsheets.",
    with: "One SQL query with JOINs and WHERE filters returns exactly the right rows in milliseconds, even across millions of records.",
    color: "0.58 0.22 195",
  },
  {
    id: "transactions",
    icon: <CheckCircle2 className="w-5 h-5" />,
    title: "Reliable Transactions",
    without:
      "Transfer fails mid-way: money debited from account A, but credit to account B never happens. £500 vanishes.",
    with: "ACID transaction: if the credit fails, the debit is automatically rolled back. Either both happen or neither does.",
    color: "0.52 0.18 282",
  },
  {
    id: "scalability",
    icon: <TrendingUp className="w-5 h-5" />,
    title: "Scalability",
    without:
      "100,000-row spreadsheet opens slowly, crashes on complex filters, can't handle two users editing simultaneously.",
    with: "Database handles millions of rows, concurrent users, and complex queries — with indexes, it stays fast at scale.",
    color: "0.72 0.19 40",
  },
  {
    id: "consistency",
    icon: <Globe className="w-5 h-5" />,
    title: "Data Consistency",
    without:
      "Product price updated in the web store but not in the mobile app's cache — customers see different prices.",
    with: "Single source of truth: all systems read from the same database. Price updates are immediately visible everywhere.",
    color: "0.65 0.19 40",
  },
];

function BenefitCard({ benefit }: { benefit: (typeof BENEFITS)[0] }) {
  const [side, setSide] = useState<"with" | "without">("without");
  const isWith = side === "with";
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div
        className="flex items-center gap-2.5 px-4 py-3 border-b border-border"
        style={{ background: `oklch(${benefit.color} / 0.08)` }}
      >
        <span style={{ color: `oklch(${benefit.color})` }}>{benefit.icon}</span>
        <span className="text-sm font-semibold text-foreground">
          {benefit.title}
        </span>
      </div>
      <div className="bg-card p-4 space-y-3">
        <div className="flex rounded-lg overflow-hidden border border-border text-xs font-semibold">
          <button
            type="button"
            onClick={() => setSide("without")}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 transition-colors duration-150"
            style={{
              background: !isWith
                ? "oklch(0.65 0.19 22 / 0.12)"
                : "oklch(var(--muted) / 0.5)",
              color: !isWith
                ? "oklch(0.65 0.19 22)"
                : "oklch(var(--muted-foreground))",
            }}
            data-ocid={`benefit.without_tab.${benefit.id}`}
          >
            <XCircle className="w-3.5 h-3.5" />
            Without DB
          </button>
          <button
            type="button"
            onClick={() => setSide("with")}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 transition-colors duration-150"
            style={{
              background: isWith
                ? `oklch(${benefit.color} / 0.12)`
                : "oklch(var(--muted) / 0.5)",
              color: isWith
                ? `oklch(${benefit.color})`
                : "oklch(var(--muted-foreground))",
            }}
            data-ocid={`benefit.with_tab.${benefit.id}`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            With DB
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={side}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="text-xs leading-relaxed"
            style={{
              color: isWith
                ? `oklch(${benefit.color})`
                : "oklch(var(--muted-foreground))",
            }}
          >
            {isWith ? benefit.with : benefit.without}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

function BenefitsView() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground leading-relaxed">
        Toggle each card to compare the real-world impact of using a relational
        database vs not.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {BENEFITS.map((b) => (
          <BenefitCard key={b.id} benefit={b} />
        ))}
      </div>
    </div>
  );
}

// ─── A3.1.3 Limitations: Scenario Cards ───────────────────────────────────────

const LIMITATIONS = [
  {
    id: "rigid-schema",
    icon: <Layers className="w-5 h-5" />,
    title: "Rigid Schema",
    color: "0.65 0.19 22",
    scenario:
      "An e-commerce startup adds a new product attribute (colour variants) 2 years after launch.",
    problem:
      "ALTER TABLE adds a new column to 4 million rows. The migration takes 45 minutes, locks the table, and the website goes offline.",
    alternative:
      "Document databases (MongoDB) store flexible JSON — new fields are added per-document with no migration needed.",
  },
  {
    id: "big-data",
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Big Data Scalability",
    color: "0.65 0.19 22",
    scenario:
      "Twitter stores 500 million tweets per day. Each tweet needs to be written in under 5ms at peak load.",
    problem:
      "Traditional RDBMS struggle to distribute writes across servers. A single-server relational DB maxes out at ~100k writes/second.",
    alternative:
      "NoSQL databases (Cassandra) distribute writes across hundreds of nodes, handling millions of writes per second.",
  },
  {
    id: "hierarchical",
    icon: <TreePine className="w-5 h-5" />,
    title: "Hierarchical Data",
    color: "0.65 0.19 22",
    scenario:
      "A file system stores folders inside folders, 10 levels deep. Find all files under /documents/2024/.",
    problem:
      "Querying a tree in SQL requires recursive CTEs or multiple self-joins — complex code, slow performance on deep hierarchies.",
    alternative:
      "Graph databases (Neo4j) or document stores traverse hierarchical structures naturally in a single query.",
  },
  {
    id: "oop-mismatch",
    icon: <Binary className="w-5 h-5" />,
    title: "Object-Relational Impedance Mismatch",
    color: "0.65 0.19 22",
    scenario:
      "A Python application uses an Order object with a list of OrderItem objects as an attribute.",
    problem:
      "Flat relational tables don't store nested objects. You need 2 tables + JOINs + an ORM to reconstruct the Python object from the DB.",
    alternative:
      "Document databases store the entire order (including items) as one JSON document — reads in a single operation.",
  },
  {
    id: "unstructured",
    icon: <FileQuestion className="w-5 h-5" />,
    title: "Unstructured Data",
    color: "0.65 0.19 22",
    scenario:
      "A healthcare system stores patient medical notes as free-text documents, images, PDFs, and audio recordings.",
    problem:
      "Relational databases store BLOBs but cannot search inside images or understand document semantics — TEXT columns are slow to search.",
    alternative:
      "Object storage (S3) + search engines (Elasticsearch) handle unstructured content with full-text and semantic search.",
  },
  {
    id: "design-complexity",
    icon: <AlertTriangle className="w-5 h-5" />,
    title: "Design Complexity",
    color: "0.65 0.19 22",
    scenario:
      "A hospital management system needs to model patients, doctors, appointments, wards, medications, and billing.",
    problem:
      "Designing a normalised 3NF schema requires weeks of ER modelling, stakeholder interviews, and careful dependency analysis before any data is stored.",
    alternative:
      "For rapid prototypes, a spreadsheet or JSON file is simpler to start with — schema design pays off at scale, not at MVP stage.",
  },
];

function LimitationCard({
  limitation,
}: { limitation: (typeof LIMITATIONS)[0] }) {
  const [tab, setTab] = useState<"problem" | "alternative">("problem");
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div
        className="flex items-center gap-2.5 px-4 py-3 border-b border-border"
        style={{ background: "oklch(0.65 0.19 22 / 0.07)" }}
      >
        <span style={{ color: "oklch(0.65 0.19 22)" }}>{limitation.icon}</span>
        <span className="text-sm font-semibold text-foreground">
          {limitation.title}
        </span>
      </div>
      <div className="bg-card p-4 space-y-3">
        <p
          className="text-xs text-muted-foreground leading-relaxed italic border-l-2 pl-3"
          style={{ borderColor: "oklch(0.65 0.19 22 / 0.4)" }}
        >
          Scenario: {limitation.scenario}
        </p>
        <div className="flex rounded-lg overflow-hidden border border-border text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTab("problem")}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 transition-colors duration-150"
            style={{
              background:
                tab === "problem"
                  ? "oklch(0.65 0.19 22 / 0.12)"
                  : "oklch(var(--muted) / 0.5)",
              color:
                tab === "problem"
                  ? "oklch(0.65 0.19 22)"
                  : "oklch(var(--muted-foreground))",
            }}
            data-ocid={`limitation.problem_tab.${limitation.id}`}
          >
            <XCircle className="w-3.5 h-3.5" />
            The Problem
          </button>
          <button
            type="button"
            onClick={() => setTab("alternative")}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 transition-colors duration-150"
            style={{
              background:
                tab === "alternative"
                  ? "oklch(0.58 0.22 195 / 0.12)"
                  : "oklch(var(--muted) / 0.5)",
              color:
                tab === "alternative"
                  ? "oklch(0.58 0.22 195)"
                  : "oklch(var(--muted-foreground))",
            }}
            data-ocid={`limitation.alternative_tab.${limitation.id}`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Alternative
          </button>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={tab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="text-xs leading-relaxed"
            style={{
              color:
                tab === "problem"
                  ? "oklch(0.65 0.19 22)"
                  : "oklch(0.58 0.22 195)",
            }}
          >
            {tab === "problem" ? limitation.problem : limitation.alternative}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

function LimitationsView() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground leading-relaxed">
        Each card shows a real scenario where a relational database struggles.
        Toggle to see the problem vs. the better alternative.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {LIMITATIONS.map((l) => (
          <LimitationCard key={l.id} limitation={l} />
        ))}
      </div>
    </div>
  );
}

// ─── A3.1.4 Real-World Scenarios ──────────────────────────────────────────────

const DOMAINS = [
  {
    id: "library",
    label: "📚 Library",
    description: "A public library tracking books, members, and loans.",
    tables: [
      { name: "books", pk: "book_id", notes: "One row per physical book" },
      { name: "authors", pk: "author_id", notes: "Avoids name duplication" },
      { name: "members", pk: "member_id", notes: "Registered library members" },
      {
        name: "loans",
        pk: "(member_id, book_id, date)",
        notes: "Composite key",
      },
    ],
    features: [
      {
        feature: "Primary Keys",
        example: "book_id uniquely identifies each book",
        icon: <Key className="w-3.5 h-3.5" />,
      },
      {
        feature: "Foreign Keys",
        example: "loans.member_id → members.member_id",
        icon: <Link2 className="w-3.5 h-3.5" />,
      },
      {
        feature: "Composite Keys",
        example: "(member_id, book_id, date) as PK of loans",
        icon: <Layers className="w-3.5 h-3.5" />,
      },
      {
        feature: "Reduced Redundancy",
        example: "Author name stored once, not per book copy",
        icon: <RefreshCw className="w-3.5 h-3.5" />,
      },
      {
        feature: "Relationships",
        example: "One author → many books (1:N)",
        icon: <Database className="w-3.5 h-3.5" />,
      },
    ],
    color: "0.58 0.22 195",
  },
  {
    id: "hospital",
    label: "🏥 Hospital",
    description: "A hospital managing patients, doctors, and appointments.",
    tables: [
      {
        name: "patients",
        pk: "patient_id",
        notes: "NHS number as natural key",
      },
      { name: "doctors", pk: "doctor_id", notes: "GMC number reference" },
      {
        name: "appointments",
        pk: "appointment_id",
        notes: "Links patient + doctor",
      },
      { name: "wards", pk: "ward_id", notes: "Hospital location data" },
    ],
    features: [
      {
        feature: "Data Integrity",
        example: "Cannot book appointment for non-existent patient",
        icon: <ShieldCheck className="w-3.5 h-3.5" />,
      },
      {
        feature: "Security Features",
        example:
          "Nurses can't access billing; receptionists can't see diagnoses",
        icon: <Lock className="w-3.5 h-3.5" />,
      },
      {
        feature: "Concurrency Control",
        example: "Two doctors can't be assigned the same appointment slot",
        icon: <Users className="w-3.5 h-3.5" />,
      },
      {
        feature: "Transactions",
        example:
          "Admit patient: update bed, create admission, log activity atomically",
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      },
      {
        feature: "Foreign Keys",
        example: "appointments.doctor_id → doctors.doctor_id",
        icon: <Link2 className="w-3.5 h-3.5" />,
      },
    ],
    color: "0.52 0.18 282",
  },
  {
    id: "ecommerce",
    label: "🛒 E-Commerce",
    description: "An online shop managing products, orders, and customers.",
    tables: [
      { name: "customers", pk: "customer_id", notes: "Registered shoppers" },
      { name: "products", pk: "product_id", notes: "Catalogue items" },
      { name: "orders", pk: "order_id", notes: "Placed orders" },
      {
        name: "order_items",
        pk: "(order_id, product_id)",
        notes: "Composite PK junction",
      },
    ],
    features: [
      {
        feature: "Scalability",
        example: "Millions of products, billions of order history rows",
        icon: <TrendingUp className="w-3.5 h-3.5" />,
      },
      {
        feature: "Reliable Transactions",
        example:
          "Payment + stock deduction + order creation all commit together",
        icon: <Zap className="w-3.5 h-3.5" />,
      },
      {
        feature: "Composite Keys",
        example: "(order_id, product_id) as PK of order_items",
        icon: <Layers className="w-3.5 h-3.5" />,
      },
      {
        feature: "Data Consistency",
        example: "Product price is one value — all baskets see the same price",
        icon: <Globe className="w-3.5 h-3.5" />,
      },
      {
        feature: "Data Retrieval",
        example: "'Find all customers who bought X and also Y' — one SQL query",
        icon: <Database className="w-3.5 h-3.5" />,
      },
    ],
    color: "0.72 0.19 40",
  },
  {
    id: "school",
    label: "🏫 School",
    description: "A school system managing students, teachers, and classes.",
    tables: [
      {
        name: "students",
        pk: "student_id",
        notes: "Year group + personal data",
      },
      { name: "teachers", pk: "teacher_id", notes: "Subject specialisms" },
      { name: "classes", pk: "class_id", notes: "Subject + year group" },
      {
        name: "enrollments",
        pk: "(student_id, class_id)",
        notes: "Junction table",
      },
    ],
    features: [
      {
        feature: "Relationships",
        example: "Students enrolled in many classes (M:N via enrollments)",
        icon: <Database className="w-3.5 h-3.5" />,
      },
      {
        feature: "Primary Keys",
        example: "student_id uniquely identifies each student",
        icon: <Key className="w-3.5 h-3.5" />,
      },
      {
        feature: "Reduced Redundancy",
        example:
          "Teacher stored once — not repeated for every class they teach",
        icon: <RefreshCw className="w-3.5 h-3.5" />,
      },
      {
        feature: "Security Features",
        example: "Students can only see their own grades",
        icon: <Lock className="w-3.5 h-3.5" />,
      },
      {
        feature: "Concurrency Control",
        example:
          "Multiple staff recording marks simultaneously without conflict",
        icon: <Users className="w-3.5 h-3.5" />,
      },
    ],
    color: "0.65 0.19 40",
  },
];

function ScenariosView() {
  const [selected, setSelected] = useState(DOMAINS[0].id);
  const domain = DOMAINS.find((d) => d.id === selected) ?? DOMAINS[0];

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground leading-relaxed">
        Select a domain to see which database features are used in that
        real-world system.
      </p>

      {/* Domain selector */}
      <div className="flex flex-wrap gap-2">
        {DOMAINS.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setSelected(d.id)}
            data-ocid={`scenarios.domain_tab.${d.id}`}
            className="px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 border"
            style={{
              background:
                selected === d.id
                  ? `oklch(${d.color} / 0.12)`
                  : "oklch(var(--muted) / 0.5)",
              borderColor:
                selected === d.id ? `oklch(${d.color} / 0.4)` : "transparent",
              color:
                selected === d.id
                  ? `oklch(${d.color})`
                  : "oklch(var(--muted-foreground))",
            }}
          >
            {d.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={domain.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          <p className="text-sm text-muted-foreground">{domain.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tables panel */}
            <div className="rounded-xl border border-border overflow-hidden">
              <div
                className="px-4 py-2.5 border-b border-border text-xs font-semibold"
                style={{
                  background: `oklch(${domain.color} / 0.08)`,
                  color: `oklch(${domain.color})`,
                }}
              >
                Database Tables
              </div>
              <div className="bg-card">
                {domain.tables.map((t, i) => (
                  <div
                    key={t.name}
                    className="flex items-start gap-3 px-4 py-3 border-b border-border/40 last:border-0"
                  >
                    <span
                      className="mt-0.5 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                      style={{
                        background: `oklch(${domain.color} / 0.15)`,
                        color: `oklch(${domain.color})`,
                      }}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <span className="font-mono text-xs font-semibold text-foreground">
                        {t.name}
                      </span>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        PK: <code className="font-mono">{t.pk}</code> —{" "}
                        {t.notes}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features panel */}
            <div className="rounded-xl border border-border overflow-hidden">
              <div
                className="px-4 py-2.5 border-b border-border text-xs font-semibold"
                style={{
                  background: `oklch(${domain.color} / 0.08)`,
                  color: `oklch(${domain.color})`,
                }}
              >
                Key DB Features Used
              </div>
              <div className="bg-card">
                {domain.features.map((f) => (
                  <div
                    key={f.feature}
                    className="flex items-start gap-3 px-4 py-3 border-b border-border/40 last:border-0"
                  >
                    <span
                      className="mt-0.5 flex-shrink-0"
                      style={{ color: `oklch(${domain.color})` }}
                    >
                      {f.icon}
                    </span>
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-foreground">
                        {f.feature}
                      </span>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        {f.example}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────

export function RelationalDiagram({ variant }: RelationalDiagramProps) {
  const VARIANT_LABELS: Record<DiagramVariant, string> = {
    features: "Interactive Table Diagram",
    benefits: "Benefits Comparison",
    limitations: "Limitation Scenarios",
    scenarios: "Real-World Applications",
  };

  return (
    <div data-ocid={`relational_diagram.${variant}`}>
      <p
        className="text-xs font-semibold uppercase tracking-wider mb-4"
        style={{ color: "oklch(var(--db-sql))" }}
      >
        {VARIANT_LABELS[variant]}
      </p>
      {variant === "features" && <FeaturesView />}
      {variant === "benefits" && <BenefitsView />}
      {variant === "limitations" && <LimitationsView />}
      {variant === "scenarios" && <ScenariosView />}
    </div>
  );
}
