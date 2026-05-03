import { Link, useRouterState } from "@tanstack/react-router";
import {
  Award,
  Code2,
  Database,
  LayoutDashboard,
  LogIn,
  LogOut,
  User,
  X,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useCourse } from "../hooks/useCourse";
import { ProgressBar } from "./ProgressBar";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navLinks = [
  { to: "/", label: "Home", icon: Code2 },
  { to: "/course", label: "Dashboard", icon: LayoutDashboard, protected: true },
  { to: "/db-course", label: "A3 Databases", icon: Database, protected: true },
  { to: "/certificate", label: "Certificate", icon: Award, protected: true },
  { to: "/profile", label: "Profile", icon: User, protected: true },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const { isAuthenticated, login, logout, principal } = useAuth();
  const { completionPercentage, completedLessons, totalLessons } = useCourse();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          role="button"
          tabIndex={-1}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar panel */}
      <aside
        data-ocid="sidebar.panel"
        className={`
          fixed inset-y-0 left-0 z-40 w-72 flex flex-col
          bg-sidebar border-r border-sidebar-border
          transform transition-smooth
          lg:relative lg:translate-x-0 lg:z-auto lg:flex lg:w-64
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-sidebar-border">
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            onClick={onClose}
            data-ocid="sidebar.logo_link"
          >
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
              <Code2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-medium text-foreground group-hover:text-primary transition-colors">
              Codex Python
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md hover:bg-muted/50 text-muted-foreground transition-smooth"
            aria-label="Close menu"
            data-ocid="sidebar.close_button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress summary */}
        {isAuthenticated && (
          <div className="px-5 py-4 border-b border-sidebar-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Overall Progress</span>
              <span className="font-mono tabular-nums">
                {completedLessons}/{totalLessons}
              </span>
            </div>
            <ProgressBar
              value={completionPercentage}
              size="sm"
              variant={completionPercentage === 100 ? "success" : "default"}
              showLabel
            />
          </div>
        )}

        {/* Navigation */}
        <nav
          className="flex-1 px-3 py-4 space-y-1 overflow-y-auto"
          aria-label="Main navigation"
        >
          {navLinks.map(({ to, label, icon: Icon, protected: prot }) => {
            if (prot && !isAuthenticated) return null;
            const isActive =
              pathname === to || (to !== "/" && pathname.startsWith(to));
            return (
              <Link
                key={`${to}-${label}`}
                to={to}
                onClick={onClose}
                data-ocid={`sidebar.nav.${label.toLowerCase().replace(/\s+/g, "_")}`}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-smooth
                  ${
                    isActive
                      ? "bg-sidebar-primary/15 text-sidebar-primary"
                      : "text-sidebar-foreground hover:bg-muted/40 hover:text-foreground"
                  }
                `}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User / Auth */}
        <div className="px-3 pb-5 pt-3 border-t border-sidebar-border">
          {isAuthenticated ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary-foreground">
                    {principal ? principal.slice(0, 2).toUpperCase() : "ME"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    Python Graduate
                  </p>
                  <p className="text-xs text-muted-foreground truncate font-mono">
                    {principal ? `${principal.slice(0, 12)}…` : "Connected"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                }}
                data-ocid="sidebar.logout_button"
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => void login()}
              data-ocid="sidebar.login_button"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-primary-foreground text-sm font-semibold transition-smooth hover:opacity-90"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
