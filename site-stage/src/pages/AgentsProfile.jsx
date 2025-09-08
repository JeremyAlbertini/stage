import { useLocation } from "react-router-dom";
import BasePage from "../components/BasePage";

export default function AgentsProfile() {
  const location = useLocation();
  const agent = location.state?.agent; // Récupérer l'agent depuis l'état

  return (
    <BasePage
      title={agent ? `Profil de ${agent.nom} ${agent.prenom}` : "Profil de l'agent"}
      backgroundColor="#f5f5f5"
    >
      <div style={{ padding: "20px" }}>
        {agent ? (
          <>
            <h2>Bienvenue sur le profil de {agent.nom} {agent.prenom}</h2>
            <p>Matricule : {agent.matricule}</p>
            <p>Poste : {agent.poste}</p>
            <p>Adresse professionnelle : {agent.adresse_pro}</p>
            <p>Stage : {agent.stage}</p>
          </>
        ) : (
          <p>Aucun agent sélectionné.</p>
        )}
      </div>
    </BasePage>
  );
}