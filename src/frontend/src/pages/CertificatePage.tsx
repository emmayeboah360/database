import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Copy,
  Database,
  Download,
  ExternalLink,
  Loader2,
  Share2,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { HLBadge } from "../components/HLBadge";
import { useCertificate } from "../hooks/useCertificate";
import {
  TOTAL_DB_HL_LESSONS,
  TOTAL_DB_LESSONS,
  TOTAL_DB_SL_LESSONS,
  totalDbHours,
} from "../types/database";

// ─ Confetti ─────────────────────────────────────────────────────────────────

interface Particle {
  id: number;
  x: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  rotation: number;
}

const CONFETTI_COLORS = [
  "var(--cert-gold)",
  "var(--cert-gold-deep)",
  "var(--cert-gold-mid)",
  "var(--cert-gold-muted)",
  "#ffffff",
  "oklch(var(--primary))",
  "oklch(var(--secondary))",
];

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 3,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: 6 + Math.random() * 8,
    rotation: Math.random() * 360,
  }));
}

function Confetti({ active }: { active: boolean }) {
  const [particles] = useState(() => generateParticles(80));
  if (!active) return null;
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-50"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: "-20px",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.id % 2 === 0 ? "50%" : "2px",
            animationName: "certConfettiFall",
            animationTimingFunction: "linear",
            animationFillMode: "forwards",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}

// ─ Certificate Document ───────────────────────────────────────────────────

