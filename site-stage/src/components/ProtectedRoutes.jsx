import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import '../styles/ProtectedRoutes.css';
import { useEffect } from "react";
import { hasAnyPerm} from "../utils/permsApi";
import { useState } from "react";
import { useApi } from "../hooks/useApi";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const api = useApi();
  const { user, loading , permissions, refreshUserData} = useAuth();
  const [ok, setOk] = useState(null);

  useEffect(() => {
    if (!loading && user && requireAdmin) {
      const result = hasAnyPerm(permissions, ["create_account", "all_users"]);
      setOk(result);
    } else if (!loading) {
      setOk(true);
    }
  }, [user, requireAdmin, loading, permissions]);

  if (loading) {
    return <div className="loader-container">
    <div className="loader">
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !ok) {
    return <Navigate to="/" replace />;
  }

  return children;
}
