import { useState } from "react";

function App() {
  const [page, setPage] = useState("login");
  const [loginData, setLoginData] = useState({ matricule: "", password: "" });
  const [registerData, setRegisterData] = useState({ matricule: "", password: "" });
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
        if (data.id) {
          setMessage("Inscription réussie !");
          setPage("login");
        } else {
          setMessage(data.message || "Erreur d'inscription.");
        }
      })
      .catch(() => setMessage("Erreur serveur."));
  };

  return (
    <div className="container">
      <h1>{page === "login" ? "Connexion" : "Inscription"}</h1>
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setPage("login")}>Connexion</button>
        <button onClick={() => setPage("register")} style={{ marginLeft: "1rem" }}>
          Inscription
        </button>
      </div>
      {message && <div style={{ color: "red", marginBottom: "1rem" }}>{message}</div>}
      {page === "login" ? (
        <form onSubmit={handleLoginSubmit}>
          <div>
            <label>Matricule:</label>
            <input type="text" name="matricule" value={loginData.matricule} onChange={handleLoginChange} required />
          </div>
          <div>
            <label>Mot de passe:</label>
            <input type="password" name="password" value={loginData.password} onChange={handleLoginChange} required />
          </div>
          <button type="submit">Se connecter</button>
        </form>
      ) : (
        <form onSubmit={handleRegisterSubmit}>
          <div>
            <label>Matricule:</label>
            <input type="text" name="matricule" value={registerData.matricule} onChange={handleRegisterChange} required />
          </div>
          <div>
            <label>Mot de passe:</label>
            <input type="password" name="password" value={registerData.password} onChange={handleRegisterChange} required />
          </div>
          <div>
            <label>Nom :</label>
            <input type="name" name="name" value={registerData.name} onChange={handleRegisterChange} required />
          </div>
          <div>
            <label>Prènom :</label>
            <input type="firstname" name="firstname" value={registerData.firstname} onChange={handleRegisterChange} required />
          </div>
          <button type="submit">S'inscrire</button>
        </form>
      )}
    </div>
  );
}

export default App;
