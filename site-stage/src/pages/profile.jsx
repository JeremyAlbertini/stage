import TabGroup from "../components/TabGroup";
import TabContent from "../components/TabContent";
import { useEffect, useState } from "react";
import BasePage from "../components/BasePage";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";
import "../styles/profile.css";

export default function Profile() {
    const api = useApi();
    const { refreshUserData } = useAuth(); 
    const [userData, setUserData] = useState(null);
    const [activeTab, setActiveTab] = useState("infos");
    const [isHoveringPhoto, setIsHoveringPhoto] = useState(false);
    const tabs = [
        { id: "infos perso", label: "Profil" },
        { id: "infos pro", label: "Information Administratives" },
        { id: "certificats", label: "Certificats" }
    ];

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const meResponse = await api.get("http://localhost:5000/me", {
                    credentials: "include"
                });
                const meData = meResponse;

                if (meData.loggedIn) {
                    const profileResponse = await api.get("http://localhost:5000/perm/profile", {
                        credentials: "include"
                    });
                    const profileData = await profileResponse;

                    if (profileData.success) {
                        setUserData({
                            ...meData.user,
                            ...profileData.agentData
                        });
                    }
                }
            } catch (error) {
                console.error("Erreur lors du chargement du profil:", error);
            }
        };

        loadUserData();
    }, []);

    const handlePhotoChange = async (e) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("photo", file);

        try {
            const response = await fetch("http://localhost:5000/upload/profile", {
                method: "POST",
                body: formData,
                credentials: "include"
            });

            const data = await response.json();

            if (data.success) {
                setUserData(prev => ({
                    ...prev,
                    photo: data.imageUrl.split("/").pop()
                }));
                await refreshUserData();
            } else {
                alert("Erreur lors de l'upload: " + data.message);
            } 
        } catch (error) {
            console.error("Erreur lors de l'upload::", error);
            alert("Erreur lors de l'upload de l'image");
        }
    }

    const handleDeletePhoto = async () => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer votre photo de profil?")) return;
        
        try {
            const response = await fetch("http://localhost:5000/delete/profile-photo", {
                method: "POST",
                credentials: "include"
            });
            
            const data = await response.json();
            
            if (data.success) {
                setUserData(prev => ({
                    ...prev,
                    photo: "ano.jpg"
                }));
                await refreshUserData();
            } else {
                alert("Erreur lors de la suppression: " + data.message);
            }
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            alert("Erreur lors de la suppression de l'image");
        }
    };

    return (
        <BasePage title="Hébésoft">
            <div className="profile-container">
                <div className="profile-header">
                    PROFIL :
                </div>
                {userData ? (
                    <>
                        {/* Photo Section */}
                        <div className="photo-section">
                            <div 
                                className="photo-container"
                                onMouseEnter={() => setIsHoveringPhoto(true)}
                                onMouseLeave={() => setIsHoveringPhoto(false)}
                            >
                                <img
                                    src={userData.photo && userData.photo !== "ano.jpg" 
                                        ? `/uploads/profiles/${userData.photo}` 
                                        : "/ano.jpg"}
                                    alt="Photo de profil"
                                />

                                <div className={`photo-overlay ${isHoveringPhoto ? 'visible' : ''}`}>
                                    <div className="photo-buttons">
                                        <button 
                                            className="photo-btn change"
                                            onClick={() => document.getElementById("photoUpload").click()}
                                        >
                                            Changer
                                        </button>
                                        {userData.photo && userData.photo !== "ano.jpg" && (
                                            <button 
                                                className="photo-btn delete"
                                                onClick={handleDeletePhoto}
                                            >
                                                Supprimer
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <input
                                    type="file"
                                    id="photoUpload"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                />
                            </div>
                        </div>

                        {/* Tab Navigation */}
                        <TabGroup 
                            tabs={tabs} 
                            activeTab={activeTab} 
                            onTabChange={setActiveTab} 
                        />

                        {/* Tab Contents */}
                        <TabContent id="infos perso" activeTab={activeTab}>
                            <div className="tab-content">
                                <h2 className="admin-subtitle">Informations personnelles</h2>
                                <div className="profile-grid">
                                    <div className="form-group">
                                        <label className="form-label">Civilité :</label>
                                        <input 
                                            type="text" 
                                            className="form-input" 
                                            value={userData.civilite || ""}
                                            readOnly
                                        />
                                    </div>
                                    <br></br>
                                    <div className="form-group">
                                        <label className="form-label">Nom :</label>
                                        <input 
                                            type="text" 
                                            className="form-input" 
                                            value={userData.nom || ""}
                                            readOnly
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Prénom :</label>
                                        <input 
                                            type="text" 
                                            className="form-input" 
                                            value={userData.prenom || ""}
                                            readOnly
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Lieu de naissance :</label>
                                        <input 
                                            type="text" 
                                            className="form-input" 
                                            value={userData.lieu_naiss || ""}
                                            readOnly
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Date de naissance :</label>
                                        <input 
                                            type="text" 
                                            className="form-input" 
                                            value={userData.date_naiss 
                                                ? new Date(userData.date_naiss).toLocaleDateString("fr-FR")
                                                : ""
                                            }
                                            readOnly
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Pays de naissance :</label>
                                        <input 
                                            type="text" 
                                            className="form-input" 
                                            value={userData.pays_naiss || ""}
                                            readOnly
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Département de naissance :</label>
                                        <input 
                                            type="text" 
                                            className="form-input" 
                                            value={userData.dpt_naiss || ""}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <h2 className="admin-subtitle">Coordonnées</h2>
                                <div className="profile-grid">
                                    <div className="form-group full-width">
                                        <label className="form-label">Adresse :</label>
                                        <input 
                                            type="text" 
                                            className="form-input" 
                                            value={userData.adresse || ""}
                                            readOnly
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Code Postal :</label>
                                        <input 
                                            type="text" 
                                            className="form-input" 
                                            value={userData.adresse_code || ""}
                                            readOnly
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Ville :</label>
                                        <input 
                                            type="text" 
                                            className="form-input" 
                                            value={userData.adresse_ville || ""}
                                            readOnly
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Téléphone Portable :</label>
                                        <input 
                                            type="text" 
                                            className="form-input" 
                                            value={userData.tel_pro || userData.tel_perso || ""}
                                            readOnly
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email Personnel :</label>
                                        <input 
                                            type="email" 
                                            className="form-input" 
                                            value={userData.mail_perso || ""}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                        </TabContent>

                        <TabContent id="infos pro" activeTab={activeTab}>
                            
                        </TabContent>

                        <TabContent id="certificats" activeTab={activeTab}>
                            <div className="tab-content">
                                <h2 className="admin-subtitle">Mes certificats</h2>
                                <p>Aucun certificat disponible pour le moment.</p>
                            </div>
                        </TabContent>
                    </>
                ) : (
                    <div className="loading">
                        Chargement des données...
                    </div>
                )}
            </div>
        </BasePage>
    );
}