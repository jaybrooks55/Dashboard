import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function ProtectedRoute() {
  const { session, loading } = useAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">Loading...</div>;
  }

  if (!session) return <Navigate to="/login" replace />;

  return <Outlet />;
}
