import type { Difficulty, QuizQuestion } from "./course";

// ─── Database (A3) course types ───────────────────────────────────────────────

/** Helper to get the HL badge display text */
export function getHLBadgeLabel(isHL: boolean | undefined): "HL" | null {
  return isHL ? "HL" : null;
}
export interface DbSqlChallenge {
  db: "library" | "ecommerce" | "hospital" | "school";
  initialSql: string;
  description?: string;
  hints?: string[];
}

export interface DbErdSchema {
  schemaId: "library" | "ecommerce" | "hospital" | "school";
  highlightEntities?: string[];
}

export interface DbNormalizationExercise {
  exerciseId: string;
  scenario?: string;
  targetNF?: "1NF" | "2NF" | "3NF";
}

export type DiagramVariant =
  | "features"
  | "benefits"
  | "limitations"
  | "scenarios";

export interface DbLesson {
  id: string;
  moduleId: string;
  title: string;
  duration: number;
  difficulty: Difficulty;
  content: string;
  quiz: QuizQuestion[];
  sqlChallenge?: DbSqlChallenge;
  erdSchema?: DbErdSchema;
  normalizationExercise?: DbNormalizationExercise;
  interactiveType?: DiagramVariant;
  /** Show interactive SchemaLayerDiagram component for this lesson */
  schemaLayerDiagram?: boolean;
  /** Show interactive DataTypeExercise component for this lesson */
  dataTypeExercise?: boolean;
  /** Renders the DbTypeComparison interactive component */
  dbTypeComparison?: true;
  /** Renders the DataMiningMatcher interactive component */
  dataMiningMatcher?: true;
  /** Renders the DistributedDiagram interactive component */
  distributedDiagram?: true;
  /** Renders SqlClassifier interactive component */
  sqlClassifier?: true;
  /** Renders AcidExplainer interactive component */
  acidExplainer?: true;
  isHL?: boolean;
  order: number;
}

export interface DbModuleData {
  id: string;
  title: string;
  description: string;
  order: number;
  isHL?: boolean;
}

export interface DbModuleWithLessons {
  module: DbModuleData;
  lessons: DbLesson[];
}

