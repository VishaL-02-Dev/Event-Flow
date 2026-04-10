import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }: any) {
  const token = localStorage.getItem("adminToken");

  if (!token) return <Navigate to="/admin/login" />;

  return children;
}