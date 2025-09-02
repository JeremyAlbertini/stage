import { useState } from "react";
import "../styles/log.css";

function Log() {
  const [page, setPage] = useState("login");
  const [loginData, setLoginData] = useState({ matricule: "", password: "" });
  const [message, setMessage] = useState("");

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessage("Connexion réussie !");
        } else {
          setMessage(data.message || "Erreur de connexion.");
        }
      })
      .catch(() => setMessage("Erreur serveur."));
  };

return (
  <div className="log-page">
    <div className="app-container">
      <h1>{page === "login" ? "Connexion" : "Inscription"}</h1>

      {page === "login" && (
        <form onSubmit={handleLoginSubmit} className="auth-form">
          <input
            type="text"
            name="matricule"
            placeholder="Matricule"
            value={loginData.matricule}
            onChange={handleLoginChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={loginData.password}
            onChange={handleLoginChange}
            required
          />
          <button type="submit" className="btn-primary">Se connecter</button>
        </form>
      )}
      {message && <p className="message">{message}</p>}
    </div>
  </div>
  );
}

export default Log;
