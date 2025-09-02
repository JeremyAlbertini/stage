import { useState } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState("login");
  const [loginData, setLoginData] = useState({ matricule: "", password: "" });
  const [registerData, setRegisterData] = useState({ matricule: "", password: "", name: "", firstname: "" });
  const [message, setMessage] = useState("");

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
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

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerData)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessage("Inscription réussie !");
          setPage("login");
        } else {
          setMessage(data.message || "Erreur d'inscription.");
        }
      })
      .catch(() => setMessage("Erreur serveur."));
  };

return (
  <div className="app-container">
    <div className="form-container">
      <h1>{page === "login" ? "Connexion" : "Inscription"}</h1>

      {page === "login" ? (
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
          <p>
            Pas de compte ?{" "}
            <span className="link" onClick={() => setPage("register")}>Inscrivez-vous</span>
          </p>
        </form>
      ) : (
        <form onSubmit={handleRegisterSubmit} className="auth-form">
          <input
            type="text"
            name="matricule"
            placeholder="Matricule"
            value={registerData.matricule}
            onChange={handleRegisterChange}
            required
          />
          <input
            type="text"
            name="name"
            placeholder="Nom"
            value={registerData.name}
            onChange={handleRegisterChange}
            required
          />
          <input
            type="text"
            name="firstname"
            placeholder="Prénom"
            value={registerData.firstname}
            onChange={handleRegisterChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={registerData.password}
            onChange={handleRegisterChange}
            required
          />
          <button type="submit" className="btn-primary">S'inscrire</button>
          <p>
            Déjà inscrit ?{" "}
            <span className="link" onClick={() => setPage("login")}>Connectez-vous</span>
          </p>
        </form>
      )}

      {message && <p className="message">{message}</p>}
    </div>
  </div>
)};

export default App;
