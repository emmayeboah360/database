import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Database,
  Download,
  ExternalLink,
  LogOut,
  RotateCcw,
  Trophy,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { HLBadge } from "../components/HLBadge";
import { ProgressBar } from "../components/ProgressBar";
import { useAuth } from "../hooks/useAuth";
import { useCertificate } from "../hooks/useCertificate";
import {
  DATABASE_MODULES,
  TOTAL_DB_HL_LESSONS,
  TOTAL_DB_LESSONS,
  TOTAL_DB_SL_LESSONS,
  getDbProgress,
  setDbProgress,
} from "../types/database";

// ── Helpers ─────────────────────────────────────────────────────────────

function truncatePrincipal(id: string): string {
  if (id.length <= 20) return id;
  return `${id.slice(0, 10)}…${id.slice(-6)}`;
}

function formatNs(ns: bigint): string {
  const ms = Number(ns / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── Skeleton ──────────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div
      className="max-w-3xl mx-auto px-4 py-10 space-y-6"
      data-ocid="profile.loading_state"
    >
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-56" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-card border-border">
            <CardContent className="p-5 space-y-2">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  highlight?: boolean;
  index: number;
}

function StatCard({ icon, value, label, highlight, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.07, duration: 0.4 }}
      data-ocid={`profile.stat.item.${index}`}
    >
      <Card
        className={`border elevation-card transition-smooth hover:-translate-y-0.5 ${
          highlight
            ? "bg-primary/10 border-primary/30"
            : "bg-card border-border"
        }`}
      >
        <CardContent className="p-5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${
              highlight ? "bg-primary/20" : "bg-muted/60"
            }`}
          >
            {icon}
          </div>
          <p
            className={`text-3xl font-display font-semibold tabular-nums ${
              highlight ? "text-primary" : "text-foreground"
            }`}
          >
            {value}
          </p>
          <p className="text-xs text-muted-foreground mt-1 leading-snug">
            {label}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Not Enrolled CTA ────────────────────────────────────────────────────────────

function EnrollmentCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      data-ocid="profile.enrollment_cta"
    >
      <Card className="bg-gradient-to-br from-primary/15 via-card to-secondary/10 border-primary/30 elevation-card">
        <CardContent className="p-8 text-center">
          <div className="w-14 h-14 rounded-2xl gradient-primary mx-auto flex items-center justify-center mb-4">
            <Database className="w-7 h-7 text-primary-foreground" />
          </div>
          <h3 className="text-subheading text-foreground mb-2">
            Start Your Database Journey
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Begin the A3 Databases course to track your progress, unlock
            interactive lessons, and earn your completion certificate.
          </p>
          <Button asChild size="lg" data-ocid="profile.enroll_button">
            <Link to="/db-course">
              Begin Learning
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────────

export function ProfilePage() {
  const { principal, isLoading: authLoading, logout } = useAuth();
  const { certificate, clearCertificate } = useCertificate();

  const completedIds = getDbProgress();
  const completedCount = completedIds.length;
  const completionPercentage =
    TOTAL_DB_LESSONS > 0
      ? Math.round((completedCount / TOTAL_DB_LESSONS) * 100)
      : 0;
  const isCompleted =
    completedCount === TOTAL_DB_LESSONS && TOTAL_DB_LESSONS > 0;

  // Per-module progress
  const moduleProgress = DATABASE_MODULES.map((mod) => {
    const total = mod.lessons.length;
    const completed = mod.lessons.filter((l) =>
      completedIds.includes(l.id),
    ).length;
    return { module: mod, total, completed };
  });
  const completedModules = moduleProgress.filter(
    (m) => m.completed === m.total,
  ).length;
  const isEnrolled = completedCount > 0;
  const certificatesCount = certificate ? 1 : 0;

  if (authLoading) return <ProfileSkeleton />;

  const handleReset = () => {
    if (window.confirm("Reset all progress? This cannot be undone.")) {
      setDbProgress([]);
      clearCertificate();
      // Force reload to reflect cleared state
      window.location.reload();
    }
  };

  const stats = [
    {
      icon: (
        <Trophy
          className={`w-4 h-4 ${completionPercentage === 100 ? "text-primary" : "text-muted-foreground"}`}
        />
      ),
      value: `${completionPercentage}%`,
      label: "Overall Progress",
      highlight: completionPercentage === 100,
    },
    {
      icon: <BookOpen className="w-4 h-4 text-secondary" />,
      value: completedCount,
      label: `Lessons of ${TOTAL_DB_LESSONS} completed`,
      highlight: false,
    },
    {
      icon: <CheckCircle2 className="w-4 h-4 text-accent" />,
      value: completedModules,
      label: `Modules of ${DATABASE_MODULES.length} completed`,
      highlight: false,
    },
    {
      icon: <Award className="w-4 h-4 text-muted-foreground" />,
      value: certificatesCount,
      label: "Certificates Earned",
      highlight: certificatesCount > 0,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10" data-ocid="profile.page">
      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            IB Computer Science
          </span>
          <Badge className="bg-primary/15 text-primary border-primary/25 text-xs">
            A3
          </Badge>
        </div>
        <h1 className="text-display text-foreground">My Progress</h1>
        <p className="text-muted-foreground mt-1.5">
          Track your A3 Databases learning journey and achievements
        </p>
      </motion.div>

      {/* ── Identity Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.4 }}
        className="mb-5"
      >
        <Card className="bg-card border-border elevation-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-5">
              {/* DB-themed avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center elevation-card">
                  <Database className="w-8 h-8 text-primary-foreground" />
                </div>
                {isCompleted && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-secondary flex items-center justify-center border-2 border-background">
                    <Trophy className="w-2.5 h-2.5 text-secondary-foreground" />
                  </div>
                )}
              </div>

              {/* Identity info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-subheading text-foreground">
                    Database Student
                  </h2>
                  <Badge
                    variant="outline"
                    className={
                      isEnrolled
                        ? "border-secondary/50 text-secondary bg-secondary/10"
                        : "border-muted-foreground/40 text-muted-foreground"
                    }
                    data-ocid="profile.enrollment_badge"
                  >
                    {isEnrolled ? "In Progress" : "Not Started"}
                  </Badge>
                  {isCompleted && (
                    <Badge
                      className="bg-accent/20 text-accent border-accent/40"
                      variant="outline"
                      data-ocid="profile.mastery_badge"
                    >
                      <Trophy className="w-3 h-3 mr-1" />
                      A3 Complete
                    </Badge>
                  )}
                </div>

                <p
                  className="text-xs font-mono text-muted-foreground mt-1.5 truncate"
                  data-ocid="profile.principal_id"
                  title={principal}
                >
                  <span className="text-muted-foreground/60 mr-1">ID:</span>
                  {principal ? truncatePrincipal(principal) : "—"}
                </p>

                {isEnrolled && (
                  <div className="mt-3">
                    <ProgressBar
                      value={completionPercentage}
                      size="sm"
                      variant={
                        completionPercentage === 100 ? "success" : "default"
                      }
                      showLabel
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Enrollment CTA (if not started) ── */}
      {!isEnrolled && (
        <div className="mb-6">
          <EnrollmentCTA />
        </div>
      )}

      {/* ── Stats Grid ── */}
      {isEnrolled && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {stats.map((stat, i) => (
            <StatCard
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              highlight={stat.highlight}
              index={i}
            />
          ))}
        </div>
      )}

      {/* ── SL / HL breakdown ── */}
      {isEnrolled && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-5"
          data-ocid="profile.level_breakdown_section"
        >
          <Card className="bg-card border-border elevation-card">
            <CardContent className="p-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Standard Level
                  </span>
                  <span className="text-xl font-display font-semibold text-foreground tabular-nums">
                    {
                      completedIds.filter((id) => {
                        const lesson = DATABASE_MODULES.flatMap(
                          (m) => m.lessons,
                        ).find((l) => l.id === id);
                        return lesson && !lesson.isHL;
                      }).length
                    }
                    <span className="text-sm font-normal text-muted-foreground">
                      {" "}
                      / {TOTAL_DB_SL_LESSONS}
                    </span>
                  </span>
                  <ProgressBar
                    value={
                      TOTAL_DB_SL_LESSONS > 0
                        ? Math.round(
                            (completedIds.filter((id) => {
                              const lesson = DATABASE_MODULES.flatMap(
                                (m) => m.lessons,
                              ).find((l) => l.id === id);
                              return lesson && !lesson.isHL;
                            }).length /
                              TOTAL_DB_SL_LESSONS) *
                              100,
                          )
                        : 0
                    }
                    size="sm"
                    variant="default"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">
                      Higher Level
                    </span>
                    <HLBadge size="sm" />
                  </div>
                  <span className="text-xl font-display font-semibold text-foreground tabular-nums">
                    {
                      completedIds.filter((id) => {
                        const lesson = DATABASE_MODULES.flatMap(
                          (m) => m.lessons,
                        ).find((l) => l.id === id);
                        return lesson?.isHL;
                      }).length
                    }
                    <span className="text-sm font-normal text-muted-foreground">
                      {" "}
                      / {TOTAL_DB_HL_LESSONS}
                    </span>
                  </span>
                  <ProgressBar
                    value={
                      TOTAL_DB_HL_LESSONS > 0
                        ? Math.round(
                            (completedIds.filter((id) => {
                              const lesson = DATABASE_MODULES.flatMap(
                                (m) => m.lessons,
                              ).find((l) => l.id === id);
                              return lesson?.isHL;
                            }).length /
                              TOTAL_DB_HL_LESSONS) *
                              100,
                          )
                        : 0
                    }
                    size="sm"
                    variant="default"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ── Progress Section ── */}
      {isEnrolled && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mb-5"
          data-ocid="profile.progress_section"
        >
          <Card className="bg-card border-border elevation-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-foreground">
                <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
                  <Trophy className="w-3.5 h-3.5 text-primary" />
                </div>
                Module Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 pb-5 px-6">
              <div className="space-y-4">
                {moduleProgress.map((mp) => (
                  <div key={mp.module.id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-foreground font-medium">
                          {mp.module.title}
                        </span>
                        {mp.module.isHL && <HLBadge size="sm" />}
                      </div>
                      <span className="text-xs font-mono text-muted-foreground tabular-nums">
                        {mp.completed}/{mp.total}
                      </span>
                    </div>
                    <ProgressBar
                      value={
                        mp.total > 0
                          ? Math.round((mp.completed / mp.total) * 100)
                          : 0
                      }
                      size="md"
                      variant={
                        mp.completed === mp.total ? "success" : "default"
                      }
                    />
                  </div>
                ))}

                <Separator className="my-1 bg-border/50" />

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">
                      Overall Completion
                    </span>
                    <span className="text-sm font-mono font-bold text-primary tabular-nums">
                      {completionPercentage}%
                    </span>
                  </div>
                  <ProgressBar
                    value={completionPercentage}
                    size="lg"
                    variant={
                      completionPercentage === 100 ? "success" : "default"
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ── Certificates Section ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="mb-5"
        data-ocid="profile.certificates_section"
      >
        <Card className="bg-card border-border elevation-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-foreground">
              <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center">
                <Award className="w-3.5 h-3.5 text-accent" />
              </div>
              Certificates
              <Badge
                variant="outline"
                className="ml-auto text-xs border-border"
              >
                {certificatesCount}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-5 px-6">
            {certificate ? (
              <div
                className="rounded-xl bg-gradient-to-r from-accent/10 via-accent/5 to-transparent border border-accent/25 p-4"
                data-ocid="profile.certificate.item.1"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-foreground">
                          {certificate.courseTitle}
                        </p>
                        {certificate.level === "HigherLevel" && (
                          <HLBadge size="sm" label="HL" />
                        )}
                        {certificate.level === "StandardLevel" && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-primary/15 text-primary border border-primary/30 font-bold uppercase tracking-wide">
                            SL
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-mono text-muted-foreground mt-0.5 truncate">
                        <span className="text-muted-foreground/60">ID: </span>
                        {certificate.id}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Completed{" "}
                        <span className="text-foreground font-medium">
                          {formatNs(certificate.completedAt)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-accent/40 text-accent hover:bg-accent/10 hover:text-accent"
                      data-ocid="profile.view_certificate_button"
                    >
                      <Link to="/certificate">
                        <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                        View
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-border text-muted-foreground hover:text-foreground"
                      data-ocid="profile.download_certificate_button"
                    >
                      <Link to="/certificate">
                        <Download className="w-3.5 h-3.5 mr-1.5" />
                        Download
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="flex flex-col items-center py-6 text-center"
                data-ocid="profile.certificates.empty_state"
              >
                <div className="w-12 h-12 rounded-2xl bg-muted/40 flex items-center justify-center mb-3">
                  <Award className="w-6 h-6 text-muted-foreground/60" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  No certificates yet
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1 max-w-xs">
                  Complete all lessons to earn your A3 Databases certificate.
                </p>
                {isEnrolled && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="mt-4 border-primary/40 text-primary hover:bg-primary/10"
                    data-ocid="profile.continue_learning_button"
                  >
                    <Link to="/db-course">
                      <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                      Continue Learning
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Account Section ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="mb-5"
        data-ocid="profile.account_section"
      >
        <Card className="bg-card border-border elevation-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-foreground">
              <div className="w-7 h-7 rounded-lg bg-muted/60 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-5 px-6 space-y-3">
            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/20">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Internet Identity
                </p>
                <p className="text-xs font-mono text-muted-foreground mt-0.5 truncate max-w-[200px]">
                  {principal ? truncatePrincipal(principal) : "—"}
                </p>
              </div>
              <Badge
                variant="outline"
                className="border-secondary/50 text-secondary bg-secondary/10"
              >
                Active
              </Badge>
            </div>

            <Button
              variant="outline"
              className="w-full border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => logout()}
              data-ocid="profile.logout_button"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Danger Zone ── */}
      {isEnrolled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          data-ocid="profile.danger_zone"
        >
          <Card className="bg-card border-destructive/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-foreground">
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-5 px-6">
              <p className="text-sm text-muted-foreground mb-4">
                Permanently clear all lesson progress and your earned
                certificate. This action cannot be undone.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                data-ocid="profile.reset_button"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-2" />
                Reset All Progress
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
