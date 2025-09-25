import { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import BasePage from "../components/BasePage";
import TabContent from "../components/TabContent";
import TabGroup from "../components/TabGroup";
import ModifyAgents from "../components/modifyAgents";
import ManagePerms from "../components/managePerms";
import Contract from "../components/contrats.jsx";
import { getPerm } from "../utils/permsApi.js";
import { getAgentById } from "../utils/agentsApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useApi } from "../hooks/useApi.js";
import Calendar from "../components/calendar.jsx";

const ALL_TABS = [
    { id: "requests", label: "Demandes", perm: "request", content: "RequestsContent" },
    { id: "modify_account", label: "Informations", perm: "modify_account", content: ModifyAgents },
    { id: "calendar", label: "Calendrier", perm: null, content: "CalendarContent" },
    { id: "perms", label: "Permissions", perm: "change_perms", content: ManagePerms },
    { id: "contrats", label: "Contrats", perm: null, content: Contract },
];

export default function AgentsProfile() {
    const api = useApi();
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const { user, loading, permissions } = useAuth();

    const [agent, setAgent] = useState(null);
    const [activeTab, setActiveTab] = useState(() => searchParams.get("tab") || "");
    const [initialized, setInitialized] = useState(false);

    // Loader si authentification en cours
    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader"><div></div><div></div><div></div></div>
            </div>
        );
    }

    // Charger les informations de l'agent
    useEffect(() => {
        if (!id) return;
        const fetchAgent = async () => {
            try {
                const data = await getAgentById(api, id);
                setAgent(data);
            } catch (error) {
                console.error("Erreur lors du chargement de l'agent:", error);
            }
        };
        fetchAgent();
    }, [id]); // api retiré pour éviter les boucles infinies

    // Calculer les permissions des onglets
    const perms = useMemo(() => {
        if (!permissions || Object.keys(permissions).length === 0) return null; // pas encore chargé
        const permsObj = {};
        for (const tab of ALL_TABS) {
            permsObj[tab.id] = tab.perm ? getPerm(permissions, tab.perm) : true;
        }
        return permsObj;
    }, [permissions]);

    // Calculer les onglets autorisés
    const tabs = useMemo(() => {
        if (!perms) return [];
        return ALL_TABS.filter(tab => perms[tab.id]).map(tab => ({
            id: tab.id,
            label: tab.label
        }));
    }, [perms]);

    // Initialisation activeTab après que perms sont chargées
    useEffect(() => {
        if (!perms || initialized) return;

        const tabFromUrl = searchParams.get("tab");
        const firstAllowed = tabs[0]?.id;

        if (tabFromUrl && perms[tabFromUrl]) {
            setActiveTab(tabFromUrl);
        } else {
            // Onglet non autorisé ou absent → premier onglet autorisé
            if (firstAllowed) {
                setActiveTab(firstAllowed);
                setSearchParams({ tab: firstAllowed });
            }
        }

        setInitialized(true);
    }, [perms, tabs, searchParams, setSearchParams, initialized]);

    // Changement d'onglet via clic
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setSearchParams({ tab: tabId });
    };

    // Mettre à jour les données de l’agent depuis un composant enfant
    const updateAgentData = (updatedAgent) => {
        if (updatedAgent) setAgent(updatedAgent);
    };

    // Loader si agent non chargé
    if (!agent) {
        return (
            <BasePage title="Chargement..." backgroundColor="#f5f5f5" >
                <div style={{ textAlign: "center", padding: "2rem" }}>
                    <p>Chargement du profil...</p>
                </div>
            </BasePage>
        );
    }

    return (
        <BasePage title={`Profil de ${agent.nom} ${agent.prenom}`} backgroundColor="#f5f5f5" >
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
                <div style={{
                    position: "relative",
                    height: "150px",
                    width: "150px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "3px solid rgb(51, 35, 143)"
                }}>
                    <img
                        src={agent.photo && agent.photo !== "ano.jpg"
                            ? `/uploads/profiles/${agent.photo}`
                            : "/ano.jpg"}
                        alt="Photo de profil"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                </div>
                <h1>{agent.nom} {agent.prenom}</h1>
            </div>

            {tabs.length > 0 ? (
                <>
                    <TabGroup tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
                    {ALL_TABS.filter(tab => perms[tab.id]).map(tab => (
                        <TabContent key={tab.id} id={tab.id} activeTab={activeTab}>
                            {tab.content === ModifyAgents ? (
                                <ModifyAgents agent={agent} onUpdate={updateAgentData} />
                            ) : tab.content === ManagePerms ? (
                                <ManagePerms agent={agent} onUpdate={updateAgentData} />
                            ) : tab.content === Contract ? (
                                <Contract agent={agent} />
                            ) : tab.id === "requests" ? (
                                <p>Contenu des demandes de {agent.nom}</p>
                            ) : tab.id === "calendar" ? (
                                <Calendar user_id={agent.user_id} />
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
        </BasePage>
    );
}
