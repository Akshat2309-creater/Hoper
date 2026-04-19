import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function ProtectedRoute() {
  const { session, isReady } = useAuth();
  const location = useLocation();

  if (!isReady) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
