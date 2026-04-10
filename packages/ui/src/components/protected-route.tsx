/**
 * ProtectedRoute — auth guard component.
 * Renders children only when authenticated; calls onUnauthenticated otherwise.
 * Identical pattern across all 4 audited apps (~25-40 lines each).
 */
import React, { ReactNode } from "react";
import { useAuth } from "../hooks/use-auth";

export interface ProtectedRouteProps {
  children: ReactNode;
  /** Called when user is not authenticated. Redirect or render fallback here. */
  onUnauthenticated?: () => ReactNode;
  /** Rendered while auth state is loading. Defaults to null. */
  loadingFallback?: ReactNode;
}

export const ProtectedRoute = ({
  children,
  onUnauthenticated,
  loadingFallback = null,
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <>{loadingFallback}</>;
  if (!user) return <>{onUnauthenticated?.() ?? null}</>;

  return <>{children}</>;
};
