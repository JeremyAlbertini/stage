import React, { useState } from "react";
import '../styles/ModifyAgents.css'

function ModifyAgents({ agent, onUpdate }) {
    const initialFormData = {
        matricule: agent.matricule || "",
        nom: agent.nom || "",
        prenom: agent.prenom || "",
        civilite: agent.civilite || "",
        date_naiss: agent.date_naiss ? new Date(agent.date_naiss).toISOString().split("T")[0] : "",
        lieu_naiss: agent.lieu_naiss || "",
        dpt_naiss: agent.dpt_naiss || "",
        pays_naiss: agent.pays_naiss || "",
        adresse: agent.adresse || "",
        adresse_code: agent.adresse_code || "",
        adresse_ville: agent.adresse_ville || "",
        tel_perso: agent.tel_perso || "",
        mail_perso: agent.mail_perso || "",
        statut: agent.statut || "",
        grade: agent.grade || "",
        poste: agent.poste || "",
        adresse_pro: agent.adresse_pro || "",
        stage: agent.stage || "",
        tel_fixe: agent.tel_fixe || "",
        tel_pro: agent.tel_pro || "",
        mail_pro: agent.mail_pro || "",
    };

    const [formData, setFormData] = useState(initialFormData);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:5000/users/${agent.user_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                setMessage(result.message || "Modifications enregistrées avec succès !");
                if (onUpdate) {
                    onUpdate({ ...agent, ...formData });
                }
            } else {
                const errorResult = await response.json().catch(() => null);
                setMessage(errorResult?.message || "Une erreur est survenue.");
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
            setMessage("Erreur lors de la mise à jour.");
        }
    };

    const handleReset = () => {
        setFormData(initialFormData);
        setMessage("");
    };

    return (
        <form onSubmit={handleSubmit} className="formContainer">
            {/* Section Informations personnelles */}
            <div className="formSection">
                <h3 className="sectionTitle">Informations personnelles</h3>
                <div className="formGrid">
                    <div className="inputGroup">
                        <label className="label">
                            Matricule
                            <input
                                type="text"
                                name="matricule"
                                value={formData.matricule}
                                onChange={handleChange}
                                className="input disabled"
                            />
                        </label>
                    </div>

                    <div className="inputGroup">
                        <label className="label">
                            Civilité
                            <select
                                name="civilite"
                                value={formData.civilite}
                                onChange={handleChange}
                                className="input"
                            >
                                <option value="Monsieur">Monsieur</option>
                                <option value="Madame">Madame</option>
                                <option value="Mademoiselle">Mademoiselle</option>
                            </select>
                        </label>
                    </div>

                    <div className="inputGroup">
                        <label className="label">
                            Nom
                            <input
                                type="text"
                                name="nom"
                                value={formData.nom}
                                onChange={handleChange}
                                className="input"
                            />
                        </label>
                    </div>

                    <div className="inputGroup">
                        <label className="label">
                            Prénom
                            <input
                                type="text"
                                name="prenom"
                                value={formData.prenom}
                                onChange={handleChange}
                                className="input"
                            />
                        </label>
                    </div>

                    <div className="inputGroup">
                        <label className="label">
                            Date de naissance
                            <input
                                type="date"
                                name="date_naiss"
                                value={formData.date_naiss}
                                onChange={handleChange}
                                className="input"
                            />
                        </label>
                    </div>

                    <div className="inputGroup">
                        <label className="label">
                            Lieu de naissance
                            <input
                                type="text"
                                name="lieu_naiss"
                                value={formData.lieu_naiss}
                                onChange={handleChange}
                                className="input"
                            />
                        </label>
                    </div>

                    <div className="inputGroup">
                        <label className="label">
                            Département de naissance
                            <input
                                type="text"
                                name="dpt_naiss"
                                value={formData.dpt_naiss}
                                onChange={handleChange}
                                className="input"
                                placeholder="ex: 06, 75..."
                            />
                        </label>
                    </div>

                    <div className="inputGroup">
                        <label className="label">
                            Pays de naissance
                            <input
                                type="text"
                                name="pays_naiss"
                                value={formData.pays_naiss}
                                onChange={handleChange}
                                className="input"
                                placeholder="ex: France"
                            />
                        </label>
                    </div>
                </div>
            </div>

            {/* Section Adresse personnelle */}
            <div className="formSection">
                <h3 className="sectionTitle">Adresse personnelle</h3>
                <div className="formGrid">
                    <div className="inputGroup fullWidth">
                        <label className="label">
                            Adresse
                            <input
                                type="text"
                                name="adresse"
                                value={formData.adresse}
                                onChange={handleChange}
                                className="input"
                                placeholder="Numéro et nom de rue"
                            />
                        </label>
                    </div>

                    <div className="inputGroup">
                        <label className="label">
                            Code postal
                            <input
                                type="text"
                                name="adresse_code"
                                value={formData.adresse_code}
                                onChange={handleChange}
                                className="input"
                                placeholder="ex: 06000"
                            />
                        </label>
                    </div>

                    <div className="inputGroup">
                        <label className="label">
                            Ville
                            <input
                                type="text"
                                name="adresse_ville"
                                value={formData.adresse_ville}
                                onChange={handleChange}
                                className="input"
                                placeholder="ex: Nice"
                            />
                        </label>
                    </div>
                </div>
            </div>

            {/* Section Contact personnel */}
            <div className="formSection">
                <h3 className="sectionTitle">Contact personnel</h3>
                <div className="formGrid">
                    <div className="inputGroup">
                        <label className="label">
                            Téléphone personnel
                            <input
                                type="text"
                                name="tel_perso"
                                value={formData.tel_perso}
                                onChange={handleChange}
                                className="input"
                                placeholder="ex: 06 12 34 56 78"
                            />
                        </label>
                    </div>

                    <div className="inputGroup">
                        <label className="label">
                            Email personnel
                            <input
                                type="email"
                                name="mail_perso"
                                value={formData.mail_perso}
                                onChange={handleChange}
                                className="input"
                                placeholder="exemple@email.com"
                            />
                        </label>
                    </div>

                    <div className="inputGroup">
                        <label className="label">
                            Téléphone fixe
                            <input
                                type="text"
                                name="tel_fixe"
                                value={formData.tel_fixe}
                                onChange={handleChange}
                                className="input"
                                placeholder="ex: 04 12 34 56 78"
                            />
                        </label>
                    </div>
                </div>
            </div>

            {/* Section Informations professionnelles */}
            <div className="formSection">
                <h3 className="sectionTitle">Informations professionnelles</h3>
                <div className="formGrid">
                    <div className="inputGroup">
                        <label className="label">
                            Statut
                            <input
                                type="text"
                                name="statut"
                                value={formData.statut}
                                onChange={handleChange}
                                className="input"
                                placeholder="ex: CDD, CDI..."
                            />
                        </label>
                    </div>

                    <div className="inputGroup">
                        <label className="label">
                            Grade
                            <input
                                type="text"
                                name="grade"
                                value={formData.grade}
                                onChange={handleChange}
                                className="input"
                                placeholder="ex: Chargé de mission"
                            />
                        </label>
                    </div>

                    <div className="inputGroup">
                        <label className="label">
                            Poste
                            <select
                                name="poste"
                                value={formData.poste}
                                onChange={handleChange}
                                className="input"
                            >
                                <option value="">Sélectionner un poste</option>
                                <option value="Chef de Service">Chef de Service</option>
                                <option value="Direction">Direction</option>
                                <option value="Coordinateur">Coordinateur</option>
                                <option value="Directeur">Directeur</option>
                                <option value="Adjoint de Direction">Adjoint de Direction</option>
                                <option value="Animateur">Animateur</option>
                            </select>
                        </label>
                    </div>

                    <div className="inputGroup">
                        <label className="label">
                            Adresse professionnelle
                            <select
                                name="adresse_pro"
                                value={formData.adresse_pro}
                                onChange={handleChange}
                                className="input"
                            >
                                <option value="">Aucune</option>
                                <option value="Néo">Néo</option>
                                <option value="Impé">Impé</option>
                                <option value="Sclos">Sclos</option>
                                <option value="Auberge">Auberge</option>
                            </select>
                        </label>
                    </div>

                    <div className="inputGroup">
                        <label className="label">
                            Stage
                            <select
                                name="stage"
                                value={formData.stage}
                                onChange={handleChange}
                                className="input"
                            >
                                <option value="">Aucun</option>
                                <option value="Terra">Terra</option>
                                <option value="Mare">Mare</option>
                                <option value="Boulega">Boulega</option>
                                <option value="Nice Chef">Nice Chef</option>
                                <option value="Découverte">Découverte</option>
                                <option value="Ski">Ski</option>
                            </select>
                        </label>
                    </div>
                </div>
            </div>

            {/* Section Contact professionnel */}
            <div className="formSection">
                <h3 className="sectionTitle">Contact professionnel</h3>
                <div className="formGrid">
                    <div className="inputGroup">
                        <label className="label">
                            Téléphone professionnel
                            <input
                                type="text"
                                name="tel_pro"
                                value={formData.tel_pro}
                                onChange={handleChange}
                                className="input"
                                placeholder="ex: 04 12 34 56 78"
                            />
                        </label>
                    </div>

                    <div className="inputGroup">
                        <label className="label">
                            Email professionnel
                            <input
                                type="email"
                                name="mail_pro"
                                value={formData.mail_pro}
                                onChange={handleChange}
                                className="input"
                                placeholder="nom@entreprise.com"
                            />
                        </label>
                    </div>
                </div>
            </div>

            {/* Message de retour */}
            {message && (
                <div className={`message ${
                    message.includes("succès") ? "successMessage" : "errorMessage"
                }`}>
                    {message}
                </div>
            )}

            {/* Boutons d'action */}
            <div className="buttonContainer">
                <button type="button" onClick={handleReset} className="resetButton">
                    Réinitialiser
                </button>
                <button type="submit" className="submitButton">
                    Enregistrer les modifications
                </button>
            </div>
        </form>
    );
}

export default ModifyAgents;