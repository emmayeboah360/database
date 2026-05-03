import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Database,
  GitBranch,
  GraduationCap,
  Layers,
  Lock,
  LogIn,
  PlayCircle,
  Table2,
  Terminal,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { HLBadge } from "../components/HLBadge";
import { useAuth } from "../hooks/useAuth";
import {
  ALL_DB_LESSONS,
  DATABASE_MODULES,
  TOTAL_DB_HL_LESSONS,
  TOTAL_DB_LESSONS,
  TOTAL_DB_SL_LESSONS,
  totalDbHours,
} from "../types/database";

// ─── Static content ───────────────────────────────────────────────────────────

const _DB_HOURS_TOTAL = totalDbHours();
const DB_SL_HOURS = 11;
const DB_HL_HOURS = 18;

const FEATURES = [
  {
    icon: Terminal,
    title: "Live SQL Playground",
    desc: "Write and run real SQL queries in your browser — JOINs, aggregates, filters. Instant output, no setup.",
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20",
  },
  {
    icon: GitBranch,
    title: "Interactive ERD Diagrams",
    desc: "Explore entity-relationship diagrams for library, hospital, e-commerce, and school databases.",
    color: "text-secondary",
    bg: "bg-secondary/10 border-secondary/20",
  },
  {
    icon: Table2,
    title: "Normalisation Exercises",
    desc: "Step through 1NF → 2NF → 3NF decomposition with real-world scenarios and guided feedback.",
    color: "text-accent",
    bg: "bg-accent/10 border-accent/20",
  },
  {
    icon: BookOpen,
    title: "End-of-Lesson Quizzes",
    desc: "Test your understanding after every lesson with instant right/wrong feedback and explanations.",
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20",
  },
  {
    icon: TrendingUp,
    title: "Structured SL → HL Pathway",
    desc: "Start with Standard Level fundamentals. When ready, unlock Higher Level topics — clearly marked throughout.",
    color: "text-db-hl",
    bg: "bg-db-hl/10 border-db-hl/20",
  },
  {
    icon: Award,
    title: "Completion Certificate",
    desc: "Finish the course and instantly generate your personalized A3 Databases certificate — ready to share.",
    color: "text-accent",
    bg: "bg-accent/10 border-accent/20",
  },
];

