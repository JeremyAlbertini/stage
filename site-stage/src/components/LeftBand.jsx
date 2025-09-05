import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/LeftBand.css"; // on importe le fichier CSS

export default function LeftBand() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Chargement...</p>;
  }

  const items = [
    { name: "Accueil", path: "/" },
    { name: "Utilisateurs", path: "/users" },
    { name: "Paramètres", path: "/settings" },
  ];

  return (
    <nav className="left-band">
      {items.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""}`
          }
        >
          {item.name}
        </NavLink>
      ))}
    </nav>
  );
}
