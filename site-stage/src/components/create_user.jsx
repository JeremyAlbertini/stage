import { useState } from "react";
import "../styles/CreateUser.css";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";

function CreateUser({ onUserCreated }) {
    const api = useApi();
    const { user } = useAuth();

    if (!user || !user.isAdmin) {
        return <p>Vous n'avez pas la permission de créer un compte.</p>;
    }

    const [matricule, setMatricule] = useState("");
    const [password, setPassword] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

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
    const [adressePro, setAdressePro] = useState("");
    const [stage, setStage] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            matricule,
            password,
            isAdmin,
            nom,
            prenom,
            civilite,
            date_naiss: dateNaiss,
            lieu_naiss: lieuNaiss,
            dpt_naiss: dptNaiss,
            pays_naiss: paysNaiss,
            adresse,
            adresse_code: adresseCode,
            adresse_ville: adresseVille,
            tel_perso: telPerso,
            mail_perso: mailPerso,
            statut,
            grade,
            poste,
            tel_fixe: telFixe,
            tel_pro: telPro,
            mail_pro: mailPro,
            adresse_pro: adressePro,
            stage,
            createdBy: user.matricule,
        };

        try {
            const response = await api.post("http://localhost:5000/users/create",payload);

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
            setMessage("");
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
                    <label>Compte administrateur :</label>
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
                <div className="form-group">
                    <label>Poste :</label>
                    <select value={poste} onChange={(e) => setPoste(e.target.value)}>
                        <option value="">-- Sélectionner --</option>
                        <option value="Chef de Service">Chef de Service</option>
                        <option value="Direction">Direction</option>
                        <option value="Coordinateur">Coordinateur</option>
                        <option value="Directeur">Directeur</option>
                        <option value="Adjoint de Direction">Adjoint de Direction</option>
                        <option value="Animateur">Animateur</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Adresse professionnelle :</label>
                    <select value={adressePro} onChange={(e) => setAdressePro(e.target.value)}>
                        <option value="">-- Sélectionner --</option>
                        <option value="Néo">Néo</option>
                        <option value="Impé">Impératrice Eugénie</option>
                        <option value="Sclos">Sclos de Contes</option>
                        <option value="Auberge">Auberge de Jeunesse Mont Boron</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Stage :</label>
                    <select value={stage} onChange={(e) => setStage(e.target.value)}>
                        <option value="">-- Sélectionner --</option>
                        <option value="Terra">Terra'Ventura</option>
                        <option value="Mare">Mare'Ventura</option>
                        <option value="Boulega">Boulega'Zic</option>
                        <option value="Nice Chef">Nice Chef</option>
                        <option value="Découverte">Ados Découverte</option>
                        <option value="Ski">Samedi Ski</option>
                    </select>
                </div>

                <button type="submit" className="admin-button">
                    Créer le compte
                </button>
            </form>
        </div>
    );
}

export default CreateUser;
