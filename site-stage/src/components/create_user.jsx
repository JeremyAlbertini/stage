import { useState } from "react";

function CreateUser({ onUserCreated }) {
    const [matricule, setMatricule] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

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
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Erreur de connexion au serveur");
        }
    };

    return (
        <div>
            <h2>Créer un nouveau compte</h2>
            
            {message && <p style={{  color: "green"  }}>{message}</p>}
            {error && <p style={{ color : "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="matricule">Matricule :</label>
                    <input
                        type="text"
                        id="matricule"
                        value={matricule}
                        onChange={(e) => setMatricule(e.target.value)}
                        required
                    />
                    </div> 
                    
                    <div>
                        <label htmlFor="password">Mot de passe :</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            />
                        </div>
                        
                        <button type="submit">Créer le compte</button>
                    </form>
        </div>
    )
}

export default CreateUser;