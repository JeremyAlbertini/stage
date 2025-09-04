import Header from "../components/Header";
import LeftBand from "../components/LeftBand";
import { useEffect, useState } from "react";

export default function Profile() {
    const [userData, setUserData] = useState(null);
    const [activeTab, setActiveTab] = useState("infos");

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

    return (
        <div style={{width: "100%", height: "100vh", display: "flex", flexDirection:"column"}}>
            <Header title="Profil" backgroundColor="rgb(51, 35, 143)" color="white"/>
            <div style={{ display: "flex", flex: 1, marginTop: '60px'}}>
                <LeftBand />
                <div style={{ flex: 1, boxSizing: "border-box", padding: "2rem"}}>
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
                                    height: "150px",
                                    width: "150px",
                                    borderRadius: "50%",
                                    overflow: "hidden",
                                    border: "1.5px, solid, rgb(0, 0, 0)",
                                    objectFit: "cover",
                                }}>

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
                                            src="/default-avatar.png"
                                            alt="Photo de profil"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover"
                                            }}
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

                            <div style={{
                                display: "flex",
                                borderBottom: "1px solid #ddd",
                                marginBottom: "1.5rem",
                                width: "100%"
                            }}>

                                <div
                                    onClick={() => setActiveTab("Informations personnelles")}
                                    style={{
                                        padding: "1rem 2rem",
                                        cursor: "pointer",
                                        borderBottom: activeTab === "Informations personnelles" ? "3px solid #4A25AA" : "none",
                                        color: activeTab === "Informations personnelles" ? "#4A25AA" : "#666",
                                        fontWeight: activeTab === "Informations personnelles" ? "bold" : "normal",
                                        transition: "all 0.2s"
                                    }}
                                >
                                    Informations personnelles
                                </div>
                            </div>

                            <div className="admin-card">
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
                            </div>
                        </>
                    ) : (
                        <p>Chargement des données...</p>
                    )}
                </div>
            </div>
        </div>
    );
}