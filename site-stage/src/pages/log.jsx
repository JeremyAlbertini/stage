import { useState } from "react";
import { data, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/log.css";
import { useApi } from "../hooks/useApi";

function Log() {
  const { authenticatedFetch } = useAuth();
  const api = useApi(authenticatedFetch);
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
    const data = await api.post("http://localhost:5000/login", loginData);
      console.log("Données reçues:", data.success, data.user);

      if (data.success) {
        setUser(data.user); // ✅ context updated
        navigate("/");
      } else {
        setMessage(data.message || "Erreur de connexion.");
      }
  };

  return (
    <div className="login-container">
      {/* Colonne gauche (1/3) - Formulaire de connexion */}
      <div className="login-form-column">
        <div className="login-form-wrapper">
          <h1 className="login-title">Connexion</h1>
          {user ? (
            <div className="login-welcome">
              <h2>Bienvenue {user.matricule}</h2>
              <p>Vous êtes déjà connecté.</p>
              <button 
                onClick={() => navigate("/")} 
                className="btn-primary"
              >
                Accéder à l'application
              </button>
            </div>
          ) : (
            <>
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
              {message && <p className="message">{message}</p>}
            </>
          )}
        </div>
      </div>

      {/* Colonne droite (2/3) - Fond animé */}
      <div className="login-background-column">
        <div className="login-overlay">
          <h2 className="login-quote">Bienvenue sur l'application de gestion des agents</h2>
        </div>
      </div>
    </div>
  );
}

export default Log;
