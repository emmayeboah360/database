import type React from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

// Lightweight Python tokenizer — no external dependency
type TokenType =
  | "keyword"
  | "builtin"
  | "string"
  | "comment"
  | "number"
  | "operator"
  | "decorator"
  | "plain";

interface Token {
  type: TokenType;
  value: string;
}

const PY_KEYWORDS = new Set([
  "False",
  "None",
  "True",
  "and",
  "as",
  "assert",
  "async",
  "await",
  "break",
  "class",
  "continue",
  "def",
  "del",
  "elif",
  "else",
  "except",
  "finally",
  "for",
  "from",
  "global",
  "if",
  "import",
  "in",
  "is",
  "lambda",
  "nonlocal",
  "not",
  "or",
  "pass",
  "raise",
  "return",
  "try",
  "while",
  "with",
  "yield",
]);

const PY_BUILTINS = new Set([
  "print",
  "len",
  "range",
  "int",
  "float",
  "str",
  "bool",
  "list",
  "dict",
  "set",
  "tuple",
  "type",
  "isinstance",
  "issubclass",
  "super",
  "object",
  "property",
  "staticmethod",
  "classmethod",
  "enumerate",
  "zip",
  "map",
  "filter",
  "sorted",
  "reversed",
  "sum",
  "max",
  "min",
  "abs",
  "round",
  "open",
  "input",
  "format",
  "vars",
  "dir",
  "help",
  "repr",
  "hash",
  "id",
  "callable",
  "hasattr",
  "getattr",
  "setattr",
  "delattr",
  "next",
  "iter",
]);

function tokenizePython(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < code.length) {
    // Comment
    if (code[i] === "#") {
      let j = i;
      while (j < code.length && code[j] !== "\n") j++;
      tokens.push({ type: "comment", value: code.slice(i, j) });
      i = j;
      continue;
    }
    // Triple-quoted string
    if (code.slice(i, i + 3) === '"""' || code.slice(i, i + 3) === "'''") {
      const q = code.slice(i, i + 3);
      let j = i + 3;
      while (j < code.length && code.slice(j, j + 3) !== q) j++;
      j += 3;
      tokens.push({ type: "string", value: code.slice(i, j) });
      i = j;
      continue;
    }
    // Single-quoted string (with escape handling)
    if (code[i] === '"' || code[i] === "'") {
      const q = code[i];
      let j = i + 1;
      while (j < code.length && code[j] !== q && code[j] !== "\n") {
        if (code[j] === "\\") j++;
        j++;
      }
      j++;
      tokens.push({ type: "string", value: code.slice(i, j) });
      i = j;
      continue;
    }
    // Decorator
    if (code[i] === "@") {
      let j = i + 1;
      while (j < code.length && /\w/.test(code[j])) j++;
      tokens.push({ type: "decorator", value: code.slice(i, j) });
      i = j;
      continue;
    }
    // Number
    if (
      /[0-9]/.test(code[i]) ||
      (code[i] === "." && /[0-9]/.test(code[i + 1] ?? ""))
    ) {
      let j = i;
      while (j < code.length && /[0-9._xXbBoO]/.test(code[j])) j++;
      tokens.push({ type: "number", value: code.slice(i, j) });
      i = j;
      continue;
    }
    // Identifier / keyword / builtin
    if (/[a-zA-Z_]/.test(code[i])) {
      let j = i;
      while (j < code.length && /\w/.test(code[j])) j++;
      const word = code.slice(i, j);
      tokens.push({
        type: PY_KEYWORDS.has(word)
          ? "keyword"
          : PY_BUILTINS.has(word)
            ? "builtin"
            : "plain",
        value: word,
      });
      i = j;
      continue;
    }
    // Operators
    if (/[+\-*/%&|^~<>=!:.,;()[\]{}]/.test(code[i])) {
      tokens.push({ type: "operator", value: code[i] });
      i++;
      continue;
    }
    // Whitespace / other
    tokens.push({ type: "plain", value: code[i] });
    i++;
  }

  return tokens;
}

// Token color map — uses CSS custom properties from index.css
const tokenColorStyles: Record<TokenType, React.CSSProperties> = {
  keyword: { color: "oklch(var(--primary))" },
  builtin: { color: "oklch(var(--secondary))" },
  string: { color: "oklch(0.78 0.18 142)" }, // green — no semantic token available
  comment: { color: "oklch(var(--muted-foreground))" },
  number: { color: "oklch(var(--accent))" },
  operator: { color: "oklch(var(--foreground))" },
  decorator: { color: "oklch(var(--accent))" },
  plain: { color: "oklch(var(--foreground))" },
};

function HighlightedCode({ code }: { code: string }) {
  const tokens = tokenizePython(code);
  return (
    <>
      {tokens.map((tok, idx) => (
        <span
          key={`${idx}-${tok.value.slice(0, 4)}`}
          style={tokenColorStyles[tok.type]}
        >
          {tok.value}
        </span>
      ))}
    </>
  );
}

export function CodeBlock({
  code,
  language = "python",
  className = "",
}: CodeBlockProps) {
  return (
    <div className={`relative rounded-xl overflow-hidden my-4 ${className}`}>
      <div
        className="flex items-center gap-2 px-4 py-2.5 border-b border-border"
        style={{ background: "oklch(var(--card))" }}
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
            style={{ background: "oklch(var(--secondary))" }}
          />
        </div>
        <span className="text-xs font-mono text-muted-foreground ml-1 uppercase tracking-wider">
          {language}
        </span>
      </div>
      <div className="overflow-x-auto bg-card">
        <pre className="p-4 text-sm leading-relaxed m-0 overflow-visible">
          <code className="font-mono text-sm">
            <HighlightedCode code={code.trim()} />
          </code>
        </pre>
      </div>
    </div>
  );
}
