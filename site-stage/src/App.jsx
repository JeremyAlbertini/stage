import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home.jsx";
import Users from "./pages/user.jsx";

export default function App() {
  return (
    <Router>
      {/* <nav style={{ padding: "1rem", background: "#eee" }}>
        <Link to="/" style={{ marginRight: "1rem" }}>Accueil</Link>
        <Link to="/users">Utilisateurs</Link>
      </nav> */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </Router>
  );
}
