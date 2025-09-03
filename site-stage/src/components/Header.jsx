import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header({ title, backgroundColor = "white", color = "black" }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "60px",
        backgroundColor,
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between", // titre à gauche, bouton à droite
        padding: "0 1.5rem",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
      }}
    >
      <h1 style={{ margin: 0, fontSize: "1.5rem" }}>{title}</h1>

      <div
        style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "0 2rem",}}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Bouton principal */}
        <button
          style={{
            width:'150px',
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            display: !hovered ? "block" : "none",
            cursor: "pointer",
          }}
        >
          Mon Compte
        </button>

        {/* Boutons secondaires */}
        <div
          style={{
            display: hovered ? "flex" : "none",
            flexDirection: "column",
            backgroundColor:"black",
            borderRadius: "6px",
            width:'150px',
            gap: "0.3rem",
            marginTop:"2.7rem"
          }}
        >
          <button style={{width:'150px',
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            cursor: "pointer" }}
            >
            Mon Compte
          </button>
          <button style={{ width:'150px',
            padding: "0.5rem 1rem",
            borderRadius: "6px",
              cursor: "pointer" }}
              >
          Déconnexion
          </button>
          <button
            onClick={() => navigate('/profile')}
            style={{width:'150px',
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              cursor: "pointer"}}
              >
            Mes Infos
          </button>
        </div>
      </div>
    </header>
  );
}
