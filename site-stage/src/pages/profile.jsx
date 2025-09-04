import Header from "../components/Header";
import LeftBand from "../components/LeftBand";
import { useEffect, useState } from "react";

export default function Profile() {
    const [userData, setUserData] = useState(null);

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
                                backgroundColor: "white",
                                borderRadius: "8px",
                                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                                padding: "2rem",
                                marginBottom: "2rem"
                                }}>
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