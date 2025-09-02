import { useState } from "react";

export default function Header({ title, backgroundColor = "white", color = "#007bff" }) {
  const [hovered, setHovered] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false); 
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
        justifyContent: "space-between",
        padding: "0 1.5rem",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
      }}
    >
      <h1 style={{ margin: 0, fontSize: "1.5rem" }}>{title}</h1>

      <div
        style={{ 
          position: "relative", 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "flex-start"
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Bouton principal */}
        <button
          style={{
            width: '150px',
            padding: "0.75rem 1rem",
            borderRadius: "6px",
            cursor: "pointer",
            backgroundColor: buttonHovered ? '#0056b3' : '#007bff',
            color: "white",
            border: "none",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={() => setButtonHovered(true)}
          onMouseLeave={() => setButtonHovered(false)}
        >
          Mon Compte
        </button>

        {/* Menu déroulant avec transition */}
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: '150px',
            backgroundColor: "white",
            borderRadius: "6px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            // Utilisation de maxHeight au lieu de display pour permettre la transition
            maxHeight: hovered ? "120px" : "0",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(-10px)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            zIndex: 1001,
            marginTop: "2px"
          }}
        >
          <button 
            style={{
              width: '100%',
              padding: "0.75rem 1rem",
              cursor: "pointer",
              backgroundColor: '#dc3545',
              color: "white",
              border: "none",
              transition: "background-color 0.2s ease"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
}