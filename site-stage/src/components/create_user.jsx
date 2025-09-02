import { useState } from "react";
import "../styles/admin.css";

function CreateUser({ onUserCreated }) {
    const [matricule, setMatricule] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isAdmin, setIsAdmin] = useState("0");

    const handleSubmit = async (e) => {
        e.preventDefault(); // ca empeche la page de refresh

        try {
            const response = await fetch("http://localhost:5000/users/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ matricule, password })
                });
            
            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setMatricule("");
                setPassword("");
                onUserCreated();
                setError("");
            } else {
                setError(data.message);
                setMessage("");
            }
        } catch (err) {
            setError("Erreur de connexion au serveur");
        }
    };

    return (
        <div>
            <h2 className="admin-subtitle">Créer un nouveau compte</h2>
        
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
    
            <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
                <label htmlFor="matricule">Matricule :</label>
                <input
                type="text"
                id="matricule"
                value={matricule}
                onChange={(e) => setMatricule(e.target.value)}
                required
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="password">Mot de passe :</label>
                <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            </div>

            <div className="form-group">
                <label htmlFor="isAdmin">Compte administrateur:</label>
                <input
                type="checkbox"
                id="isAdmin"
                value={isAdmin}
                onChange={(e) => setIsAdmin(e.target.value)}
            />
            </div>
            
            <button type="submit" className="admin-button">
                Créer le compte
            </button>
            </form>
        </div>
    );
}

export default CreateUser;