function CertificateDocument({
  learnerName,
  courseTitle,
  completedAt,
  certificateId,
  isHL,
}: {
  learnerName: string;
  courseTitle: string;
  completedAt: bigint;
  certificateId: string;
  isHL: boolean;
}) {
  const date = new Date(Number(completedAt) / 1_000_000);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const hours = isHL ? totalDbHours() : 11; // HL = all hours, SL = 11
  const lessonCount = isHL ? TOTAL_DB_LESSONS : TOTAL_DB_SL_LESSONS;
  const levelLabel = isHL ? "Higher Level" : "Standard Level";

  return (
    <div
      data-ocid="certificate.document"
      className="relative w-full max-w-3xl mx-auto rounded-2xl overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--cert-bg-start) 0%, var(--cert-bg-mid) 60%, var(--cert-bg-start) 100%)",
        boxShadow:
          "0 0 0 2px rgba(255,215,0,0.35), 0 0 60px rgba(255,215,0,0.1), 0 40px 80px rgba(0,0,0,0.6)",
      }}
    >
      {/* Inner border */}
      <div
        className="absolute inset-3 rounded-xl pointer-events-none"
        style={{ border: "1px solid rgba(255,215,0,0.15)" }}
      />

      {/* Corner ornaments */}
      {[
        { pos: "top-5 left-5", scaleX: 1, scaleY: 1 },
        { pos: "top-5 right-5", scaleX: -1, scaleY: 1 },
        { pos: "bottom-5 left-5", scaleX: 1, scaleY: -1 },
        { pos: "bottom-5 right-5", scaleX: -1, scaleY: -1 },
      ].map(({ pos, scaleX, scaleY }) => (
        <div
          key={pos}
          className={`absolute ${pos} w-8 h-8 pointer-events-none`}
        >
          <svg
            viewBox="0 0 32 32"
            className="w-full h-full opacity-50"
            style={{ transform: `scale(${scaleX},${scaleY})` }}
            aria-hidden="true"
            role="presentation"
          >
            <title>Corner ornament</title>
            <path
              d="M0 0 L14 0 L14 2 L2 2 L2 14 L0 14 Z"
              fill="var(--cert-gold)"
            />
          </svg>
        </div>
      ))}

      {/* Subtle star bg */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <svg width="100%" height="100%" aria-hidden="true" role="presentation">
          <title>Star background pattern</title>
          <defs>
            <pattern
              id="certStars"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="20" cy="20" r="1" fill="var(--cert-gold)" />
              <circle cx="5" cy="5" r="0.5" fill="var(--cert-gold)" />
              <circle cx="35" cy="35" r="0.5" fill="var(--cert-gold)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#certStars)" />
        </svg>
      </div>

      {/* Glow orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--cert-overlay-gold) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 px-10 py-12 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, var(--cert-gold), var(--cert-gold-deep))",
              boxShadow: "0 0 24px rgba(255,215,0,0.45)",
            }}
          >
            <Database className="w-6 h-6 text-black" />
          </div>
          <span
            className="text-xl font-bold tracking-wider"
            style={{
              color: "var(--cert-gold)",
              fontFamily: "var(--font-display)",
            }}
          >
            A3 Databases
          </span>
        </div>

        {/* Level badge */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {isHL ? (
            <span
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{
                background: "rgba(255,215,0,0.15)",
                color: "var(--cert-gold)",
                border: "1px solid rgba(255,215,0,0.35)",
              }}
            >
              ◆ Higher Level (HL)
            </span>
          ) : (
            <span
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{
                background: "rgba(255,215,0,0.10)",
                color: "var(--cert-gold)",
                border: "1px solid rgba(255,215,0,0.25)",
              }}
            >
              Standard Level (SL)
            </span>
          )}
        </div>

        {/* Horizontal rule */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="flex-1 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,215,0,0.45))",
            }}
          />
          <span
            className="text-xs tracking-[0.35em] uppercase"
            style={{ color: "rgba(255,215,0,0.6)" }}
          >
            Certificate of Completion
          </span>
          <div
            className="flex-1 h-px"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,215,0,0.45), transparent)",
            }}
          />
        </div>

        <p
          className="text-xs tracking-[0.35em] uppercase mb-4"
          style={{ color: "rgba(255,215,0,0.55)" }}
        >
          This is to certify that
        </p>

        {/* Learner name */}
        <h1
          className="text-5xl mb-2 leading-tight"
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            background:
              "linear-gradient(135deg, var(--cert-gold) 0%, var(--cert-gold-mid) 50%, var(--cert-gold-muted) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {learnerName}
        </h1>

        <p
          className="text-xs tracking-[0.35em] uppercase mt-3 mb-5"
          style={{ color: "rgba(255,215,0,0.55)" }}
        >
          has successfully completed
        </p>

        <h2
          className="text-2xl font-semibold mb-1 tracking-wide"
          style={{ color: "#e2e8f0" }}
        >
          {courseTitle}
        </h2>
        <p className="text-sm mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>
          {levelLabel}
        </p>
        <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.35)" }}>
          IB Computer Science A3 Database Systems
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-10 mb-8">
          {[
            { label: "Lessons", value: String(lessonCount) },
            { label: "Hours", value: `~${hours}` },
            { label: "Level", value: isHL ? "HL" : "SL" },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p
                className="text-2xl font-bold"
                style={{ color: "var(--cert-gold)" }}
              >
                {value}
              </p>
              <p
                className="text-xs tracking-widest uppercase"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <div className="text-left">
            <p
              className="text-xs tracking-widest uppercase mb-1"
              style={{ color: "rgba(255,215,0,0.5)" }}
            >
              Date of Completion
            </p>
            <p
              className="text-sm font-medium"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              {formattedDate}
            </p>
          </div>

          <div
            className="w-20 h-20 rounded-full flex flex-col items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, var(--cert-gold) 0%, var(--cert-gold-deep) 100%)",
              boxShadow:
                "0 0 0 4px rgba(255,215,0,0.2), 0 0 30px rgba(255,215,0,0.35)",
            }}
          >
            <Award className="w-9 h-9 text-black" />
          </div>

          <div className="text-right">
            <p
              className="text-xs tracking-widest uppercase mb-1"
              style={{ color: "rgba(255,215,0,0.5)" }}
            >
              Certificate ID
            </p>
            <p
              className="text-xs font-mono"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              {certificateId.slice(0, 18)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─ Not Completed ───────────────────────────────────────────────────────────

function NotCompleted({
  completionPercentage,
  completedLessons,
}: {
  completionPercentage: number;
  completedLessons: number;
}) {
  return (
    <div
      data-ocid="certificate.not_completed.panel"
      className="flex flex-col items-center justify-center min-h-[60vh] gap-8 text-center px-4"
    >
      <div className="relative">
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,215,0,0.04))",
            border: "2px solid rgba(255,215,0,0.28)",
          }}
        >
          <Award
            className="w-14 h-14"
            style={{ color: "rgba(255,215,0,0.55)" }}
          />
        </div>
        <div
          className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, oklch(var(--primary)), oklch(var(--primary) / 0.7))",
          }}
        >
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      </div>

      <div>
        <h1
          className="text-3xl font-semibold mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Your certificate awaits
        </h1>
        <p className="text-muted-foreground max-w-md leading-relaxed">
          Complete all lessons in the A3 Databases course to unlock your
          personalized certificate of completion.
        </p>
      </div>

      <div className="w-full max-w-sm bg-card rounded-2xl p-6 border border-border elevation-card">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Course Progress</span>
          <span
            className="text-2xl font-bold"
            style={{ color: "var(--cert-gold)" }}
          >
            {completionPercentage}%
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-muted overflow-hidden mb-3">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${completionPercentage}%`,
              background:
                "linear-gradient(90deg, var(--cert-gold), var(--cert-gold-deep))",
            }}
          />
        </div>
        <p className="text-xs text-muted-foreground text-right">
          {completedLessons} of {TOTAL_DB_LESSONS} lessons completed
        </p>
      </div>

      <div className="flex gap-3">
        <Button asChild data-ocid="certificate.continue_course.button">
          <Link to="/db-course">
            <BookOpen className="w-4 h-4 mr-2" />
            Continue Learning
          </Link>
        </Button>
        <Button
          variant="outline"
          asChild
          data-ocid="certificate.view_lessons.button"
        >
          <Link to="/db-course">View All Lessons</Link>
        </Button>
      </div>
    </div>
  );
}

