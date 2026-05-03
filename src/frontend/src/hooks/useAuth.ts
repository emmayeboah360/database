import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export function useAuth() {
  const {
    identity,
    loginStatus,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    login,
    clear,
  } = useInternetIdentity();

  const isLoading = isInitializing || isLoggingIn;
  const principal = identity?.getPrincipal().toText();

  return {
    identity,
    principal,
    isAuthenticated,
    isLoading,
    loginStatus,
    login,
    logout: clear,
  };
}
