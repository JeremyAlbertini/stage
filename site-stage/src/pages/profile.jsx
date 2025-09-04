import Header from "../components/Header";
import LeftBand from "../components/LeftBand";
import TabGroup from "../components/TabGroup";
import TabContent from "../components/TabContent";
import { useEffect, useState } from "react";
import BasePage from "../components/BasePage";

export default function Profile() {
    const [userData, setUserData] = useState(null);
    const [activeTab, setActiveTab] = useState("infos");
    const [isHoveringPhoto, setIsHoveringPhoto] = useState(false);
    const tabs = [
        { id: "infos", label: "Informations personnelles" },
        { id: "documents", label: "Documents" },
        {id: "certificats", label: "Certificats" }
    ];

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const meResponse = await fetch("http://localhost:5000/me", {
                    credentials: "include"
                });
                const meData = await meResponse.json();

                if (meData.loggedIn) {
                    const profileResponse = await fetch("http://localhost:5000/agent/profile", {
                        credentials: "include"
                    });
                    const profileData = await profileResponse.json();

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
                } else {
                    alert("Erreur lors de l'upload: " + data.message);
                } 
            }   catch (error) {
                    console.error("Erreur lors de l'upload::", error);
                    alert("Erreur lors de l'upload de l'image");
                }
            }

    return (
        <BasePage title="Profile">
                    <h1>Mon Profil</h1>
                    {userData ? (
                        <>
                            <div style ={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                backgroundColor: "white",
                                borderRadius: "8px",
                                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                                padding: "2rem",
                                marginBottom: "2rem",
                                position: "relative"
                            }}>

                                <div style ={{
                                    position: "relative",
                                    height: "150px",
                                    width: "150px",
                                    borderRadius: "50%",
                                    overflow: "hidden",
                                    border: "1px, solid, rgb(51, 35, 143)",
                                    objectFit: "cover",
                                }}
                                    onMouseEnter={() => setIsHoveringPhoto(true)}
                                    onMouseLeave={() => setIsHoveringPhoto(false)}
                                >

                                    <div style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <img
                                            src={userData.photo ? `/uploads/profiles/${userData.photo}` : "/ano.png"}
                                            alt="Photo de profil"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover"
                                            }}
                                        />

                                        <div style={{
                                            position: "absolute",
                                            bottom: "0",
                                            left: "0",
                                            right: "0",
                                            background: "rgba(0, 0, 0, 0.6)",
                                            padding: "8px",
                                            textAlign: "center",
                                            cursor: "pointer",
                                            opacity: isHoveringPhoto ? 1 : 0,
                                            transform: isHoveringPhoto ? "translateY(0)" : "translateY(10px)",
                                            transition: "opacity 0.3s ease, transform 0.3s ease",
                                        }}
                                        onClick={() => document.getElementById("photoUpload").click()}
                                        >
                                            <span style={{ color: "white", fontSize: "0.8rem"}}>Modifier</span>
                                        </div>

                                        <input
                                            type="file"
                                            id="photoUpload"
                                            style={{ display: "none" }}
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                        />
                                    </div>

                                </div>

                                <div style={{
                                    marginTop: "1rem",
                                    textAlign: "center"
                                }}>
                                    <p>Bienvenue {userData.nom} {userData.prenom} !</p>
                                </div>

                            </div>

                            <TabGroup 
                                tabs={tabs} 
                                activeTab={activeTab} 
                                onTabChange={setActiveTab} 
                            />

                            <TabContent id="infos" activeTab={activeTab}>
                                <h2 className="admin-subtitle">Informations personnelles</h2>
                                <p>Matricule: {userData.matricule}</p>
                                <p>Nom: {userData.nom || "Non renseigné"}</p>
                                <p>Prénom: {userData.prenom || "Non renseigné"}</p>
                                <p>Email: {userData.mail_pro || userData.mail_perso || "Non renseigné"}</p>
                                <p>Rôle: {userData.is_admin ? "Administrateur" : "Utilisateur"}</p>

                                <h2 className="admin-subtitle" style={{marginTop: "1.5rem"}}>Coordonnées</h2>
                                <p>Téléphone: {userData.tel_pro || userData.tel_perso || "Non renseigné"}</p>
                                <p>Adresse: {userData.adresse ? `${userData.adresse}, ${userData.adresse_code} ${userData.adresse_ville}` : "Non renseignée"}</p>

                                {userData.is_admin && (
                                    <div style={{marginTop: "1.5rem"}}>
                                        <h2 className="admin-subtitle">Administration</h2>
                                        <button 
                                            className="admin-button"
                                            onClick={() => window.location.href = "/admin"}
                                        >
                                            Accéder à l'administration
                                        </button>
                                    </div>
                                )}
                            </TabContent>

                            <TabContent id="documents" activeTab={activeTab}>
                                <h2 className="admin-subtitle">Mes documents</h2>
                                <p>Aucun document disponible pour le moment.</p>
                            </TabContent>

                            <TabContent id="certificats" activeTab={activeTab}>
                                <h2 className="admin-subtitle">Mes certificats</h2>
                                <p>Aucun certificat disponible pour le moment.</p>
                            </TabContent>
                        </>
                    ) : (
                        <p>Chargement des données...</p>
                    )}
        </BasePage>
    );
}