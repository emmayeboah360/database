import { Link, useRouterState } from "@tanstack/react-router";
import {
  Award,
  Database,
  GraduationCap,
  LogIn,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

interface LayoutProps {
  children: React.ReactNode;
}

const NAV_LINKS = [
  { to: "/", label: "Home", exact: true },
  { to: "/db-course", label: "Course", exact: false, protected: true },
  { to: "/profile", label: "Progress", exact: false, protected: true },
  { to: "/certificate", label: "Certificate", exact: false, protected: true },
];

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated, login, logout } = useAuth();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header
        data-ocid="layout.header"
        className="sticky top-0 z-40 flex items-center gap-4 px-4 sm:px-6 py-0 bg-card border-b border-border elevation-subtle"
        style={{ height: "60px" }}
      >
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group flex-shrink-0"
          data-ocid="layout.brand_link"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
            <Database className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors">
            A3 Databases
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden sm:flex items-center gap-1 ml-4 flex-1"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map(({ to, label, exact, protected: prot }) => {
            if (prot && !isAuthenticated) return null;
            const isActive = exact
              ? pathname === to
              : pathname === to || pathname.startsWith(`${to}/`);
            return (
              <Link
                key={to}
                to={to}
                data-ocid={`layout.nav.${label.toLowerCase()}`}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => logout()}
              data-ocid="layout.header_logout_button"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void login()}
              data-ocid="layout.header_login_button"
              className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-lg gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </button>
          )}
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="sm:hidden p-2 rounded-lg hover:bg-muted/50 text-muted-foreground"
            aria-label="Open menu"
            data-ocid="layout.hamburger_button"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 sm:hidden"
          onClick={() => setMobileOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
          <nav
            className="absolute top-0 left-0 bottom-0 w-72 bg-card border-r border-border flex flex-col"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="presentation"
            data-ocid="layout.mobile_nav"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
                  <Database className="w-4 h-4 text-primary" />
                </div>
                <span className="font-display text-base font-semibold text-foreground">
                  A3 Databases
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-md hover:bg-muted/50 text-muted-foreground"
                aria-label="Close menu"
                data-ocid="layout.mobile_close_button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {NAV_LINKS.map(({ to, label, exact, protected: prot }) => {
                if (prot && !isAuthenticated) return null;
                const isActive = exact
                  ? pathname === to
                  : pathname === to || pathname.startsWith(`${to}/`);
                const Icon =
                  label === "Home"
                    ? Database
                    : label === "Course"
                      ? GraduationCap
                      : label === "Progress"
                        ? User
                        : Award;
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    data-ocid={`layout.mobile_nav.${label.toLowerCase()}`}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {label}
                  </Link>
                );
              })}
            </div>

            <div className="px-3 pb-5 pt-3 border-t border-border">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  data-ocid="layout.mobile_logout_button"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    void login();
                    setMobileOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90"
                  data-ocid="layout.mobile_login_button"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/80 px-6 py-4 flex-shrink-0">
        <p className="text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Built with love using caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
