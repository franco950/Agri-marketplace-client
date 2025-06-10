import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/useauth";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoggedin, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or your spinner
  }

  if (!isLoggedin) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
