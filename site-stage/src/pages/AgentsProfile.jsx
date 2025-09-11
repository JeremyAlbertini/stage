import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import BasePage from "../components/BasePage";
import TabContent from "../components/TabContent";
import TabGroup from "../components/TabGroup";
import ModifyAgents from "../components/modifyAgents";
import ManagePerms from "../components/managePerms";
import { getUserPerm } from "../utils/permsApi.js";
import { getAgentById } from "../utils/agentsApi.js"; // 👈 à créer côté utils
import { useAuth } from "../context/AuthContext.jsx";
import { useApi } from "../hooks/useApi.js";

const ALL_TABS = [
    { id: "requests", label: "Demandes", perm: "request", content: "RequestsContent" },
    { id: "modify_account", label: "Informations", perm: "modify_account", content: ModifyAgents },
    { id: "calendar", label: "Calendrier", perm: null, content: "CalendarContent" },
    { id: "perms", label: "Permission", perm: "change_perms", content: ManagePerms },
];

export default function AgentsProfile() {
    const api = useApi();
    const { id } = useParams(); // 👈 récupère l'id depuis l'URL
    const [searchParams, setSearchParams] = useSearchParams();
    const [agent, setAgent] = useState(null);
    const [perms, setPerms] = useState({});
    const [activeTab, setActiveTab] = useState(searchParams.get("tab") || ALL_TABS[0].id);
    const { user, loading } = useAuth();

    // Charger les infos de l’agent
    useEffect(() => {
        async function fetchAgent() {
            const data = await getAgentById(api, id);
            setAgent(data);
        }
        fetchAgent();
    }, [id]);

    // Charger les permissions
    useEffect(() => {
        async function fetchPerms() {
            const permsObj = {};
            for (const tab of ALL_TABS) {
                if (tab.perm) {
                    permsObj[tab.id] = await getUserPerm(api, user.id, tab.perm);
                } else {
                    permsObj[tab.id] = true;
                }
            }
            setPerms(permsObj);
        }
        
        if (user && !loading) {
            fetchPerms();
        }
    }, [user, loading]);

    // Onglets autorisés
    const tabs = ALL_TABS.filter(tab => perms[tab.id]).map(tab => ({
        id: tab.id,
        label: tab.label
    }));

    // Vérifier si l'onglet actif est autorisé
    useEffect(() => {
        if (!perms[activeTab] && tabs.length > 0) {
            const firstTab = tabs[0]?.id || "";
            setActiveTab(firstTab);
            setSearchParams({ tab: firstTab });
        }
    }, [perms, activeTab, tabs, setSearchParams]);

    // Quand on change d’onglet → mettre dans l’URL
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setSearchParams({ tab: tabId });
    };

    const updateAgentData = (updatedAgent) => {
        if (updatedAgent) setAgent(updatedAgent);
    };

    if (!agent) {
        return <p style={{ textAlign: "center" }}>Chargement...</p>;
    }

    return (
        <BasePage
            title={agent ? `Profil de ${agent.nom} ${agent.prenom}` : "Profil de l'agent"}
            backgroundColor="#f5f5f5"
        >
            <>
                <div style={{
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
                    <div
                        style={{
                            position: "relative",
                            height: "150px",
                            width: "150px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            border: "3px solid rgb(51, 35, 143)",
                        }}
                    >
                        <img
                            src={agent.photo && agent.photo !== "ano.jpg"
                                ? `/uploads/profiles/${agent.photo}`
                                : "/ano.jpg"}
                            alt="Photo de profil"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                position: "absolute",
                                top: 0,
                                left: 0
                            }}
                        />
                    </div>
                    <h1>{agent.nom} {agent.prenom}</h1>
                </div>

                {tabs.length > 0 ? (
                    <>
                        <TabGroup
                            tabs={tabs}
                            activeTab={activeTab}
                            onTabChange={handleTabChange}
                        />
                        
                        {ALL_TABS.filter(tab => perms[tab.id]).map(tab => (
                            <TabContent key={tab.id} id={tab.id} activeTab={activeTab}>
                                {tab.content === ModifyAgents ? (
                                    <ModifyAgents agent={agent} onUpdate={updateAgentData} />
                                ) : tab.content === ManagePerms ? (
                                    <ManagePerms agent={agent} onUpdate={updateAgentData} />
                                ) : tab.id === "requests" ? (
                                    <p>Contenu des demandes de {agent.nom}</p>
                                ) : tab.id === "calendar" ? (
                                    <p>Contenu du calendrier de {agent.nom}</p>
                                ) : (
                                    tab.content && <tab.content agent={agent} onUpdate={updateAgentData} />
                                )}
                            </TabContent>
                        ))}
                    </>
                ) : (
                    <div style={{
                        textAlign: "center",
                        padding: "2rem",
                        backgroundColor: "white",
                        borderRadius: "8px",
                        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
                    }}>
                        Vous n'avez accès à aucun onglet pour ce profil.
                    </div>
                )}
            </>
        </BasePage>
    );
}
