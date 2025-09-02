import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home.jsx";
import Users from "./pages/user.jsx";
import CreateUser from "./components/create_user";
import AdminPage from "./pages/admin.jsx";
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
        <Route path="/admin/*" element={<AdminPage users={users} loadUsers={loadUsers} />} />
      </Routes>
    </Router>
  );
}

export default App;
