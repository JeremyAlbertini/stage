import { useLocation } from "react-router-dom";
import BasePage from "../components/BasePage";
import TabContent from "../components/TabContent";
import TabGroup from "../components/TabGroup";
import { useState } from "react";
import ModifyAgents from "../components/modifyAgents";
import ManagePerms from "../components/managePerms";

export default function AgentsProfile() {
    const location = useLocation();
    const initialAgent = location.state?.agent;
    const [agent, setAgent] = useState(initialAgent);
    const [activeTab, setActiveTab] = useState("Demandes");

    const tabs = [
        { id: "Demandes", label: "Demandes" },
        { id: "Informations", label: "Informations" },
        { id: "Calendrier", label: "Calendrier" },
        { id: "Perms", label: "Permission" }
    ];

    const updateAgentData = (updatedAgent) => {
        // Vérifie que updatedAgent existe avant de setAgent
        if (updatedAgent) setAgent(updatedAgent);
    };

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
                <TabGroup
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />
                <TabContent id="Demandes" activeTab={activeTab}>
                    <p>Contenu des demandes de {agent.nom}</p>
                </TabContent>
                <TabContent id="Informations" activeTab={activeTab}>
                    <ModifyAgents agent={agent} onUpdate={updateAgentData} />
                </TabContent>
                <TabContent id="Calendrier" activeTab={activeTab}>
                    <p>Contenu du calendrier de {agent.nom}</p>
                </TabContent>
                <TabContent id="Perms" activeTab={activeTab}>
                    <ManagePerms agent={agent} onUpdate={updateAgentData}/>
                </TabContent>
            </>
        </BasePage>
    );
}