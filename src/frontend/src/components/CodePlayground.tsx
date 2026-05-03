import { useCallback, useEffect, useRef, useState } from "react";

// --- Pyodide type declarations ---
interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  globals: { get: (key: string) => unknown };
}

declare global {
  interface Window {
    loadPyodide: (config?: { indexURL?: string }) => Promise<PyodideInterface>;
    pyodide: PyodideInterface | null;
  }
}

// --- Props ---
export interface CodePlaygroundProps {
  initialCode: string;
  title?: string;
}

// --- State types ---
type RunStatus = "idle" | "loading" | "running" | "done";

interface OutputLine {
  text: string;
  isError: boolean;
}

// --- Line numbers helper ---
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

// --- Pyodide loader (singleton) ---
let pyodideReadyPromise: Promise<PyodideInterface> | null = null;

function loadPyodideOnce(): Promise<PyodideInterface> {
  if (pyodideReadyPromise) return pyodideReadyPromise;

  pyodideReadyPromise = new Promise<PyodideInterface>((resolve, reject) => {
    if (window.loadPyodide) {
      window
        .loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.0/full/",
        })
        .then((py) => {
          window.pyodide = py;
          resolve(py);
        })
        .catch(reject);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.27.0/full/pyodide.js";
    script.async = true;
    script.onload = () => {
      window
        .loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.0/full/",
        })
        .then((py) => {
          window.pyodide = py;
          resolve(py);
        })
        .catch(reject);
    };
    script.onerror = () => reject(new Error("Failed to load Pyodide script"));
    document.head.appendChild(script);
  });

  return pyodideReadyPromise;
}

