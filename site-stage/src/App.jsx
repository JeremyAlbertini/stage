import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home.jsx";
import Users from "./pages/user.jsx";
import CreateUser from "./components/create_user";
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
      <nav style={{ padding: "1rem", background: "#eee" }}>
        <Link to="/">Accueil</Link>
        <Link to="/users" style={{ marginLeft: "1rem" }}>Utilisateurs</Link>
        <Link to="/admin" style={{ marginLeft: "1rem" }}>Administration</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/admin" element={
          <div>
            <h1>Administration des utilisateurs</h1>
            <CreateUser onUserCreated={loadUsers}/>
            <h2>Liste des utilisateurs</h2>
            <ul>
              {users.map(user => (
                <li key={user.id}>{user.matricule}</li>
              ))}
            </ul>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
