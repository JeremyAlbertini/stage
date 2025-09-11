import { Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import Users from "./pages/user.jsx";
import Calendar from "./pages/calendar.jsx";
import Conges from "./pages/conges.jsx";
import Horaire from "./pages/horaire.jsx";
import Contrat from "./pages/contrat.jsx";
import Log from "./pages/log.jsx";
import AdminPage from "./pages/admin.jsx";
import NotFound from "./pages/NotFound.jsx";
import Profile from "./pages/profile.jsx";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";
import { useState, useEffect } from "react";
import AgentsProfile from "./pages/AgentsProfile.jsx";
import { useApi } from "./hooks/useApi.js"; // Import du hook
import { useAuth } from "./context/AuthContext";

export default function AppRoutes() {
  const { authenticatedFetch } = useAuth();
  const [users, setUsers] = useState([]);
  const api = useApi(authenticatedFetch); // Utiliser le hook

  // Charge les utilisateurs pour l'admin avec auto-refresh
  const loadUsers = async () => {
    try {
      const data = await api.get("http://localhost:5000/users"); // <-- URL relative
      setUsers(data);
    } catch (err) {
      console.error("Erreur lors du chargement des utilisateurs:", err);
    }
  };
  

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/users" element={
        <ProtectedRoute>
          <Users />
        </ProtectedRoute>
      } />
      <Route path="/calendar" element={
        <ProtectedRoute>
          <Calendar />
        </ProtectedRoute>
      } />
      <Route path="/conges" element={
        <ProtectedRoute>
          <Conges />
        </ProtectedRoute>
      } />
      <Route path="/horaire" element={
        <ProtectedRoute>
          <Horaire />
        </ProtectedRoute>
      } />
      <Route path="/contrat" element={
        <ProtectedRoute>
          <Contrat />
        </ProtectedRoute>
      } />
      <Route path="/admin/*" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminPage users={users} loadUsers={loadUsers} />
        </ProtectedRoute>
      } />
      <Route path="/agents/:id" element={
        <ProtectedRoute requireAdmin={true}>
          <AgentsProfile />
        </ProtectedRoute>
      } />
      <Route path="/login" element={<Log />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}