import { NavLink } from "react-router-dom";

export default function leftBand() {
  const items = [
    { name: "Accueil", path: "/" },
    { name: "Utilisateurs", path: "/users" },
    { name: "Paramètres", path: "/admin" },
  ];

  return (
    <nav
      style={{
        display: "flex",
        flexDirection: "column",
        width: "22%",
        gap: "1rem",
        padding: "1rem",
        backgroundColor: "#f0f0f0",
      }}
    >
      {items.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          style={({ isActive }) => ({
            border: "none",
            cursor: "pointer",
            textDecoration: "none",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            backgroundColor: isActive ? "#4CAF50" : "transparent",
            color: isActive ? "white" : "black",
            fontWeight: isActive ? "bold" : "normal",
          })}
        >
          {item.name}
        </NavLink>
      ))}
    </nav>
  );
}

