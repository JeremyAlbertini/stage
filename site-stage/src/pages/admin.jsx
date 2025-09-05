import Header from "../components/Header.jsx";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import CreateUser from "../components/create_user.jsx";
import LeftBand from "../components/LeftBand.jsx";
import BasePage from "../components/BasePage.jsx";
import "../styles/admin.css"
import TabGroup from "../components/TabGroup.jsx";
import { useState } from "react";
import TabContent from "../components/TabContent.jsx";
import ModifierUser from "../components/modifyUser.jsx";

export default function AdminPage({ users, loadUsers }) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("create");
    const tabs = [
        { id: "create", label: "Créer Un Utilisateur" },
        { id: "change", label: "Modifier Un Utilisateur" },
        { id: "liste", label: "Liste d'utilisateur" }
    ];

    return (
        <BasePage title="Administration">
        <div className="admin-container">
            <div className="admin-card">
                <h1 className="admin-title">Bienvenue sur la page administration</h1>
                <p className="admin-text">Ici vous pouvez administrer vos agents.</p>
                <TabGroup 
                    tabs={tabs} 
                    activeTab={activeTab} 
                    onTabChange={setActiveTab} 
                            />
                    <TabContent id="create" activeTab={activeTab}>
            <CreateUser onUserCreated={loadUsers} />
        </TabContent>
        <TabContent id="change" activeTab={activeTab}>
            <ModifierUser users={users} loadUsers={loadUsers}/>
        </TabContent>
        <TabContent id="liste" activeTab={activeTab}>
                        <h2 className="admin-subtitle">Liste des utilisateurs</h2>
                        <ul className="user-list">
                        {users.map(user => (
                        <li key={user.id}>{user.matricule}</li>
                        ))}
                    </ul>
        </TabContent>
            </div>
            </div>
        </BasePage>
    );
}
