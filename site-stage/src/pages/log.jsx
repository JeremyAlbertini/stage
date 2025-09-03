import { useState, useEffect } from "react";
import "../styles/log.css";
import { useNavigate } from "react-router-dom";

function Log() {
  const [page, setPage] = useState("login");
  const [loginData, setLoginData] = useState({ matricule: "", password: "" });
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Send cookies
      body: JSON.stringify(loginData)
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message || "Erreur de connexion.");
        if (data.success) {
          checkUser();
          setMessage("Connexion réussie !");
          //navigate("/");
        } else {
          setMessage(data.message || "Erreur de connexion.");
        }
      })
      .catch(() => setMessage("Erreur serveur."));
  };

  const checkUser = () => {
    fetch("http://localhost:5000/me", {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      });
  };

  const handleLogout = () => {
    fetch("http://localhost:5000/logout", {
      method: "POST",
      credentials: "include"
    }).then(() => {
      setUser(null);
      setMessage("Déconnecté");
    });
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <div className="log-page">
      <div className="app-container">
        {user ? (
          <>
            <h1>Bienvenue {user.matricule}</h1>
            <button onClick={handleLogout} className="btn-primary">Se déconnecter</button>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}

export default Log;