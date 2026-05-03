import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type SchemaId = "library" | "ecommerce" | "hospital" | "school";

interface Attribute {
  name: string;
  type: string;
  isPK?: boolean;
  isFK?: boolean;
  ref?: string; // referenced entity
}

interface Entity {
  id: string;
  label: string;
  description: string;
  attrs: Attribute[];
  x: number; // % of container width
  y: number; // % of container height
}

interface Relationship {
  from: string;
  to: string;
  fromCard: string; // "1", "N", "M"
  toCard: string;
  label?: string;
}

interface Schema {
  entities: Entity[];
  relationships: Relationship[];
  sql: string;
}

// ─── ERD Data ─────────────────────────────────────────────────────────────────

const SCHEMAS: Record<SchemaId, Schema> = {
  library: {
    entities: [
      {
        id: "authors",
        label: "authors",
        description:
          "Stores information about book authors including their name and country of origin.",
        attrs: [
          { name: "id", type: "INT", isPK: true },
          { name: "name", type: "VARCHAR(100)" },
          { name: "country", type: "VARCHAR(60)" },
        ],
        x: 5,
        y: 10,
      },
      {
        id: "books",
        label: "books",
        description:
          "Central catalog of all books in the library with availability status.",
        attrs: [
          { name: "id", type: "INT", isPK: true },
          { name: "title", type: "VARCHAR(200)" },
          { name: "author_id", type: "INT", isFK: true, ref: "authors" },
          { name: "year", type: "INT" },
          { name: "genre", type: "VARCHAR(50)" },
          { name: "available", type: "BOOLEAN" },
        ],
        x: 38,
        y: 5,
      },
      {
        id: "members",
        label: "members",
        description: "Registered library members who can borrow books.",
        attrs: [
          { name: "id", type: "INT", isPK: true },
          { name: "name", type: "VARCHAR(100)" },
          { name: "email", type: "VARCHAR(150)" },
          { name: "join_date", type: "DATE" },
        ],
        x: 68,
        y: 10,
      },
      {
        id: "loans",
        label: "loans",
        description:
          "Junction table recording which member borrowed which book and when.",
        attrs: [
          { name: "id", type: "INT", isPK: true },
          { name: "book_id", type: "INT", isFK: true, ref: "books" },
          { name: "member_id", type: "INT", isFK: true, ref: "members" },
          { name: "loan_date", type: "DATE" },
          { name: "return_date", type: "DATE" },
        ],
        x: 38,
        y: 58,
      },
    ],
    relationships: [
      { from: "authors", to: "books", fromCard: "1", toCard: "N" },
      { from: "books", to: "loans", fromCard: "1", toCard: "N" },
      { from: "members", to: "loans", fromCard: "1", toCard: "N" },
    ],
    sql: `-- Library Management System
CREATE TABLE authors (
  id       INT PRIMARY KEY AUTO_INCREMENT,
  name     VARCHAR(100) NOT NULL,
  country  VARCHAR(60)
);

CREATE TABLE books (
  id        INT PRIMARY KEY AUTO_INCREMENT,
  title     VARCHAR(200) NOT NULL,
  author_id INT NOT NULL,
  year      INT,
  genre     VARCHAR(50),
  available BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (author_id) REFERENCES authors(id)
);

CREATE TABLE members (
  id        INT PRIMARY KEY AUTO_INCREMENT,
  name      VARCHAR(100) NOT NULL,
  email     VARCHAR(150) UNIQUE,
  join_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE loans (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  book_id     INT NOT NULL,
  member_id   INT NOT NULL,
  loan_date   DATE NOT NULL,
  return_date DATE,
  FOREIGN KEY (book_id)   REFERENCES books(id),
  FOREIGN KEY (member_id) REFERENCES members(id)
);`,
  },

  ecommerce: {
    entities: [
      {
        id: "customers",
        label: "customers",
        description:
          "Registered shoppers with their contact and location information.",
        attrs: [
          { name: "id", type: "INT", isPK: true },
          { name: "name", type: "VARCHAR(100)" },
          { name: "email", type: "VARCHAR(150)" },
          { name: "city", type: "VARCHAR(60)" },
        ],
        x: 5,
        y: 10,
      },
      {
        id: "products",
        label: "products",
        description: "Product catalog with pricing and category information.",
        attrs: [
          { name: "id", type: "INT", isPK: true },
          { name: "name", type: "VARCHAR(200)" },
          { name: "category", type: "VARCHAR(60)" },
          { name: "price", type: "DECIMAL(10,2)" },
        ],
        x: 68,
        y: 10,
      },
      {
        id: "orders",
        label: "orders",
        description: "Purchase orders placed by customers, including totals.",
        attrs: [
          { name: "id", type: "INT", isPK: true },
          { name: "customer_id", type: "INT", isFK: true, ref: "customers" },
          { name: "date", type: "DATE" },
          { name: "total", type: "DECIMAL(10,2)" },
        ],
        x: 30,
        y: 12,
      },
      {
        id: "order_items",
        label: "order_items",
        description:
          "Line items linking individual products to orders (junction table).",
        attrs: [
          { name: "id", type: "INT", isPK: true },
          { name: "order_id", type: "INT", isFK: true, ref: "orders" },
          { name: "product_id", type: "INT", isFK: true, ref: "products" },
          { name: "quantity", type: "INT" },
          { name: "unit_price", type: "DECIMAL(10,2)" },
        ],
        x: 35,
        y: 62,
      },
    ],
    relationships: [
      { from: "customers", to: "orders", fromCard: "1", toCard: "N" },
      { from: "orders", to: "order_items", fromCard: "1", toCard: "N" },
      { from: "products", to: "order_items", fromCard: "1", toCard: "N" },
    ],
    sql: `-- E-Commerce Platform
CREATE TABLE customers (
  id    INT PRIMARY KEY AUTO_INCREMENT,
  name  VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  city  VARCHAR(60)
);

CREATE TABLE products (
  id       INT PRIMARY KEY AUTO_INCREMENT,
  name     VARCHAR(200) NOT NULL,
  category VARCHAR(60),
  price    DECIMAL(10,2) NOT NULL
);

CREATE TABLE orders (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT NOT NULL,
  date        DATE DEFAULT CURRENT_DATE,
  total       DECIMAL(10,2),
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE order_items (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  order_id   INT NOT NULL,
  product_id INT NOT NULL,
  quantity   INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id)   REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);`,
  },

  hospital: {
    entities: [
      {
        id: "doctors",
        label: "doctors",
        description: "Medical staff with their specialty information.",
        attrs: [
          { name: "id", type: "INT", isPK: true },
          { name: "name", type: "VARCHAR(100)" },
          { name: "specialty", type: "VARCHAR(80)" },
        ],
        x: 5,
        y: 8,
      },
      {
        id: "patients",
        label: "patients",
        description: "Patient records including date of birth and blood type.",
        attrs: [
          { name: "id", type: "INT", isPK: true },
          { name: "name", type: "VARCHAR(100)" },
          { name: "dob", type: "DATE" },
          { name: "blood_type", type: "VARCHAR(5)" },
        ],
        x: 68,
        y: 8,
      },
      {
        id: "appointments",
        label: "appointments",
        description:
          "Scheduled visits linking patients to doctors with diagnosis notes.",
        attrs: [
          { name: "id", type: "INT", isPK: true },
          { name: "patient_id", type: "INT", isFK: true, ref: "patients" },
          { name: "doctor_id", type: "INT", isFK: true, ref: "doctors" },
          { name: "date", type: "DATETIME" },
          { name: "diagnosis", type: "TEXT" },
        ],
        x: 33,
        y: 10,
      },
      {
        id: "medications",
        label: "medications",
        description: "Drug catalog with standard dosage information.",
        attrs: [
          { name: "id", type: "INT", isPK: true },
          { name: "name", type: "VARCHAR(100)" },
          { name: "dosage", type: "VARCHAR(50)" },
        ],
        x: 5,
        y: 62,
      },
      {
        id: "prescriptions",
        label: "prescriptions",
        description:
          "Links appointments to medications prescribed during that visit.",
        attrs: [
          { name: "id", type: "INT", isPK: true },
          {
            name: "appointment_id",
            type: "INT",
            isFK: true,
            ref: "appointments",
          },
          {
            name: "medication_id",
            type: "INT",
            isFK: true,
            ref: "medications",
          },
          { name: "quantity", type: "INT" },
        ],
        x: 35,
        y: 65,
      },
    ],
    relationships: [
      { from: "doctors", to: "appointments", fromCard: "1", toCard: "N" },
      { from: "patients", to: "appointments", fromCard: "1", toCard: "N" },
      { from: "appointments", to: "prescriptions", fromCard: "1", toCard: "N" },
      { from: "medications", to: "prescriptions", fromCard: "1", toCard: "N" },
    ],
    sql: `-- Hospital Management System
CREATE TABLE doctors (
  id        INT PRIMARY KEY AUTO_INCREMENT,
  name      VARCHAR(100) NOT NULL,
  specialty VARCHAR(80)
);

CREATE TABLE patients (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(100) NOT NULL,
  dob        DATE,
  blood_type VARCHAR(5)
);

CREATE TABLE appointments (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  patient_id INT NOT NULL,
  doctor_id  INT NOT NULL,
  date       DATETIME NOT NULL,
  diagnosis  TEXT,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (doctor_id)  REFERENCES doctors(id)
);

CREATE TABLE medications (
  id     INT PRIMARY KEY AUTO_INCREMENT,
  name   VARCHAR(100) NOT NULL,
  dosage VARCHAR(50)
);

CREATE TABLE prescriptions (
  id             INT PRIMARY KEY AUTO_INCREMENT,
  appointment_id INT NOT NULL,
  medication_id  INT NOT NULL,
  quantity       INT DEFAULT 1,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id),
  FOREIGN KEY (medication_id)  REFERENCES medications(id)
);`,
  },

  school: {
    entities: [
      {
        id: "students",
        label: "students",
        description:
          "Enrolled students with their grade level and contact email.",
        attrs: [
          { name: "id", type: "INT", isPK: true },
          { name: "name", type: "VARCHAR(100)" },
          { name: "grade", type: "VARCHAR(10)" },
          { name: "email", type: "VARCHAR(150)" },
        ],
        x: 5,
        y: 10,
      },
      {
        id: "teachers",
        label: "teachers",
        description: "Faculty members and the main subject they teach.",
        attrs: [
          { name: "id", type: "INT", isPK: true },
          { name: "name", type: "VARCHAR(100)" },
          { name: "subject", type: "VARCHAR(80)" },
        ],
        x: 68,
        y: 10,
      },
      {
        id: "courses",
        label: "courses",
        description:
          "Course catalog managed by a specific teacher, with credit hours.",
        attrs: [
          { name: "id", type: "INT", isPK: true },
          { name: "name", type: "VARCHAR(150)" },
          { name: "teacher_id", type: "INT", isFK: true, ref: "teachers" },
          { name: "credits", type: "INT" },
        ],
        x: 36,
        y: 10,
      },
      {
        id: "enrollments",
        label: "enrollments",
        description:
          "Junction table recording student course registrations per semester.",
        attrs: [
          { name: "id", type: "INT", isPK: true },
          { name: "student_id", type: "INT", isFK: true, ref: "students" },
          { name: "course_id", type: "INT", isFK: true, ref: "courses" },
          { name: "semester", type: "VARCHAR(20)" },
          { name: "grade", type: "CHAR(2)" },
        ],
        x: 35,
        y: 62,
      },
    ],
    relationships: [
      { from: "teachers", to: "courses", fromCard: "1", toCard: "N" },
      { from: "students", to: "enrollments", fromCard: "1", toCard: "N" },
      { from: "courses", to: "enrollments", fromCard: "1", toCard: "N" },
    ],
    sql: `-- School Management System
CREATE TABLE students (
  id    INT PRIMARY KEY AUTO_INCREMENT,
  name  VARCHAR(100) NOT NULL,
  grade VARCHAR(10),
  email VARCHAR(150) UNIQUE
);

CREATE TABLE teachers (
  id      INT PRIMARY KEY AUTO_INCREMENT,
  name    VARCHAR(100) NOT NULL,
  subject VARCHAR(80)
);

CREATE TABLE courses (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(150) NOT NULL,
  teacher_id INT NOT NULL,
  credits    INT DEFAULT 3,
  FOREIGN KEY (teacher_id) REFERENCES teachers(id)
);

CREATE TABLE enrollments (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  course_id  INT NOT NULL,
  semester   VARCHAR(20),
  grade      CHAR(2),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id)  REFERENCES courses(id)
);`,
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function AttrRow({ attr }: { attr: Attribute }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1 text-xs db-table-row">
      {attr.isPK && (
        <span className="text-amber-400 shrink-0" title="Primary Key">
          🔑
        </span>
      )}
      {!attr.isPK && attr.isFK && (
        <span className="text-amber-500/70 shrink-0" title="Foreign Key">
          🔗
        </span>
      )}
      {!attr.isPK && !attr.isFK && <span className="w-4 shrink-0" />}
      <span
        className={`font-mono font-semibold truncate ${
          attr.isPK
            ? "text-amber-300"
            : attr.isFK
              ? "text-amber-500/90"
              : "text-foreground/90"
        }`}
      >
        {attr.name}
      </span>
      <span className="ml-auto text-muted-foreground font-mono shrink-0">
        {attr.type}
      </span>
      {attr.isPK && (
        <Badge
          className="ml-1 bg-amber-500/20 text-amber-300 border-amber-500/30 text-[9px] px-1 py-0"
          variant="outline"
        >
          PK
        </Badge>
      )}
      {attr.isFK && !attr.isPK && (
        <Badge
          className="ml-1 bg-amber-700/20 text-amber-500 border-amber-700/30 text-[9px] px-1 py-0"
          variant="outline"
        >
          FK
        </Badge>
      )}
    </div>
  );
}

interface EntityBoxProps {
  entity: Entity;
  isSelected: boolean;
  isHighlighted: boolean;
  isHovered: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  containerWidth: number;
  containerHeight: number;
}

function EntityBox({
  entity,
  isSelected,
  isHighlighted,
  isHovered,
  onSelect,
  onHover,
  containerWidth,
  containerHeight,
}: EntityBoxProps) {
  const BOX_WIDTH = 200;
  const left = (entity.x / 100) * containerWidth;
  const top = (entity.y / 100) * containerHeight;

  const borderClass = isSelected
    ? "border-primary shadow-[0_0_16px_2px] shadow-primary/50"
    : isHighlighted
      ? "border-secondary shadow-[0_0_12px_2px] shadow-secondary/40"
      : isHovered
        ? "border-db-erd/70 shadow-md"
        : "border-db-erd/50";

  return (
    <button
      type="button"
      aria-label={`Entity: ${entity.label}`}
      data-ocid={`erd.entity.${entity.id}`}
      className={`absolute cursor-pointer select-none rounded-lg overflow-hidden
        border-2 bg-card transition-smooth text-left
        ${borderClass}`}
      style={{
        left,
        top,
        width: BOX_WIDTH,
        zIndex: isSelected ? 20 : isHovered ? 10 : 1,
      }}
      onClick={() => onSelect(entity.id)}
      onMouseEnter={() => onHover(entity.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Header */}
      <div
        className={`px-3 py-2 font-mono font-bold text-sm uppercase tracking-wider
        bg-db-erd/20 border-b-2 border-db-erd/40
        ${isSelected ? "bg-primary/20 border-primary/40" : isHighlighted ? "bg-secondary/20 border-secondary/40" : ""}`}
      >
        <span className="text-db-erd-foreground">{entity.label}</span>
      </div>
      {/* Attributes */}
      <div className="divide-y divide-border/30">
        {entity.attrs.map((attr) => (
          <AttrRow key={attr.name} attr={attr} />
        ))}
      </div>
    </button>
  );
}

// ─── SVG Relationships ─────────────────────────────────────────────────────────

const BOX_WIDTH = 200;
const BOX_HEADER_HEIGHT = 37;
const ROW_HEIGHT = 28;

function getBoxHeight(entity: Entity) {
  return BOX_HEADER_HEIGHT + entity.attrs.length * ROW_HEIGHT;
}

function getCenter(entity: Entity, cw: number, ch: number) {
  const x = (entity.x / 100) * cw + BOX_WIDTH / 2;
  const y = (entity.y / 100) * ch + getBoxHeight(entity) / 2;
  return { x, y };
}

interface RelLineProps {
  rel: Relationship;
  entities: Entity[];
  containerWidth: number;
  containerHeight: number;
  isActive: boolean;
}

function RelLine({
  rel,
  entities,
  containerWidth,
  containerHeight,
  isActive,
}: RelLineProps) {
  const fromEnt = entities.find((e) => e.id === rel.from);
  const toEnt = entities.find((e) => e.id === rel.to);
  if (!fromEnt || !toEnt) return null;

  const from = getCenter(fromEnt, containerWidth, containerHeight);
  const to = getCenter(toEnt, containerWidth, containerHeight);

  // Pick edge points (nearest side of each box)
  const fromBoxLeft = (fromEnt.x / 100) * containerWidth;
  const fromBoxRight = fromBoxLeft + BOX_WIDTH;
  const fromBoxTop = (fromEnt.y / 100) * containerHeight;
  const fromBoxBottom = fromBoxTop + getBoxHeight(fromEnt);

  const toBoxLeft = (toEnt.x / 100) * containerWidth;
  const toBoxRight = toBoxLeft + BOX_WIDTH;
  const toBoxTop = (toEnt.y / 100) * containerHeight;
  const toBoxBottom = toBoxTop + getBoxHeight(toEnt);

  // Determine connection sides
  let x1 = from.x;
  let y1 = from.y;
  let x2 = to.x;
  let y2 = to.y;

  if (toBoxLeft > fromBoxRight) {
    x1 = fromBoxRight;
    x2 = toBoxLeft;
  } else if (fromBoxLeft > toBoxRight) {
    x1 = fromBoxLeft;
    x2 = toBoxRight;
  } else if (toBoxTop > fromBoxBottom) {
    y1 = fromBoxBottom;
    y2 = toBoxTop;
    x1 = from.x;
    x2 = to.x;
  } else if (fromBoxTop > toBoxBottom) {
    y1 = fromBoxTop;
    y2 = toBoxBottom;
    x1 = from.x;
    x2 = to.x;
  }

  const midX = (x1 + x2) / 2;
  const _midY = (y1 + y2) / 2;
  const color = isActive
    ? "oklch(0.72 0.18 262)"
    : "oklch(0.62 0.12 282 / 0.7)";
  const strokeW = isActive ? 2 : 1.5;

  // Cardinality text offsets
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const offFrom = { x: x1 + (dx / len) * 22, y: y1 + (dy / len) * 14 };
  const offTo = { x: x2 - (dx / len) * 22, y: y2 - (dy / len) * 14 };

  return (
    <g>
      <path
        d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
        fill="none"
        stroke={color}
        strokeWidth={strokeW}
        strokeDasharray={isActive ? "none" : "5,3"}
      />
      {/* Cardinality labels */}
      <text
        x={offFrom.x}
        y={offFrom.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={11}
        fontWeight="bold"
        fill={color}
      >
        {rel.fromCard}
      </text>
      <text
        x={offTo.x}
        y={offTo.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={11}
        fontWeight="bold"
        fill={color}
      >
        {rel.toCard}
      </text>
    </g>
  );
}

// ─── Tooltip / Entity Detail ───────────────────────────────────────────────────

function EntityDetail({
  entity,
  onClose,
}: { entity: Entity; onClose: () => void }) {
  return (
    <div
      className="absolute z-30 bg-popover border-2 border-primary/60 rounded-xl shadow-elevation-modal p-4 w-72"
      style={{
        top: `calc(${entity.y}% + 10px)`,
        left: `calc(${entity.x}% + 210px)`,
      }}
      data-ocid={`erd.detail.${entity.id}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono font-bold text-primary text-sm uppercase tracking-wider">
          {entity.label}
        </span>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground transition-smooth text-base leading-none"
          onClick={onClose}
          aria-label="Close detail"
          data-ocid={`erd.detail.${entity.id}.close_button`}
        >
          ✕
        </button>
      </div>
      <p className="text-xs text-muted-foreground mb-3">{entity.description}</p>
      <div className="space-y-1">
        {entity.attrs.map((a) => (
          <div key={a.name} className="flex items-center gap-2 text-xs">
            {a.isPK && <span className="text-amber-400">🔑</span>}
            {a.isFK && !a.isPK && <span className="text-amber-500/80">🔗</span>}
            {!a.isPK && !a.isFK && <span className="w-4" />}
            <span className="font-mono font-semibold text-foreground/90">
              {a.name}
            </span>
            <span className="text-muted-foreground ml-auto">{a.type}</span>
            {a.ref && (
              <span className="text-xs text-primary/70 italic">→ {a.ref}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SQL View ─────────────────────────────────────────────────────────────────

function SqlView({ sql }: { sql: string }) {
  const lines = sql.split("\n");
  const keywords = [
    "CREATE",
    "TABLE",
    "PRIMARY",
    "KEY",
    "AUTO_INCREMENT",
    "NOT NULL",
    "DEFAULT",
    "UNIQUE",
    "FOREIGN",
    "REFERENCES",
    "INT",
    "VARCHAR",
    "BOOLEAN",
    "DATE",
    "DATETIME",
    "TEXT",
    "DECIMAL",
    "CHAR",
  ];

  function highlightLine(line: string) {
    // Very lightweight highlighting — no regex replace, just span wrapping
    const parts: Array<{ text: string; bold: boolean; comment: boolean }> = [];
    if (line.trim().startsWith("--")) {
      return <span className="text-muted-foreground italic">{line}</span>;
    }
    let remaining = line;
    while (remaining.length > 0) {
      let matched = false;
      for (const kw of keywords) {
        if (remaining.toUpperCase().startsWith(kw)) {
          parts.push({
            text: remaining.slice(0, kw.length),
            bold: true,
            comment: false,
          });
          remaining = remaining.slice(kw.length);
          matched = true;
          break;
        }
      }
      if (!matched) {
        const nextKwIdx = Math.min(
          ...keywords.map((kw) => {
            const idx = remaining.toUpperCase().indexOf(kw, 1);
            return idx === -1 ? Number.POSITIVE_INFINITY : idx;
          }),
        );
        const cut =
          nextKwIdx === Number.POSITIVE_INFINITY ? remaining.length : nextKwIdx;
        parts.push({
          text: remaining.slice(0, cut),
          bold: false,
          comment: false,
        });
        remaining = remaining.slice(cut);
      }
    }
    return parts.map((p, i) =>
      p.bold ? (
        // biome-ignore lint/suspicious/noArrayIndexKey: syntax highlight parts are positional
        <span key={i} className="text-primary font-semibold">
          {p.text}
        </span>
      ) : (
        // biome-ignore lint/suspicious/noArrayIndexKey: syntax highlight parts are positional
        <span key={i} className="text-foreground/80">
          {p.text}
        </span>
      ),
    );
  }

  return (
    <div
      className="bg-card rounded-xl border border-border overflow-auto max-h-[420px]"
      data-ocid="erd.sql_view"
    >
      <div className="px-4 py-2 bg-muted/40 border-b border-border flex items-center gap-2">
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          SQL — CREATE TABLE statements
        </span>
      </div>
      <pre className="p-4 font-mono text-xs leading-relaxed overflow-x-auto">
        <code>
          {lines.map((line, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: SQL lines are positional
            <div key={i}>
              <span className="text-muted-foreground/40 select-none mr-4 text-right inline-block w-6">
                {i + 1}
              </span>
              {highlightLine(line)}
              {"\n"}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

// ─── Legend ───────────────────────────────────────────────────────────────────

function Legend() {
  return (
    <div
      className="flex flex-wrap gap-3 items-center px-4 py-2 bg-muted/30 border-t border-border text-xs"
      data-ocid="erd.legend"
    >
      <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px] mr-1">
        Legend:
      </span>
      <span className="flex items-center gap-1">
        <span className="text-amber-400">🔑</span>
        <span className="text-foreground/70">Primary Key (PK)</span>
      </span>
      <span className="flex items-center gap-1">
        <span className="text-amber-500/80">🔗</span>
        <span className="text-foreground/70">Foreign Key (FK)</span>
      </span>
      <span className="flex items-center gap-1 text-db-erd/80">
        <span className="font-bold">1</span>
        <span className="border-b border-dashed border-db-erd/60 w-6 inline-block" />
        <span className="font-bold">N</span>
        <span className="text-foreground/70 ml-1">One-to-Many</span>
      </span>
      <span className="flex items-center gap-1 text-db-erd/80">
        <span className="font-bold">M</span>
        <span className="border-b border-dashed border-db-erd/60 w-6 inline-block" />
        <span className="font-bold">N</span>
        <span className="text-foreground/70 ml-1">
          Many-to-Many (via junction)
        </span>
      </span>
      <span className="flex items-center gap-1">
        <span className="w-5 border-t-2 border-primary inline-block" />
        <span className="text-foreground/70">Selected entity</span>
      </span>
    </div>
  );
}

// ─── Main ERDViewer ───────────────────────────────────────────────────────────

export interface ERDViewerProps {
  schemaId: SchemaId;
  highlightEntities?: string[];
}

export function ERDViewer({
  schemaId,
  highlightEntities = [],
}: ERDViewerProps) {
  const schema = SCHEMAS[schemaId];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [containerSize, setContainerSize] = useState({
    width: 800,
    height: 480,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const updateSize = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerSize({ width: rect.width, height: rect.height });
    }
  }, []);

  useEffect(() => {
    updateSize();
    const ro = new ResizeObserver(updateSize);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [updateSize]);

  // Reset selection when schema changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: schemaId change intentionally resets selection
  useEffect(() => {
    setSelectedId(null);
  }, [schemaId]);

  const selectedEntity =
    schema.entities.find((e) => e.id === selectedId) ?? null;

  function handleSelect(id: string) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  const { width: cw, height: ch } = containerSize;

  return (
    <Tabs defaultValue="diagram" className="w-full" data-ocid="erd.viewer">
      <div className="flex items-center justify-between px-4 pt-3 pb-0">
        <TabsList className="bg-muted/50" data-ocid="erd.tabs">
          <TabsTrigger value="diagram" data-ocid="erd.tab.diagram">
            ERD Diagram
          </TabsTrigger>
          <TabsTrigger value="schema" data-ocid="erd.tab.schema">
            View Schema SQL
          </TabsTrigger>
        </TabsList>
        {selectedId && (
          <button
            type="button"
            className="text-xs text-muted-foreground hover:text-foreground transition-smooth"
            onClick={() => setSelectedId(null)}
            data-ocid="erd.clear_selection_button"
          >
            Clear selection ✕
          </button>
        )}
      </div>

      {/* Diagram Tab */}
      <TabsContent value="diagram" className="mt-0">
        <div
          ref={containerRef}
          className="relative bg-background/50 border-y border-border overflow-hidden"
          style={{ height: 480 }}
          data-ocid="erd.diagram"
        >
          {/* Grid background */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width={cw}
            height={ch}
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="grid"
                width="32"
                height="32"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 32 0 L 0 0 0 32"
                  fill="none"
                  stroke="oklch(0.62 0.12 282 / 0.08)"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width={cw} height={ch} fill="url(#grid)" />
          </svg>

          {/* Relationship lines — drawn behind entity boxes */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width={cw}
            height={ch}
            aria-hidden="true"
            style={{ zIndex: 0 }}
          >
            {schema.relationships.map((rel) => (
              <RelLine
                key={`${rel.from}-${rel.to}`}
                rel={rel}
                entities={schema.entities}
                containerWidth={cw}
                containerHeight={ch}
                isActive={
                  selectedId === rel.from ||
                  selectedId === rel.to ||
                  hoveredId === rel.from ||
                  hoveredId === rel.to
                }
              />
            ))}
          </svg>

          {/* Entity boxes */}
          {schema.entities.map((entity) => (
            <EntityBox
              key={entity.id}
              entity={entity}
              isSelected={selectedId === entity.id}
              isHighlighted={highlightEntities.includes(entity.id)}
              isHovered={hoveredId === entity.id}
              onSelect={handleSelect}
              onHover={setHoveredId}
              containerWidth={cw}
              containerHeight={ch}
            />
          ))}

          {/* Entity detail tooltip */}
          {selectedEntity && (
            <EntityDetail
              entity={selectedEntity}
              onClose={() => setSelectedId(null)}
            />
          )}
        </div>

        {/* Legend */}
        <Legend />

        {/* Hint */}
        <p className="px-4 py-2 text-[11px] text-muted-foreground/60 italic">
          Click any entity to view its details. Relationships are shown with
          cardinality labels (1 / N / M).
        </p>
      </TabsContent>

      {/* Schema SQL Tab */}
      <TabsContent value="schema" className="mt-0 p-4">
        <SqlView sql={schema.sql} />
      </TabsContent>
    </Tabs>
  );
}
