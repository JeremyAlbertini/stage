import { useState, useEffect, useCallback } from "react";
import BasePage from "../components/BasePage";
import TabGroup from "../components/TabGroup";
import TabContent from "../components/TabContent";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";
import "../styles/conges.css";

export default function Conges() {
  const { user } = useAuth();
  const api = useApi();
  const [activeTab, setActiveTab] = useState("new");
  const [userLeaves, setUserLeaves] = useState([]);
  const [soldes, setSoldes] = useState({ CA: 25, RCA: 10});
  const [soldesError, setSoldesError] = useState("");
  const [formData, setFormData] = useState({
    type_conge: "CA",
    date_debut: "",
    date_fin: "",
    commentaire: "",
    duree: 0
  });
  const [submitMessage, setSubmitMessage] = useState({ text: "", type: ""});

  const tabs = [
    { id: "new", label: "Nouvelle demande" },
    { id: "history", label: "Mes demandes" }
  ];

const fetchUserLeaves = useCallback(async () => {
  try {
    const response = await fetch('/api/conges', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Réponse API /api/conges :", data);

    if (Array.isArray(data)) {
      setUserLeaves(data);
    } else {
      console.error("La réponse n'est pas un tableau :", data);
      setUserLeaves([]);
    }
  } catch (err) {
    console.error("Erreur lors de la récupération des congés:", err);
    setUserLeaves([]);
  }
}, []);

const fetchSoldes = useCallback(async () => {
  try {
    const res = await api.get("/api/soldes");
    if (res.error) {
      setSoldesError(res.error);
      setSoldes(null);
    } else {
      setSoldes(res);
      setSoldesError("");
    }
  } catch (err) {
    setSoldesError("Impossible de récupérer les soldes.");
    setSoldes(null);
    console.error("Erreur lors de la récupération des soldes:", err);
  }
}, [api]);

  useEffect(() => {
    fetchUserLeaves();
    fetchSoldes();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.date_debut && formData.date_fin) {
      const debut = new Date(formData.date_debut);
      const fin = new Date(formData.date_fin);
      let count = 0;
      const currentDate = new Date(debut);

      while (currentDate <= fin) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          count++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      formData.duree = count;
    }

    if (
      (formData.type_conge === "CA" && formData.duree > (soldes?.CA ?? 0)) ||
      (formData.type_conge === "RCA" && formData.duree > (soldes?.RCA ?? 0))
    ) {
      setSubmitMessage({ 
        text: `Vous n'avez pas assez de jours de ${formData.type_conge} pour cette demande.`,
        type: "error"
      });
      return;
    }

    try {
      await api.post("/api/conges", formData);
      setSubmitMessage({ text: "Demande soumise avec succès", type: "success" });
      setFormData({
        type_conge: "CA",
        date_debut: "",
        date_fin: "",
        commentaire: ""
      });
      fetchUserLeaves();
      fetchSoldes();
      setActiveTab("history");
    } catch (err) {
      setSubmitMessage({ text: "Erreur lors de la soumission", type: "error"});
      console.error("Erreur", err);
    }
  };

  const handleCancelLeave = async (leaveId) => {
    try {
      await api.delete(`/api/conges/${leaveId}`);
      setSubmitMessage({ text: "Demande annulée avec succès", type: "success" });
      fetchUserLeaves();
      fetchSoldes();
    } catch (err) {
      setSubmitMessage({ text: "Erreur lors de l'annulation", type: "error"});
      console.error("Erreur lors de l'annulation:", err);
    }
  };

  return (
    <BasePage title="Congés">
      <h1>Mes congés</h1>

      {soldesError ? (
        <div className="error-message">{soldesError}</div>
      ) : soldes ? (
        <div className="leave-balance-cards">
          <div className="balance-card">
            <h3>Congés annuels</h3>
            <p className="balance-value">{soldes.CA} jours</p>
          </div>
          <div className="balance-card">
            <h3>RTT</h3>
            <p className="balance-value">{soldes.RCA} jours</p>
          </div>
        </div>
      ) : null}

      <TabGroup
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <TabContent id="new" activeTab={activeTab}>
        <div className="form-container">
          <h2>Nouvelle demande de congé</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="type_conge">Type de congé</label>
              <select
                id="type_conge"
                name="type_conge"
                value={formData.type_conge}
                onChange={handleChange}
                required
              >
                <option value="CA">
                  Congés Annuels ({soldes?.CA ?? 0} jours restants)
                </option>
                <option value="RCA">  
                  RTT ({soldes?.RCA ?? 0} jours restants)
                </option>
                <option value="Congé Exceptionnel">Congé Exceptionnel</option>
                <option value="CF">Congés Formation</option>
                <option value="JS">Jour de solidarité</option>
                <option value="CET">Compte Épargne Temps</option>
                <option value="Congé Enfant Malade">Congé Enfant Malade</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date_debut">Date de début</label>
              <input
                type="date"
                id="date_debut"
                name="date_debut"
                value={formData.date_debut}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="date_fin">Date de fin</label>
              <input
                type="date"
                id="date_fin"
                name="date_fin"
                value={formData.date_fin}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="commentaire">Commentaire (optionnel)</label>
              <textarea
                id="commentaire"
                name="commentaire"
                value={formData.commentaire}
                onChange={handleChange}
                rows="3"
              ></textarea>
            </div>

            <Button type="submit">Soumettre ma demande</Button>

            {submitMessage.text && (
              <div className={`message ${submitMessage.type}`}>
                {submitMessage.text}
              </div>
            )}
          </form>
        </div>
      </TabContent>

      <TabContent id="history" activeTab={activeTab}>
        <h2>Historique des demandes</h2>
        <table className="leaves-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Dates</th>
              <th>Durée</th>
              <th>Statut</th>
              <th>Commentaire</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userLeaves.length > 0 ? (
              userLeaves.map(leave => (
                <tr key={leave.id}>
                  <td>{leave.type_conge}</td>
                  <td>{new Date(leave.date_debut).toLocaleDateString()} - {new Date(leave.date_fin).toLocaleDateString()}</td>
                  <td>{leave.duree} jours</td>
                  <td>
                    <span className={`status status-${leave.statut.toLowerCase().replace(' ', '-')}`}>
                      {leave.statut}
                    </span>
                  </td>
                  <td>{leave.commentaire}</td>
                  <td>
                    {leave.statut === "En Attente" && (
                      <Button
                        secondary
                        onClick={() => handleCancelLeave(leave.id)}
                      >
                        Annuler
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">Aucune demande de congé</td>
              </tr>
            )}
          </tbody>
        </table>
      </TabContent>
    </BasePage>
  );
}