export const DATABASE_MODULES: DbModuleWithLessons[] = [
  // ── A3.1 Database Fundamentals ──────────────────────────────────────────────
  {
    module: {
      id: "db-mod-1",
      title: "A3.1 Database Fundamentals",
      description: "Features, benefits and limitations of relational databases",
      order: 1,
    },
    lessons: [
      {
        id: "db-1-1",
        moduleId: "db-mod-1",
        title: "A3.1.1 Relational Database Features",
        duration: 20,
        interactiveType: "features" as const,
        difficulty: "Beginner",
        order: 1,
        content: `# Relational Database Features

A **relational database** organises data into tables (relations) with rows and columns. Relationships between tables are defined through keys.

## Core Features

**Tables** — Data is stored in structured tables. Each table represents one entity type (e.g. Students, Courses).

**Primary Keys** — A primary key uniquely identifies each row in a table. No two rows can share the same primary key value, and it cannot be NULL.

**Foreign Keys** — A foreign key in one table references the primary key of another table, creating a link between them.

**Composite Keys** — A primary key made up of two or more columns combined. Used when no single column alone uniquely identifies a row.

**Relationships** — Tables relate to each other through keys. Common types: one-to-one, one-to-many, many-to-many.

## Benefits

- **Data integrity** — Constraints (primary/foreign keys) ensure data remains accurate and valid
- **Reduced redundancy** — Data is stored once and referenced, not duplicated across tables
- **Concurrency control** — Multiple users can safely read and write data simultaneously
- **Security features** — Fine-grained access control per table, row, or column
- **Scalability** — Can grow from thousands to millions of records
- **Reliable transaction processing** — ACID guarantees keep data consistent
- **Data consistency** — All copies of data stay synchronised
- **Data retrieval** — Powerful SQL queries for flexible, efficient data access

## Limitations

- **Rigid schema** — Table structure must be defined upfront; changes are complex and costly in production
- **Design complexity** — Normalised schemas require careful upfront planning
- **Hierarchical data handling** — Tree-like structures (e.g. nested categories) are awkward to model
- **Big data scalability issues** — Traditional RDBMS struggle with petabyte-scale datasets
- **Object-relational impedance mismatch** — OOP objects don't map cleanly to flat tables
- **Unstructured data handling** — Text documents, images, JSON don't fit naturally into rows and columns`,
        quiz: [
          {
            id: "dbq-1-1-1",
            question:
              "What is the purpose of a primary key in a relational database table?",
            options: [
              "To link two tables together using a reference",
              "To uniquely identify each row in the table",
              "To store the most important data in the record",
              "To sort the rows in ascending order automatically",
            ],
            correctIndex: 1,
            explanation:
              "A primary key uniquely identifies each row in a table. It must be unique across all rows and cannot be NULL. It serves as the reference point for foreign keys in related tables.",
          },
          {
            id: "dbq-1-1-2",
            question:
              "Which of the following is a limitation of relational databases?",
            options: [
              "Strong data integrity guarantees",
              "Support for ACID transactions",
              "Rigid schema that is costly and complex to change",
              "Built-in concurrency control mechanisms",
            ],
            correctIndex: 2,
            explanation:
              "The rigid schema is a key limitation — the table structure must be defined upfront, and schema changes (adding columns, splitting tables) can be complex and expensive in live production systems.",
          },
          {
            id: "dbq-1-1-3",
            question: "A composite key is:",
            options: [
              "A foreign key that references another table",
              "A key made of two or more columns that together uniquely identify a row",
              "A key automatically generated by the database engine",
              "A key used only in NoSQL databases",
            ],
            correctIndex: 1,
            explanation:
              "A composite key uses two or more columns in combination to form a unique identifier. For example, in an Enrollment table, (StudentID, CourseID) together form the composite primary key — neither column alone is unique.",
          },
        ],
        erdSchema: {
          schemaId: "school",
          highlightEntities: ["student", "course"],
        },
      },
      {
        id: "db-1-2",
        moduleId: "db-mod-1",
        title: "A3.1.2 Benefits of Relational Databases",
        duration: 25,
        interactiveType: "benefits" as const,
        difficulty: "Beginner",
        order: 2,
        content: `# Keys and Relationships

Keys are the backbone of relational databases. They enforce uniqueness, link tables together, and maintain data integrity.

## Primary Keys

A **primary key** is a column (or set of columns) that uniquely identifies each row in a table.

- Must be **unique** — no two rows share the same primary key value
- Must be **NOT NULL** — every row must have an identifier
- Usually a single auto-incrementing integer (e.g. \`student_id INT AUTO_INCREMENT\`)

\`\`\`sql
CREATE TABLE students (
  student_id INT PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(100) NOT NULL,
  grade      INT
);
\`\`\`

## Foreign Keys

A **foreign key** is a column in one table that references the primary key of another table. It creates a link between two tables and enforces **referential integrity**.

\`\`\`sql
CREATE TABLE enrollments (
  enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
  student_id    INT NOT NULL,
  course_id     INT NOT NULL,
  enroll_date   DATE,
  FOREIGN KEY (student_id) REFERENCES students(student_id),
  FOREIGN KEY (course_id)  REFERENCES courses(course_id)
);
\`\`\`

## Composite Keys

When no single column uniquely identifies a row, two or more columns are combined to form a **composite primary key**.

\`\`\`sql
CREATE TABLE student_courses (
  student_id INT,
  course_id  INT,
  PRIMARY KEY (student_id, course_id)
);
\`\`\`

## How Keys Create Relationships

| Relationship | Implementation |
|---|---|
| One-to-one | Foreign key in either table |
| One-to-many | Foreign key on the "many" side |
| Many-to-many | Junction table with composite/concatenated key |`,
        quiz: [
          {
            id: "dbq-1-2-1",
            question: "What is the purpose of a foreign key?",
            options: [
              "To uniquely identify each row in its own table",
              "To link a row in one table to a row in another table via a primary key reference",
              "To sort the rows in ascending order automatically",
              "To prevent any NULL values in the table",
            ],
            correctIndex: 1,
            explanation:
              "A foreign key creates a relationship between two tables by referencing the primary key of another table. This enforces referential integrity — you cannot add a row with a foreign key value that doesn't exist in the referenced table.",
          },
          {
            id: "dbq-1-2-2",
            question:
              "In an Enrollments table, (student_id, course_id) is used as the primary key. This is called a:",
            options: [
              "Foreign key",
              "Natural key",
              "Composite key",
              "Surrogate key",
            ],
            correctIndex: 2,
            explanation:
              "A composite key uses two or more columns together to form a unique identifier. Neither student_id nor course_id alone is unique in an Enrollments table, but the combination uniquely identifies each enrollment record.",
          },
          {
            id: "dbq-1-2-3",
            question: "Which constraint does a foreign key enforce?",
            options: [
              "Uniqueness — the foreign key value must be unique within the table",
              "Referential integrity — the referenced primary key record must exist",
              "Non-null — the foreign key column cannot contain NULL",
              "Atomicity — the value must be a single indivisible unit",
            ],
            correctIndex: 1,
            explanation:
              "Referential integrity means a foreign key value must correspond to an existing primary key in the parent table. If you try to insert a loan for a member who doesn't exist, the database rejects it — preventing orphaned records.",
          },
          {
            id: "dbq-1-2-4",
            question:
              "How is a many-to-many (M:N) relationship between Students and Courses implemented?",
            options: [
              "By adding a foreign key column directly into the Students table",
              "By adding a foreign key column directly into the Courses table",
              "By creating a junction table (e.g. Enrollments) with foreign keys to both tables",
              "By combining Students and Courses into one large table",
            ],
            correctIndex: 2,
            explanation:
              "M:N relationships require a junction (linking) table that contains foreign keys to both related tables. For Students-Courses, an Enrollments table with (student_id, course_id) as a composite/concatenated primary key implements the relationship cleanly.",
          },
        ],
        sqlChallenge: {
          db: "school",
          initialSql:
            "SELECT students.name, courses.name\nFROM students\nJOIN enrollments ON students.id = enrollments.student_id\nJOIN courses ON enrollments.course_id = courses.id\nWHERE students.grade = 10;",
          description:
            "Explore primary and foreign key relationships in the school database",
          hints: [
            "Try changing the WHERE grade to other values",
            "Add ORDER BY students.name",
          ],
        },
        erdSchema: {
          schemaId: "school",
          highlightEntities: ["student", "course", "enrollment"],
        },
      },

      {
        id: "db-1-3",
        moduleId: "db-mod-1",
        title: "A3.1.3 Limitations of Relational Databases",
        duration: 20,
        difficulty: "Beginner",
        order: 3,
        interactiveType: "limitations" as const,
        content: [
          "# Limitations of Relational Databases",
          "",
          "Relational databases are powerful, but they are not the right tool for every problem. Understanding their limitations helps you choose the correct technology.",
          "",
          "## Rigid Schema",
          "",
          "The table structure must be **defined upfront**. Adding a column to a table with millions of rows requires an ALTER TABLE migration. This can take hours and lock the table, causing downtime.",
          "",
          "## Design Complexity",
          "",
          "Good relational design requires careful **normalisation**, entity-relationship modelling, and understanding of dependencies.",
          "",
          "## Hierarchical Data Handling",
          "",
          "Tree-like structures (category hierarchies, org charts, file systems) are **awkward to query** in SQL. Recursive CTEs are complex; self-joins on deep trees are slow.",
          "",
          "## Big Data Scalability Issues",
          "",
          "Traditional RDBMS are designed for **vertical scaling** (bigger server). Distributing writes across many servers (horizontal scaling) is complex and limited.",
          "",
          "## Object-Relational Impedance Mismatch",
          "",
          "Object-oriented code uses **objects with nested attributes**. Flat relational tables do not match this model. An ORM is needed to translate between them.",
          "",
          "## Unstructured Data Handling",
          "",
          "**Unstructured data** such as text documents, images, video, PDFs, and sensor logs does not fit the tabular model.",
        ].join("\n"),
        quiz: [
          {
            id: "dbq-1-3-1",
            question:
              "Which limitation makes NoSQL a better choice for social media platforms with billions of users?",
            options: [
              "Rigid schema",
              "Design complexity",
              "Big data scalability issues",
              "Hierarchical data handling",
            ],
            correctIndex: 2,
            explanation:
              "At social media scale, the volume of writes far exceeds what a single-server RDBMS can handle. NoSQL databases like Cassandra distribute writes across hundreds of nodes.",
          },
          {
            id: "dbq-1-3-2",
            question:
              "An e-commerce site needs to add a colour-variants field to its 4-million-row Products table. Which limitation does this illustrate?",
            options: [
              "Unstructured data handling",
              "Rigid schema",
              "Object-relational impedance mismatch",
              "Concurrency control",
            ],
            correctIndex: 1,
            explanation:
              "Rigid schema means schema changes require ALTER TABLE migrations that touch every row. On large tables this can lock the table for minutes or hours.",
          },
          {
            id: "dbq-1-3-3",
            question:
              "Which limitation explains why querying a 10-level-deep folder hierarchy is difficult in SQL?",
            options: [
              "Big data scalability issues",
              "Unstructured data handling",
              "Hierarchical data handling",
              "Object-relational impedance mismatch",
            ],
            correctIndex: 2,
            explanation:
              "Hierarchical structures are not natively supported by flat relational tables. Querying variable-depth trees requires recursive CTEs or multiple self-joins, which are complex and perform poorly on deep hierarchies.",
          },
          {
            id: "dbq-1-3-4",
            question:
              "A Python Order object contains a list of OrderItem objects. Storing this in a relational database requires an ORM. Which limitation does this illustrate?",
            options: [
              "Rigid schema",
              "Unstructured data handling",
              "Object-relational impedance mismatch",
              "Design complexity",
            ],
            correctIndex: 2,
            explanation:
              "Object-relational impedance mismatch occurs because OOP objects do not map cleanly to flat relational tables. An ORM bridges the gap but adds translation overhead and complexity.",
          },
        ],
      },

      {
        id: "db-1-4",
        moduleId: "db-mod-1",
        title: "A3.1.4 Real-World Database Applications",
        duration: 20,
        difficulty: "Beginner",
        order: 4,
        interactiveType: "scenarios" as const,
        content: [
          "# Real-World Database Applications",
          "",
          "Relational databases power the core systems of modern organisations.",
          "",
          "## Library Management System",
          "",
          "- **Primary keys** — book_id uniquely identifies each book",
          "- **Foreign keys** — loans.member_id references members.member_id",
          "- **Composite keys** — (member_id, book_id, borrow_date) as the loans primary key",
          "- **Reduced redundancy** — author name stored once in an Authors table",
          "",
          "## Hospital Management System",
          "",
          "- **Data integrity** — cannot book an appointment for a non-existent patient",
          "- **Security features** — nurses see patient care data; billing staff see financial data only",
          "- **Concurrency control** — two receptionists cannot double-book the same slot",
          "",
          "## E-Commerce Platform",
          "",
          "- **Scalability** — millions of product listings, billions of historical order rows",
          "- **Reliable transactions** — payment, stock deduction, and order creation all commit together or all roll back",
          "",
          "## School Management System",
          "",
          "- **M:N relationships** — students enrol in many classes; classes have many students",
          "- **Reduced redundancy** — teacher data stored once, not repeated per class",
        ].join("\n"),
        quiz: [
          {
            id: "dbq-1-4-1",
            question:
              "In a library database, why is the author name stored in a separate Authors table rather than in the Books table?",
            options: [
              "Because author names are too long to fit in the Books table",
              "To reduce redundancy — one author writes many books, so storing the name once avoids repeating it per book",
              "Because primary keys must always be in a separate table",
              "To improve query speed by reducing the number of columns in Books",
            ],
            correctIndex: 1,
            explanation:
              "Storing author data once in an Authors table and referencing it by author_id in Books eliminates redundancy. If an author name changes, one row is updated, not dozens of book rows.",
          },
          {
            id: "dbq-1-4-2",
            question:
              "An e-commerce checkout deducts stock and creates an order. The payment gateway fails halfway through. Which database benefit ensures the stock is not permanently deducted?",
            options: [
              "Concurrency control",
              "Reliable transaction processing (ACID)",
              "Data retrieval",
              "Reduced redundancy",
            ],
            correctIndex: 1,
            explanation:
              "ACID transactions wrap all steps atomically. If the payment fails, the entire transaction rolls back and the stock deduction is undone automatically.",
          },
          {
            id: "dbq-1-4-3",
            question:
              "In a school database, what type of relationship exists between Students and Classes?",
            options: [
              "One-to-one — each student is in exactly one class",
              "One-to-many — one class can have many students but each student is in one class only",
              "Many-to-many — a student can be in many classes and a class can have many students",
              "Many-to-one — many students share a single record",
            ],
            correctIndex: 2,
            explanation:
              "Students-Classes is M:N. A student is enrolled in multiple classes and each class has many students. This is implemented with a junction table (Enrollments) with composite primary key (student_id, class_id).",
          },
        ],
      },
    ],
  },

  // ── A3.2 Database Design ─────────────────────────────────────────────────────
  {
    module: {
      id: "db-mod-2",
      title: "A3.2 Database Design",
      description: "Schemas, ERDs, data types, and normalisation to 3NF",
      order: 2,
    },
    lessons: [
      {
        id: "db-2-1",
        moduleId: "db-mod-2",
        title: "Database Schemas",
        duration: 15,
        difficulty: "Beginner",
        order: 1,
        schemaLayerDiagram: true,
        content: `# Database Schemas

A **schema** is the blueprint of a database — it defines its structure without containing any actual data. There are three levels of schema abstraction.

## Conceptual Schema

The **highest-level** view, independent of how data is physically stored. Describes *what* data exists and the relationships between entities. Typically expressed as an Entity-Relationship Diagram (ERD).

Example: "A Student enrols in many Courses. Each Course has one Lecturer."

## Logical Schema

A more detailed view that maps the conceptual model to specific database structures — tables, columns, data types, and constraints — but remains independent of any particular database system.

Example:
\`Students(StudentID INT PK, Name VARCHAR(100), DOB DATE)\`

## Physical Schema

The **lowest-level** view describing exactly how data is stored on disk — file organisation, indexes, partitions, storage formats.

Example: "The Students table uses a B-tree index on StudentID stored in 8KB page blocks."

## Why Multiple Schema Levels?

- **Data independence** — Changes to physical storage don't require changes to application code
- **Abstraction** — Different stakeholders see only what is relevant to them
- **Portability** — A logical schema can be implemented on any RDBMS`,
        quiz: [
          {
            id: "dbq-2-1-1",
            question:
              "Which schema level is most appropriate for communicating with business stakeholders?",
            options: [
              "Physical schema — describes disk storage and indexes",
              "Logical schema — defines tables, columns, and data types",
              "Conceptual schema — uses high-level entities and relationships",
              "Implementation schema — describes query execution plans",
            ],
            correctIndex: 2,
            explanation:
              "The conceptual schema uses high-level concepts (entities, relationships) without technical detail. Expressed as ERDs and natural language, it is ideal for communicating with non-technical stakeholders.",
          },
          {
            id: "dbq-2-1-2",
            question: "The physical schema is primarily concerned with:",
            options: [
              "Entities and their relationships at a high level",
              "Tables, columns, data types, and foreign key constraints",
              "How data is stored on disk — indexes, file formats, partitions",
              "User interface design and form layouts",
            ],
            correctIndex: 2,
            explanation:
              "The physical schema describes implementation details: file organisation, index structures (B-tree, hash), partitioning, and storage block sizes. It is specific to the DBMS being used.",
          },
        ],
      },
      {
        id: "db-2-2",
        moduleId: "db-mod-2",
        title: "Entity-Relationship Diagrams (ERDs)",
        duration: 25,
        difficulty: "Beginner",
        order: 2,
        content: `# Entity-Relationship Diagrams

An ERD is a visual representation of the entities in a database and the relationships between them. ERDs form the foundation of database design.

## Entities

An **entity** represents a real-world object or concept with data stored about it. Examples: Student, Course, Employee, Product.

## Attributes

**Attributes** are properties of an entity — they become columns in tables.

## Relationships

**Cardinality** — How many instances of one entity relate to instances of another:

- **One-to-one (1:1)** — One person has one passport
- **One-to-many (1:N)** — One teacher teaches many students
- **Many-to-many (M:N)** — Students enrol in many courses; courses have many students

**Modality** — Whether participation in a relationship is mandatory or optional:

- **Mandatory** — Every instance must participate in the relationship
- **Optional** — Participation is not required`,
        quiz: [
          {
            id: "dbq-2-2-1",
            question: "In an ERD, what does 'cardinality' describe?",
            options: [
              "Whether an attribute is mandatory or optional",
              "The numerical relationship — how many instances of one entity relate to instances of another",
              "The data type of an attribute",
              "The total number of tables in the database",
            ],
            correctIndex: 1,
            explanation:
              "Cardinality defines the numerical relationship between entity occurrences — how many instances exist on each side of a relationship. The three types are one-to-one (1:1), one-to-many (1:N), and many-to-many (M:N).",
          },
          {
            id: "dbq-2-2-2",
            question:
              "A Students-Courses relationship where students can enrol in many courses AND courses can have many students is:",
            options: [
              "One-to-one (1:1)",
              "One-to-many (1:N)",
              "Many-to-many (M:N)",
              "Zero-to-many (0:N)",
            ],
            correctIndex: 2,
            explanation:
              "Many-to-many (M:N) means both sides can have multiple associated records. M:N relationships require a junction table (e.g. Enrollments) to implement in a relational database.",
          },
          {
            id: "dbq-2-2-3",
            question: "What is 'modality' in the context of ERDs?",
            options: [
              "The visual style or format of the diagram",
              "Whether participation in a relationship is mandatory or optional",
              "The cardinality between two entities",
              "The number of attributes an entity has",
            ],
            correctIndex: 1,
            explanation:
              "Modality (also called participation) specifies whether every instance of an entity must participate in a relationship. Mandatory means every instance must be involved; optional means some instances may not participate.",
          },
        ],
        erdSchema: {
          schemaId: "library",
          highlightEntities: ["member", "book", "loan"],
        },
      },
      {
        id: "db-2-3",
        moduleId: "db-mod-2",
        title: "Data Types in Relational Databases",
        duration: 15,
        difficulty: "Beginner",
        order: 3,
        dataTypeExercise: true,
        content: `# Data Types in Relational Databases

Choosing the correct data type for each column is crucial. The wrong type wastes storage, causes sorting bugs, and corrupts data.

## Common Data Types

**Integer types**
- \`INT\` / \`INTEGER\` — whole numbers
- \`BIGINT\` — large whole numbers; use for IDs in very large tables

**Decimal / floating-point**
- \`DECIMAL(p, s)\` — exact decimal; **always use for money**
- \`FLOAT\` — approximate decimal; avoid for financial values

**Text**
- \`CHAR(n)\` — fixed-length string (good for country codes)
- \`VARCHAR(n)\` — variable-length string up to n characters (most common)
- \`TEXT\` — unlimited length text

**Date and time**
- \`DATE\` — date only (YYYY-MM-DD)
- \`DATETIME\` / \`TIMESTAMP\` — date and time combined

**Other**
- \`BOOLEAN\` — TRUE or FALSE
- \`BLOB\` — Binary Large Object (images, files)

## Importance of Data Type Consistency

Using the wrong data type causes:

- **Precision loss** — storing prices as FLOAT leads to rounding errors
- **Storage waste** — VARCHAR(500) for a 2-character country code wastes space
- **Sorting errors** — storing numbers as TEXT means '9' sorts after '10'
- **Failed comparisons** — comparing TEXT dates with DATE columns may fail`,
        sqlChallenge: {
          db: "library",
          initialSql:
            "PRAGMA table_info(books);\nSELECT typeof(id), typeof(title), typeof(year) FROM books LIMIT 1;",
          description:
            "Inspect the data types used in the library database — try PRAGMA table_info on other tables too",
          hints: [
            "Try PRAGMA table_info(authors) to see another table",
            "Note which columns are INTEGER vs TEXT",
          ],
        },
        quiz: [
          {
            id: "dbq-2-3-1",
            question:
              "Why should monetary values be stored as DECIMAL rather than FLOAT?",
            options: [
              "DECIMAL is always faster to compute than FLOAT",
              "FLOAT uses binary approximation, causing rounding errors in financial calculations",
              "DECIMAL supports negative numbers while FLOAT does not",
              "FLOAT cannot store values greater than 999.99",
            ],
            correctIndex: 1,
            explanation:
              "FLOAT uses binary floating-point, which cannot represent all decimal fractions exactly. DECIMAL stores exact decimal values, which is essential for financial data to avoid penny-rounding errors.",
          },
          {
            id: "dbq-2-3-2",
            question: "What is the problem with storing a phone number as INT?",
            options: [
              "INT cannot store numbers that large",
              "Leading zeros are lost and special characters cannot be stored — phone numbers are identifiers, not quantities",
              "Phone numbers must be stored as FLOAT",
              "There is no problem — INT is the best type for phone numbers",
            ],
            correctIndex: 1,
            explanation:
              "Phone numbers like +44 07911 123456 have leading zeros and special characters. Storing as INT drops leading zeros. Phone numbers are identifiers, not quantities, so VARCHAR is correct.",
          },
        ],
      },
      {
        id: "db-2-4",
        moduleId: "db-mod-2",
        title: "Constructing Tables: Keys and Constraints",
        duration: 20,
        difficulty: "Beginner",
        order: 4,
        content: `# Constructing Tables for Relational Databases

Well-designed tables are the foundation of data integrity. Keys and constraints enforce rules at the database level.

## Primary Keys

A **primary key** uniquely identifies each row. Rules:
- Must be unique across all rows
- Cannot contain NULL values

\`\`\`sql
CREATE TABLE students (
  student_id   INT PRIMARY KEY AUTO_INCREMENT,
  name         VARCHAR(100) NOT NULL,
  email        VARCHAR(150) UNIQUE,
  date_of_birth DATE
);
\`\`\`

## Foreign Keys

\`\`\`sql
CREATE TABLE enrollments (
  enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
  student_id    INT NOT NULL,
  course_id     INT NOT NULL,
  enrolled_date DATE,
  FOREIGN KEY (student_id) REFERENCES students(student_id),
  FOREIGN KEY (course_id) REFERENCES courses(course_id)
);
\`\`\`

## Composite Keys

\`\`\`sql
CREATE TABLE class_schedule (
  teacher_id  INT,
  room_id     INT,
  time_slot   VARCHAR(20),
  PRIMARY KEY (teacher_id, room_id, time_slot)
);
\`\`\``,
        quiz: [
          {
            id: "dbq-2-4-a",
            question: "What constraint does a foreign key enforce?",
            options: [
              "Uniqueness — no two rows can have the same foreign key value",
              "Referential integrity — the referenced record must exist in the parent table",
              "Non-null — the foreign key value cannot be empty",
              "Atomicity — the value must be a single data item",
            ],
            correctIndex: 1,
            explanation:
              "A foreign key enforces referential integrity — you cannot insert a row with a foreign key value that does not exist in the parent table's primary key.",
          },
          {
            id: "dbq-2-4-b",
            question: "When would you use a composite primary key?",
            options: [
              "When you want to sort data faster",
              "When no single column uniquely identifies a row, but a combination of columns does",
              "When the table has more than 10 columns",
              "When the table is accessed by multiple users simultaneously",
            ],
            correctIndex: 1,
            explanation:
              "A composite primary key is used when no single attribute is unique on its own. In a junction table (e.g. Enrollments), neither StudentID nor CourseID alone is unique, but the combination uniquely identifies each enrollment.",
          },
        ],
        erdSchema: {
          schemaId: "school",
          highlightEntities: ["student", "course", "enrollment"],
        },
      },
      {
        id: "db-2-5",
        moduleId: "db-mod-2",
        title: "Normalisation: 1NF, 2NF, 3NF",
        duration: 30,
        difficulty: "Intermediate",
        order: 5,
        content: `# Normalisation: 1NF, 2NF, 3NF

**Normalisation** is the process of structuring a database to reduce data duplication and prevent anomalies.

## First Normal Form (1NF)

**Rule:** Every cell must contain a single (atomic) value. No repeating groups. Each row must be uniquely identifiable via a primary key.

**Violation example:** \`phones = "0771, 0882"\`

**Key terms:** **Atomicity** and **Unique identification**

## Second Normal Form (2NF)

**Rule:** Must be in 1NF AND every non-key attribute must depend on the **whole** primary key (no partial dependencies).

**Violation example:** \`OrderDetails(OrderID, ProductID, ProductName)\` — ProductName depends only on ProductID.

**Key term:** **Partial-key dependency**

## Third Normal Form (3NF)

**Rule:** Must be in 2NF AND no non-key attribute should depend on another non-key attribute (no transitive dependencies).

**Violation example:** \`Students(StudentID, PostalCode, City)\` — City depends on PostalCode.

**Key term:** **Transitive dependency** — A → B → C

## Summary

| Problem | Fixed by |
|---------|----------|
| Multi-valued cells | 1NF |
| Partial-key dependency | 2NF |
| Transitive dependency | 3NF |`,
        quiz: [
          {
            id: "dbq-2-5-1",
            question: "A table in 1NF must have:",
            options: [
              "No foreign keys in any column",
              "Atomic values in each column and a primary key to uniquely identify every row",
              "No more than 5 columns total",
              "All non-key columns depending on a composite key",
            ],
            correctIndex: 1,
            explanation:
              "First Normal Form requires: (1) atomic (indivisible) values in every cell — no multi-valued or repeating group fields, and (2) a primary key to uniquely identify each row.",
          },
          {
            id: "dbq-2-5-2",
            question: "Which type of dependency violates Second Normal Form?",
            options: [
              "Transitive dependency",
              "Partial-key dependency",
              "Full functional dependency",
              "Foreign key dependency",
            ],
            correctIndex: 1,
            explanation:
              "2NF is violated by partial-key dependencies — when a non-key attribute depends on only part of a composite primary key.",
          },
          {
            id: "dbq-2-5-3",
            question:
              "In Students(StudentID, PostalCode, City), City depends on PostalCode, not StudentID. This violates:",
            options: [
              "First Normal Form (1NF)",
              "Second Normal Form (2NF)",
              "Third Normal Form (3NF)",
              "No normal form — this is acceptable design",
            ],
            correctIndex: 2,
            explanation:
              "This is a transitive dependency: StudentID → PostalCode → City. City depends on PostalCode (a non-key attribute), not directly on the primary key. 3NF requires all non-key attributes to depend directly and only on the primary key.",
          },
        ],
        normalizationExercise: {
          exerciseId: "orders-1nf",
          scenario: "An e-commerce order management system",
          targetNF: "3NF",
        },
      },
      {
        id: "db-2-6",
        moduleId: "db-mod-2",
        title: "Normalisation Scenarios to 3NF",
        duration: 35,
        difficulty: "Intermediate",
        order: 6,
        content: `# Normalisation to 3NF: Real-World Scenarios

## Library Management: Unnormalized Form

\`LibraryRecords(MemberID, MemberName, MemberEmail, BookID, BookTitle, AuthorName, BorrowDate, ReturnDate)\`

**Problems:**
- MemberName and MemberEmail repeat for every book a member borrows
- BookTitle and AuthorName repeat for every loan of that book

## Step 1 — 1NF

All values are atomic. PK: (MemberID, BookID, BorrowDate)

## Step 2 — 2NF

Remove partial dependencies:
- \`Members(MemberID PK, MemberName, MemberEmail)\`
- \`Books(BookID PK, BookTitle, AuthorName)\`
- \`Loans(MemberID FK, BookID FK, BorrowDate, ReturnDate)\`

## Step 3 — 3NF

Remove transitive dependencies (AuthorName depends on AuthorID, not BookID):
- \`Authors(AuthorID PK, AuthorName)\`
- \`Books(BookID PK, BookTitle, AuthorID FK)\`
- \`Members(MemberID PK, MemberName, MemberEmail)\`
- \`Loans(MemberID FK, BookID FK, BorrowDate, ReturnDate)\``,
        quiz: [
          {
            id: "dbq-2-6-1",
            question:
              "In the library example, why is storing MemberName in the Loans table problematic?",
            options: [
              "Member names are too long to store in a database column",
              "Updating a member's name requires changing every loan record — an update anomaly",
              "Names are not unique, so they cannot be stored safely",
              "It violates 1NF because names are multi-valued",
            ],
            correctIndex: 1,
            explanation:
              "Storing MemberName in Loans causes an update anomaly — if a member changes their name, every single loan record must be updated.",
          },
          {
            id: "dbq-2-6-2",
            question:
              "After normalising the library system to 3NF, the typical result is:",
            options: [
              "One large flat table containing all data",
              "Exactly two tables: Members and Books",
              "Multiple tables (Members, Books, Authors, Loans) each focused on one entity",
              "Exactly ten tables, one per column of the original",
            ],
            correctIndex: 2,
            explanation:
              "Normalisation to 3NF produces multiple focused tables, each storing data about exactly one concept.",
          },
        ],
        normalizationExercise: {
          exerciseId: "library-3nf",
          scenario: "Library management system",
          targetNF: "3NF",
        },
        sqlChallenge: {
          db: "library",
          initialSql:
            "SELECT m.name, b.title, l.borrow_date\nFROM loans l\nJOIN members m ON l.member_id = m.id\nJOIN books b ON l.book_id = b.id\nORDER BY l.borrow_date DESC;",
          description:
            "Query the library database to list all loans with member names and book titles.",
          hints: [
            "Use JOIN to connect loans, members, and books tables",
            "ORDER BY borrow_date DESC shows the most recent loans first",
          ],
        },
      },
      {
        id: "db-2-7",
        moduleId: "db-mod-2",
        title: "Denormalisation",
        duration: 20,
        difficulty: "Intermediate",
        order: 7,
        isHL: true,
        content: `# Denormalisation

**Denormalisation** is the deliberate process of adding redundancy back into a database after normalisation, in order to improve read performance.

## When to Denormalise

- Read-intensive applications (dashboards, reports, analytics)
- Queries that always join the same set of tables
- When JOIN performance is a proven bottleneck

## Techniques

**Pre-computed columns** — Store calculated values to avoid expensive sub-queries.

**Merged tables** — Combine two frequently joined tables into one.

**Duplicate columns** — Copy a column from a referenced table to avoid a JOIN.

## Trade-Off Summary

| | Normalisation | Denormalisation |
|---|---|---|
| Read speed | Slower (JOINs) | Faster (fewer JOINs) |
| Write speed | Faster | Slower |
| Data integrity | Strong | Update anomaly risk |
| Best for | Write-heavy apps | Read-heavy analytics |`,
        quiz: [
          {
            id: "dbq-2-7-1",
            question: "Denormalisation is most beneficial when:",
            options: [
              "You need strict data integrity above all else",
              "The application is write-heavy with many INSERT and UPDATE operations",
              "The application is read-heavy and complex JOINs are a proven performance bottleneck",
              "You want to reduce total storage usage",
            ],
            correctIndex: 2,
            explanation:
              "Denormalisation trades data integrity and storage efficiency for read speed. It is most valuable in read-heavy scenarios (analytics, reporting dashboards) where the cost of many JOINs outweighs the maintenance overhead of redundant data.",
          },
          {
            id: "dbq-2-7-2",
            question: "What is the main risk of denormalising a database?",
            options: [
              "SQL queries become impossible to write",
              "Update anomalies — duplicated data can become inconsistent if not all copies are updated",
              "The database cannot be backed up properly",
              "Primary keys stop working after denormalisation",
            ],
            correctIndex: 1,
            explanation:
              "When data is stored in multiple places, every UPDATE must touch all copies. If even one copy is missed, the database becomes inconsistent — an update anomaly.",
          },
        ],
      },
    ],
  },

  // ── A3.3 Database Programming ────────────────────────────────────────────────
  {
    module: {
      id: "db-mod-3",
      title: "A3.3 SQL Programming",
      description:
        "DDL, DML, SELECT queries, JOINs, aggregates, views, and ACID transactions",
      order: 3,
    },
    lessons: [
      // ── A3.3.1 DDL vs DML ──────────────────────────────────────────────────────
      {
        id: "db-3-1",
        moduleId: "db-mod-3",
        title: "A3.3.1 DDL vs DML — Data Language Types in SQL",
        duration: 20,
        difficulty: "Beginner",
        order: 1,
        sqlClassifier: true,
        content: `# Data Language Types in SQL

SQL is divided into sublanguages, each serving a distinct purpose.

## Data Definition Language (DDL)

DDL defines and manages the **structure** (schema) of database objects.

| Command | Purpose |
|---|---|
| **CREATE TABLE** | Defines a new table with columns, data types, and constraints |
| **ALTER TABLE** | Modifies an existing table (add/remove columns, change types) |
| **DROP TABLE** | Permanently deletes a table and all its data |
| **CREATE INDEX** | Creates an index to speed up query lookups |

\`\`\`sql
CREATE TABLE students (
  student_id INT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) UNIQUE,
  enrolled   DATE
);

ALTER TABLE students ADD COLUMN grade_level INT DEFAULT 10;

DROP TABLE old_temp_data;
\`\`\`

## Data Manipulation Language (DML)

DML manipulates the **data** stored within structures defined by DDL.

| Command | Purpose |
|---|---|
| **SELECT** | Retrieves data from tables |
| **INSERT INTO** | Adds new rows to a table |
| **UPDATE SET** | Modifies existing rows |
| **DELETE FROM** | Removes rows from a table |

\`\`\`sql
SELECT name, email FROM students WHERE grade_level = 10;

INSERT INTO students (student_id, name, email, enrolled)
VALUES (1, 'Alice Chen', 'alice@school.edu', '2024-09-01');

UPDATE students SET email = 'alice.chen@school.edu' WHERE student_id = 1;

DELETE FROM students WHERE student_id = 1;
\`\`\`

## Key Differences

| | DDL | DML |
|---|---|---|
| Operates on | Schema (structure) | Data (content) |
| Examples | CREATE, ALTER, DROP | SELECT, INSERT, UPDATE, DELETE |
| Can be rolled back? | Usually **no** | **Yes** — within a transaction |

## Interactive Activity

Use the **DDL vs DML Classifier** below to test your understanding.`,
        quiz: [
          {
            id: "dbq-3-1-1",
            question:
              "Which SQL command belongs to DDL (Data Definition Language)?",
            options: ["SELECT", "INSERT INTO", "CREATE TABLE", "UPDATE SET"],
            correctIndex: 2,
            explanation:
              "CREATE TABLE is DDL — it defines the structure (schema) of the database. SELECT, INSERT, UPDATE, and DELETE are all DML commands that work with the data inside existing structures.",
          },
          {
            id: "dbq-3-1-2",
            question: "What is the fundamental difference between DDL and DML?",
            options: [
              "DDL is for large tables; DML is for small tables",
              "DDL defines database structure; DML manipulates the data within that structure",
              "DDL can only be used by administrators; DML by regular users",
              "DDL requires transactions; DML does not",
            ],
            correctIndex: 1,
            explanation:
              "DDL (Data Definition Language) defines *what* the database looks like — tables, columns, constraints. DML (Data Manipulation Language) works with the *content* — inserting, querying, updating, and deleting rows.",
          },
          {
            id: "dbq-3-1-3",
            question: "Which of the following is a DDL command?",
            options: [
              "DELETE FROM students WHERE id = 1",
              "ALTER TABLE students ADD COLUMN grade INT",
              "SELECT * FROM students",
              "UPDATE students SET grade = 10",
            ],
            correctIndex: 1,
            explanation:
              "ALTER TABLE modifies the schema (structure) of an existing table — adding or removing columns, changing data types. This is DDL.",
          },
          {
            id: "dbq-3-1-4",
            question:
              "Can DDL operations typically be rolled back using ROLLBACK?",
            options: [
              "Yes — all SQL statements can always be rolled back",
              "No — DDL operations are usually auto-committed and cannot be undone with ROLLBACK",
              "Only if the table was created within the same session",
              "Only with the UNDO DDL command",
            ],
            correctIndex: 1,
            explanation:
              "Most database systems auto-commit DDL statements. Once executed, they take immediate effect and cannot be rolled back with a simple ROLLBACK command — a critical difference from DML.",
          },
        ],
        sqlChallenge: {
          db: "library",
          initialSql:
            "-- DML: Query all members (SELECT is DML)\nSELECT name, email, join_date FROM members ORDER BY join_date DESC;\n\n-- Try: SELECT * FROM books WHERE available = 1;",
          description:
            "Practice DML: Write SELECT queries to explore the library database.",
          hints: [
            "Try: SELECT * FROM books WHERE year > 1980",
            "Try: SELECT * FROM loans WHERE return_date IS NULL",
          ],
        },
      },

      // ── A3.3.2 SELECT Queries ──────────────────────────────────────────────────
      {
        id: "db-3-2",
        moduleId: "db-mod-3",
        title: "A3.3.2 SELECT Queries — Filtering, Ordering & Pattern Matching",
        duration: 30,
        difficulty: "Beginner",
        order: 2,
        content: `# SELECT Queries

The SELECT statement is the most powerful DML command — it retrieves data from one or more tables with filtering, sorting, and deduplication.

## Core SELECT Syntax

\`\`\`sql
SELECT [DISTINCT] columns
FROM table
WHERE condition
ORDER BY column [ASC|DESC];
\`\`\`

## DISTINCT — Remove Duplicates

\`\`\`sql
SELECT DISTINCT genre FROM books ORDER BY genre ASC;
\`\`\`

## WHERE — Filtering Rows

\`\`\`sql
-- BETWEEN: inclusive range filter
SELECT title, year FROM books WHERE year BETWEEN 1980 AND 2000;

-- AND, OR, NOT: logical operators
SELECT title, genre FROM books
WHERE genre = 'Fiction' AND year > 1970 AND NOT available = 0;
\`\`\`

## LIKE — Pattern Matching with % Wildcard

\`\`\`sql
-- Names starting with 'S'
SELECT name, email FROM members WHERE name LIKE 'S%';

-- Books with 'Harry' anywhere in the title
SELECT title FROM books WHERE title LIKE '%Harry%';

-- Emails ending in '.edu'
SELECT name FROM members WHERE email LIKE '%.edu';
\`\`\`

## ORDER BY — Sorting

\`\`\`sql
SELECT title, year FROM books ORDER BY year DESC;  -- newest first
SELECT name FROM members ORDER BY name ASC;         -- alphabetical
\`\`\`

## SQL Command Reference

| Clause | Purpose |
|---|---|
| SELECT / DISTINCT | Choose columns; remove duplicates |
| WHERE | Filter rows |
| BETWEEN x AND y | Range filter (inclusive) |
| LIKE '%pattern%' | Pattern matching with % wildcard |
| AND / OR / NOT | Logical operators |
| ORDER BY ASC/DESC | Sort results |

## Guided Challenges (Library Database)

1. **Find all books published after 2010** — WHERE year > 2010
2. **Find members whose name starts with 'S'** — LIKE 'S%'
3. **List all distinct genres** — SELECT DISTINCT
4. **Find all books not yet returned** — WHERE return_date IS NULL`,
        quiz: [
          {
            id: "dbq-3-2-1",
            question: "What does SELECT DISTINCT genre FROM books return?",
            options: [
              "Every genre value including duplicates",
              "Only unique genre values — each genre appears once",
              "A count of how many books are in each genre",
              "All books sorted by genre",
            ],
            correctIndex: 1,
            explanation:
              "DISTINCT eliminates duplicate values from the result. If 5 books are 'Fiction', only one 'Fiction' row appears.",
          },
          {
            id: "dbq-3-2-2",
            question: "What does WHERE name LIKE 'S%' match?",
            options: [
              "Names containing the letter S anywhere",
              "Names starting with the letter S",
              "Names ending with the letter S",
              "Only the exact name 'S%'",
            ],
            correctIndex: 1,
            explanation:
              "In LIKE patterns, % matches zero or more characters. 'S%' means: starts with S followed by anything. It matches 'Sarah', 'Smith', 'Sam', etc.",
          },
          {
            id: "dbq-3-2-3",
            question:
              "Which query finds books published between 1980 and 2000 inclusive?",
            options: [
              "WHERE year > 1980 AND year < 2000",
              "WHERE year BETWEEN 1980 AND 2000",
              "WHERE year LIKE '198% OR 199%'",
              "WHERE year = 1980 TO 2000",
            ],
            correctIndex: 1,
            explanation:
              "BETWEEN is inclusive on both ends — BETWEEN 1980 AND 2000 includes books from 1980 and 2000.",
          },
          {
            id: "dbq-3-2-4",
            question:
              "How do you sort query results newest (highest year) first?",
            options: [
              "ORDER BY year ASC",
              "ORDER BY year DESC",
              "SORT BY year NEWEST",
              "ORDER BY year REVERSE",
            ],
            correctIndex: 1,
            explanation:
              "DESC (descending) sorts from highest to lowest — perfect for newest first. ASC (ascending) sorts from lowest to highest.",
          },
        ],
        sqlChallenge: {
          db: "library",
          initialSql:
            "-- Challenge 1: Find all books published after 2010\nSELECT title, year, genre\nFROM books\nWHERE year > 2010\nORDER BY year DESC;\n\n-- Challenge 2: Members whose name starts with 'S'\n-- SELECT name, email FROM members WHERE name LIKE 'S%';",
          description:
            "Guided challenges using the library database. Try all 4 challenges listed above.",
          hints: [
            "Challenge 3: SELECT DISTINCT genre FROM books ORDER BY genre",
            "Challenge 4: SELECT b.title, m.name FROM loans l JOIN books b ON l.book_id = b.id JOIN members m ON l.member_id = m.id WHERE l.return_date IS NULL",
          ],
        },
      },

      // ── A3.3.3 JOINs & Multi-table Queries ────────────────────────────────────
      {
        id: "db-3-3",
        moduleId: "db-mod-3",
        title: "A3.3.3 JOINs & Multi-table Queries",
        duration: 35,
        difficulty: "Intermediate",
        order: 3,
        content: `# JOINs and Multi-table Queries

JOINs combine rows from two or more tables based on a matching column.

## INNER JOIN

Returns only rows where there is a **match in both tables**.

\`\`\`sql
-- List all orders with customer names
SELECT c.name AS customer, o.order_date, o.total, o.status
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id
ORDER BY o.order_date DESC;
\`\`\`

## Multi-table JOINs

\`\`\`sql
SELECT c.name, p.name AS product, oi.quantity, oi.unit_price
FROM order_items oi
JOIN orders o    ON oi.order_id   = o.id
JOIN customers c ON o.customer_id = c.id
JOIN products p  ON oi.product_id = p.id
ORDER BY c.name;
\`\`\`

## GROUP BY — Aggregating Results

\`\`\`sql
SELECT c.name, COUNT(o.id) AS order_count
FROM customers c
JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name
ORDER BY order_count DESC;
\`\`\`

## HAVING — Filtering Groups

HAVING filters GROUPS after GROUP BY (unlike WHERE which filters rows before grouping).

\`\`\`sql
-- Find products ordered more than 2 times total
SELECT p.name, SUM(oi.quantity) AS total_ordered
FROM order_items oi
JOIN products p ON oi.product_id = p.id
GROUP BY p.id, p.name
HAVING SUM(oi.quantity) > 2
ORDER BY total_ordered DESC;
\`\`\`

## WHERE vs HAVING

| Clause | When it filters | Can use aggregates? |
|---|---|---|
| WHERE | Before GROUP BY (row level) | No |
| HAVING | After GROUP BY (group level) | Yes |

## Guided Challenges (E-Commerce Database)

1. **List all orders with customer names** — JOIN orders and customers
2. **Find products ordered more than 5 times** — GROUP BY + HAVING SUM(quantity) > 5
3. **Show customers from a specific country** — WHERE c.country = 'UK'
4. **Count items per order** — GROUP BY order_id with COUNT(*)`,
        quiz: [
          {
            id: "dbq-3-3-1",
            question: "What does an INNER JOIN return?",
            options: [
              "All rows from the left table, with NULLs where there is no right match",
              "All rows from both tables, including rows without matches",
              "Only rows where there is a matching value in both tables",
              "Only rows where there is no match between the tables",
            ],
            correctIndex: 2,
            explanation:
              "INNER JOIN returns only the intersection — rows where the JOIN condition is satisfied in both tables. Rows without a match in the other table are excluded.",
          },
          {
            id: "dbq-3-3-2",
            question: "What is the difference between WHERE and HAVING?",
            options: [
              "WHERE filters individual rows before grouping; HAVING filters groups after GROUP BY",
              "HAVING filters individual rows; WHERE filters groups after aggregation",
              "They are interchangeable and always produce identical results",
              "WHERE works on all SQL queries; HAVING only works with ORDER BY",
            ],
            correctIndex: 0,
            explanation:
              "WHERE filters individual rows *before* any GROUP BY aggregation. HAVING filters the *groups* produced by GROUP BY — it can use aggregate functions (COUNT, SUM). You cannot use aggregate functions in a WHERE clause.",
          },
          {
            id: "dbq-3-3-3",
            question:
              "In a JOIN query, what does ON orders.customer_id = customers.id specify?",
            options: [
              "The columns to display in the result",
              "The condition that links matching rows between the two tables",
              "A filter to exclude customers without orders",
              "The order in which the tables are searched",
            ],
            correctIndex: 1,
            explanation:
              "The ON clause specifies the join condition — which columns from each table should match.",
          },
          {
            id: "dbq-3-3-4",
            question: "What does GROUP BY do in a SQL query?",
            options: [
              "Removes duplicate rows from the result",
              "Collapses rows with the same value into a single group, enabling aggregate calculations per group",
              "Sorts the result in ascending order",
              "Joins two tables together",
            ],
            correctIndex: 1,
            explanation:
              "GROUP BY groups all rows that share the same value(s) into a single result row. This enables aggregates (COUNT, SUM, AVG) to calculate per group.",
          },
        ],
        sqlChallenge: {
          db: "ecommerce",
          initialSql:
            "-- Challenge 1: List all orders with customer names\nSELECT c.name AS customer, o.order_date, o.total, o.status\nFROM orders o\nJOIN customers c ON o.customer_id = c.id\nORDER BY o.order_date DESC;",
          description:
            "Guided challenges using the e-commerce database. Try all 4 challenges.",
          hints: [
            "Challenge 2: SELECT p.name, SUM(oi.quantity) AS total FROM order_items oi JOIN products p ON oi.product_id = p.id GROUP BY p.id, p.name HAVING SUM(oi.quantity) > 2 ORDER BY total DESC",
            "Challenge 4: SELECT o.id, COUNT(oi.id) AS items FROM orders o JOIN order_items oi ON o.id = oi.order_id GROUP BY o.id ORDER BY items DESC",
          ],
        },
      },

      // ── A3.3.4 INSERT/UPDATE/DELETE + Aggregate Functions (HL) ─────────────────
      {
        id: "db-3-4",
        moduleId: "db-mod-3",
        title: "A3.3.4 INSERT, UPDATE, DELETE & Aggregate Functions",
        duration: 35,
        difficulty: "Intermediate",
        order: 4,
        isHL: true,
        content: `# INSERT, UPDATE, DELETE & Aggregate Functions

## INSERT INTO — Adding New Records

\`\`\`sql
INSERT INTO patients (id, name, dob, blood_type, phone)
VALUES (7, 'Sophia Lee', '1998-06-15', 'B+', '555-0107');

INSERT INTO medications (id, name, dosage, manufacturer)
VALUES
  (6, 'Amlodipine', '5mg daily', 'CardioPharm'),
  (7, 'Omeprazole', '20mg daily', 'GastroLabs');
\`\`\`

## UPDATE SET — Modifying Records

Always use WHERE unless you intend to update every row.

\`\`\`sql
UPDATE patients SET phone = '555-9999' WHERE id = 1;

UPDATE appointments
SET notes = 'Rescheduled — doctor unavailable'
WHERE doctor_id = 3 AND date > '2024-03-01';
\`\`\`

## DELETE FROM — Removing Records

Always use WHERE — a DELETE without WHERE removes ALL rows.

\`\`\`sql
DELETE FROM prescriptions WHERE id = 6;
DELETE FROM appointments WHERE date < '2023-01-01';
\`\`\`

## Performance: Updating Indexed Columns

When you UPDATE a column that has an index:
1. The row data is updated on disk
2. The **index structure must also be updated** to stay consistent

Indexes are best on columns that are **read-heavy and rarely updated**.

---

## Aggregate Functions (HL)

| Function | Purpose |
|---|---|
| COUNT(*) | Count all rows |
| COUNT(col) | Count non-NULL values |
| SUM(col) | Total of all values |
| AVG(col) | Mean average |
| MIN(col) | Smallest value |
| MAX(col) | Largest value |

\`\`\`sql
SELECT
  d.department,
  COUNT(a.id)                  AS total_appointments,
  COUNT(DISTINCT a.patient_id) AS unique_patients
FROM appointments a
JOIN doctors d ON a.doctor_id = d.id
GROUP BY d.department
ORDER BY total_appointments DESC;
\`\`\`

**NULL handling:** SUM, AVG, MIN, MAX all **ignore NULL values**. COUNT(*) counts all rows; COUNT(column) counts only non-NULL values.

## Guided Challenges (Hospital Database)

1. **Count appointments per department** — JOIN doctors + appointments, GROUP BY department
2. **Find the doctor with the most appointments** — GROUP BY + COUNT + ORDER BY DESC
3. **Insert a new patient** then verify with SELECT
4. **Update a patient record** — INSERT then UPDATE`,
        quiz: [
          {
            id: "dbq-3-4-1",
            question:
              "What happens if you run DELETE FROM appointments without a WHERE clause?",
            options: [
              "Only the oldest record is deleted",
              "The query raises an error — WHERE is required for DELETE",
              "Every row in the appointments table is deleted",
              "Nothing — DELETE requires a WHERE to execute",
            ],
            correctIndex: 2,
            explanation:
              "A DELETE without WHERE removes ALL rows from the table. The table structure remains, but all data is gone. Always test with a SELECT using the same WHERE condition first.",
          },
          {
            id: "dbq-3-4-2",
            question:
              "Why is updating an indexed column slower than a non-indexed column?",
            options: [
              "Indexed columns are stored in read-only storage that must be unlocked first",
              "The database must update both the row data and the index structure to stay consistent",
              "Indexes prevent any changes to the columns they cover",
              "SQL does not support updating indexed columns directly",
            ],
            correctIndex: 1,
            explanation:
              "When you update an indexed column, the database must: (1) update the row on disk, and (2) update the index data structure. For large tables with many indexes, this adds significant overhead to each write.",
          },
          {
            id: "dbq-3-4-3",
            question:
              "What does COUNT(*) return when used with GROUP BY department?",
            options: [
              "The total number of rows in the entire table",
              "The number of rows in each department group",
              "The number of non-NULL values in the department column",
              "A single value — 1",
            ],
            correctIndex: 1,
            explanation:
              "When used with GROUP BY, COUNT(*) returns the count of rows in each group separately. Without GROUP BY, it returns the total count for the entire result set.",
          },
          {
            id: "dbq-3-4-4",
            question: "How do NULL values affect AVG(salary)?",
            options: [
              "NULLs are treated as zero in the average calculation",
              "NULLs cause the AVG function to return NULL for the entire group",
              "NULL values are ignored — AVG calculates the mean of non-NULL values only",
              "AVG raises an error if any NULL values are present",
            ],
            correctIndex: 2,
            explanation:
              "Aggregate functions (SUM, AVG, MIN, MAX, COUNT(column)) ignore NULL values. For AVG, the denominator is the count of non-NULL values.",
          },
        ],
        sqlChallenge: {
          db: "hospital",
          initialSql:
            "-- Challenge 1: Count appointments per department\nSELECT d.department, COUNT(a.id) AS appointment_count\nFROM doctors d\nJOIN appointments a ON d.id = a.doctor_id\nGROUP BY d.department\nORDER BY appointment_count DESC;",
          description:
            "Hospital database: aggregates, INSERT, and UPDATE challenges.",
          hints: [
            "Challenge 3: INSERT INTO patients (id, name, dob, blood_type, phone) VALUES (7, 'New Patient', '2000-01-01', 'O+', '555-9999'); then SELECT * FROM patients;",
            "Challenge 4: UPDATE patients SET phone = '555-8888' WHERE id = 7;",
          ],
        },
      },

      // ── A3.3.5 Views & ACID Transactions (HL) ─────────────────────────────────
      {
        id: "db-3-5",
        moduleId: "db-mod-3",
        title: "A3.3.5 Database Views & ACID Transactions",
        duration: 30,
        difficulty: "Advanced",
        order: 5,
        isHL: true,
        acidExplainer: true,
        content: `# Database Views & ACID Transactions

## Database Views

A **view** is a stored SQL query that behaves like a virtual table.

### Virtual Views

Stores only the **query definition**. Data is recomputed fresh each time the view is accessed.

\`\`\`sql
CREATE VIEW patient_appointments AS
SELECT
  p.name AS patient_name,
  d.name AS doctor_name,
  d.specialty,
  a.date,
  a.diagnosis
FROM appointments a
JOIN patients p ON a.patient_id = p.id
JOIN doctors d  ON a.doctor_id  = d.id;

SELECT * FROM patient_appointments WHERE specialty = 'Cardiology';
\`\`\`

### Materialized (Snapshot) Views

Stores the **pre-computed result** on disk — faster reads, but may be stale until refreshed.

| | Virtual View | Materialized View |
|---|---|---|
| Stores | Query only | Pre-computed results |
| Freshness | Always current | May be stale |
| Read speed | Slower | Faster |

### Benefits of Views

- **Simplicity** — hide complex JOINs behind a clean interface
- **Security** — expose only specific columns to specific users
- **Consistency** — one query definition reused everywhere
- **Independence** — change underlying tables without breaking apps
- **Performance** — materialized views cache expensive results

---

## Transactions and ACID Properties

A **transaction** is a sequence of operations that must ALL succeed or ALL be rolled back.

### ACID Properties

| Property | Meaning |
|---|---|
| **Atomicity** | All-or-nothing — all operations succeed, or none do |
| **Consistency** | Database moves from one valid state to another |
| **Isolation** | Concurrent transactions do not interfere with each other |
| **Durability** | Committed data survives crashes — written to persistent storage |

### TCL — Transaction Control Language

\`\`\`sql
BEGIN TRANSACTION;

UPDATE accounts SET balance = balance - 500 WHERE id = 1;
UPDATE accounts SET balance = balance + 500 WHERE id = 2;

COMMIT;    -- make all changes permanent
-- OR:
ROLLBACK; -- undo all changes
\`\`\`

| Command | Effect |
|---|---|
| BEGIN TRANSACTION | Starts a new transaction |
| COMMIT | Saves all changes permanently to disk |
| ROLLBACK | Undoes all changes back to BEGIN |

## Interactive ACID Explainer

Use the **Interactive ACID Transaction Explainer** below to step through a bank transfer and see how each ACID property protects your data.`,
        quiz: [
          {
            id: "dbq-3-5-1",
            question:
              "What is the key difference between a virtual view and a materialized view?",
            options: [
              "Virtual views are permanent; materialized views are temporary",
              "A virtual view stores only the query definition; a materialized view stores the pre-computed results",
              "Materialized views cannot be queried with SELECT",
              "Virtual views are only available in PostgreSQL",
            ],
            correctIndex: 1,
            explanation:
              "A virtual view stores the SQL query — data is recomputed fresh each time it is accessed. A materialized view stores the actual query results (faster reads, but may be stale until refreshed).",
          },
          {
            id: "dbq-3-5-2",
            question:
              "Which ACID property ensures a transaction completes fully or not at all?",
            options: [
              "Consistency — the database stays in a valid state",
              "Isolation — transactions do not see each other's changes",
              "Atomicity — all operations succeed, or none do",
              "Durability — committed data persists after crashes",
            ],
            correctIndex: 2,
            explanation:
              "Atomicity is the all-or-nothing guarantee. If a transaction has 3 steps and step 2 fails, step 1 is also rolled back. The database returns to its exact pre-transaction state.",
          },
          {
            id: "dbq-3-5-3",
            question:
              "In a bank transfer, if the debit succeeds but the credit fails, what should happen?",
            options: [
              "The debit is kept and the failure is logged",
              "The entire transaction is rolled back — both operations are undone",
              "Only the failed operation is retried automatically",
              "The transaction commits with partial results",
            ],
            correctIndex: 1,
            explanation:
              "Atomicity means the entire transaction must succeed or fail as a unit. If the credit fails, ROLLBACK undoes the debit too — money cannot disappear.",
          },
          {
            id: "dbq-3-5-4",
            question:
              "Which ACID property ensures committed data survives a server crash?",
            options: ["Atomicity", "Consistency", "Isolation", "Durability"],
            correctIndex: 3,
            explanation:
              "Durability guarantees that once a transaction is committed, its changes are written to persistent non-volatile storage. Even if the server crashes immediately after COMMIT, the data is recovered on restart.",
          },
        ],
      },
    ],
  },

  // ── A3.4 Alternative Databases (HL) ──────────────────────────────────────────
  {
    module: {
      id: "db-mod-4",
      title: "A3.4 Alternative Databases (HL)",
      description:
        "NoSQL, cloud, spatial, in-memory, data warehouses, OLAP, distributed databases",
      order: 4,
      isHL: true,
    },
    lessons: [
      {
        id: "db-4-1",
        moduleId: "db-mod-4",
        title: "NoSQL and Alternative Database Models",
        duration: 25,
        difficulty: "Advanced",
        order: 1,
        isHL: true,
        dbTypeComparison: true,
        content: `# Alternative Database Models

Relational databases are not always the best tool. Different data problems call for different storage models.

## NoSQL Databases

**Document databases** (e.g. MongoDB) — store JSON-like documents. Ideal for e-commerce product catalogues with variable attributes.

**Key-value stores** (e.g. Redis) — store simple key to value pairs. Extremely fast — used for sessions, caching, and real-time leaderboards.

**Wide-column stores** (e.g. Cassandra) — store data in column families optimised for writes and time-series data at massive scale.

**Graph databases** (e.g. Neo4j) — model data as nodes and edges. Perfect for social networks, recommendation engines, and fraud detection.

## Cloud Databases

- **Amazon RDS** — managed relational DB (MySQL, PostgreSQL)
- **Google Firestore** — real-time document DB for mobile and web apps
- **Azure Cosmos DB** — globally distributed multi-model DB

## Spatial Databases

Store and query geographical data — coordinates, shapes, distances.

Use cases: Google Maps, GIS, logistics route planning.

## In-Memory Databases

Store all data in RAM for ultra-low latency reads and writes.

Use cases: real-time analytics, session management, game leaderboards.`,
        quiz: [
          {
            id: "dbq-4-1-1",
            question:
              "Which type of database is best suited for storing social network connections?",
            options: [
              "Relational (SQL) database",
              "Key-value store",
              "Graph database",
              "In-memory database",
            ],
            correctIndex: 2,
            explanation:
              "Graph databases model data as nodes (entities) and edges (relationships). They excel at traversing connections — 'find all friends of friends within 3 hops' is trivial in a graph DB.",
          },
          {
            id: "dbq-4-1-2",
            question:
              "Why is an in-memory database faster than a disk-based database?",
            options: [
              "RAM automatically compresses data for faster retrieval",
              "In-memory databases skip data validation to improve speed",
              "RAM access is orders of magnitude faster than disk I/O — nanoseconds vs milliseconds",
              "In-memory databases use a different programming language internally",
            ],
            correctIndex: 2,
            explanation:
              "RAM access time is ~100 nanoseconds vs disk access of ~1-10 milliseconds. In-memory databases can handle millions of operations per second.",
          },
        ],
      },
      {
        id: "db-4-2",
        moduleId: "db-mod-4",
        title: "Data Warehouses and Business Intelligence",
        duration: 25,
        difficulty: "Advanced",
        order: 2,
        isHL: true,
        dataMiningMatcher: true,
        content: `# Data Warehouses and OLAP

## What Is a Data Warehouse?

A data warehouse is a specialised database optimised for **analytical queries** across large historical datasets.

### Key Characteristics

- **Subject-oriented** — organised around business topics (sales, customers)
- **Integrated** — data from multiple source systems is cleaned and unified
- **Time-variant** — stores years of historical data; every record is timestamped
- **Non-volatile** — data is loaded and read, not updated or deleted (append-only)
- **Optimised for query performance** — column-oriented storage, pre-computed aggregates

## OLTP vs OLAP

| | OLTP (Transactional) | OLAP (Analytical) |
|---|---|---|
| Purpose | Daily operations | Business intelligence |
| Operations | Read and write | Mostly read |
| Query type | Simple, fast, precise | Complex, aggregated |
| Example | Processing an order | Quarterly sales report |

## Data Mining Techniques

- **Classification** — assign items to predefined categories (spam / not spam)
- **Clustering** — group similar items without predefined labels
- **Regression** — predict a numeric value (price forecasting)
- **Association rule discovery** — find co-occurring patterns (customers who buy X also buy Y)
- **Anomaly detection** — identify outliers (credit card fraud detection)
- **Sequential pattern discovery** — find ordered patterns over time`,
        quiz: [
          {
            id: "dbq-4-2-1",
            question:
              "A data warehouse is described as 'non-volatile'. What does this mean?",
            options: [
              "Data is stored in volatile RAM for maximum speed",
              "Once loaded, data is not typically updated or deleted — it is append-only",
              "The warehouse is prone to data loss and instability",
              "Data can only be queried once before being deleted",
            ],
            correctIndex: 1,
            explanation:
              "Non-volatile means data in a warehouse is stable — once loaded, it is preserved. New data is appended over time; existing records are not modified.",
          },
          {
            id: "dbq-4-2-2",
            question:
              "Which data mining technique finds that 'customers who buy nappies also tend to buy beer'?",
            options: [
              "Classification",
              "Clustering",
              "Association rule discovery",
              "Anomaly detection",
            ],
            correctIndex: 2,
            explanation:
              "Association rule discovery (market basket analysis) finds items that frequently appear together in transactions.",
          },
        ],
      },
      {
        id: "db-4-3",
        moduleId: "db-mod-4",
        title: "Distributed Databases",
        duration: 35,
        difficulty: "Advanced",
        order: 3,
        isHL: true,
        distributedDiagram: true,
        content: `# Distributed Databases

A **distributed database** stores data across multiple physical locations (nodes) — different servers, data centres, or even countries.

## Core Features

**Partitioning (Sharding)** — Data is divided across nodes. Each node stores a subset of the total data.

- Horizontal partitioning — different rows on different nodes (most common)
- Vertical partitioning — different columns on different nodes

**Replication** — Data is copied to multiple nodes for fault tolerance and faster reads.

**Distribution Transparency** — Applications interact with the system as if it were a single database.

**Location Transparency** — Queries work regardless of where data physically resides.

**Fault Tolerance** — If one node fails, other nodes continue serving requests.

**Scalability** — Add more nodes to handle more data and traffic horizontally.

**Security** — Fine-grained access control per node, with encryption in transit.

## ACID in Distributed Environments

| ACID Property | Distributed Challenge |
|---|---|
| Atomicity | Requires two-phase commit (2PC) across all nodes |
| Consistency | Conflicts with availability (CAP theorem) |
| Isolation | Requires distributed locking protocols |
| Durability | Data must survive individual node failures via replication |

**CAP Theorem** — A distributed system can guarantee at most 2 of:

- **Consistency** — all nodes return the same data at the same time
- **Availability** — every request receives a response
- **Partition tolerance** — system continues operating despite network failures

## Real-World Examples

- **Google Spanner** — globally distributed SQL with near-perfect consistency
- **Amazon DynamoDB** — high availability, eventual consistency
- **Cassandra** — designed for write-heavy distributed workloads`,
        quiz: [
          {
            id: "dbq-4-3-1",
            question:
              "What does 'distribution transparency' mean in a distributed database?",
            options: [
              "Data is encrypted during transmission between nodes",
              "Applications interact with the database as if it were a single system",
              "All nodes must be visible to the user at all times",
              "The database automatically transfers data between nodes every hour",
            ],
            correctIndex: 1,
            explanation:
              "Distribution transparency means the complexity of data spread across multiple nodes is hidden from the application. Developers write standard queries; the system handles routing behind the scenes.",
          },
          {
            id: "dbq-4-3-2",
            question:
              "The CAP theorem states that a distributed system can guarantee at most 2 of:",
            options: [
              "Consistency, Availability, and Performance",
              "Consistency, Availability, and Partition tolerance",
              "Atomicity, Concurrency, and Partitioning",
              "Consistency, Accuracy, and Portability",
            ],
            correctIndex: 1,
            explanation:
              "The CAP theorem states a distributed system can only simultaneously guarantee 2 of: Consistency, Availability, and Partition tolerance.",
          },
          {
            id: "dbq-4-3-3",
            question: "What is horizontal partitioning (sharding)?",
            options: [
              "Storing different columns of a table on different nodes",
              "Distributing different rows of a table across different nodes based on a partition key",
              "Creating read-only replicas of the entire database",
              "Compressing each table independently for storage efficiency",
            ],
            correctIndex: 1,
            explanation:
              "Horizontal partitioning splits rows — for example, customers with IDs 1-1,000,000 go to Node A and 1,000,001-2,000,000 go to Node B.",
          },
          {
            id: "dbq-4-3-4",
            question:
              "Why is maintaining ACID properties difficult in a distributed database?",
            options: [
              "Distributed databases use NoSQL which does not support ACID by design",
              "Coordinating atomic transactions across multiple nodes requires expensive protocols like two-phase commit",
              "ACID properties only apply to databases with fewer than 1,000 rows",
              "Distributed databases are always designed to use eventual consistency",
            ],
            correctIndex: 1,
            explanation:
              "In a distributed system, ensuring all nodes agree and that transactions fully complete or abort requires coordination protocols like two-phase commit. Network latency and failures make this expensive.",
          },
        ],
      },
    ],
  },
];
