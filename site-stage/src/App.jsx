import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    firstname: ""
  });

  // Charger les utilisateurs
  const fetchUsers = () => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Erreur lors du chargement des utilisateurs:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Gérer les changements de formulaire
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    fetch("http://localhost:5000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Succès:", data);
        // Réinitialiser le formulaire
        setFormData({
          email: "",
          password: "",
          name: "",
          firstname: ""
        });
        // Recharger la liste des utilisateurs
        fetchUsers();
      })
      .catch((err) => console.error("Erreur:", err));
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Test de la Base de Données</h1>
      
      {/* Formulaire d'ajout d'utilisateur */}
      <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
        <h2>Ajouter un utilisateur</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Email:
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange}
                style={{ width: "100%", padding: "0.5rem" }}
                required
              />
            </label>
          </div>
          
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Mot de passe:
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange}
                style={{ width: "100%", padding: "0.5rem" }}
                required
              />
            </label>
          </div>
          
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Nom:
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                style={{ width: "100%", padding: "0.5rem" }}
                required
              />
            </label>
          </div>
          
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Prénom:
              <input 
                type="text" 
                name="firstname" 
                value={formData.firstname} 
                onChange={handleChange}
                style={{ width: "100%", padding: "0.5rem" }}
                required
              />
            </label>
          </div>
          
          <button 
            type="submit"
            style={{ padding: "0.5rem 1rem", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px" }}
          >
            Ajouter
          </button>
        </form>
      </div>
      
      {/* Liste des utilisateurs */}
      <div>
        <h2>Liste des utilisateurs</h2>
        {users.length === 0 ? (
          <p>Aucun utilisateur trouvé</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={{ padding: "0.5rem", textAlign: "left", border: "1px solid #ddd" }}>ID</th>
                <th style={{ padding: "0.5rem", textAlign: "left", border: "1px solid #ddd" }}>Email</th>
                <th style={{ padding: "0.5rem", textAlign: "left", border: "1px solid #ddd" }}>Nom</th>
                <th style={{ padding: "0.5rem", textAlign: "left", border: "1px solid #ddd" }}>Prénom</th>
                <th style={{ padding: "0.5rem", textAlign: "left", border: "1px solid #ddd" }}>Date de création</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{user.id}</td>
                  <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{user.email}</td>
                  <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{user.name}</td>
                  <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{user.firstname}</td>
                  <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{new Date(user.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;