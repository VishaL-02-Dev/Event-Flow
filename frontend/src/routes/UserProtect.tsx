import { Navigate } from "react-router-dom";
export default function UserProtectedRoute({ children }: any) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}