const MODULE_CARDS = [
  {
    id: "a31",
    code: "A3.1",
    title: "Database Fundamentals",
    desc: "Relational features, benefits, and limitations. Primary keys, foreign keys, composite keys, and data relationships.",
    lessons: ALL_DB_LESSONS.filter((l) => l.moduleId === "db-mod-1").length,
    hlLessons: ALL_DB_LESSONS.filter((l) => l.moduleId === "db-mod-1" && l.isHL)
      .length,
    color: "text-primary",
    bg: "bg-primary/10 border-primary/25",
    accent: "bg-primary",
    level: "SL",
  },
  {
    id: "a32",
    code: "A3.2",
    title: "Database Design",
    desc: "Schemas, ERDs, data types, and normalisation to 3NF. Real-world design for library, hospital, and e-commerce systems.",
    lessons: ALL_DB_LESSONS.filter((l) => l.moduleId === "db-mod-2").length,
    hlLessons: ALL_DB_LESSONS.filter((l) => l.moduleId === "db-mod-2" && l.isHL)
      .length,
    color: "text-secondary",
    bg: "bg-secondary/10 border-secondary/25",
    accent: "bg-secondary",
    level: "SL + HL",
  },
  {
    id: "a33",
    code: "A3.3",
    title: "SQL Programming",
    desc: "DDL, DML, JOINs, filtering, GROUP BY, aggregate functions, views, and transactions with ACID properties.",
    lessons: ALL_DB_LESSONS.filter((l) => l.moduleId === "db-mod-3").length,
    hlLessons: ALL_DB_LESSONS.filter((l) => l.moduleId === "db-mod-3" && l.isHL)
      .length,
    color: "text-accent",
    bg: "bg-accent/10 border-accent/25",
    accent: "bg-accent",
    level: "SL + HL",
  },
  {
    id: "a34",
    code: "A3.4",
    title: "Alternative Databases & Warehouses",
    desc: "NoSQL, cloud, spatial, in-memory databases; OLAP, data mining, and distributed database architectures.",
    lessons: ALL_DB_LESSONS.filter((l) => l.moduleId === "db-mod-4").length,
    hlLessons: ALL_DB_LESSONS.filter((l) => l.moduleId === "db-mod-4" && l.isHL)
      .length,
    color: "text-db-hl",
    bg: "bg-db-hl/10 border-db-hl/25",
    accent: "bg-db-hl",
    level: "HL Only",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatPill({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: string | number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 bg-card/80 border border-border rounded-full elevation-subtle">
      <Icon className="w-4 h-4 text-primary" />
      <span className="text-sm font-semibold text-foreground">{value}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
  color,
  bg,
  index,
}: (typeof FEATURES)[0] & { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      data-ocid={`home.feature.card.${index + 1}`}
      className="flex gap-4 p-5 rounded-xl border bg-card hover:border-opacity-60 transition-colors duration-300 group"
    >
      <div
        className={`w-10 h-10 rounded-lg border flex items-center justify-center flex-shrink-0 group-hover:opacity-80 transition-opacity ${bg}`}
      >
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground mb-1">{title}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

function ModuleOverviewCard({
  mod,
  index,
  locked,
}: {
  mod: (typeof MODULE_CARDS)[0];
  index: number;
  locked: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Card
        data-ocid={`home.module.card.${index + 1}`}
        className={`relative overflow-hidden border bg-card transition-all duration-300 group ${
          locked
            ? "opacity-60"
            : "hover:border-primary/40 elevation-card hover:elevation-modal"
        }`}
      >
        {/* Top accent bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-0.5 ${mod.accent} opacity-60 group-hover:opacity-100 transition-opacity`}
        />

        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-xs border flex-shrink-0 ${mod.bg} ${mod.color}`}
              >
                {mod.code}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground leading-snug">
                  {mod.title}
                </h3>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${mod.bg} ${mod.color}`}
                  >
                    {mod.level}
                  </span>
                  {mod.hlLessons > 0 && (
                    <HLBadge label={`${mod.hlLessons} HL`} size="sm" />
                  )}
                </div>
              </div>
            </div>
            {locked ? (
              <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            ) : (
              <ChevronRight
                className={`w-4 h-4 flex-shrink-0 mt-1 ${mod.color} opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200`}
              />
            )}
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            {mod.desc}
          </p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{mod.lessons} lessons</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function HomePage() {
  const { isAuthenticated, login, isLoading } = useAuth();
  const router = useRouter();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  function handleStartLearning() {
    if (isAuthenticated) {
      void router.navigate({ to: "/db-course" });
    } else {
      setLoginModalOpen(true);
    }
  }

  async function handleLogin() {
    await login();
    setLoginModalOpen(false);
    void router.navigate({ to: "/db-course" });
  }

  return (
    <div className="flex flex-col">
      {/* ===== HERO ===== */}
      <section
        data-ocid="home.hero_section"
        className="relative min-h-[88vh] flex flex-col items-center justify-center overflow-hidden px-4 py-20"
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/assets/generated/db-hero.dim_1400x700.jpg')",
          }}
          aria-hidden="true"
        />
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.09 0.01 280 / 0.88) 0%, oklch(0.10 0.01 280 / 0.95) 60%, oklch(0.10 0.01 280 / 1) 100%)",
          }}
          aria-hidden="true"
        />
        {/* Cyan radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 35%, oklch(0.42 0.18 195 / 0.15) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        {/* Hero content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs font-semibold px-3 py-1 uppercase tracking-widest">
              IB Computer Science
            </Badge>
            <Badge className="bg-db-hl/20 text-db-hl border-db-hl/30 text-xs font-semibold px-3 py-1 uppercase tracking-widest">
              SL → HL
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-foreground mb-6 leading-[1.1]"
          >
            Master{" "}
            <span
              style={{
                backgroundImage:
                  "linear-gradient(135deg, oklch(0.68 0.20 195), oklch(0.60 0.18 282))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              A3 Databases
            </span>
            <br />
            <span className="italic">from Schema to SQL</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            The complete IB Computer Science A3 Databases course — live SQL
            editor, interactive ERD diagrams, normalisation exercises, and
            structured coverage from Standard Level fundamentals to Higher Level
            advanced topics.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
          >
            <Button
              data-ocid="home.start_learning_button"
              size="lg"
              onClick={handleStartLearning}
              disabled={isLoading}
              className="gradient-primary text-primary-foreground font-semibold px-8 py-6 text-base rounded-xl border-0 hover:opacity-90 transition-opacity elevation-card gap-2 min-w-[200px]"
            >
              <PlayCircle className="w-5 h-5" />
              {isLoading ? "Loading…" : "Start Learning Free"}
            </Button>
            <Button
              data-ocid="home.view_modules_button"
              size="lg"
              variant="outline"
              className="px-8 py-6 text-base rounded-xl border-border hover:border-primary/50 hover:bg-primary/5 transition-all gap-2"
              onClick={() =>
                document
                  .getElementById("modules")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <Database className="w-4 h-4" />
              View Modules
            </Button>
          </motion.div>

          {/* Stats pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <StatPill
              icon={Layers}
              value={DATABASE_MODULES.length}
              label="modules"
            />
            <StatPill
              icon={BookOpen}
              value={TOTAL_DB_LESSONS}
              label="lessons"
            />
            <StatPill
              icon={Clock}
              value={`SL ${DB_SL_HOURS}h / HL ${DB_HL_HOURS}h`}
              label="content"
            />
            <StatPill
              icon={GraduationCap}
              value={TOTAL_DB_SL_LESSONS}
              label="SL topics"
            />
            <StatPill
              icon={Award}
              value={TOTAL_DB_HL_LESSONS}
              label="HL topics"
            />
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent, oklch(0.10 0.01 280 / 1))",
          }}
          aria-hidden="true"
        />
      </section>

      {/* ===== FEATURES ===== */}
      <section
        data-ocid="home.features_section"
        className="py-20 px-4 bg-background"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
              How you'll learn
            </p>
            <h2 className="text-heading text-3xl sm:text-4xl font-medium text-foreground mb-4">
              Built for <span className="italic">active learning</span>
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              Every lesson is interactive. No passive content — you write SQL,
              build ERDs, and practice normalisation with real feedback.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== MODULES ===== */}
      <section
        id="modules"
        data-ocid="home.modules_section"
        className="py-20 px-4 bg-muted/30"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3">
              Course structure
            </p>
            <h2 className="text-heading text-3xl sm:text-4xl font-medium text-foreground mb-4">
              {DATABASE_MODULES.length} modules,{" "}
              <span className="italic">
                {TOTAL_DB_LESSONS} interactive lessons
              </span>
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              Full A3 syllabus coverage — Standard Level (11 hours) and Higher
              Level (18 hours). HL topics are clearly marked and differentiated
              throughout.
            </p>

            {/* SL / HL time badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  SL: 11 hours
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-db-hl/10 border border-db-hl/30">
                <Clock className="w-3.5 h-3.5 text-db-hl" />
                <span className="text-sm font-semibold text-db-hl">
                  HL: 18 hours
                </span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MODULE_CARDS.map((mod, i) => (
              <ModuleOverviewCard
                key={mod.id}
                mod={mod}
                index={i}
                locked={!isAuthenticated}
              />
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-muted-foreground mb-5">
              {isAuthenticated
                ? "You're signed in — jump straight into the first lesson."
                : "Sign in with Internet Identity to unlock all modules and track your progress."}
            </p>
            <Button
              data-ocid="home.modules_cta_button"
              size="lg"
              onClick={handleStartLearning}
              disabled={isLoading}
              className="gradient-primary text-primary-foreground font-semibold px-10 py-6 text-base rounded-xl border-0 hover:opacity-90 transition-opacity elevation-card gap-2"
            >
              <PlayCircle className="w-5 h-5" />
              {isAuthenticated
                ? "Continue to Course"
                : "Start Learning — It's Free"}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ===== CERTIFICATE CTA ===== */}
      <section
        data-ocid="home.certificate_section"
        className="py-20 px-4 bg-background"
      >
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="relative overflow-hidden rounded-2xl border border-border bg-card p-10 text-center elevation-modal"
          >
            {/* Glow */}
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{
                background:
                  "radial-gradient(ellipse 70% 60% at 50% 0%, oklch(0.60 0.15 195 / 0.10) 0%, transparent 70%)",
              }}
              aria-hidden="true"
            />

            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center">
                <Award className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-heading text-2xl sm:text-3xl font-medium text-foreground mb-4">
                Complete the course,{" "}
                <span className="italic text-accent">
                  earn your certificate
                </span>
              </h2>
              <p className="text-muted-foreground text-base max-w-lg mx-auto mb-8 leading-relaxed">
                Finish all {TOTAL_DB_LESSONS} lessons and your personalized A3
                Databases certificate generates instantly — ready to share on
                LinkedIn, attach to your CV, or display with pride.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 text-sm text-muted-foreground">
                {[
                  "Auto-generated on completion",
                  "Standard Level or Higher Level",
                  "Print or share as PDF",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Button
                data-ocid="home.certificate_cta_button"
                size="lg"
                onClick={handleStartLearning}
                disabled={isLoading}
                className="gradient-primary text-primary-foreground font-semibold px-10 py-6 text-base rounded-xl border-0 hover:opacity-90 transition-opacity elevation-card gap-2"
              >
                <GraduationCap className="w-5 h-5" />
                Begin Your Database Journey
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== LOGIN MODAL ===== */}
      <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
        <DialogContent
          data-ocid="home.login_dialog"
          className="sm:max-w-md bg-card border-border"
        >
          <DialogHeader>
            <DialogTitle className="text-heading text-xl font-medium">
              Sign in to start learning
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-5 py-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Use Internet Identity — decentralized, password-free
              authentication. No email required, fully private.
            </p>
            <div className="flex flex-col gap-3">
              {[
                "Track your progress across all devices",
                `Unlock all ${TOTAL_DB_LESSONS} database lessons instantly`,
                "Generate your A3 certificate on completion",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                data-ocid="home.login_confirm_button"
                onClick={() => void handleLogin()}
                disabled={isLoading}
                className="flex-1 gradient-primary text-primary-foreground font-semibold border-0 hover:opacity-90 gap-2"
              >
                <LogIn className="w-4 h-4" />
                {isLoading ? "Signing in…" : "Sign in with Internet Identity"}
              </Button>
              <Button
                data-ocid="home.login_cancel_button"
                variant="outline"
                onClick={() => setLoginModalOpen(false)}
                className="border-border"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
