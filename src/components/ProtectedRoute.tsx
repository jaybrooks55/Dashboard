import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function ProtectedRoute() {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">Loading...</div>;
  }

  if (!session) return <Navigate to="/login" replace />;

  // An invite/recovery link signs the user in directly (see index.html), but
  // they still need to pick a password before they can log in normally next
  // time. Force that step before letting them into the rest of the app.
  if (sessionStorage.getItem("pendingAuthAction") && location.pathname !== "/set-password") {
    return <Navigate to="/set-password" replace />;
  }

  return <Outlet />;
}
