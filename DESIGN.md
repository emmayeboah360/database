# A3 Databases Design

## Purpose & Tone
Dedicated IB Computer Science A3 Databases learning platform. Modern, structured, technical. Authoritative yet approachable. Visual identity reflects database systems infrastructure: precise, efficient, data-focused.

## Visual Direction
Dark-mode-first with modern tech aesthetic. Electric cyan primary (database energy, modern systems), deep purple/teal secondary (schema/entity relationships), amber accent for Higher Level differentiation. Geometric sans-serif display (modern, technical confidence). Intentional depth hierarchy: deep slate backgrounds (0.08L dark), elevated cards, structured layout.

## Color Palette

| Token              | Light            | Dark            | Usage                                |
| :----------------- | :--------------- | :-------------- | :----------------------------------- |
| primary            | 0.58 0.22 195    | 0.64 0.22 195   | Cyan accent, buttons, SQL highlights            |
| secondary          | 0.52 0.18 282    | 0.58 0.2 282    | Purple, schemas, entity relationships            |
| accent             | 0.72 0.19 40     | 0.68 0.21 40    | Amber, Higher Level badges, achievements        |
| background         | 0.97 0.01 0      | 0.08 0.01 280   | Deep slate page background (tech feel)          |
| foreground         | 0.15 0.02 280    | 0.94 0.02 280   | Body text, high contrast                        |
| card               | 0.99 0 0         | 0.14 0.01 280   | Lesson cards, content containers                |
| db-sql             | 0.58 0.22 195    | 0.65 0.2 195    | SQL code blocks, database queries               |
| db-hl              | 0.72 0.19 40     | 0.70 0.22 40    | HL badge background, Higher Level markers       |
| db-erd             | 0.52 0.18 282    | 0.60 0.12 282   | Entity diagram boxes, relationships              |
| db-table           | 0.88 0.02 0      | 0.18 0.01 280   | Database table rows, cell backgrounds            |

## Typography
Display: General Sans (geometric, modern, technical confidence). Body: General Sans (clean, efficient). Mono: JetBrains Mono (code, queries, technical content). Scale: bold 3xl display, bold 2xl headings, lg subheadings, base body.

## Structural Zones

| Zone           | Light Background | Dark Background | Purpose                                     |
| :------------- | :--------------- | :-------------- | :------------------------------------------ |
| Header/Nav     | 0.99 0 0         | 0.14 0.01 280   | Logo (A3 Databases), user profile, breadcrumbs  |
| Sidebar        | 0.96 0.01 0      | 0.12 0.01 280   | Module tree, lesson list, HL separators         |
| Main Content   | 0.97 0.01 0      | 0.08 0.01 280   | Lesson content, SQL editor, normalization steps |
| Cards/Modules  | 0.99 0 0         | 0.14 0.01 280   | Module cards, lesson containers, quiz boxes     |
| Popover/Modal  | 0.99 0 0         | 0.17 0.01 280   | Certificate, dialogs, feedback modals           |
| Footer         | 0.94 0.01 0      | 0.12 0.01 280   | Progress bar, next lesson CTA                   |

## Shape Language
Tighter radius (0.5rem base). Structured, data-oriented aesthetic. Cards have subtle elevation. SQL blocks and ERD nodes emphasize precision. Minimal shadows: elevation-subtle for interactive elements, elevation-modal for overlays. No blur or glow—clarity over decoration.

## Component Patterns
- **Lesson Cards**: bg-card, elevation-subtle, left border in primary (cyan) for unlocked, accent for HL-only
- **SQL Playground**: db-sql-block; cyan border/background, JetBrains Mono, table results on dark db-table background
- **HL Badge**: db-hl-badge; amber background (0.70 0.22 40 dark), dark text, font-bold, inline beside lesson titles
- **ERD Diagram**: db-erd-node; purple border (0.60 0.12 282), semi-transparent bg, connected via SVG lines
- **Normalization UI**: Multi-step progress; "1NF → 2NF → 3NF" labels, before/after tables, cyan transform button
- **Code Block**: mono font, cyan syntax highlight (--db-sql), dark background
- **Database Table**: db-table-row; slate background (0.18L dark), bottom border, header in muted-foreground

## Spacing & Rhythm
16px base unit. Content container max-width 1400px. Generous vertical rhythm (32px between sections). Sidebar fixed width 240px. Module cards on 2-column grid (md+), single column (sm).

## Motion & Interaction
Smooth transitions (0.3s cubic-bezier) on hover/focus. Progress bar fill animation on lesson completion. Certificate modal fade-in with scale entrance. No decorative bounce—clarity over playfulness.

## A3 Database Course Extensions
**SQL Playground Component**: Cyan accent (0.65 0.2 195 dark) for code editor, table result rows use db-table background. Editor height 200px, results container height 300px, 1px border-db-sql/30 divider.
**ERD Diagram Viewer**: Purple outline (0.60 0.12 282) for entity boxes, 2px border, 16px padding. Relationship lines drawn in db-erd with 2px stroke. Title label in db-erd text color.
**Normalization Exercise**: Multi-step UI with progress indicator; each step shows before/after tables. Step header shows "1NF / 2NF / 3NF" label. Transform button in primary color. Success state uses secondary color (purple).
**HL Topics Badge**: Amber (0.70 0.22 40 dark) background inline badge. Appears beside lesson titles and topic names. Max 80px width.

## Constraints
- No generic blues (cyan 0.64 0.22 195 only)
- No decorative gradients (gradients only on CTAs or certificates)
- SQL always in db-sql color; code always mono, 12px min
- HL content marked with amber badge + visible gate
- All OKLCH in oklch() functions only; no raw hex or RGB
- Database terminology: schema, entity, normalization, SQL, query, transaction

## Signature Detail
Cyan-accented SQL playground with live query results. Purple entity diagrams that feel structural and precise. Amber HL badges create clear visual separation. Deep slate backgrounds evoke database systems infrastructure. Typography hierarchy (bold, geometric display) projects technical authority.
