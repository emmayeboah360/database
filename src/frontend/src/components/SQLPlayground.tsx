import { useCallback, useEffect, useRef, useState } from "react";

// --- sql.js type declarations ---
interface SqlJsDatabase {
  run: (sql: string) => SqlJsDatabase;
  exec: (sql: string) => SqlJsQueryResult[];
  close: () => void;
}

interface SqlJsQueryResult {
  columns: string[];
  values: (string | number | boolean | null)[][];
}

interface SqlJsStatic {
  Database: new () => SqlJsDatabase;
}

declare global {
  interface Window {
    initSqlJs: (config: {
      locateFile: (file: string) => string;
    }) => Promise<SqlJsStatic>;
  }
}

// --- Database seeding ---
export type DbName = "library" | "ecommerce" | "hospital" | "school";

const DB_SEED: Record<DbName, string> = {
  library: `
CREATE TABLE authors (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT
);
CREATE TABLE books (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  author_id INTEGER REFERENCES authors(id),
  year INTEGER,
  genre TEXT,
  available BOOLEAN DEFAULT 1
);
CREATE TABLE members (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  join_date TEXT
);
CREATE TABLE loans (
  id INTEGER PRIMARY KEY,
  book_id INTEGER REFERENCES books(id),
  member_id INTEGER REFERENCES members(id),
  loan_date TEXT,
  return_date TEXT
);
INSERT INTO authors VALUES
  (1,'George Orwell','United Kingdom'),
  (2,'Gabriel García Márquez','Colombia'),
  (3,'Toni Morrison','United States'),
  (4,'Haruki Murakami','Japan'),
  (5,'J.K. Rowling','United Kingdom');
INSERT INTO books VALUES
  (1,'1984',1,1949,'Dystopian',1),
  (2,'Animal Farm',1,1945,'Satire',0),
  (3,'One Hundred Years of Solitude',2,1967,'Magical Realism',1),
  (4,'Love in the Time of Cholera',2,1985,'Romance',1),
  (5,'Beloved',3,1987,'Historical Fiction',0),
  (6,'The Bluest Eye',3,1970,'Fiction',1),
  (7,'Norwegian Wood',4,1987,'Romance',1),
  (8,'Kafka on the Shore',4,2002,'Magical Realism',0),
  (9,'Harry Potter and the Philosopher Stone',5,1997,'Fantasy',1),
  (10,'Harry Potter and the Chamber of Secrets',5,1998,'Fantasy',1);
INSERT INTO members VALUES
  (1,'Alice Johnson','alice@email.com','2022-01-15'),
  (2,'Bob Smith','bob@email.com','2022-03-20'),
  (3,'Carol White','carol@email.com','2023-06-01'),
  (4,'David Brown','david@email.com','2023-08-12'),
  (5,'Emma Davis','emma@email.com','2024-01-05'),
  (6,'Frank Miller','frank@email.com','2024-03-18');
INSERT INTO loans VALUES
  (1,2,1,'2024-01-10','2024-01-24'),
  (2,5,2,'2024-02-01',NULL),
  (3,8,3,'2024-02-15','2024-03-01'),
  (4,1,4,'2024-03-05','2024-03-19'),
  (5,9,1,'2024-04-01',NULL),
  (6,2,5,'2024-04-10','2024-04-24'),
  (7,5,6,'2024-05-01',NULL),
  (8,3,2,'2024-05-15','2024-05-29');`,

  ecommerce: `
CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  city TEXT,
  country TEXT
);
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  price DECIMAL(10,2),
  stock INTEGER DEFAULT 0
);
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  order_date TEXT,
  total DECIMAL(10,2),
  status TEXT
);
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER,
  unit_price DECIMAL(10,2)
);
INSERT INTO customers VALUES
  (1,'Alice Chen','alice@shop.com','San Francisco','USA'),
  (2,'Bob Torres','bob@shop.com','London','UK'),
  (3,'Clara Müller','clara@shop.com','Berlin','Germany'),
  (4,'David Kim','david@shop.com','Seoul','South Korea'),
  (5,'Eva Rossi','eva@shop.com','Milan','Italy');
INSERT INTO products VALUES
  (1,'Wireless Headphones','Electronics',89.99,150),
  (2,'Mechanical Keyboard','Electronics',129.99,80),
  (3,'USB-C Hub','Electronics',49.99,200),
  (4,'Desk Lamp','Home & Office',34.99,120),
  (5,'Notebook Set','Stationery',12.99,500),
  (6,'Coffee Mug','Kitchen',14.99,300),
  (7,'Yoga Mat','Sports',39.99,75),
  (8,'Running Shoes','Sports',79.99,45);
INSERT INTO orders VALUES
  (1,1,'2024-01-05',179.98,'delivered'),
  (2,2,'2024-01-12',129.99,'delivered'),
  (3,3,'2024-02-03',174.97,'shipped'),
  (4,4,'2024-02-18',44.98,'processing'),
  (5,1,'2024-03-10',119.98,'delivered'),
  (6,5,'2024-03-22',94.98,'shipped');
INSERT INTO order_items VALUES
  (1,1,1,1,89.99),(2,1,3,2,49.99),
  (3,2,2,1,129.99),
  (4,3,1,1,89.99),(5,3,4,1,34.99),(6,3,5,4,12.99),
  (7,4,6,2,14.99),(8,4,5,1,12.99),
  (9,5,7,1,39.99),(10,5,8,1,79.99),
  (11,6,1,1,89.99),(12,6,4,1,34.99);`,

  hospital: `
CREATE TABLE doctors (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT,
  department TEXT
);
CREATE TABLE patients (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  dob TEXT,
  blood_type TEXT,
  phone TEXT
);
CREATE TABLE appointments (
  id INTEGER PRIMARY KEY,
  patient_id INTEGER REFERENCES patients(id),
  doctor_id INTEGER REFERENCES doctors(id),
  date TEXT,
  diagnosis TEXT,
  notes TEXT
);
CREATE TABLE medications (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  dosage TEXT,
  manufacturer TEXT
);
CREATE TABLE prescriptions (
  id INTEGER PRIMARY KEY,
  appointment_id INTEGER REFERENCES appointments(id),
  medication_id INTEGER REFERENCES medications(id),
  quantity INTEGER
);
INSERT INTO doctors VALUES
  (1,'Dr. Sarah Khan','Cardiology','Internal Medicine'),
  (2,'Dr. James Park','Neurology','Neurosciences'),
  (3,'Dr. Maria Lopez','Pediatrics','Child Health'),
  (4,'Dr. Chen Wei','Oncology','Cancer Center');
INSERT INTO patients VALUES
  (1,'Emma Brown','1990-04-12','A+','555-0101'),
  (2,'Liam Wilson','1975-09-22','B-','555-0102'),
  (3,'Olivia Martinez','2005-01-08','O+','555-0103'),
  (4,'Noah Johnson','1988-11-30','AB+','555-0104'),
  (5,'Ava Taylor','1962-07-19','A-','555-0105'),
  (6,'Ethan Anderson','1995-03-25','O-','555-0106');
INSERT INTO appointments VALUES
  (1,1,1,'2024-01-15','Hypertension','BP 140/90, prescribe medication'),
  (2,2,2,'2024-01-20','Migraine','Recurring episodes, MRI scheduled'),
  (3,3,3,'2024-02-05','Seasonal Allergies','Pollen allergy confirmed'),
  (4,4,1,'2024-02-12','Arrhythmia','ECG shows irregular rhythm'),
  (5,5,4,'2024-03-01','Routine Checkup','All vitals normal'),
  (6,6,2,'2024-03-14','Tension Headache','Stress-related'),
  (7,1,4,'2024-04-02','Follow-up','BP improving'),
  (8,3,3,'2024-04-18','Asthma','Mild persistent asthma');
INSERT INTO medications VALUES
  (1,'Lisinopril','10mg daily','PharmaCorp'),
  (2,'Sumatriptan','50mg as needed','MediLabs'),
  (3,'Cetirizine','10mg daily','HealthGen'),
  (4,'Metoprolol','25mg twice daily','CardioPharm'),
  (5,'Salbutamol','100mcg inhaled','RespiCare');
INSERT INTO prescriptions VALUES
  (1,1,1,30),(2,2,2,10),
  (3,3,3,30),(4,4,4,60),
  (5,8,5,1),(6,7,1,30);`,

  school: `
CREATE TABLE students (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  grade INTEGER,
  email TEXT,
  dob TEXT
);
CREATE TABLE teachers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT,
  email TEXT
);
CREATE TABLE courses (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  teacher_id INTEGER REFERENCES teachers(id),
  credits INTEGER,
  grade_level INTEGER
);
CREATE TABLE enrollments (
  id INTEGER PRIMARY KEY,
  student_id INTEGER REFERENCES students(id),
  course_id INTEGER REFERENCES courses(id),
  semester TEXT,
  grade TEXT
);
INSERT INTO students VALUES
  (1,'Alice Nguyen',10,'alice@school.edu','2008-05-14'),
  (2,'Brandon Lee',11,'brandon@school.edu','2007-09-03'),
  (3,'Chloe Adams',10,'chloe@school.edu','2008-02-27'),
  (4,'Dylan Patel',12,'dylan@school.edu','2006-11-18'),
  (5,'Elena Rossi',11,'elena@school.edu','2007-04-22'),
  (6,'Felix Müller',12,'felix@school.edu','2006-08-09'),
  (7,'Grace Kim',10,'grace@school.edu','2008-12-01'),
  (8,'Henry Clark',11,'henry@school.edu','2007-06-16');
INSERT INTO teachers VALUES
  (1,'Ms. Johnson','Mathematics','johnson@school.edu'),
  (2,'Mr. Williams','Computer Science','williams@school.edu'),
  (3,'Ms. Garcia','English Literature','garcia@school.edu'),
  (4,'Dr. Thompson','Physics','thompson@school.edu'),
  (5,'Ms. Patel','Biology','patel@school.edu');
INSERT INTO courses VALUES
  (1,'Algebra II',1,4,10),
  (2,'AP Computer Science',2,5,11),
  (3,'English 10',3,4,10),
  (4,'AP Physics',4,5,12),
  (5,'Biology',5,4,10),
  (6,'Calculus',1,5,12);
INSERT INTO enrollments VALUES
  (1,1,1,'2024-Spring','B+'),
  (2,1,3,'2024-Spring','A'),
  (3,1,5,'2024-Spring','A-'),
  (4,2,2,'2024-Spring','A'),
  (5,2,6,'2024-Spring','B'),
  (6,3,1,'2024-Spring','B'),
  (7,3,3,'2024-Spring','A-'),
  (8,4,4,'2024-Spring','A+'),
  (9,4,6,'2024-Spring','A'),
  (10,5,2,'2024-Spring','B+'),
  (11,5,1,'2024-Spring','A-'),
  (12,6,4,'2024-Spring','B+'),
  (13,7,3,'2024-Spring','A'),
  (14,8,2,'2024-Spring','B');`,
};

