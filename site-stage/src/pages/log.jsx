import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/log.css";

function Log() {
  const [page] = useState("login"); // tu pourras élargir à "signup" si besoin
  const [loginData, setLoginData] = useState({ matricule: "", password: "" });
  const [message, setMessage] = useState("");
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // cookies inclus
        body: JSON.stringify(loginData),
      });

      const data = await res.json();
      setMessage(data.message || "Erreur de connexion.");

      if (data.success) {
        setUser(data.user); // maj du contexte
        navigate("/");
      }
    } catch {
      setMessage("Erreur serveur.");
    }
  };

  return (
    <div className="log-page">
      <div className="app-container">
        {user ? (
          <>
            <h1 className="title-log">Bienvenue {user.matricule}</h1>
            <p>Vous êtes déjà connecté.</p>
          </>
        ) : (
          <>
            <h1 className="title-log">
              {page === "login" ? "Connexion" : "Inscription"}
            </h1>

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
                <button type="submit" className="btn-primary">
                  Se connecter
                </button>
              </form>
            )}

            {message && <p className="message">{message}</p>}
          </>
        )}
      </div>
    </div>
  );
}

export default Log;
