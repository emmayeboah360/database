// A3 Databases — IB Computer Science course types and static data

export type DbLevelFilter = "all" | "sl" | "hl";

export interface DbLesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  duration: string; // e.g. "30 min"
  order: number;
  isHL: boolean;
  sqlChallenge?: boolean;
  erdSchema?: boolean;
  normalizationExercise?: boolean;
}

export interface DbModule {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  order: number;
  isHL: boolean; // true if the module itself is HL-only
  color: "primary" | "secondary" | "accent" | "db-hl";
  lessons: DbLesson[];
}

export interface DbProgress {
  completedLessonIds: string[];
}

export const DATABASE_MODULES: DbModule[] = [
  {
    id: "db-mod-1",
    title: "Database Fundamentals",
    subtitle: "A3.1 — Standard Level",
    description:
      "Understand what relational databases are, why they matter, and their core structural features.",
    order: 1,
    isHL: false,
    color: "primary",
    lessons: [
      {
        id: "db-1-1",
        moduleId: "db-mod-1",
        title: "What Is a Relational Database?",
        description:
          "Features, benefits, and limitations of relational databases — community support, ACID, scalability, and the big-data ceiling.",
        duration: "25 min",
        order: 1,
        isHL: false,
        erdSchema: false,
        sqlChallenge: false,
        normalizationExercise: false,
      },
      {
        id: "db-1-2",
        moduleId: "db-mod-1",
        title: "Keys & Relationships",
        description:
          "Primary keys, foreign keys, composite keys, concatenated keys — and how they tie tables together.",
        duration: "30 min",
        order: 2,
        isHL: false,
        erdSchema: true,
        sqlChallenge: false,
        normalizationExercise: false,
      },
    ],
  },
  {
    id: "db-mod-2",
    title: "Database Design",
    subtitle: "A3.2 — Standard Level + HL",
    description:
      "Design professional databases using schemas, ERDs, data types, and normal forms up to 3NF.",
    order: 2,
    isHL: false,
    color: "secondary",
    lessons: [
      {
        id: "db-2-1",
        moduleId: "db-mod-2",
        title: "Database Schemas",
        description:
          "Conceptual, logical, and physical schemas — how data structure is defined at each abstraction level.",
        duration: "20 min",
        order: 1,
        isHL: false,
        erdSchema: false,
        sqlChallenge: false,
        normalizationExercise: false,
      },
      {
        id: "db-2-2",
        moduleId: "db-mod-2",
        title: "Entity Relationship Diagrams",
        description:
          "Construct ERDs with entities, attributes, relationships, cardinality, and modality.",
        duration: "40 min",
        order: 2,
        isHL: false,
        erdSchema: true,
        sqlChallenge: false,
        normalizationExercise: false,
      },
      {
        id: "db-2-3",
        moduleId: "db-mod-2",
        title: "Data Types in Relational Databases",
        description:
          "Choosing correct data types, consistency, and the effects of wrong type selection.",
        duration: "20 min",
        order: 3,
        isHL: false,
        erdSchema: false,
        sqlChallenge: false,
        normalizationExercise: false,
      },
      {
        id: "db-2-4",
        moduleId: "db-mod-2",
        title: "Constructing Relational Tables",
        description:
          "Build well-defined tables with primary, foreign, composite, and concatenated keys.",
        duration: "35 min",
        order: 4,
        isHL: false,
        erdSchema: true,
        sqlChallenge: true,
        normalizationExercise: false,
      },
      {
        id: "db-2-5",
        moduleId: "db-mod-2",
        title: "Normal Forms (1NF, 2NF, 3NF)",
        description:
          "Atomicity, functional dependencies, partial-key and transitive dependencies — normalise step by step.",
        duration: "45 min",
        order: 5,
        isHL: false,
        erdSchema: false,
        sqlChallenge: false,
        normalizationExercise: true,
      },
      {
        id: "db-2-6",
        moduleId: "db-mod-2",
        title: "Normalising Real-World Scenarios to 3NF",
        description:
          "Library, hospital, e-commerce, school, and police reporting systems — practise normalisation end-to-end.",
        duration: "60 min",
        order: 6,
        isHL: false,
        erdSchema: true,
        sqlChallenge: false,
        normalizationExercise: true,
      },
      {
        id: "db-2-7",
        moduleId: "db-mod-2",
        title: "Denormalization (HL)",
        description:
          "When to break the rules — performance gains from denormalisation in read-heavy applications and the trade-offs.",
        duration: "30 min",
        order: 7,
        isHL: true,
        erdSchema: false,
        sqlChallenge: false,
        normalizationExercise: true,
      },
    ],
  },
  {
    id: "db-mod-3",
    title: "Database Programming (SQL)",
    subtitle: "A3.3 — Standard Level + HL",
    description:
      "Write real SQL — DDL, DML, JOINs, aggregates, views, and transactions.",
    order: 3,
    isHL: false,
    color: "accent",
    lessons: [
      {
        id: "db-3-1",
        moduleId: "db-mod-3",
        title: "DDL vs DML",
        description:
          "Data Definition Language (CREATE, ALTER, DROP) vs Data Manipulation Language (SELECT, INSERT, UPDATE, DELETE).",
        duration: "20 min",
        order: 1,
        isHL: false,
        erdSchema: false,
        sqlChallenge: true,
        normalizationExercise: false,
      },
      {
        id: "db-3-2",
        moduleId: "db-mod-3",
        title: "SQL Queries Across Two Tables",
        description:
          "JOINs, WHERE, BETWEEN, ORDER BY, GROUP BY, HAVING, LIKE, AND/OR/NOT — with live practice.",
        duration: "50 min",
        order: 2,
        isHL: false,
        erdSchema: false,
        sqlChallenge: true,
        normalizationExercise: false,
      },
      {
        id: "db-3-3",
        moduleId: "db-mod-3",
        title: "Updating Data with SQL",
        description:
          "INSERT INTO, UPDATE SET, DELETE — and performance implications of updating indexed columns.",
        duration: "25 min",
        order: 3,
        isHL: false,
        erdSchema: false,
        sqlChallenge: true,
        normalizationExercise: false,
      },
      {
        id: "db-3-4",
        moduleId: "db-mod-3",
        title: "Aggregate Functions (HL)",
        description:
          "AVG, COUNT, MAX, MIN, SUM — calculate totals, averages, and summaries in SQL.",
        duration: "30 min",
        order: 4,
        isHL: true,
        erdSchema: false,
        sqlChallenge: true,
        normalizationExercise: false,
      },
      {
        id: "db-3-5",
        moduleId: "db-mod-3",
        title: "Database Views (HL)",
        description:
          "Virtual views vs materialized snapshots — benefits for security, performance, and complexity hiding.",
        duration: "25 min",
        order: 5,
        isHL: true,
        erdSchema: false,
        sqlChallenge: true,
        normalizationExercise: false,
      },
      {
        id: "db-3-6",
        moduleId: "db-mod-3",
        title: "Transactions & ACID (HL)",
        description:
          "ACID properties, TCL commands — BEGIN TRANSACTION, COMMIT, ROLLBACK — and how they protect data.",
        duration: "35 min",
        order: 6,
        isHL: true,
        erdSchema: false,
        sqlChallenge: true,
        normalizationExercise: false,
      },
    ],
  },
  {
    id: "db-mod-4",
    title: "Alternative Databases & Data Warehouses",
    subtitle: "A3.4 — Higher Level Only",
    description:
      "Beyond relational — NoSQL, cloud, spatial, in-memory, OLAP, data mining, and distributed systems.",
    order: 4,
    isHL: true,
    color: "db-hl",
    lessons: [
      {
        id: "db-4-1",
        moduleId: "db-mod-4",
        title: "Alternative Database Models (HL)",
        description:
          "NoSQL, cloud, spatial, and in-memory databases — with real-world examples from e-commerce to GIS.",
        duration: "35 min",
        order: 1,
        isHL: true,
        erdSchema: false,
        sqlChallenge: false,
        normalizationExercise: false,
      },
      {
        id: "db-4-2",
        moduleId: "db-mod-4",
        title: "Data Warehouses (HL)",
        description:
          "Append-only, subject-oriented, integrated, time-variant data stores optimised for analytics.",
        duration: "30 min",
        order: 2,
        isHL: true,
        erdSchema: false,
        sqlChallenge: false,
        normalizationExercise: false,
      },
      {
        id: "db-4-3",
        moduleId: "db-mod-4",
        title: "OLAP & Data Mining (HL)",
        description:
          "Online analytical processing and data mining techniques — classification, clustering, regression, anomaly detection.",
        duration: "35 min",
        order: 3,
        isHL: true,
        erdSchema: false,
        sqlChallenge: false,
        normalizationExercise: false,
      },
      {
        id: "db-4-4",
        moduleId: "db-mod-4",
        title: "Distributed Databases (HL)",
        description:
          "Concurrency control, replication, partitioning, fault tolerance, and ACID in distributed environments.",
        duration: "40 min",
        order: 4,
        isHL: true,
        erdSchema: false,
        sqlChallenge: false,
        normalizationExercise: false,
      },
    ],
  },
];

// Flatten all lessons across all modules
export const ALL_DB_LESSONS: DbLesson[] = DATABASE_MODULES.flatMap(
  (m) => m.lessons,
);

export const TOTAL_DB_LESSONS = ALL_DB_LESSONS.length;
export const TOTAL_DB_HL_LESSONS = ALL_DB_LESSONS.filter((l) => l.isHL).length;
export const TOTAL_DB_SL_LESSONS = TOTAL_DB_LESSONS - TOTAL_DB_HL_LESSONS;

// Sum of durations as minutes (parse "N min")
export function parseDurationMinutes(duration: string): number {
  const match = /^(\d+)/.exec(duration);
  return match ? Number.parseInt(match[1], 10) : 0;
}

export function totalDbHours(): number {
  const totalMin = ALL_DB_LESSONS.reduce(
    (s, l) => s + parseDurationMinutes(l.duration),
    0,
  );
  return Math.round(totalMin / 60);
}

export function getDbProgress(): string[] {
  try {
    const raw = localStorage.getItem("db-progress");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) return parsed as string[];
    return [];
  } catch {
    return [];
  }
}

export function setDbProgress(completedIds: string[]): void {
  localStorage.setItem("db-progress", JSON.stringify(completedIds));
}