// --- Props ---
export interface SQLPlaygroundProps {
  dbName: DbName;
  initialSql: string;
  description?: string;
  hints?: string[];
}

// --- sql.js CDN URLs ---
const SQL_JS_CDN =
  "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js";
const SQL_WASM_CDN =
  "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.wasm";

// --- Singleton loader ---
let sqlJsPromise: Promise<SqlJsStatic> | null = null;

function loadSqlJs(): Promise<SqlJsStatic> {
  if (sqlJsPromise) return sqlJsPromise;
  sqlJsPromise = new Promise<SqlJsStatic>((resolve, reject) => {
    if (window.initSqlJs) {
      window
        .initSqlJs({ locateFile: () => SQL_WASM_CDN })
        .then(resolve)
        .catch(reject);
      return;
    }
    const script = document.createElement("script");
    script.src = SQL_JS_CDN;
    script.async = true;
    script.onload = () => {
      window
        .initSqlJs({ locateFile: () => SQL_WASM_CDN })
        .then(resolve)
        .catch(reject);
    };
    script.onerror = () => reject(new Error("Failed to load sql.js script"));
    document.head.appendChild(script);
  });
  return sqlJsPromise;
}

// --- Line numbers ---
function LineNumbers({ code }: { code: string }) {
  const lines = code.split("\n");
  return (
    <div
      className="select-none text-right pr-3 pt-[14px] pb-[14px] font-mono text-xs leading-[1.6] shrink-0"
      style={{
        color: "oklch(var(--muted-foreground))",
        minWidth: "2.5rem",
        borderRight: "1px solid oklch(var(--border))",
        background: "oklch(var(--card))",
      }}
      aria-hidden="true"
    >
      {lines.map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: line numbers are positional
        <div key={`ln-${i}`}>{i + 1}</div>
      ))}
    </div>
  );
}