// ─ Page ───────────────────────────────────────────────────────────────────

export function CertificatePage() {
  const { certificate, isCompleted } = useCertificate();

  // Derive progress from localStorage (db-focused)
  const completedIds = (() => {
    try {
      const raw = localStorage.getItem("db-progress");
      if (!raw) return [];
      const parsed = JSON.parse(raw) as unknown;
      return Array.isArray(parsed) ? (parsed as string[]) : [];
    } catch {
      return [];
    }
  })();
  const completedLessons = completedIds.length;
  const completionPercentage =
    TOTAL_DB_LESSONS > 0
      ? Math.round((completedLessons / TOTAL_DB_LESSONS) * 100)
      : 0;
  const _hlCompletedCount = completedIds.filter((_id) => {
    // Check if this id is an HL lesson in the db-course type
    // We just check if HL completed >= TOTAL_DB_HL_LESSONS to determine level
    return false; // placeholder
  }).length;

  // Determine certificate level based on HL lessons completed
  const dbHlCompletedCount =
    completedIds.length - (TOTAL_DB_LESSONS - TOTAL_DB_HL_LESSONS);
  const isHLCert =
    certificate?.level === "HigherLevel" ||
    dbHlCompletedCount >= TOTAL_DB_HL_LESSONS;

  const [generating, setGenerating] = useState(!certificate && isCompleted);
  const [showConfetti, setShowConfetti] = useState(false);
  const [copied, setCopied] = useState(false);
  const confettiTriggered = useRef(false);

  useEffect(() => {
    if (isCompleted && !certificate) {
      setGenerating(true);
    }
    if (certificate) {
      setGenerating(false);
      if (!confettiTriggered.current) {
        confettiTriggered.current = true;
        setShowConfetti(true);
        const t = setTimeout(() => setShowConfetti(false), 6000);
        return () => clearTimeout(t);
      }
    }
  }, [isCompleted, certificate]);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/certificate?id=${certificate?.id ?? ""}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // Generating
  if (generating && !certificate) {
    return (
      <div
        data-ocid="certificate.loading_state"
        className="flex flex-col items-center justify-center min-h-[60vh] gap-6"
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,215,0,0.18), rgba(255,215,0,0.04))",
            border: "2px solid rgba(255,215,0,0.38)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        >
          <Loader2
            className="w-10 h-10 animate-spin"
            style={{ color: "var(--cert-gold)" }}
          />
        </div>
        <div className="text-center">
          <p
            className="text-xl font-semibold mb-1"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Generating your certificate…
          </p>
          <p className="text-sm text-muted-foreground">Just a moment</p>
        </div>
      </div>
    );
  }

  // Not completed
  if (!isCompleted || !certificate) {
    return (
      <NotCompleted
        completionPercentage={completionPercentage}
        completedLessons={completedLessons}
      />
    );
  }

  const completedAtBigInt =
    typeof certificate.completedAt === "bigint"
      ? certificate.completedAt
      : BigInt(String(certificate.completedAt));

  return (
    <>
      {/* Keyframes + print styles */}
      <style>{`
        @keyframes certConfettiFall {
          0%   { transform: translateY(-20px) rotate(0deg);   opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
        }
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>

      <Confetti active={showConfetti} />

      <div
        data-ocid="certificate.page"
        className="max-w-4xl mx-auto px-4 py-10"
      >
        {/* Success banner */}
        <div
          data-ocid="certificate.success.panel"
          className="no-print flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl px-6 py-4 mb-8 border"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,215,0,0.07), rgba(255,143,0,0.03))",
            borderColor: "rgba(255,215,0,0.22)",
          }}
        >
          <div className="flex items-center gap-3">
            <CheckCircle2
              className="w-6 h-6 flex-shrink-0"
              style={{ color: "var(--cert-gold)" }}
            />
            <div>
              <p
                className="font-semibold text-sm"
                style={{ color: "var(--cert-gold)" }}
              >
                Course Complete! 🎉
              </p>
              <p className="text-xs text-muted-foreground">
                You've completed A3 Databases —{" "}
                {isHLCert ? "Higher Level" : "Standard Level"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isHLCert ? (
              <HLBadge size="md" />
            ) : (
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-sm"
                style={{
                  background: "rgba(255,215,0,0.12)",
                  color: "var(--cert-gold)",
                  border: "1px solid rgba(255,215,0,0.28)",
                }}
              >
                SL
              </span>
            )}
            <Badge
              className="text-xs font-mono shrink-0"
              style={{
                background: "rgba(255,215,0,0.12)",
                color: "var(--cert-gold)",
                border: "1px solid rgba(255,215,0,0.28)",
              }}
            >
              ID: {certificate.id.slice(0, 14)}…
            </Badge>
          </div>
        </div>

        {/* Certificate */}
        <div className="mb-8">
          <CertificateDocument
            learnerName={certificate.learnerName}
            courseTitle={certificate.courseTitle}
            completedAt={completedAtBigInt}
            certificateId={certificate.id}
            isHL={isHLCert}
          />
        </div>

        {/* Actions */}
        <div
          className="no-print flex flex-wrap items-center justify-center gap-3"
          data-ocid="certificate.actions.panel"
        >
          <Button
            onClick={() => window.print()}
            data-ocid="certificate.download.button"
            className="gap-2 font-semibold"
            style={{
              background:
                "linear-gradient(135deg, var(--cert-gold), var(--cert-gold-deep))",
              color: "#000",
            }}
          >
            <Download className="w-4 h-4" />
            Download / Print
          </Button>

          <Button
            variant="outline"
            onClick={handleCopyLink}
            data-ocid="certificate.share.button"
            className="gap-2"
          >
            {copied ? (
              <>
                <CheckCircle2
                  className="w-4 h-4"
                  style={{ color: "oklch(var(--secondary))" }}
                />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Share Link
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            asChild
            data-ocid="certificate.back_to_course.button"
            className="gap-2"
          >
            <Link to="/db-course">
              <ExternalLink className="w-4 h-4" />
              Back to Course
            </Link>
          </Button>
        </div>

        {copied && (
          <p
            data-ocid="certificate.copy.success_state"
            className="no-print text-center text-xs text-muted-foreground mt-3"
          >
            <Share2 className="inline w-3 h-3 mr-1" />
            Certificate link copied to clipboard
          </p>
        )}
      </div>
    </>
  );
}
