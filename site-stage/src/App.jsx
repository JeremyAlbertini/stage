import { BrowserRouter as Router, Routes, Route, useNavigate} from "react-router-dom";
import Home from "./pages/home.jsx";
import Users from "./pages/user.jsx";
import Log from "./pages/log.jsx";
import CreateUser from "./components/create_user";
import AdminPage from "./pages/admin.jsx";
import NotFound from "./pages/NotFound.jsx";
import { useState, useEffect } from "react";

function AppRoutes({ users, setUsers, user, setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/me", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.loggedIn) {
          setUser(data.user);
        } else {
          setUser(null);
          navigate("/login");
        }
      })
      .catch(() => {
        setUser(null);
        navigate("/login");
      });
  }, [navigate, setUser]);

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
    <Routes>
      <Route path="/" element={<Home user={user} />} />
      <Route path="/users" element={<Users />} />
      <Route path="/login" element={<Log />} />
      <Route path="/admin/*" element={<AdminPage users={users} loadUsers={loadUsers} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);

  return (
    <Router>
      <AppRoutes users={users} setUsers={setUsers} user={user} setUser={setUser} />
    </Router>
  );
}

export default App;