// --- Results table ---
function ResultsTable({ result }: { result: SqlJsQueryResult }) {
  if (result.values.length === 0) {
    return (
      <p
        className="text-xs font-mono py-2"
        style={{ color: "oklch(var(--muted-foreground))" }}
      >
        Query executed successfully — no rows returned.
      </p>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs font-mono border-collapse">
        <thead>
          <tr>
            {result.columns.map((col) => (
              <th
                key={col}
                className="text-left px-3 py-2 font-semibold uppercase tracking-wider border-b"
                style={{
                  background: "oklch(var(--db-sql) / 0.15)",
                  color: "oklch(var(--db-sql))",
                  borderColor: "oklch(var(--db-sql) / 0.3)",
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.values.map((row, ri) => (
            <tr
              // biome-ignore lint/suspicious/noArrayIndexKey: result rows are positional
              key={`row-${ri}`}
              className="db-table-row transition-colors"
              style={{ borderColor: "oklch(var(--border))" }}
              data-ocid={`sql_playground.result.item.${ri + 1}`}
            >
              {row.map((cell, ci) => (
                <td
                  // biome-ignore lint/suspicious/noArrayIndexKey: cells are positional
                  key={`cell-${ci}`}
                  className="px-3 py-2 border-b"
                  style={{
                    borderColor: "oklch(var(--border))",
                    color:
                      cell === null
                        ? "oklch(var(--muted-foreground))"
                        : "oklch(var(--foreground))",
                  }}
                >
                  {cell === null ? <em>NULL</em> : String(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- Main component ---
export default function SQLPlayground({
  dbName,
  initialSql,
  description,
  hints,
}: SQLPlaygroundProps) {
  const [sqlCode, setSqlCode] = useState(initialSql.trim());
  const [results, setResults] = useState<SqlJsQueryResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const dbRef = useRef<SqlJsDatabase | null>(null);

  // Load sql.js and initialize database on mount
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    loadSqlJs()
      .then((SQL) => {
        if (cancelled) return;
        const db = new SQL.Database();
        db.run(DB_SEED[dbName]);
        dbRef.current = db;
        setIsLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          `Failed to initialize database: ${err instanceof Error ? err.message : String(err)}`,
        );
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [dbName]);

  const handleReset = useCallback(() => {
    setSqlCode(initialSql.trim());
    setResults(null);
    setError(null);
    setHintsRevealed(0);
    setShowHints(false);
  }, [initialSql]);

  const handleRun = useCallback(() => {
    if (!dbRef.current || isLoading) return;
    setIsRunning(true);
    setError(null);
    setResults(null);

    try {
      // Split by semicolons and execute each non-empty statement
      const statements = sqlCode
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      let lastResult: SqlJsQueryResult[] = [];
      for (const stmt of statements) {
        const res = dbRef.current.exec(stmt);
        if (res.length > 0) lastResult = res;
      }
      setResults(lastResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsRunning(false);
    }
  }, [sqlCode, isLoading]);

  // Tab key → insert 2 spaces; Ctrl+Enter → run
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const ta = e.currentTarget;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const newCode = `${sqlCode.slice(0, start)}  ${sqlCode.slice(end)}`;
        setSqlCode(newCode);
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + 2;
        });
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (!isLoading && !isRunning) handleRun();
      }
    },
    [sqlCode, isLoading, isRunning, handleRun],
  );

  const isDisabled = isLoading || isRunning;
  const lineCount = sqlCode.split("\n").length;
  const hasResults = results !== null && results.length > 0;
  const hasEmptyResult = results !== null && results.length === 0;

  return (
    <div
      className="relative rounded-xl overflow-hidden my-4 border elevation-card"
      style={{ borderColor: "oklch(var(--db-sql) / 0.3)" }}
      data-ocid="sql_playground.container"
    >
      {/* Header bar */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 border-b"
        style={{
          background: "oklch(var(--db-sql) / 0.08)",
          borderColor: "oklch(var(--db-sql) / 0.25)",
        }}
      >
        <div className="flex gap-1.5">
          <span
            className="w-3 h-3 rounded-full"
            style={{ background: "oklch(var(--destructive))" }}
          />
          <span
            className="w-3 h-3 rounded-full"
            style={{ background: "oklch(var(--accent))" }}
          />
          <span
            className="w-3 h-3 rounded-full"
            style={{ background: "oklch(var(--db-sql))" }}
          />
        </div>
        <span
          className="text-xs font-mono uppercase tracking-wider flex-1 ml-1"
          style={{ color: "oklch(var(--db-sql))" }}
        >
          SQL · {dbName} database
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={isDisabled}
            data-ocid="sql_playground.reset_button"
            className="text-xs font-mono px-2.5 py-1 rounded-md border transition-smooth
              text-muted-foreground hover:text-foreground
              disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "oklch(var(--muted))",
              borderColor: "oklch(var(--border))",
            }}
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleRun}
            disabled={isDisabled}
            data-ocid="sql_playground.run_button"
            className="text-xs font-mono font-semibold px-3 py-1 rounded-md transition-smooth
              disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            style={{
              background: isDisabled
                ? "oklch(var(--muted))"
                : "oklch(var(--db-sql))",
              color: isDisabled
                ? "oklch(var(--muted-foreground))"
                : "oklch(var(--db-sql-foreground))",
            }}
          >
            {isRunning && (
              <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {isLoading ? "Loading…" : isRunning ? "Running…" : "▶ Run Query"}
          </button>
        </div>
      </div>

      {/* Description */}
      {description && (
        <div
          className="px-4 py-3 text-sm border-b"
          style={{
            background: "oklch(var(--db-sql) / 0.05)",
            color: "oklch(var(--muted-foreground))",
            borderColor: "oklch(var(--db-sql) / 0.2)",
          }}
          data-ocid="sql_playground.description"
        >
          {description}
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div
          className="flex items-center gap-3 px-4 py-4"
          style={{ color: "oklch(var(--muted-foreground))" }}
          data-ocid="sql_playground.loading_state"
        >
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-mono">
            Initializing SQLite database…
          </span>
        </div>
      )}

      {/* Editor area */}
      {!isLoading && (
        <div
          className="flex overflow-x-auto"
          style={{ background: "oklch(var(--card))" }}
        >
          <LineNumbers code={sqlCode} />
          <textarea
            value={sqlCode}
            onChange={(e) => setSqlCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            data-ocid="sql_playground.editor"
            rows={Math.max(lineCount, 4)}
            className="flex-1 resize-none outline-none border-none font-mono text-sm leading-[1.6]
              px-4 py-[14px] bg-transparent text-foreground placeholder:text-muted-foreground
              min-w-0"
            style={{
              fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
              tabSize: 2,
              caretColor: "oklch(var(--db-sql))",
            }}
            aria-label="SQL query editor"
            aria-multiline="true"
          />
        </div>
      )}

      {/* Results panel */}
      {!isLoading && (error || hasResults || hasEmptyResult) && (
        <div
          className="border-t"
          style={{ borderColor: "oklch(var(--db-sql) / 0.25)" }}
        >
          {/* Results header */}
          <div
            className="flex items-center gap-2 px-4 py-1.5 border-b"
            style={{
              background: "oklch(var(--db-sql) / 0.06)",
              borderColor: "oklch(var(--db-sql) / 0.2)",
            }}
          >
            <span
              className="text-xs font-mono uppercase tracking-wider"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              results
            </span>
            {error && (
              <span
                className="text-xs font-mono"
                style={{ color: "oklch(var(--destructive))" }}
                data-ocid="sql_playground.error_state"
              >
                error
              </span>
            )}
            {!error && hasResults && (
              <span
                className="text-xs font-mono"
                style={{ color: "oklch(var(--db-sql))" }}
                data-ocid="sql_playground.success_state"
              >
                {results[results.length - 1].values.length} row
                {results[results.length - 1].values.length !== 1 ? "s" : ""}
              </span>
            )}
            {!error && hasEmptyResult && (
              <span
                className="text-xs font-mono"
                style={{ color: "oklch(var(--db-sql))" }}
                data-ocid="sql_playground.success_state"
              >
                ok
              </span>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div
              className="px-4 py-3 font-mono text-sm"
              style={{
                background: "oklch(var(--destructive) / 0.08)",
                color: "oklch(var(--destructive))",
              }}
              data-ocid="sql_playground.error_message"
            >
              <span className="font-semibold">Error:</span> {error}
            </div>
          )}

          {/* Results table */}
          {!error && results && (
            <div
              className="max-h-64 overflow-y-auto"
              data-ocid="sql_playground.results_table"
            >
              {results.length === 0 ? (
                <p
                  className="px-4 py-3 text-xs font-mono"
                  style={{ color: "oklch(var(--muted-foreground))" }}
                >
                  Query executed successfully — no rows returned.
                </p>
              ) : (
                <ResultsTable result={results[results.length - 1]} />
              )}
            </div>
          )}
        </div>
      )}

      {/* Hints section */}
      {hints && hints.length > 0 && (
        <div
          className="border-t"
          style={{ borderColor: "oklch(var(--border))" }}
        >
          <button
            type="button"
            onClick={() => setShowHints((v) => !v)}
            data-ocid="sql_playground.hints_toggle"
            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-mono transition-smooth
              hover:bg-muted/40 text-left"
            style={{ color: "oklch(var(--muted-foreground))" }}
          >
            <span
              className="transition-transform duration-200"
              style={{
                display: "inline-block",
                transform: showHints ? "rotate(90deg)" : "rotate(0deg)",
              }}
            >
              ▶
            </span>
            {showHints ? "Hide Hints" : "Show Hints"}
            <span
              className="ml-auto px-1.5 py-0.5 rounded text-xs"
              style={{
                background: "oklch(var(--db-sql) / 0.15)",
                color: "oklch(var(--db-sql))",
              }}
            >
              {hintsRevealed}/{hints.length}
            </span>
          </button>

          {showHints && (
            <div
              className="px-4 pb-3 space-y-2"
              style={{ background: "oklch(var(--db-sql) / 0.04)" }}
              data-ocid="sql_playground.hints_panel"
            >
              {hints.slice(0, hintsRevealed).map((hint, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: hints are ordered
                  key={`hint-${i}`}
                  className="db-sql-block text-xs"
                  data-ocid={`sql_playground.hint.${i + 1}`}
                >
                  <span
                    className="font-semibold mr-2"
                    style={{ color: "oklch(var(--db-sql))" }}
                  >
                    Hint {i + 1}:
                  </span>
                  {hint}
                </div>
              ))}
              {hintsRevealed < hints.length && (
                <button
                  type="button"
                  onClick={() => setHintsRevealed((n) => n + 1)}
                  data-ocid="sql_playground.reveal_hint_button"
                  className="text-xs font-mono px-3 py-1.5 rounded-md border transition-smooth"
                  style={{
                    background: "oklch(var(--db-sql) / 0.1)",
                    borderColor: "oklch(var(--db-sql) / 0.35)",
                    color: "oklch(var(--db-sql))",
                  }}
                >
                  Reveal next hint ({hintsRevealed + 1}/{hints.length})
                </button>
              )}
              {hintsRevealed === hints.length && (
                <p
                  className="text-xs font-mono"
                  style={{ color: "oklch(var(--muted-foreground))" }}
                >
                  All hints revealed.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Footer keyboard hint */}
      <div
        className="px-4 py-1.5 flex items-center justify-end border-t"
        style={{
          background: "oklch(var(--card))",
          borderColor: "oklch(var(--db-sql) / 0.2)",
        }}
      >
        <span
          className="text-xs font-mono"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          <kbd className="px-1 py-0.5 rounded border border-border text-xs">
            Ctrl
          </kbd>
          {" + "}
          <kbd className="px-1 py-0.5 rounded border border-border text-xs">
            ↵
          </kbd>
          {" to run"}
        </span>
      </div>
    </div>
  );
}
