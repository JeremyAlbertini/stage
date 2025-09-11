import { useState, useEffect } from "react";
import "../styles/admin.css";
import { useApi } from "./hooks/useApi";

function CompleteProfile({ userId, onProfileCompleted, onCancel }) {
    const api = useApi();
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        civilite: "Monsieur",
        date_naiss: "",
        lieu_naiss: "",
        dpt_naiss: "",
        pays_naiss: "France",
        photo: "ano.jpg",
        adresse: "",
        adresse_code: "",
        adresse_ville: "",
        tel_perso: "",
        mail_perso: "",
        statut: "Actif",
        grade: "",
        poste: "Animateur",
        adresse_pro: "",
        stage: "",
        tel_fixe: "",
        tel_pro: "",
        mail_pro: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Charger les données existantes si elles existent
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await api.get(`http://localhost:5000/users/${userId}/profile`);
                const data = response;
                
                if (data.success && data.data) {
                    const profile = data.data;
                    setFormData(prev => ({
                        ...prev,
                        nom: profile.nom || "",
                        prenom: profile.prenom || "",
                        civilite: profile.civilite || "Monsieur",
                        date_naiss: profile.date_naiss || "",
                        lieu_naiss: profile.lieu_naiss || "",
                        dpt_naiss: profile.dpt_naiss || "",
                        pays_naiss: profile.pays_naiss || "France",
                        photo: profile.photo || "ano.jpg",
                        adresse: profile.adresse || "",
                        adresse_code: profile.adresse_code || "",
                        adresse_ville: profile.adresse_ville || "",
                        tel_perso: profile.tel_perso || "",
                        mail_perso: profile.mail_perso || "",
                        statut: profile.statut || "Actif",
                        grade: profile.grade || "",
                        poste: profile.poste || "Animateur",
                        adresse_pro: profile.adresse_pro || "",
                        stage: profile.stage || "",
                        tel_fixe: profile.tel_fixe || "",
                        tel_pro: profile.tel_pro || "",
                        mail_pro: profile.mail_pro || ""
                    }));
                }
            } catch (err) {
                console.error("Erreur lors du chargement du profil:", err);
            }
        };

        if (userId) {
            loadProfile();
        }
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post(`http://localhost:5000/users/${userId}/complete-profile`,formData);
            
            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setError("");
                if (onProfileCompleted) {
                    setTimeout(() => onProfileCompleted(), 1500);
                }
            } else {
                setError(data.message);
                setMessage("");
            }
        } catch (err) {
            setError("Erreur de connexion au serveur");
            setMessage("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-card">
            <h2 className="admin-subtitle">Compléter le profil agent</h2>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="admin-form">
                {/* Informations personnelles */}
                <h3 className="form-section-title">Informations personnelles</h3>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="civilite">Civilité :</label>
                        <select
                            id="civilite"
                            name="civilite"
                            value={formData.civilite}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="Monsieur">Monsieur</option>
                            <option value="Madame">Madame</option>
                            <option value="Mademoiselle">Mademoiselle</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="nom">Nom :</label>
                        <input
                            type="text"
                            id="nom"
                            name="nom"
                            value={formData.nom}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="prenom">Prénom :</label>
                        <input
                            type="text"
                            id="prenom"
                            name="prenom"
                            value={formData.prenom}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="date_naiss">Date de naissance :</label>
                        <input
                            type="date"
                            id="date_naiss"
                            name="date_naiss"
                            value={formData.date_naiss}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lieu_naiss">Lieu de naissance :</label>
                        <input
                            type="text"
                            id="lieu_naiss"
                            name="lieu_naiss"
                            value={formData.lieu_naiss}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dpt_naiss">Département de naissance :</label>
                        <input
                            type="text"
                            id="dpt_naiss"
                            name="dpt_naiss"
                            value={formData.dpt_naiss}
                            onChange={handleInputChange}
                            maxLength="5"
                            required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="pays_naiss">Pays de naissance :</label>
                    <input
                        type="text"
                        id="pays_naiss"
                        name="pays_naiss"
                        value={formData.pays_naiss}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                {/* Adresse */}
                <h3 className="form-section-title">Adresse</h3>
                
                <div className="form-group">
                    <label htmlFor="adresse">Adresse :</label>
                    <input
                        type="text"
                        id="adresse"
                        name="adresse"
                        value={formData.adresse}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="adresse_code">Code postal :</label>
                        <input
                            type="text"
                            id="adresse_code"
                            name="adresse_code"
                            value={formData.adresse_code}
                            onChange={handleInputChange}
                            maxLength="10"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="adresse_ville">Ville :</label>
                        <input
                            type="text"
                            id="adresse_ville"
                            name="adresse_ville"
                            value={formData.adresse_ville}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>
                {/* Contact personnel */}
                <h3 className="form-section-title">Contact personnel</h3>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="tel_perso">Téléphone personnel :</label>
                        <input
                            type="tel"
                            id="tel_perso"
                            name="tel_perso"
                            value={formData.tel_perso}
                            onChange={handleInputChange}
                            maxLength="15"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="mail_perso">Email personnel :</label>
                        <input
                            type="email"
                            id="mail_perso"
                            name="mail_perso"
                            value={formData.mail_perso}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>
                {/* Informations professionnelles */}
                <h3 className="form-section-title">Informations professionnelles</h3>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="statut">Statut :</label>
                        <input
                            type="text"
                            id="statut"
                            name="statut"
                            value={formData.statut}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="grade">Grade :</label>
                        <input
                            type="text"
                            id="grade"
                            name="grade"
                            value={formData.grade}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="poste">Poste :</label>
                        <select
                            id="poste"
                            name="poste"
                            value={formData.poste}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="Chef de Service">Chef de Service</option>
                            <option value="Direction">Direction</option>
                            <option value="Coordinateur">Coordinateur</option>
                            <option value="Directeur">Directeur</option>
                            <option value="Adjoint de Direction">Adjoint de Direction</option>
                            <option value="Animateur">Animateur</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="adresse_pro">Adresse pro :</label>
                        <select
                            id="adresse_pro"
                            name="adresse_pro"
                            value={formData.adresse_pro}
                            onChange={handleInputChange}
                        >
                            <option value="">-- Sélectionner --</option>
                            <option value="Néo">Néo</option>
                            <option value="Impé">Impé</option>
                            <option value="Sclos">Sclos</option>
                            <option value="Auberge">Auberge</option>
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="stage">Stage :</label>
                    <select
                        id="stage"
                        name="stage"
                        value={formData.stage}
                        onChange={handleInputChange}
                    >
                        <option value="">-- Sélectionner --</option>
                        <option value="Terra">Terra</option>
                        <option value="Mare">Mare</option>
                        <option value="Boulega">Boulega</option>
                        <option value="Nice Chef">Nice Chef</option>
                        <option value="Découverte">Découverte</option>
                        <option value="Ski">Ski</option>
                    </select>
                </div>
                {/* Contact professionnel */}
                <h3 className="form-section-title">Contact professionnel</h3>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="tel_fixe">Téléphone fixe :</label>
                        <input
                            type="tel"
                            id="tel_fixe"
                            name="tel_fixe"
                            value={formData.tel_fixe}
                            onChange={handleInputChange}
                            maxLength="15"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="tel_pro">Téléphone pro :</label>
                        <input
                            type="tel"
                            id="tel_pro"
                            name="tel_pro"
                            value={formData.tel_pro}
                            onChange={handleInputChange}
                            maxLength="15"
                            required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="mail_pro">Email professionnel :</label>
                    <input
                        type="email"
                        id="mail_pro"
                        name="mail_pro"
                        value={formData.mail_pro}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-actions">
                    <button 
                        type="submit" 
                        className="admin-button"
                        disabled={loading}
                    >
                        {loading ? "Enregistrement..." : "Enregistrer le profil"}
                    </button>
                    {onCancel && (
                        <button 
                            type="button" 
                            className="admin-button admin-button-secondary"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Annuler
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default CompleteProfile;