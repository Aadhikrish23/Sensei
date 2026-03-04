import React, {  type ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({children}:{ children: ReactNode }) {
  const { user } = useAuth();
const { hasAttemptedRefresh } = useAuth();

if (!hasAttemptedRefresh) {
  return <div>Loading...</div>;
}

if (!user) {
  return <Navigate to="/login" replace />;
}

return children; 
}
