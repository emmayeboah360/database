import { Lock } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface AuthGuardProps {
  children: React.ReactNode;
}

function LockIcon() {
  return <Lock className="w-8 h-8 text-primary-foreground" aria-hidden />;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">
            Checking authentication…
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh] px-4">
        <div className="max-w-md w-full text-center space-y-6 bg-card border border-border rounded-2xl p-8 elevation-card">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto">
            <LockIcon />
          </div>
          <div>
            <h2 className="text-heading text-foreground">Sign In Required</h2>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              Sign in with Internet Identity to access your course, track
              progress, and earn your certificate.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void login()}
            data-ocid="auth_guard.login_button"
            className="w-full gradient-primary text-primary-foreground font-semibold py-3 px-6 rounded-xl transition-smooth hover:opacity-90 active:scale-[0.98]"
          >
            Sign In with Internet Identity
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