// --- Main component ---
export default function CodePlayground({
  initialCode,
  title,
}: CodePlaygroundProps) {
  const [code, setCode] = useState(initialCode.trim());
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [status, setStatus] = useState<RunStatus>("idle");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Scroll output to bottom on new output
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }); // runs after every render — intentional for auto-scroll

  const handleReset = useCallback(() => {
    setCode(initialCode.trim());
    setOutput([]);
    setStatus("idle");
  }, [initialCode]);

  const handleRun = useCallback(async () => {
    setOutput([]);
    setStatus("loading");

    let pyodide: PyodideInterface;
    try {
      pyodide = await loadPyodideOnce();
    } catch (err) {
      setOutput([
        {
          text: `Failed to load Python runtime: ${err instanceof Error ? err.message : String(err)}`,
          isError: true,
        },
      ]);
      setStatus("done");
      return;
    }

    setStatus("running");

    // Capture stdout by redirecting via sys
    const captured: OutputLine[] = [];
    const captureCode = `
import sys
import io
_stdout_capture = io.StringIO()
_stderr_capture = io.StringIO()
sys.stdout = _stdout_capture
sys.stderr = _stderr_capture
`;

    try {
      await pyodide.runPythonAsync(captureCode);
      await pyodide.runPythonAsync(code);

      // Collect stdout
      const stdoutResult = await pyodide.runPythonAsync(
        "_stdout_capture.getvalue()",
      );
      const stderrResult = await pyodide.runPythonAsync(
        "_stderr_capture.getvalue()",
      );

      const stdout = String(stdoutResult ?? "");
      const stderr = String(stderrResult ?? "");

      if (stdout.trim()) {
        for (const line of stdout.split("\n")) {
          if (line !== "" || stdout.endsWith("\n")) {
            captured.push({ text: line, isError: false });
          }
        }
        // Remove trailing empty line artifact
        if (captured.length > 0 && captured[captured.length - 1].text === "") {
          captured.pop();
        }
      }
      if (stderr.trim()) {
        for (const line of stderr.split("\n")) {
          if (line) captured.push({ text: line, isError: true });
        }
      }
      if (captured.length === 0) {
        captured.push({
          text: "✓ Ran successfully (no output)",
          isError: false,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      for (const line of msg.split("\n")) {
        if (line) captured.push({ text: line, isError: true });
      }
    } finally {
      // Restore stdout
      try {
        await pyodide.runPythonAsync(
          "sys.stdout = sys.__stdout__\nsys.stderr = sys.__stderr__",
        );
      } catch (_) {
        // ignore restore errors
      }
    }

    setOutput(captured);
    setStatus("done");
  }, [code]);

  // Tab key → insert 2 spaces
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const ta = e.currentTarget;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const newCode = `${code.slice(0, start)}  ${code.slice(end)}`;
        setCode(newCode);
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + 2;
        });
      }
      // Ctrl/Cmd + Enter → run
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (status !== "loading" && status !== "running") handleRun();
      }
    },
    [code, status, handleRun],
  );

  const isRunDisabled = status === "loading" || status === "running";
  const lineCount = code.split("\n").length;

  return (
    <div
      className="relative rounded-xl overflow-hidden my-4 border border-border elevation-card"
      data-ocid="playground.container"
    >
      {/* macOS-style header */}
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
        <span className="text-xs font-mono text-muted-foreground ml-1 uppercase tracking-wider flex-1">
          {title ?? "interactive python"}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={isRunDisabled}
            data-ocid="playground.reset_button"
            className="text-xs font-mono px-2.5 py-1 rounded-md border border-border transition-smooth
              text-muted-foreground hover:text-foreground hover:border-border
              disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "oklch(var(--muted))" }}
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleRun}
            disabled={isRunDisabled}
            data-ocid="playground.run_button"
            className="text-xs font-mono font-semibold px-3 py-1 rounded-md transition-smooth
              disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            style={{
              background: isRunDisabled
                ? "oklch(var(--muted))"
                : "oklch(var(--primary))",
              color: isRunDisabled
                ? "oklch(var(--muted-foreground))"
                : "oklch(var(--primary-foreground))",
            }}
          >
            {status === "loading" && (
              <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {status === "running" && (
              <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {status === "loading"
              ? "Loading Python…"
              : status === "running"
                ? "Running…"
                : "▶ Run"}
          </button>
        </div>
      </div>

      {/* Editor area */}
      <div
        className="flex overflow-x-auto"
        style={{ background: "oklch(var(--card))" }}
      >
        <LineNumbers code={code} />
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          data-ocid="playground.editor"
          rows={Math.max(lineCount, 4)}
          className="flex-1 resize-none outline-none border-none font-mono text-sm leading-[1.6]
            px-4 py-[14px] bg-transparent text-foreground placeholder:text-muted-foreground
            min-w-0"
          style={{
            fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
            tabSize: 2,
            caretColor: "oklch(var(--primary))",
          }}
          aria-label="Python code editor"
          aria-multiline="true"
        />
      </div>

      {/* Output panel */}
      {(output.length > 0 || status === "loading" || status === "running") && (
        <div
          className="border-t border-border"
          style={{ background: "oklch(var(--background))" }}
        >
          {/* Output header */}
          <div
            className="flex items-center gap-2 px-4 py-1.5 border-b border-border"
            style={{ background: "oklch(var(--card))" }}
          >
            <span
              className="text-xs font-mono uppercase tracking-wider"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              output
            </span>
            {status === "done" && output.some((l) => l.isError) && (
              <span
                className="text-xs font-mono"
                style={{ color: "oklch(var(--destructive))" }}
                data-ocid="playground.error_state"
              >
                error
              </span>
            )}
            {status === "done" && !output.some((l) => l.isError) && (
              <span
                className="text-xs font-mono"
                style={{ color: "oklch(var(--secondary))" }}
                data-ocid="playground.success_state"
              >
                ok
              </span>
            )}
          </div>

          {/* Output lines */}
          <div
            ref={outputRef}
            className="px-4 py-3 font-mono text-sm leading-relaxed overflow-y-auto max-h-52"
            data-ocid="playground.output"
          >
            {(status === "loading" || status === "running") &&
              output.length === 0 && (
                <div
                  className="flex items-center gap-2"
                  style={{ color: "oklch(var(--muted-foreground))" }}
                  data-ocid="playground.loading_state"
                >
                  <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  {status === "loading"
                    ? "Loading Python runtime…"
                    : "Running…"}
                </div>
              )}
            {output.map((line, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: output lines are positional
                key={`out-${i}`}
                style={{
                  color: line.isError
                    ? "oklch(var(--destructive))"
                    : "oklch(var(--secondary))",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                }}
              >
                {line.text || "\u00a0"}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Keyboard hint */}
      <div
        className="px-4 py-1.5 flex items-center justify-end border-t border-border"
        style={{ background: "oklch(var(--card))" }}
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
