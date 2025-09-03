import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home.jsx";
import Users from "./pages/user.jsx";
import Log from "./pages/log.jsx";
import CreateUser from "./components/create_user";
import AdminPage from "./pages/admin.jsx";
import { useState, useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";
import Profile from "./pages/profile.jsx";

function App() {
  const [users, setUsers] = useState([]);

  const loadUsers = () => {
    fetch("http://localhost:5000/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/login" element={<Log />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/*" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminPage users={users} loadUsers={loadUsers} />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
