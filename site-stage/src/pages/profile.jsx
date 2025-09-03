import Header from "../components/Header";
import LeftBand from "../components/LeftBand";
import { useEffect, useState } from "react";

export default function Profile() {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (userString) {
            setUserData(JSON.parse(userString));
        }
    }, []);

    return (
        <div style={{width: "100%", height: "100vh", display: "flex", flexDirection:"column"}}>
            <Header title="Profil" backgroundColor="rgb(51, 35, 143)" color="white"/>
            <div style={{ display: "flex", flex: 1, marginTop: '60px'}}>
                <LeftBand />
                <div style={{ flex: 1, boxSizing: "border-box", padding: "2rem"}}>
                    <h1>Mon Profil</h1>
                    {userData ? (
                    <div>
                        <p>Matricule: {userData.matricule}</p>
                        <p>ID: {userData.id}</p>
                        <p>Email: {userData.email || "Non renseigné"}</p>
                        <p>Nom: {userData.nom || "Non renseigné"}</p>
                        <p>Prénom: {userData.prenom || "Non renseigné"}</p>
                        <p>Rôle: {userData.isAdmin ? "Administrateur" : "Utilisateur"}</p>
                    </div>
                    ): (
                        <p>Chargement des données...</p>
                    )}
                </div>
            </div>
        </div>
    );
}