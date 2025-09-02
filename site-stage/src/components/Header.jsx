//import DropdownMenu from "./DropdownMenu.jsx";

export default function Header({ title, backgroundColor = "white", color = "black" }) {
    const menuItems = [
        { label: "Accueil", href: "/" },
        { label: "Utilisateurs", href: "/users" },
        { label: "Paramètres", href: "/settings" },
        { label: "Administration", href: "/admin" },
      ];
    return (
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          boxSizing: "border-box",
          height: "60px",
          backgroundColor,
          color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center", // centre le titre
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          zIndex: 1000,
          //position: "relative", // pour le bouton absolu
        }}
      >
        {/* Titre centré */}
        <h1 style={{ margin: 0, fontSize: "1.5rem", textAlign: "center" }}>{title}</h1>
  
        {/* Bouton “Compte” à droite */}
        <button
          style={{
            position: "absolute",
            right: "10.5rem",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Compte
        </button>
      </header>
    );
  }
  