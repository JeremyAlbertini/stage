import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "100vh",
      overflow: "hidden"
    }}>
      {/* Background GIF */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: "url('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmdqN2lvczFvbXB0cjA5dWJnMmphajl1N2JhZXBibXg3c2JhdmdndSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/MyWrJJIdAfoJuEPlLP/giphy.gif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        zIndex: -2
      }} />

      {/* Dark Overlay for readability */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: -1
      }} />

      {/* Content */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        height: "100%",
        color: "#fff",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: "0 20px"
      }}>
        <h1 style={{ fontSize: "6rem", margin: 0 }}>404</h1>
        <h2 style={{ fontSize: "2rem", margin: "10px 0" }}>Page non trouvée</h2>
        <p style={{ fontSize: "1.2rem", maxWidth: "500px" }}>
          Oups ! La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <Link
          to="/"
          style={{
            marginTop: "20px",
            padding: "12px 24px",
            backgroundColor: "#007bff",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "6px",
            fontSize: "1rem",
            transition: "background 0.3s ease"
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = "#0056b3"}
          onMouseLeave={(e) => e.target.style.backgroundColor = "#007bff"}
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}