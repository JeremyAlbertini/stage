import React from "react";

export default function NotFound() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      background: "#f8f8f8"
    }}>
      <h1 style={{ fontSize: "4rem", color: "#333" }}>404</h1>
      <h2 style={{ color: "#555" }}>Page non trouvée</h2>
      <p>La page que vous cherchez n'existe pas.</p>
      <a href="/" style={{ color: "#007bff", textDecoration: "underline" }}>Retour à l'accueil</a>
    </div>
  );
}