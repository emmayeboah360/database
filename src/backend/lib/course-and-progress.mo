import List "mo:core/List";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Types "../types/course-and-progress";

module {
  public type Lesson = Types.Lesson;
  public type Module = Types.Module;
  public type Enrollment = Types.Enrollment;
  public type LessonCompletion = Types.LessonCompletion;
  public type Certificate = Types.Certificate;
  public type CertificateLevel = Types.CertificateLevel;
  public type LessonWithStatus = Types.LessonWithStatus;
  public type ModuleWithLessons = Types.ModuleWithLessons;
  public type DashboardData = Types.DashboardData;
  public type UserProfile = Types.UserProfile;
  public type CourseOverview = Types.CourseOverview;
  public type UserId = Types.UserId;
  public type LessonId = Types.LessonId;
  public type ModuleId = Types.ModuleId;

  // ─── Seed Data ─────────────────────────────────────────────────────────────

  public func seedCourseData(
    modules : List.List<Module>,
    lessons : List.List<Lesson>
  ) {
    // ── Modules ──────────────────────────────────────────────────────────────
    modules.add({
      id = 1;
      title = "A3.1 Database Fundamentals";
      description = "Understand what relational databases are, why they exist, their features, benefits, and limitations — the foundation for everything that follows.";
      order = 1;
    });
    modules.add({
      id = 2;
      title = "A3.2 Database Design";
      description = "Master the art of designing well-structured databases: schemas, ERDs, data types, table construction, and normalization up to 3NF.";
      order = 2;
    });
    modules.add({
      id = 3;
      title = "A3.3 Database Programming";
      description = "Write SQL to define, query, and manipulate relational databases — from basic SELECT statements to complex JOINs and aggregate functions.";
      order = 3;
    });
    modules.add({
      id = 4;
      title = "A3.4 Alternative Databases & Data Warehouses";
      description = "Higher Level: Explore NoSQL, cloud, spatial and in-memory databases, data warehouses, OLAP, data mining, and distributed database systems.";
      order = 4;
    });

    // ── A3.1 Lessons ──────────────────────────────────────────────────────────

    lessons.add({
      id = 1; moduleId = 1; order = 1;
      difficulty = #Beginner; durationMinutes = 20; isHL = false;
      title = "Relational DB Features, Benefits & Limitations";
      description = "Explore the defining features of relational databases, why organisations choose them, and where they fall short.";
      content = "## Relational Database Features, Benefits & Limitations\n\nA **relational database** organises data into **tables** (also called relations), where each row represents a record and each column represents an attribute.\n\n---\n\n## Key Features\n\n| Feature | What it means |\n|---|---|\n| **Tables** | Data stored in rows and columns |\n| **Primary keys** | Unique identifier for every row |\n| **Foreign keys** | Column(s) that reference a primary key in another table |\n| **Composite keys** | Primary key made from two or more columns |\n| **Relationships** | Logical links between tables (one-to-one, one-to-many, many-to-many) |\n\n---\n\n## Benefits\n\n- **Data integrity** — constraints prevent invalid data entering the database\n- **Reduced redundancy** — normalisation stores each piece of information once\n- **Concurrency control** — multiple users can read/write safely at the same time\n- **Data consistency** — ACID transactions keep data in a valid state\n- **Security features** — fine-grained access control per table or column\n- **Scalability** — handles millions of rows with proper indexing\n- **Community support** — mature ecosystem, extensive documentation, widespread expertise\n- **Reliable transaction processing** — guaranteed commit/rollback behaviour\n- **Data retrieval** — powerful SQL query language for complex queries\n\n---\n\n## Limitations\n\n- **Rigid schema** — changing the structure after data is loaded is costly\n- **Object-relational impedance mismatch** — translating between objects (code) and tables (DB) adds complexity\n- **Hierarchical data handling** — nested/tree structures are awkward in flat tables\n- **Unstructured data handling** — not designed for images, videos, or free-text blobs\n- **\"Big data\" scalability issues** — horizontal scaling across thousands of servers is challenging\n- **Design complexity** — a poorly designed schema is hard to fix later\n\n---\n\n## Quick Check\n\n> *True or false: A foreign key must be unique within its own table.*\n\nFalse — a foreign key references a primary key in **another** table; it can appear multiple times in the table that holds it (e.g. many orders can belong to the same customer).";
    });

    lessons.add({
      id = 2; moduleId = 1; order = 2;
      difficulty = #Beginner; durationMinutes = 20; isHL = false;
      title = "Keys & Relationships";
      description = "Understand primary keys, foreign keys, composite keys, and how relationships link tables together.";
      content = "## Keys & Relationships\n\n### Primary Keys\n\nA **primary key** (PK) uniquely identifies every row in a table. Rules:\n- Must be **unique** for every row\n- Must **never be NULL**\n- Should be **stable** (rarely or never changes)\n\n```sql\nCREATE TABLE Students (\n  student_id  INT         PRIMARY KEY,\n  full_name   VARCHAR(100) NOT NULL,\n  email       VARCHAR(150) UNIQUE NOT NULL\n);\n```\n\n### Foreign Keys\n\nA **foreign key** (FK) is a column (or set of columns) in one table that references the primary key of another table. It enforces **referential integrity** — you cannot insert a foreign key value that does not exist in the referenced table.\n\n```sql\nCREATE TABLE Enrolments (\n  enrolment_id  INT  PRIMARY KEY,\n  student_id    INT  NOT NULL,\n  course_id     INT  NOT NULL,\n  FOREIGN KEY (student_id) REFERENCES Students(student_id),\n  FOREIGN KEY (course_id)  REFERENCES Courses(course_id)\n);\n```\n\n### Composite Keys\n\nA **composite key** uses **two or more columns together** as the primary key — neither column alone is unique, but the combination is.\n\n```sql\nCREATE TABLE CourseEnrolment (\n  student_id  INT,\n  course_id   INT,\n  PRIMARY KEY (student_id, course_id)   -- composite\n);\n```\n\n### Relationship Types\n\n| Relationship | Example |\n|---|---|\n| **One-to-one** | Person ↔ Passport |\n| **One-to-many** | Customer → Orders |\n| **Many-to-many** | Students ↔ Courses (via junction table) |\n\nMany-to-many relationships require a **junction table** (also called a linking or associative table) that holds the foreign keys of both entities.";
    });

    lessons.add({
      id = 3; moduleId = 1; order = 3;
      difficulty = #Beginner; durationMinutes = 25; isHL = false;
      title = "Entity Types & Attributes";
      description = "Identify entities, attributes, and the difference between strong and weak entities in database modelling.";
      content = "## Entity Types & Attributes\n\n### What is an Entity?\n\nAn **entity** is a distinguishable real-world object or concept about which data is stored.\n- Examples: `Student`, `Course`, `Product`, `Order`, `Employee`\n\n### Attributes\n\nAttributes describe properties of an entity.\n\n| Attribute type | Description | Example |\n|---|---|---|\n| **Simple** | Atomic, indivisible | `date_of_birth` |\n| **Composite** | Made of sub-parts | `full_name` = `first_name` + `last_name` |\n| **Derived** | Computed from another attribute | `age` derived from `date_of_birth` |\n| **Multi-valued** | Can hold multiple values | `phone_numbers` |\n| **Key attribute** | Uniquely identifies the entity | `student_id` |\n\n### Strong vs Weak Entities\n\n- A **strong entity** has its own primary key and exists independently (e.g. `Student`).\n- A **weak entity** cannot be uniquely identified without a related strong entity (e.g. `Dependent` relies on `Employee`). Weak entities are identified by a **partial key** combined with the parent's PK.\n\n### Representing Attributes in a Table\n\n```sql\nCREATE TABLE Employees (\n  employee_id   INT           PRIMARY KEY,   -- key attribute\n  first_name    VARCHAR(50)   NOT NULL,       -- simple\n  last_name     VARCHAR(50)   NOT NULL,       -- simple\n  date_of_birth DATE          NOT NULL,       -- simple (age is derived)\n  job_title     VARCHAR(100)\n);\n```\n\n> **Design tip:** Multi-valued attributes should NOT be stored as a column. Instead, create a separate table and link back with a foreign key.";
    });

    lessons.add({
      id = 4; moduleId = 1; order = 4;
      difficulty = #Beginner; durationMinutes = 25; isHL = false;
      title = "Real-World Database Examples";
      description = "See how relational databases are used in library management, hospital systems, e-commerce, and school administration.";
      content = "## Real-World Relational Database Examples\n\n### Library Management System\n\n**Tables:** `Books`, `Members`, `Loans`, `Authors`, `Categories`\n\n```\nBooks        (book_id PK, title, isbn, author_id FK, category_id FK)\nMembers      (member_id PK, name, email, membership_date)\nLoans        (loan_id PK, book_id FK, member_id FK, loan_date, due_date, returned_date)\n```\n\nKey relationships: a member can borrow many books; a book can be loaned many times (sequentially).\n\n---\n\n### Hospital Management System\n\n**Tables:** `Patients`, `Doctors`, `Appointments`, `Prescriptions`, `Wards`\n\n```\nPatients     (patient_id PK, name, dob, blood_type)\nDoctors      (doctor_id PK, name, specialisation, ward_id FK)\nAppointments (appt_id PK, patient_id FK, doctor_id FK, date_time, notes)\n```\n\n---\n\n### E-Commerce Platform\n\n**Tables:** `Customers`, `Products`, `Orders`, `OrderItems`, `Categories`\n\n```\nCustomers    (customer_id PK, name, email, address)\nProducts     (product_id PK, name, price, stock_qty, category_id FK)\nOrders       (order_id PK, customer_id FK, order_date, status)\nOrderItems   (order_id FK, product_id FK, quantity, unit_price)   -- composite PK\n```\n\n---\n\n### School Management System\n\n**Tables:** `Students`, `Teachers`, `Classes`, `Enrolments`, `Grades`\n\n```\nStudents     (student_id PK, name, year_group, dob)\nTeachers     (teacher_id PK, name, subject)\nClasses      (class_id PK, subject, teacher_id FK, room)\nEnrolments   (student_id FK, class_id FK)   -- composite PK\nGrades       (grade_id PK, student_id FK, class_id FK, mark, grade_letter)\n```\n\n---\n\n> **Key insight:** Every real-world system uses the same building blocks — tables, primary keys, foreign keys, and relationships. The domain changes; the principles stay the same.";
    });

    // ── A3.2 Lessons ──────────────────────────────────────────────────────────

    lessons.add({
      id = 5; moduleId = 2; order = 1;
      difficulty = #Beginner; durationMinutes = 20; isHL = false;
      title = "Database Schemas";
      description = "Understand conceptual, logical, and physical schemas — three levels of abstraction for describing database structure.";
      content = "## Database Schemas\n\nA **schema** is an abstract description of how data is structured and organised. Databases have three schema levels:\n\n---\n\n## 1. Conceptual Schema\n\nThe **highest-level** view — describes *what* data exists and how entities relate, independent of any technology.\n\n- Drawn as an Entity-Relationship Diagram (ERD)\n- No mention of data types, storage, or indexing\n- Audience: business stakeholders and analysts\n\nExample: \"A Customer places many Orders; each Order contains many Products.\"\n\n---\n\n## 2. Logical Schema\n\nTranslates the conceptual model into a **technology-neutral** table structure.\n\n- Defines tables, columns, data types, primary keys, and foreign keys\n- No details about physical storage (file layout, partitions, indexes)\n- Audience: database designers and developers\n\nExample:\n```\nCustomers (customer_id INT PK, name VARCHAR(100), email VARCHAR(150))\nOrders    (order_id INT PK, customer_id INT FK, order_date DATE, total DECIMAL(10,2))\n```\n\n---\n\n## 3. Physical Schema\n\nThe **lowest-level** view — describes how data is stored on disk.\n\n- Specifies file formats, index types (B-tree, hash), storage engines, partitioning\n- Highly vendor-specific (MySQL InnoDB, PostgreSQL, Oracle)\n- Audience: database administrators (DBAs)\n\n---\n\n## The Three-Schema Architecture\n\n```\nUsers/Apps\n    │\n    ▼  External Schema (views for specific users/apps)\n    │\n    ▼  Conceptual / Logical Schema (overall logical structure)\n    │\n    ▼  Internal / Physical Schema (storage implementation)\n```\n\nThis separation (called **data independence**) means you can change the physical storage without rewriting application code.";
    });

    lessons.add({
      id = 6; moduleId = 2; order = 2;
      difficulty = #Beginner; durationMinutes = 30; isHL = false;
      title = "ERDs & Cardinality";
      description = "Construct Entity-Relationship Diagrams and express cardinality and modality to define how entities relate.";
      content = "## Entity Relationship Diagrams (ERDs)\n\nAn ERD is a visual blueprint showing the entities in a database and how they relate.\n\n---\n\n## ERD Notation Elements\n\n| Symbol | Meaning |\n|---|---|\n| Rectangle | Entity |\n| Ellipse | Attribute |\n| Diamond | Relationship |\n| Underlined attribute | Primary key |\n| Double rectangle | Weak entity |\n\n---\n\n## Cardinality\n\n**Cardinality** defines *how many* instances of one entity can relate to instances of another.\n\n| Notation | Meaning |\n|---|---|\n| `1` | Exactly one |\n| `N` or `M` | Many (one or more) |\n| `0..1` | Zero or one |\n| `0..N` | Zero or many |\n\n### Common Cardinalities\n\n- **One-to-One (1:1):** A person has exactly one passport; a passport belongs to exactly one person.\n- **One-to-Many (1:N):** A department employs many employees; each employee belongs to one department.\n- **Many-to-Many (M:N):** Students enrol in many courses; courses have many students.\n\n---\n\n## Modality (Participation)\n\n**Modality** (also called *participation constraint*) defines whether participation in a relationship is **mandatory** or **optional**.\n\n- **Mandatory (total participation):** Every instance *must* participate. Shown with a double line in ERDs.\n- **Optional (partial participation):** Instances *may* participate. Shown with a single line.\n\nExample: Every `Order` **must** have a `Customer` (mandatory). A `Customer` **may** have zero or more `Orders` (optional).\n\n---\n\n## ERD Example: Library\n\n```\n[Member] ---borrows--- [Loan] ---for--- [Book]\n   1               0..N         N           1\n```\n\n- A Member can have 0 or many Loans (optional, one-to-many)\n- Each Loan is for exactly 1 Book\n- A Book can appear in 0 or many Loans\n\n---\n\n## Crow's Foot Notation\n\nIn crow's foot notation (common in tools like Lucidchart, draw.io):\n\n```\n|o——<  zero or many\n||——<  one or many  \n|o——|  zero or one\n||——|  exactly one\n```";
    });

    lessons.add({
      id = 7; moduleId = 2; order = 3;
      difficulty = #Beginner; durationMinutes = 20; isHL = false;
      title = "Data Types in Relational Databases";
      description = "Survey the data types available in SQL databases and understand why choosing the right type matters.";
      content = "## Data Types in Relational Databases\n\nChoosing the correct data type is critical for data integrity, storage efficiency, and query performance.\n\n---\n\n## Common SQL Data Types\n\n### Numeric\n\n| Type | Description | Range |\n|---|---|---|\n| `INT` / `INTEGER` | Whole number | −2,147,483,648 to 2,147,483,647 |\n| `BIGINT` | Large whole number | ±9.2 × 10¹⁸ |\n| `SMALLINT` | Small whole number | −32,768 to 32,767 |\n| `DECIMAL(p,s)` | Exact fixed-point | e.g. `DECIMAL(10,2)` for money |\n| `FLOAT` / `REAL` | Approximate floating-point | Scientific use |\n\n### Text\n\n| Type | Description |\n|---|---|\n| `CHAR(n)` | Fixed-length string, padded with spaces |\n| `VARCHAR(n)` | Variable-length string, up to n characters |\n| `TEXT` | Unlimited-length string |\n\n### Date & Time\n\n| Type | Description |\n|---|---|\n| `DATE` | Calendar date (YYYY-MM-DD) |\n| `TIME` | Time of day (HH:MM:SS) |\n| `DATETIME` | Date + time combined |\n| `TIMESTAMP` | Date + time, often auto-updated |\n\n### Other\n\n| Type | Description |\n|---|---|\n| `BOOLEAN` | TRUE / FALSE |\n| `BLOB` | Binary large object (images, files) |\n| `ENUM` | One value from a predefined list |\n\n---\n\n## Why Data Type Choice Matters\n\n- **Data integrity:** Using `DATE` for a date column prevents \"29/02/2023\" (non-existent) from being stored.\n- **Storage efficiency:** `SMALLINT` uses 2 bytes; `BIGINT` uses 8. Multiplied across millions of rows, this adds up.\n- **Query performance:** Comparing `INT` values is faster than comparing `VARCHAR` values.\n- **Arithmetic accuracy:** `FLOAT` has rounding errors — always use `DECIMAL` for money.\n\n### Wrong Type Consequences\n\n| Mistake | Problem |\n|---|---|\n| Storing a phone number as `INT` | Leading zeros lost; no country code |\n| Storing money as `FLOAT` | Rounding errors in calculations |\n| `CHAR(10)` for variable names | Wastes space with padding |\n| `TEXT` for a flag (Y/N) | Should be `BOOLEAN` or `ENUM` |";
    });

    lessons.add({
      id = 8; moduleId = 2; order = 4;
      difficulty = #Intermediate; durationMinutes = 30; isHL = false;
      title = "Table Construction & Keys";
      description = "Construct well-defined relational tables with primary keys, foreign keys, composite keys, and concatenated keys.";
      content = "## Table Construction & Keys\n\n## Designing a Good Table\n\nA well-constructed table:\n- Has a clear **primary key** for every row\n- Uses appropriate **data types** for every column\n- Enforces **NOT NULL** where a value is always required\n- Uses **FOREIGN KEY** constraints to maintain referential integrity\n- Has meaningful, consistent column names\n\n---\n\n## Primary Keys\n\n```sql\n-- Natural key (meaningful real-world value)\nCREATE TABLE Countries (\n  country_code CHAR(2)     PRIMARY KEY,   -- e.g. 'GB', 'US'\n  country_name VARCHAR(100) NOT NULL\n);\n\n-- Surrogate key (generated ID, no real-world meaning)\nCREATE TABLE Customers (\n  customer_id  INT AUTO_INCREMENT PRIMARY KEY,\n  email        VARCHAR(150) UNIQUE NOT NULL,\n  full_name    VARCHAR(100) NOT NULL\n);\n```\n\n---\n\n## Foreign Keys\n\n```sql\nCREATE TABLE Orders (\n  order_id     INT AUTO_INCREMENT PRIMARY KEY,\n  customer_id  INT         NOT NULL,\n  order_date   DATE        NOT NULL,\n  total        DECIMAL(10,2) NOT NULL,\n  FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)\n    ON DELETE RESTRICT\n    ON UPDATE CASCADE\n);\n```\n\n`ON DELETE RESTRICT` — prevents deleting a customer that has orders.\n`ON UPDATE CASCADE` — if the customer_id changes, automatically updates all matching orders.\n\n---\n\n## Composite Keys\n\nUsed when no single column uniquely identifies a row, but a **combination** does.\n\n```sql\nCREATE TABLE StudentCourses (\n  student_id  INT NOT NULL,\n  course_id   INT NOT NULL,\n  enrol_date  DATE NOT NULL,\n  PRIMARY KEY (student_id, course_id),           -- composite PK\n  FOREIGN KEY (student_id) REFERENCES Students(student_id),\n  FOREIGN KEY (course_id)  REFERENCES Courses(course_id)\n);\n```\n\n---\n\n## Concatenated Keys\n\nA **concatenated key** is another term for a composite key — multiple columns concatenated to form a unique identifier. The distinction sometimes implies the columns are joined as a string, but in practice the terms are often used interchangeably.\n\n---\n\n## Data Integrity Through Well-Defined Tables\n\n| Constraint | What it enforces |\n|---|---|\n| `PRIMARY KEY` | Uniqueness and non-null |\n| `FOREIGN KEY` | Referential integrity |\n| `NOT NULL` | Mandatory field |\n| `UNIQUE` | No duplicates in column |\n| `CHECK` | Custom value rule |\n| `DEFAULT` | Fallback value |";
    });

    lessons.add({
      id = 9; moduleId = 2; order = 5;
      difficulty = #Intermediate; durationMinutes = 40; isHL = false;
      title = "Normalization: 1NF, 2NF & 3NF";
      description = "Apply the rules of First, Second, and Third Normal Form to eliminate data anomalies and reduce redundancy.";
      content = "## Normalization: 1NF, 2NF & 3NF\n\n**Normalization** is the process of structuring a relational database to reduce redundancy and improve data integrity.\n\n---\n\n## Key Terms\n\n- **Atomicity:** Each column holds one indivisible value (no lists in a cell).\n- **Functional dependency:** Column B is *functionally dependent* on column A if knowing A uniquely determines B (written A → B).\n- **Partial-key dependency:** A non-key column depends on only *part* of a composite primary key.\n- **Transitive dependency:** A non-key column depends on another non-key column (A → B → C, where A is the PK).\n\n---\n\n## First Normal Form (1NF)\n\n**Rules:**\n1. Each column contains **atomic** (indivisible) values.\n2. Each row is **uniquely identifiable** (has a primary key).\n3. No repeating groups or arrays in a single column.\n\n**Violation:** `Order(order_id, products)` where products = \"Pen, Ruler, Eraser\"\n\n**Fix:** Split into `OrderItems(order_id, product_name)` — one product per row.\n\n---\n\n## Second Normal Form (2NF)\n\n**Rules (builds on 1NF):**\n- Must be in 1NF.\n- Every non-key attribute must be **fully functionally dependent on the entire primary key** (no partial dependencies — only relevant when the PK is composite).\n\n**Violation:**\n```\nOrderItems(order_id, product_id, product_name, quantity)\nPK = (order_id, product_id)\n```\n`product_name` depends only on `product_id`, not on the full composite key.\n\n**Fix:** Move `product_name` to a separate `Products(product_id, product_name)` table.\n\n---\n\n## Third Normal Form (3NF)\n\n**Rules (builds on 2NF):**\n- Must be in 2NF.\n- No **transitive dependencies** — non-key attributes must not depend on other non-key attributes.\n\n**Violation:**\n```\nEmployees(emp_id, emp_name, dept_id, dept_name)\n```\n`dept_name` depends on `dept_id`, not directly on `emp_id`.\n\n**Fix:** Move to `Departments(dept_id, dept_name)` and reference with a FK.\n\n---\n\n## Normalization Issues\n\n| Issue | Form that fixes it |\n|---|---|\n| Data duplication | 1NF (atomicity) |\n| Partial-key dependency | 2NF |\n| Transitive dependency | 3NF |\n| Multi-valued dependency | 4NF (beyond syllabus) |\n\n---\n\n## Worked Example: Library (to 3NF)\n\n**Before normalization:**\n```\nLoans(loan_id, member_id, member_name, member_email, book_id, book_title, author_name, loan_date)\n```\n\n**After 3NF:**\n```\nMembers(member_id PK, member_name, member_email)\nAuthors(author_id PK, author_name)\nBooks(book_id PK, book_title, author_id FK)\nLoans(loan_id PK, member_id FK, book_id FK, loan_date)\n```";
    });

    lessons.add({
      id = 10; moduleId = 2; order = 6;
      difficulty = #Intermediate; durationMinutes = 35; isHL = true;
      title = "Denormalization (HL)";
      description = "Higher Level: Evaluate when and why denormalization can improve performance, and the trade-offs involved.";
      content = "## Denormalization (Higher Level)\n\n**Denormalization** deliberately introduces redundancy into a normalized database to improve **read performance**.\n\n---\n\n## Why Denormalize?\n\nNormalized databases can require many JOINs to answer common queries. JOINs are computationally expensive at scale.\n\nIn **read-intensive** applications (dashboards, reporting, e-commerce product listings), denormalization can dramatically reduce query complexity and response time.\n\n---\n\n## Advantages of Denormalization\n\n- **Faster reads:** Fewer joins needed — data is co-located\n- **Simpler queries:** One table instead of many\n- **Better cache utilization:** Larger rows fit analytical access patterns\n- **Reduced query plan complexity:** Optimizer has less to figure out\n\n---\n\n## Disadvantages of Denormalization\n\n- **Data redundancy:** The same fact is stored in multiple places\n- **Update anomalies:** Changing one piece of data requires updating multiple rows\n- **Increased storage:** Duplicate data takes more space\n- **Risk of inconsistency:** If one copy is updated but others are not\n\n---\n\n## When to Denormalize\n\n| Scenario | Recommendation |\n|---|---|\n| OLAP / data warehouse | Denormalize (star schema, flat tables) |\n| Heavy reporting with millions of rows | Denormalize key summary columns |\n| Real-time leaderboard / dashboard | Precomputed aggregates |\n| OLTP (banking, order processing) | Stay normalized — writes are frequent |\n\n---\n\n## Common Denormalization Techniques\n\n1. **Storing computed/derived values:** e.g. storing `total_price` in `Orders` rather than calculating it from `OrderItems` each time.\n2. **Duplicating frequently-joined columns:** e.g. copying `customer_name` into the `Orders` table.\n3. **Combining tables:** Merging `Employees` and `Departments` when the department data is small and rarely changes.\n4. **Pre-aggregated summary tables:** A `MonthlySales` table updated nightly for dashboard use.\n\n---\n\n> **Exam tip:** Denormalization is a deliberate trade-off. Always justify it with a specific performance need — not just \"it's faster.\"";
    });

    // ── A3.3 Lessons ──────────────────────────────────────────────────────────

    lessons.add({
      id = 11; moduleId = 3; order = 1;
      difficulty = #Beginner; durationMinutes = 20; isHL = false;
      title = "DDL & DML";
      description = "Distinguish Data Definition Language (DDL) from Data Manipulation Language (DML) and know which SQL statements belong to each.";
      content = "## DDL & DML\n\nSQL is divided into sub-languages. The two most important for A3 are **DDL** and **DML**.\n\n---\n\n## Data Definition Language (DDL)\n\nDDL statements **define and modify the database structure** (schema). They affect *tables, columns, constraints, and indexes* — not the data inside.\n\n| Statement | Purpose |\n|---|---|\n| `CREATE TABLE` | Create a new table |\n| `ALTER TABLE` | Modify an existing table (add/drop columns) |\n| `DROP TABLE` | Delete a table and all its data |\n| `TRUNCATE TABLE` | Remove all rows but keep the table structure |\n| `CREATE INDEX` | Create an index on column(s) |\n\n```sql\n-- DDL: define structure\nCREATE TABLE Products (\n  product_id   INT           PRIMARY KEY,\n  product_name VARCHAR(200)  NOT NULL,\n  price        DECIMAL(8,2)  NOT NULL,\n  stock_qty    INT           DEFAULT 0\n);\n\nALTER TABLE Products ADD COLUMN category VARCHAR(50);\nDROP TABLE Products;\n```\n\n---\n\n## Data Manipulation Language (DML)\n\nDML statements **read and modify the data** inside tables.\n\n| Statement | Purpose |\n|---|---|\n| `SELECT` | Query/retrieve data |\n| `INSERT INTO` | Add new rows |\n| `UPDATE ... SET` | Modify existing rows |\n| `DELETE FROM` | Remove rows |\n\n```sql\n-- DML: manipulate data\nINSERT INTO Products (product_id, product_name, price) VALUES (1, 'Notebook', 3.99);\nUPDATE Products SET price = 4.49 WHERE product_id = 1;\nSELECT * FROM Products WHERE price > 3.00;\nDELETE FROM Products WHERE stock_qty = 0;\n```\n\n---\n\n## Summary\n\n| | DDL | DML |\n|---|---|---|\n| Affects | Structure (schema) | Data (rows) |\n| Auto-committed | Yes (usually) | Transactional |\n| Examples | CREATE, ALTER, DROP | SELECT, INSERT, UPDATE, DELETE |";
    });

    lessons.add({
      id = 12; moduleId = 3; order = 2;
      difficulty = #Beginner; durationMinutes = 30; isHL = false;
      title = "SELECT Queries";
      description = "Write SELECT queries with WHERE, ORDER BY, GROUP BY, HAVING, DISTINCT, BETWEEN, and LIKE.";
      content = "## SELECT Queries\n\nThe `SELECT` statement retrieves data from one or more tables.\n\n---\n\n## Basic Syntax\n\n```sql\nSELECT column1, column2\nFROM table_name\nWHERE condition\nORDER BY column1 ASC;\n```\n\n---\n\n## Key Clauses\n\n### DISTINCT — remove duplicates\n```sql\nSELECT DISTINCT country FROM Customers;\n```\n\n### WHERE — filter rows\n```sql\nSELECT * FROM Products WHERE price > 10.00;\nSELECT * FROM Products WHERE category = 'Electronics' AND stock_qty > 0;\nSELECT * FROM Orders   WHERE status = 'pending' OR status = 'processing';\nSELECT * FROM Products WHERE category NOT IN ('Books', 'Toys');\n```\n\n### BETWEEN — inclusive range\n```sql\nSELECT * FROM Orders WHERE order_date BETWEEN '2024-01-01' AND '2024-12-31';\nSELECT * FROM Products WHERE price BETWEEN 5.00 AND 20.00;\n```\n\n### LIKE — pattern matching\n```sql\nSELECT * FROM Customers WHERE last_name LIKE 'Sm%';   -- starts with Sm\nSELECT * FROM Products  WHERE product_name LIKE '%USB%';  -- contains USB\nSELECT * FROM Emails    WHERE email LIKE '%@gmail.com';\n```\n\n### ORDER BY — sort results\n```sql\nSELECT * FROM Products ORDER BY price ASC;     -- cheapest first\nSELECT * FROM Products ORDER BY price DESC;    -- most expensive first\nSELECT * FROM Students ORDER BY last_name ASC, first_name ASC;\n```\n\n### GROUP BY — aggregate by category\n```sql\nSELECT category, COUNT(*) AS product_count\nFROM Products\nGROUP BY category;\n```\n\n### HAVING — filter on aggregated groups\n```sql\nSELECT category, COUNT(*) AS product_count\nFROM Products\nGROUP BY category\nHAVING COUNT(*) > 5;\n```\n\n> **WHERE vs HAVING:** `WHERE` filters individual rows *before* grouping; `HAVING` filters groups *after* grouping.\n\n---\n\n## Logical Operators\n\n| Operator | Meaning |\n|---|---|\n| `AND` | Both conditions true |\n| `OR` | At least one condition true |\n| `NOT` | Negates the condition |\n| `IN (...)` | Value matches any in list |\n| `BETWEEN a AND b` | Inclusive range |\n| `LIKE` | Pattern match |\n| `IS NULL` / `IS NOT NULL` | Null check |";
    });

    lessons.add({
      id = 13; moduleId = 3; order = 3;
      difficulty = #Intermediate; durationMinutes = 35; isHL = false;
      title = "JOINs & Filtering Across Tables";
      description = "Combine data from multiple tables using INNER JOIN, LEFT JOIN, and other join types with filtering and ordering.";
      content = "## JOINs & Filtering Across Tables\n\nA **JOIN** combines rows from two or more tables based on a related column.\n\n---\n\n## INNER JOIN\n\nReturns only rows where the join condition is **true in both tables**.\n\n```sql\nSELECT Orders.order_id, Customers.name, Orders.total\nFROM Orders\nINNER JOIN Customers ON Orders.customer_id = Customers.customer_id\nWHERE Orders.total > 100\nORDER BY Orders.order_date DESC;\n```\n\n---\n\n## LEFT JOIN (LEFT OUTER JOIN)\n\nReturns **all rows from the left table** and matched rows from the right. Unmatched right rows return NULL.\n\n```sql\n-- All customers, even those with no orders\nSELECT Customers.name, Orders.order_id\nFROM Customers\nLEFT JOIN Orders ON Customers.customer_id = Orders.customer_id;\n```\n\n---\n\n## RIGHT JOIN & FULL OUTER JOIN\n\n```sql\n-- All rows from right table\nSELECT * FROM Orders RIGHT JOIN Customers ON Orders.customer_id = Customers.customer_id;\n\n-- All rows from both tables (not all DBMS support this)\nSELECT * FROM Orders FULL OUTER JOIN Customers ON Orders.customer_id = Customers.customer_id;\n```\n\n---\n\n## Three-Table JOIN\n\n```sql\nSELECT\n  s.full_name     AS student,\n  c.course_name   AS course,\n  g.mark\nFROM Students s\nINNER JOIN Enrolments e ON s.student_id = e.student_id\nINNER JOIN Courses    c ON e.course_id   = c.course_id\nINNER JOIN Grades     g ON g.student_id  = s.student_id\n                        AND g.course_id  = c.course_id\nWHERE g.mark >= 70\nORDER BY g.mark DESC;\n```\n\n---\n\n## Aliases\n\nAliases (`AS`) make long queries more readable:\n```sql\nSELECT p.product_name, s.supplier_name\nFROM Products AS p\nINNER JOIN Suppliers AS s ON p.supplier_id = s.supplier_id;\n```\n\n---\n\n## Common JOIN Pitfall\n\nForgetting the `ON` condition creates a **Cartesian product** — every row from table A paired with every row from table B.\n```sql\n-- WRONG — Cartesian product\nSELECT * FROM Orders, Customers;\n\n-- CORRECT\nSELECT * FROM Orders INNER JOIN Customers ON Orders.customer_id = Customers.customer_id;\n```";
    });

    lessons.add({
      id = 14; moduleId = 3; order = 4;
      difficulty = #Intermediate; durationMinutes = 25; isHL = false;
      title = "INSERT, UPDATE & DELETE";
      description = "Modify database content with INSERT INTO, UPDATE SET, and DELETE, and understand performance implications.";
      content = "## INSERT, UPDATE & DELETE\n\n## INSERT INTO — Add New Records\n\n```sql\n-- Insert a single row\nINSERT INTO Students (student_id, full_name, email, enrol_year)\nVALUES (101, 'Alice Johnson', 'alice@school.edu', 2024);\n\n-- Insert multiple rows at once\nINSERT INTO Products (product_id, name, price, category)\nVALUES\n  (1, 'Notebook',  3.99, 'Stationery'),\n  (2, 'Ballpoint', 1.49, 'Stationery'),\n  (3, 'USB Hub',   24.99, 'Electronics');\n\n-- Insert from a SELECT\nINSERT INTO ArchivedOrders\nSELECT * FROM Orders WHERE order_date < '2023-01-01';\n```\n\n---\n\n## UPDATE SET — Modify Existing Records\n\n```sql\n-- Update a single column\nUPDATE Products\nSET price = 4.49\nWHERE product_id = 1;\n\n-- Update multiple columns\nUPDATE Students\nSET email = 'alice.j@school.edu', year_group = 12\nWHERE student_id = 101;\n\n-- Update with calculation\nUPDATE Products\nSET price = price * 1.05    -- 5% price increase\nWHERE category = 'Electronics';\n```\n\n> ⚠️ **Always use WHERE with UPDATE.** Without it, every row in the table is updated.\n\n---\n\n## DELETE — Remove Records\n\n```sql\n-- Delete specific rows\nDELETE FROM Products WHERE stock_qty = 0;\n\n-- Delete with JOIN condition\nDELETE FROM OrderItems WHERE order_id IN (\n  SELECT order_id FROM Orders WHERE status = 'cancelled'\n);\n```\n\n> ⚠️ **Always use WHERE with DELETE.** `DELETE FROM Products;` deletes every row.\n\n---\n\n## Performance Implications of Updating Indexed Columns\n\nWhen you update a column that has an **index**, the database must:\n1. Update the data row\n2. Remove the old entry from the index\n3. Insert the new entry into the index\n\nThis makes `UPDATE` on indexed columns **slower** than on non-indexed columns.\n\n**Trade-off:** Indexes speed up `SELECT`; they slow down `INSERT`, `UPDATE`, and `DELETE`. Design indexes based on the most common query patterns.";
    });

    lessons.add({
      id = 15; moduleId = 3; order = 5;
      difficulty = #Intermediate; durationMinutes = 25; isHL = true;
      title = "Aggregate Functions (HL)";
      description = "Higher Level: Use COUNT, SUM, AVG, MAX, and MIN to calculate summary statistics within SQL queries.";
      content = "## Aggregate Functions (Higher Level)\n\nAggregate functions compute a **single result** from a set of rows.\n\n---\n\n## The Five Aggregate Functions\n\n| Function | Description | Example result |\n|---|---|---|\n| `COUNT(*)` | Number of rows | 142 |\n| `COUNT(col)` | Non-NULL values in column | 138 |\n| `SUM(col)` | Total of numeric column | 48920.50 |\n| `AVG(col)` | Mean of numeric column | 344.51 |\n| `MAX(col)` | Largest value | 9999.00 |\n| `MIN(col)` | Smallest value | 0.99 |\n\n---\n\n## Examples\n\n```sql\n-- Total number of orders\nSELECT COUNT(*) AS total_orders FROM Orders;\n\n-- Total revenue\nSELECT SUM(total) AS revenue FROM Orders;\n\n-- Average product price per category\nSELECT category, AVG(price) AS avg_price\nFROM Products\nGROUP BY category\nORDER BY avg_price DESC;\n\n-- Most expensive and cheapest product\nSELECT MAX(price) AS highest, MIN(price) AS lowest FROM Products;\n\n-- Categories with more than 10 products (HAVING with aggregate)\nSELECT category, COUNT(*) AS cnt\nFROM Products\nGROUP BY category\nHAVING COUNT(*) > 10;\n```\n\n---\n\n## NULLs and Aggregates\n\n`COUNT(*)` counts all rows including NULLs.  \n`COUNT(column)` counts only non-NULL values in that column.  \n`SUM`, `AVG`, `MAX`, `MIN` all **ignore NULL values** automatically.\n\n```sql\n-- Count students with an email on record (ignores NULL emails)\nSELECT COUNT(email) FROM Students;\n```\n\n---\n\n## Combining with GROUP BY and HAVING\n\n```sql\nSELECT\n  department,\n  COUNT(*)      AS headcount,\n  AVG(salary)   AS avg_salary,\n  MAX(salary)   AS top_salary\nFROM Employees\nGROUP BY department\nHAVING AVG(salary) > 50000\nORDER BY avg_salary DESC;\n```";
    });

    lessons.add({
      id = 16; moduleId = 3; order = 6;
      difficulty = #Advanced; durationMinutes = 25; isHL = true;
      title = "Database Views (HL)";
      description = "Higher Level: Create and use virtual views and materialized views to simplify queries and control data access.";
      content = "## Database Views (Higher Level)\n\nA **view** is a saved SQL query that behaves like a table. It does not store data itself — it is a *virtual* table.\n\n---\n\n## Creating a View\n\n```sql\nCREATE VIEW StudentGrades AS\nSELECT\n  s.student_id,\n  s.full_name,\n  c.course_name,\n  g.mark,\n  g.grade_letter\nFROM Students s\nJOIN Grades g     ON s.student_id = g.student_id\nJOIN Courses c    ON g.course_id  = c.course_id;\n\n-- Use it like a table\nSELECT * FROM StudentGrades WHERE grade_letter = 'A';\n```\n\n---\n\n## Virtual Views vs Materialized (Snapshot) Views\n\n| | Virtual View | Materialized View |\n|---|---|---|\n| Data stored? | No — query re-runs each time | Yes — physically stored result |\n| Always up to date? | Yes | No — must be refreshed |\n| Performance | Slower (query re-executed) | Faster (pre-computed) |\n| Use case | Security, simplicity | Reporting, dashboards |\n\n```sql\n-- Materialized view (PostgreSQL syntax)\nCREATE MATERIALIZED VIEW MonthlySales AS\nSELECT\n  DATE_TRUNC('month', order_date) AS month,\n  SUM(total)                      AS revenue\nFROM Orders\nGROUP BY 1;\n\n-- Refresh manually\nREFRESH MATERIALIZED VIEW MonthlySales;\n```\n\n---\n\n## Benefits of Views\n\n| Benefit | Explanation |\n|---|---|\n| **Security** | Expose only certain columns/rows to specific users |\n| **Simplicity / hiding complexity** | Wrap complex JOINs in a simple name |\n| **Consistency** | One canonical query definition |\n| **Independence** | Applications can use the view; the underlying schema can change |\n| **Performance** | Materialized views cache expensive computations |\n\n---\n\n## Dropping a View\n\n```sql\nDROP VIEW StudentGrades;\nDROP MATERIALIZED VIEW MonthlySales;\n```";
    });

    lessons.add({
      id = 17; moduleId = 3; order = 7;
      difficulty = #Advanced; durationMinutes = 30; isHL = true;
      title = "ACID & Transactions (HL)";
      description = "Higher Level: Use BEGIN TRANSACTION, COMMIT, and ROLLBACK, and understand how ACID properties maintain data integrity.";
      content = "## ACID & Transactions (Higher Level)\n\nA **transaction** is a sequence of SQL operations treated as a single logical unit of work.\n\n---\n\n## ACID Properties\n\n| Property | Meaning |\n|---|---|\n| **Atomicity** | All operations succeed, or none of them do (all-or-nothing) |\n| **Consistency** | The database moves from one valid state to another; no integrity rules are broken |\n| **Isolation** | Concurrent transactions do not interfere with each other |\n| **Durability** | Once committed, changes survive system crashes |\n\n---\n\n## TCL Commands\n\n| Command | Purpose |\n|---|---|\n| `BEGIN TRANSACTION` | Start a transaction |\n| `COMMIT` | Permanently save all changes in the transaction |\n| `ROLLBACK` | Undo all changes since BEGIN |\n| `SAVEPOINT name` | Set a partial rollback point |\n\n---\n\n## Example: Bank Transfer\n\n```sql\nBEGIN TRANSACTION;\n\n  -- Debit Alice\n  UPDATE Accounts SET balance = balance - 500 WHERE account_id = 1;\n\n  -- Credit Bob\n  UPDATE Accounts SET balance = balance + 500 WHERE account_id = 2;\n\n  -- If both succeed, commit\n  COMMIT;\n\n-- If anything fails, roll back both\nROLLBACK;\n```\n\nWithout ACID, a crash between the two UPDATE statements could deduct from Alice without crediting Bob — money disappears.\n\n---\n\n## Atomicity in Practice\n\n```sql\nBEGIN TRANSACTION;\n  INSERT INTO Orders (customer_id, total) VALUES (42, 199.99);\n  INSERT INTO OrderItems (order_id, product_id, qty) VALUES (LAST_INSERT_ID(), 7, 2);\nCOMMIT;\n```\n\nIf the second INSERT fails (e.g. product 7 does not exist), the ROLLBACK removes the incomplete order too — no orphaned records.\n\n---\n\n## Isolation Levels\n\nIsolation levels control how visible uncommitted changes are to other transactions:\n\n| Level | Dirty Read | Non-repeatable Read | Phantom Read |\n|---|---|---|---|\n| Read Uncommitted | ✅ possible | ✅ possible | ✅ possible |\n| Read Committed | ❌ prevented | ✅ possible | ✅ possible |\n| Repeatable Read | ❌ prevented | ❌ prevented | ✅ possible |\n| Serializable | ❌ prevented | ❌ prevented | ❌ prevented |";
    });

    // ── A3.4 Lessons (all HL) ─────────────────────────────────────────────────

    lessons.add({
      id = 18; moduleId = 4; order = 1;
      difficulty = #Advanced; durationMinutes = 30; isHL = true;
      title = "Alternative Database Models (HL)";
      description = "Higher Level: Survey NoSQL, cloud, spatial, and in-memory database models with real-world use cases.";
      content = "## Alternative Database Models (Higher Level)\n\nRelational databases are not the only option. Different data shapes and workloads call for different storage models.\n\n---\n\n## NoSQL Databases\n\nNoSQL (\"Not only SQL\") databases sacrifice strict schema and relational integrity for flexibility, scale, and speed.\n\n| Type | Structure | Example system | Use case |\n|---|---|---|---|\n| **Document** | JSON/BSON documents | MongoDB | User profiles, product catalogues |\n| **Key-Value** | Key → opaque value | Redis, DynamoDB | Sessions, shopping carts |\n| **Column-family** | Rows with dynamic columns | Apache Cassandra | Time-series, IoT telemetry |\n| **Graph** | Nodes and edges | Neo4j | Social networks, fraud detection |\n\n### NoSQL Trade-offs (CAP Theorem)\n\nDistributed systems can guarantee at most **two** of:\n- **Consistency** — every read sees the latest write\n- **Availability** — every request gets a response\n- **Partition tolerance** — system continues despite network splits\n\n---\n\n## Cloud Databases\n\nManaged database services hosted by cloud providers — no server administration required.\n\n| Example | Type |\n|---|---|\n| Amazon RDS | Managed relational (MySQL, PostgreSQL) |\n| Google Firestore | Document (NoSQL) |\n| Azure Cosmos DB | Multi-model (document, graph, key-value) |\n| Snowflake | Cloud data warehouse |\n\nReal-world use: SaaS applications, auto-scaling web backends, multi-region data replication.\n\n---\n\n## Spatial Databases\n\nOptimized for storing and querying geographic data.\n\n- Store points, lines, polygons (GIS data)\n- Specialized indexing (R-trees) for spatial queries\n- Extensions: **PostGIS** (PostgreSQL), **MySQL Spatial**\n\nReal-world use: Google Maps, ride-sharing (nearest driver), real estate platforms.\n\n```sql\n-- Find all restaurants within 1 km\nSELECT name FROM Restaurants\nWHERE ST_Distance(location, ST_Point(-0.127, 51.507)) < 1000;\n```\n\n---\n\n## In-Memory Databases\n\nStore all data in RAM rather than on disk — extremely low latency.\n\n- **Redis** — key-value store, used for caching, pub/sub, leaderboards\n- **Memcached** — simple distributed cache\n- **VoltDB** — in-memory relational database for real-time analytics\n\nReal-world use: session stores, real-time analytics dashboards, game leaderboards.\n\n**Trade-off:** Data is lost if the server restarts (unless persistence is configured).";
    });

    lessons.add({
      id = 19; moduleId = 4; order = 2;
      difficulty = #Advanced; durationMinutes = 30; isHL = true;
      title = "Data Warehouses (HL)";
      description = "Higher Level: Understand the purpose and characteristics of data warehouses and how they differ from operational databases.";
      content = "## Data Warehouses (Higher Level)\n\nA **data warehouse** is a centralised repository of integrated data from multiple sources, optimized for **analytical queries** and **business intelligence**.\n\n---\n\n## Characteristics\n\n| Property | Description |\n|---|---|\n| **Subject-oriented** | Organised around business subjects (Sales, HR, Finance) not applications |\n| **Integrated** | Data from multiple sources cleaned and unified into a consistent format |\n| **Time-variant** | Historical data preserved; records are timestamped |\n| **Non-volatile** | Data is loaded in bulk and rarely updated or deleted |\n| **Append-only** | New data is added; old data is not changed |\n| **Optimized for query performance** | Denormalized schemas, columnar storage, pre-aggregated data |\n\n---\n\n## Operational DB vs Data Warehouse\n\n| | Operational DB (OLTP) | Data Warehouse (OLAP) |\n|---|---|---|\n| Purpose | Daily transactions | Historical analysis |\n| Data freshness | Real-time | Batch loads (nightly/weekly) |\n| Query type | Simple, frequent | Complex, analytical |\n| Schema | Normalized (3NF) | Denormalized (star/snowflake) |\n| Users | Many concurrent | Fewer analysts |\n| Row count | Millions | Billions |\n\n---\n\n## Star Schema\n\nThe most common data warehouse schema:\n\n```\n                  [Date Dimension]\n                       │\n[Product Dimension] ──[Fact Table: Sales]── [Customer Dimension]\n                       │\n                  [Store Dimension]\n```\n\n- **Fact table:** contains measurable events (sale amount, quantity)\n- **Dimension tables:** context for each fact (who, what, where, when)\n\n---\n\n## ETL Pipeline\n\nData reaches a warehouse via **ETL (Extract, Transform, Load)**:\n\n1. **Extract** — Pull raw data from OLTP databases, CSV files, APIs\n2. **Transform** — Clean, standardize, deduplicate, aggregate\n3. **Load** — Insert into the warehouse tables\n\nModern systems often use **ELT** (load first, transform inside the warehouse using SQL).";
    });

    lessons.add({
      id = 20; moduleId = 4; order = 3;
      difficulty = #Advanced; durationMinutes = 35; isHL = true;
      title = "OLAP & Data Mining (HL)";
      description = "Higher Level: Explain OLAP for multidimensional analysis and survey data mining techniques for business intelligence.";
      content = "## OLAP & Data Mining (Higher Level)\n\n---\n\n## OLAP (Online Analytical Processing)\n\nOLAP tools let analysts explore data across **multiple dimensions** interactively.\n\n### OLAP Operations\n\n| Operation | Meaning | Example |\n|---|---|---|\n| **Roll-up** | Aggregate to higher level | Daily → Monthly → Yearly sales |\n| **Drill-down** | Expand to lower level | Yearly → Quarterly → Monthly |\n| **Slice** | Filter one dimension | Sales in 2024 only |\n| **Dice** | Filter multiple dimensions | Sales in 2024 in the UK |\n| **Pivot** | Rotate the data cube | Swap rows and columns |\n\n### OLAP Cube\n\nAn OLAP cube stores pre-aggregated data along dimensions (time, geography, product) so queries can be answered in milliseconds instead of minutes.\n\n---\n\n## Data Mining\n\nData mining discovers **patterns and insights** in large datasets automatically.\n\n### Techniques\n\n| Technique | Description | Example |\n|---|---|---|\n| **Classification** | Assign items to predefined categories | Spam vs. not spam |\n| **Clustering** | Group similar items without labels | Customer segments |\n| **Regression** | Predict a continuous value | House price prediction |\n| **Association rule discovery** | Find items that co-occur | \"People who buy X also buy Y\" |\n| **Sequential pattern discovery** | Find ordered event sequences | Clickstream path analysis |\n| **Anomaly detection** | Identify outliers | Credit card fraud |\n\n---\n\n## Business Intelligence (BI) Workflow\n\n```\nRaw Data Sources\n    │  ETL\n    ▼\nData Warehouse\n    │  OLAP / SQL\n    ▼\nData Cubes / Aggregates\n    │  Data Mining / ML\n    ▼\nInsights / Dashboards / Reports\n    │\n    ▼\nBusiness Decisions\n```\n\n---\n\n## Real-World Examples\n\n- **Retail:** Association rules reveal that customers buying nappies also buy beer → optimize shelf placement.\n- **Banking:** Anomaly detection flags unusual transactions as potential fraud in real time.\n- **Healthcare:** Clustering groups patients by risk profile for targeted preventive care.\n- **E-commerce:** Recommendation engines use collaborative filtering (a clustering/association technique) to suggest products.";
    });

    lessons.add({
      id = 21; moduleId = 4; order = 4;
      difficulty = #Advanced; durationMinutes = 35; isHL = true;
      title = "Distributed Databases (HL)";
      description = "Higher Level: Describe the features of distributed databases, including replication, partitioning, fault tolerance, and distributed ACID.";
      content = "## Distributed Databases (Higher Level)\n\nA **distributed database** stores data across multiple physical locations (servers or data centres) but appears to users as a single system.\n\n---\n\n## Key Features\n\n| Feature | Description |\n|---|---|\n| **Distribution transparency** | Users are unaware of where data physically lives |\n| **Location transparency** | Queries work the same regardless of data location |\n| **Replication** | Copies of data kept on multiple nodes for availability |\n| **Partitioning (sharding)** | Data split across nodes by range or hash of a key |\n| **Fault tolerance** | System continues operating when nodes fail |\n| **Scalability** | Add more nodes to handle more data / traffic |\n| **Concurrency control** | Distributed locking or MVCC to prevent conflicts |\n| **Data consistency** | All replicas eventually agree on the same value |\n| **Security** | Data in transit encrypted; access control per node |\n| **Global query processing** | Queries span multiple nodes and results are merged |\n\n---\n\n## Replication Strategies\n\n| Strategy | Description |\n|---|---|\n| **Synchronous** | All replicas updated before commit confirmed — strong consistency, slower |\n| **Asynchronous** | Primary commits; replicas update later — faster writes, possible lag |\n| **Master-slave** | One primary handles writes; replicas handle reads |\n| **Multi-master** | Multiple nodes accept writes; conflicts must be resolved |\n\n---\n\n## Partitioning (Sharding)\n\n- **Horizontal partitioning (sharding):** Different rows on different nodes. E.g. customers A–M on server 1, N–Z on server 2.\n- **Vertical partitioning:** Different columns on different nodes. Rarely used for sharding.\n\n---\n\n## ACID in Distributed Environments\n\nDistributed ACID is harder because operations span multiple nodes:\n\n- **Two-Phase Commit (2PC):** Coordinator asks all nodes to *prepare*, then sends *commit* if all agree.\n- **Three-Phase Commit (3PC):** Adds a timeout phase to handle coordinator failure.\n- **Distributed transactions** (e.g. Google Spanner, CockroachDB) use clock synchronization (TrueTime) to achieve global ACID.\n\n---\n\n## CAP Theorem Revisited\n\nFor distributed systems, you can guarantee only **two** of:\n- **Consistency** — every read sees the latest write\n- **Availability** — every request gets a response\n- **Partition tolerance** — system continues despite network splits\n\nMost distributed databases choose **AP** (available + partition-tolerant) for high availability, accepting eventual consistency.";
    });
  };

  // ─── Query Helpers ─────────────────────────────────────────────────────────

  /// Returns all modules sorted by order
  public func getAllModules(
    modules : List.List<Module>
  ) : [Module] {
    let arr = modules.toArray();
    arr.sort(func(a : Module, b : Module) : { #less; #equal; #greater } { Nat.compare(a.order, b.order) })
  };

  /// Returns all lessons for a given module, sorted by order
  public func getLessonsForModule(
    lessons : List.List<Lesson>,
    moduleId : ModuleId
  ) : [Lesson] {
    let filtered = lessons.filter(func(l : Lesson) : Bool { l.moduleId == moduleId });
    let arr = filtered.toArray();
    arr.sort(func(a : Lesson, b : Lesson) : { #less; #equal; #greater } { Nat.compare(a.order, b.order) })
  };

  /// Returns the full course overview (public, no auth)
  public func getCourseOverview(
    modules : List.List<Module>,
    lessons : List.List<Lesson>
  ) : CourseOverview {
    let totalLessons = lessons.size();
    let totalDurationMinutes = lessons.foldLeft(0, func(acc : Nat, l : Lesson) : Nat { acc + l.durationMinutes });
    {
      title = "A3 Databases: Standard & Higher Level";
      description = "A comprehensive, interactive course covering the complete A3 Databases syllabus — relational fundamentals, database design, SQL programming, and Higher Level topics including NoSQL, data warehouses, OLAP, and distributed systems.";
      totalModules = modules.size();
      totalLessons = totalLessons;
      estimatedHours = (totalDurationMinutes + 59) / 60;
    }
  };

  /// Returns all modules with their lessons and per-user completion status
  public func getModulesWithStatus(
    modules : List.List<Module>,
    lessons : List.List<Lesson>,
    completions : Map.Map<UserId, List.List<LessonCompletion>>,
    userId : UserId
  ) : [ModuleWithLessons] {
    let userCompletions : List.List<LessonCompletion> = switch (completions.get(userId)) {
      case (?c) c;
      case null List.empty<LessonCompletion>();
    };

    let sortedModules = getAllModules(modules);

    sortedModules.map<Module, ModuleWithLessons>(
      func(m : Module) : ModuleWithLessons {
        let moduleLessons = getLessonsForModule(lessons, m.id);
        let lessonsWithStatus = moduleLessons.map(
          func(l : Lesson) : LessonWithStatus {
            let completion = userCompletions.find(func(c : LessonCompletion) : Bool { c.lessonId == l.id });
            switch (completion) {
              case (?c) {
                let lws : LessonWithStatus = { lesson = l; completed = true; completedAt = ?c.completedAt };
                lws
              };
              case null {
                let lws : LessonWithStatus = { lesson = l; completed = false; completedAt = null };
                lws
              };
            }
          }
        );
        let completedCount = lessonsWithStatus.foldLeft(
          0,
          func(acc : Nat, lws : LessonWithStatus) : Nat { if (lws.completed) acc + 1 else acc }
        );
        {
          module_ = m;
          lessons = lessonsWithStatus;
          completedCount = completedCount;
          totalCount = moduleLessons.size();
        }
      }
    )
  };

  /// Enroll a user in the course; returns false if already enrolled
  public func enrollUser(
    enrollments : Map.Map<UserId, Enrollment>,
    userId : UserId,
    now : Int
  ) : Bool {
    if (enrollments.containsKey(userId)) {
      return false;
    };
    enrollments.add(userId, { userId = userId; enrolledAt = now });
    true
  };

  /// Check whether a user is enrolled
  public func isEnrolled(
    enrollments : Map.Map<UserId, Enrollment>,
    userId : UserId
  ) : Bool {
    enrollments.containsKey(userId)
  };

  /// Mark a lesson complete for a user; enforces sequential ordering.
  public func completeLesson(
    enrollments : Map.Map<UserId, Enrollment>,
    completions : Map.Map<UserId, List.List<LessonCompletion>>,
    lessons : List.List<Lesson>,
    userId : UserId,
    lessonId : LessonId,
    now : Int
  ) : { #ok; #err : Text } {
    if (not enrollments.containsKey(userId)) {
      return #err("You must enroll in the course before completing lessons.");
    };

    // Find the lesson
    let lessonOpt = lessons.find(func(l : Lesson) : Bool { l.id == lessonId });
    let lesson = switch (lessonOpt) {
      case (?l) l;
      case null return #err("Lesson not found.");
    };

    // Get or create user completions list
    let userCompletions : List.List<LessonCompletion> = switch (completions.get(userId)) {
      case (?c) c;
      case null {
        let fresh = List.empty<LessonCompletion>();
        completions.add(userId, fresh);
        fresh
      };
    };

    // Check if already completed
    let alreadyDone = userCompletions.find(func(c : LessonCompletion) : Bool { c.lessonId == lessonId });
    if (alreadyDone != null) {
      return #err("This lesson is already marked as complete.");
    };

    // Enforce sequential ordering within the module
    let moduleLessons = getLessonsForModule(lessons, lesson.moduleId);

    // Check prior lesson in the same module is done (if this is not order=1)
    if (lesson.order > 1) {
      let prevLesson = moduleLessons.find(func(l : Lesson) : Bool { l.order == lesson.order - 1 });
      switch (prevLesson) {
        case (?prev) {
          let prevDone = userCompletions.find(func(c : LessonCompletion) : Bool { c.lessonId == prev.id });
          if (prevDone == null) {
            return #err("You must complete the previous lesson first.");
          };
        };
        case null {};
      };
    };

    // Enforce sequential module unlocking: module N requires all lessons of module N-1 done
    if (lesson.order == 1 and lesson.moduleId > 1) {
      // Find all lessons in the previous module
      let prevModuleLessons = getLessonsForModule(lessons, lesson.moduleId - 1);
      let allPrevDone = prevModuleLessons.all(
        func(l : Lesson) : Bool {
          userCompletions.find(func(c : LessonCompletion) : Bool { c.lessonId == l.id }) != null
        }
      );
      if (not allPrevDone) {
        return #err("You must complete all lessons in the previous module before starting this one.");
      };
    };

    userCompletions.add({ lessonId = lessonId; completedAt = now });
    #ok
  };

  /// Returns the list of completed lessons with their completion timestamps
  public func getProgressHistory(
    completions : Map.Map<UserId, List.List<LessonCompletion>>,
    lessons : List.List<Lesson>,
    userId : UserId
  ) : [LessonWithStatus] {
    let userCompletions : List.List<LessonCompletion> = switch (completions.get(userId)) {
      case (?c) c;
      case null return [];
    };
    let result = List.empty<LessonWithStatus>();
    userCompletions.forEach(func(c : LessonCompletion) {
      let lessonOpt = lessons.find(func(l : Lesson) : Bool { l.id == c.lessonId });
      switch (lessonOpt) {
        case (?l) result.add({ lesson = l; completed = true; completedAt = ?c.completedAt });
        case null {};
      };
    });
    result.toArray()
  };

  /// Compute dashboard summary for a user
  public func getDashboard(
    enrollments : Map.Map<UserId, Enrollment>,
    completions : Map.Map<UserId, List.List<LessonCompletion>>,
    modules : List.List<Module>,
    lessons : List.List<Lesson>,
    userId : UserId
  ) : ?DashboardData {
    if (not enrollments.containsKey(userId)) {
      return null;
    };

    let totalLessons = lessons.size();
    let userCompletions : List.List<LessonCompletion> = switch (completions.get(userId)) {
      case (?c) c;
      case null List.empty<LessonCompletion>();
    };
    let completedLessons = userCompletions.size();
    let completionPercentage = if (totalLessons == 0) 0 else (completedLessons * 100) / totalLessons;

    // Find the next lesson: the first lesson (sorted by module order, then lesson order) not yet completed
    let sortedModules = getAllModules(modules);
    var nextLessonId : ?LessonId = null;
    var currentModuleId : ?ModuleId = null;
    label search for (m in sortedModules.vals()) {
      let moduleLessons = getLessonsForModule(lessons, m.id);
      for (l in moduleLessons.vals()) {
        let done = userCompletions.find(func(c : LessonCompletion) : Bool { c.lessonId == l.id });
        if (done == null) {
          nextLessonId := ?l.id;
          currentModuleId := ?m.id;
          break search;
        };
      };
    };

    ?{
      completionPercentage = completionPercentage;
      currentModuleId = currentModuleId;
      nextLessonId = nextLessonId;
      totalLessons = totalLessons;
      completedLessons = completedLessons;
    }
  };

  /// Generate a deterministic certificate ID from userId + timestamp
  func makeCertId(userId : UserId, now : Int, level : CertificateLevel) : Text {
    let suffix = switch (level) { case (#StandardLevel) "SL"; case (#HigherLevel) "HL" };
    "CERT-" # userId.toText() # "-" # suffix # "-" # now.toText()
  };

  /// SL lessons are in modules 1, 2, 3 and are not HL-only.
  /// HL lessons are in module 4 or are HL-flagged in modules 1-3.
  func slLessons(lessons : List.List<Lesson>) : List.List<Lesson> {
    lessons.filter(func(l : Lesson) : Bool { not l.isHL })
  };

  func hlLessons(lessons : List.List<Lesson>) : List.List<Lesson> {
    lessons.filter(func(l : Lesson) : Bool { l.isHL })
  };

  /// Check if a user has completed all Standard Level lessons
  func hasCompletedSL(
    userCompletions : List.List<LessonCompletion>,
    lessons : List.List<Lesson>
  ) : Bool {
    let sl = slLessons(lessons);
    if (sl.size() == 0) return false;
    sl.all(func(l : Lesson) : Bool {
      userCompletions.find(func(c : LessonCompletion) : Bool { c.lessonId == l.id }) != null
    })
  };

  /// Check if a user has completed all lessons (SL + HL)
  func hasCompletedHL(
    userCompletions : List.List<LessonCompletion>,
    lessons : List.List<Lesson>
  ) : Bool {
    if (lessons.size() == 0) return false;
    lessons.all(func(l : Lesson) : Bool {
      userCompletions.find(func(c : LessonCompletion) : Bool { c.lessonId == l.id }) != null
    })
  };

  /// Issue a certificate if the user qualifies for SL or HL.
  /// Returns the newly issued certificate, or null if no new cert issued.
  public func maybeIssueCertificate(
    completions : Map.Map<UserId, List.List<LessonCompletion>>,
    certificates : Map.Map<UserId, Certificate>,
    lessons : List.List<Lesson>,
    userId : UserId,
    learnerName : Text,
    now : Int
  ) : ?Certificate {
    let userCompletions : List.List<LessonCompletion> = switch (completions.get(userId)) {
      case (?c) c;
      case null return null;
    };

    // Check if HL cert already exists
    switch (certificates.get(userId)) {
      case (?existing) {
        if (existing.level == #HigherLevel) return null; // already highest cert
        // Has SL cert — check if now eligible for HL
        if (hasCompletedHL(userCompletions, lessons)) {
          let completedAt = userCompletions.foldLeft(
            0 : Int,
            func(acc : Int, c : LessonCompletion) : Int { if (c.completedAt > acc) c.completedAt else acc }
          );
          let cert : Certificate = {
            id = makeCertId(userId, now, #HigherLevel);
            userId = userId;
            learnerName = learnerName;
            courseTitle = "A3 Databases — Higher Level";
            level = #HigherLevel;
            completedAt = completedAt;
            issuedAt = now;
          };
          certificates.add(userId, cert);
          return ?cert;
        };
        return null;
      };
      case null {};
    };

    // No certificate yet — check HL first (subsumes SL)
    if (hasCompletedHL(userCompletions, lessons)) {
      let completedAt = userCompletions.foldLeft(
        0 : Int,
        func(acc : Int, c : LessonCompletion) : Int { if (c.completedAt > acc) c.completedAt else acc }
      );
      let cert : Certificate = {
        id = makeCertId(userId, now, #HigherLevel);
        userId = userId;
        learnerName = learnerName;
        courseTitle = "A3 Databases — Higher Level";
        level = #HigherLevel;
        completedAt = completedAt;
        issuedAt = now;
      };
      certificates.add(userId, cert);
      return ?cert;
    };

    // Check SL
    if (hasCompletedSL(userCompletions, lessons)) {
      let slOnly = slLessons(lessons);
      let completedAt = userCompletions.foldLeft(
        0 : Int,
        func(acc : Int, c : LessonCompletion) : Int {
          let isSlLesson = slOnly.find(func(l : Lesson) : Bool { l.id == c.lessonId }) != null;
          if (isSlLesson and c.completedAt > acc) c.completedAt else acc
        }
      );
      let cert : Certificate = {
        id = makeCertId(userId, now, #StandardLevel);
        userId = userId;
        learnerName = learnerName;
        courseTitle = "A3 Databases — Standard Level";
        level = #StandardLevel;
        completedAt = completedAt;
        issuedAt = now;
      };
      certificates.add(userId, cert);
      return ?cert;
    };

    null
  };

  /// Retrieve a certificate by principal
  public func getCertificate(
    certificates : Map.Map<UserId, Certificate>,
    userId : UserId
  ) : ?Certificate {
    certificates.get(userId)
  };

  /// Build a user profile (enrollment status, progress, certificates)
  public func getUserProfile(
    enrollments : Map.Map<UserId, Enrollment>,
    completions : Map.Map<UserId, List.List<LessonCompletion>>,
    certificates : Map.Map<UserId, Certificate>,
    lessons : List.List<Lesson>,
    userId : UserId
  ) : UserProfile {
    let isEnrolledUser = enrollments.containsKey(userId);
    let totalLessons = lessons.size();
    let userCompletions : List.List<LessonCompletion> = switch (completions.get(userId)) {
      case (?c) c;
      case null List.empty<LessonCompletion>();
    };
    let completedCount = userCompletions.size();
    let pct = if (totalLessons == 0) 0 else (completedCount * 100) / totalLessons;
    let certs : [Certificate] = switch (certificates.get(userId)) {
      case (?c) [c];
      case null [];
    };
    {
      userId = userId;
      isEnrolled = isEnrolledUser;
      overallProgressPercentage = pct;
      certificates = certs;
    }
  };
};
