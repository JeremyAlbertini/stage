import { useState } from "react";
import "../styles/admin.css";

function CreateUser({ onUserCreated }) {
    const [matricule, setMatricule] = useState("");
    const [password, setPassword] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    // Agent data fields
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [civilite, setCivilite] = useState("Monsieur");
    const [dateNaiss, setDateNaiss] = useState("");
    const [lieuNaiss, setLieuNaiss] = useState("");
    const [dptNaiss, setDptNaiss] = useState("");
    const [paysNaiss, setPaysNaiss] = useState("");
    const [adresse, setAdresse] = useState("");
    const [adresseCode, setAdresseCode] = useState("");
    const [adresseVille, setAdresseVille] = useState("");
    const [telPerso, setTelPerso] = useState("");
    const [mailPerso, setMailPerso] = useState("");
    const [statut, setStatut] = useState("Actif");
    const [grade, setGrade] = useState("Agent");
    const [poste, setPoste] = useState("");
    const [telFixe, setTelFixe] = useState("");
    const [telPro, setTelPro] = useState("");
    const [mailPro, setMailPro] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            matricule,
            password,
            isAdmin,
            nom, prenom, civilite,
            date_naiss: dateNaiss,
            lieu_naiss: lieuNaiss,
            dpt_naiss: dptNaiss,
            pays_naiss: paysNaiss,
            adresse, adresse_code: adresseCode, adresse_ville: adresseVille,
            tel_perso: telPerso,
            mail_perso: mailPerso,
            statut, grade, poste,
            tel_fixe: telFixe,
            tel_pro: telPro,
            mail_pro: mailPro
        };

        try {
            const response = await fetch("http://localhost:5000/users/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setError("");
                onUserCreated();
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
                <h3>Informations de connexion</h3>
                <div className="form-group">
                    <label>Matricule :</label>
                    <input type="text" value={matricule} onChange={(e) => setMatricule(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Mot de passe :</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Compte administrateur:</label>
                    <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
                </div>

                <h3>Données Agent</h3>
                <div className="form-group">
                    <label>Nom :</label>
                    <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Prénom :</label>
                    <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Civilité :</label>
                    <select value={civilite} onChange={(e) => setCivilite(e.target.value)}>
                        <option value="Monsieur">Monsieur</option>
                        <option value="Madame">Madame</option>
                        <option value="Mademoiselle">Mademoiselle</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Date de naissance :</label>
                    <input type="date" value={dateNaiss} onChange={(e) => setDateNaiss(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Lieu de naissance :</label>
                    <input type="text" value={lieuNaiss} onChange={(e) => setLieuNaiss(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Département :</label>
                    <input type="text" value={dptNaiss} onChange={(e) => setDptNaiss(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Pays :</label>
                    <input type="text" value={paysNaiss} onChange={(e) => setPaysNaiss(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Adresse :</label>
                    <input type="text" value={adresse} onChange={(e) => setAdresse(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Code Postal :</label>
                    <input type="text" value={adresseCode} onChange={(e) => setAdresseCode(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Ville :</label>
                    <input type="text" value={adresseVille} onChange={(e) => setAdresseVille(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Téléphone perso :</label>
                    <input type="text" value={telPerso} onChange={(e) => setTelPerso(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Email perso :</label>
                    <input type="email" value={mailPerso} onChange={(e) => setMailPerso(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Statut :</label>
                    <input type="text" value={statut} onChange={(e) => setStatut(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Grade :</label>
                    <input type="text" value={grade} onChange={(e) => setGrade(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Poste :</label>
                    <input type="text" value={poste} onChange={(e) => setPoste(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Téléphone fixe :</label>
                    <input type="text" value={telFixe} onChange={(e) => setTelFixe(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Téléphone pro :</label>
                    <input type="text" value={telPro} onChange={(e) => setTelPro(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Email pro :</label>
                    <input type="email" value={mailPro} onChange={(e) => setMailPro(e.target.value)} />
                </div>

                <button type="submit" className="admin-button">
                    Créer le compte
                </button>
            </form>
        </div>
    );
}

export default CreateUser;
