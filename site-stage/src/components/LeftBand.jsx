import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Home, Users, Calendar, Palmtree, Clock, FileText, Menu } from "lucide-react";
import "../styles/LeftBand.css";
import { useUI } from "../context/UIContext";

export default function LeftBand() {
  const { user, loading } = useAuth();
  const { isLeftOpen } = useUI();
  if (loading) {
    return <p>Chargement...</p>;
  }

  const items = [
    { name: "Accueil", path: "/", icon: Home },
    { name: "Agents", path: "/users", icon: Users },
    { name: "Calendrier", path: "/calendar", icon: Calendar },
    { name: "Mes Congés", path: "/conges", icon: Palmtree },
    { name: "Fiches Horaires", path: "/horaire", icon: Clock },
    { name: "Mes Contrats", path: "/contrat", icon: FileText },
  ];

  return (
    <nav className="left-band" style={{ width: isLeftOpen ? "240px" : "60px" }}>
      {items.map((item, index) => {
        const IconComponent = item.icon;

        return (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            <IconComponent className="nav-icon" size={18} />
            {isLeftOpen && <span className="nav-text" >{item.name}</span>}
          </NavLink>
        );
      })}
    </nav>
  );
}