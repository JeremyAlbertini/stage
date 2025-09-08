import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import '../styles/ProtectedRoutes.css';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div class="loader-container">
    <div class="loader">
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
