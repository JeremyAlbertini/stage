import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BasePage from "../components/BasePage.jsx";
import TabGroup from "../components/TabGroup.jsx";
import TabContent from "../components/TabContent.jsx";
import CreateUser from "../components/create_user.jsx";
import SearchList from "../components/searchList.jsx";
import { getUserData, getUserPerm } from "../utils/permsApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useApi } from "../hooks/useApi.js";
import LeaveApproval from "../components/LeaveApproval";

const ALL_TABS = [
    { id: "create", label: "Créer Un Utilisateur", perm: "create_account", content: CreateUser },
    { id: "liste", label: "Liste d'utilisateur", perm: "all_users", content: SearchList },
    { id: "conges", label: "Gestion des congés", perm: "request", content: LeaveApproval },
    // Pour ajouter un nouvel onglet : { id: "stats", label: "Statistiques", perm: "view_stats", content: StatsComponent }
];

export default function AdminPage({ users, loadUsers }) {
    const api = useApi();
    const [perms, setPerms] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.defaultTab || ALL_TABS[0].id);
    const { user, loading } = useAuth();

    useEffect(() => {
        async function fetchPerms() {
            const permsObj = {};
            for (const tab of ALL_TABS) {
                if (tab.perm) {
                    permsObj[tab.id] = await getUserPerm(api, user.id, tab.perm);
                } else {
                    permsObj[tab.id] = true; // Onglet sans restriction
                }
            }
            setPerms(permsObj);
        }
        fetchPerms();
    }, [users.user_id]);

    // Onglets autorisés
    const tabs = ALL_TABS.filter(tab => perms[tab.id]).map(tab => ({
        id: tab.id,
        label: tab.label
    }));

    // Si l’onglet actif n’est plus autorisé, on bascule sur le premier onglet autorisé
    useEffect(() => {
        if (!perms[activeTab]) {
            const firstTab = tabs[0]?.id || "";
            setActiveTab(firstTab);
        }
    }, [perms, activeTab, tabs]);

    return (
        <BasePage title="Administration">
            <div className="admin-container">
                <div className="admin-card">
                    <h1 className="admin-title">Bienvenue sur la page administration</h1>
                    <p className="admin-text">Ici vous pouvez administrer vos agents.</p>
                    {tabs.length > 0 ? (
                        <>
                            <TabGroup 
                                tabs={tabs} 
                                activeTab={activeTab} 
                                onTabChange={setActiveTab} 
                            />
                            {ALL_TABS.filter(tab => perms[tab.id]).map(tab => (
                                <TabContent key={tab.id} id={tab.id} activeTab={activeTab}>
                                    {tab.content === CreateUser
                                        ? <CreateUser onUserCreated={loadUsers} />
                                        : tab.content === SearchList
                                            ? <SearchList />
                                            : tab.content && <tab.content />
                                    }
                                </TabContent>
                            ))}
                        </>
                    ) : (
                        <div className="admin-no-access">
                            Vous n'avez accès à aucun onglet.
                        </div>
                    )}
                </div>
            </div>
        </BasePage>
    );
}
