import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import '../styles/ProtectedRoutes.css';
import { useEffect } from "react";
import { hasAnyUserPerm } from "../utils/permsApi";
import { useState } from "react";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth();
  const [ok, setOk] = useState(false);


  useEffect(() => {
    if (user) {
      hasAnyUserPerm(user.id, ["create_account", "all_users"]).then(result => {
        setOk(result);
      });
      console.log("Vérification des permissions pour l'utilisateur :", user);
    }
  }, [user]);

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
