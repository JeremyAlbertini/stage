import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import Users from "./pages/user.jsx";
import Log from "./pages/log.jsx";
import CreateUser from "./components/create_user";
import AdminPage from "./pages/admin.jsx";
import NotFound from "./pages/NotFound.jsx";
import { useState, useEffect } from "react";

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
        <Route path="/admin/*" element={<AdminPage users={users} loadUsers={loadUsers} />} />
        <Route path="*" element={<NotFound />} /> {}
      </Routes>
    </Router>
  );
}

export default App;
