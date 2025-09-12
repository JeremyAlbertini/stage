import { useState, useEffect, act } from "react";
import BasePage from "../components/BasePage";
import TabGroup from "../components/TabGroup";
import TabContent from "../components/TabContent";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";

export default function Conges() {
  const { user } = useAuth();
  const api = useApi();
  const [activeTab, setActiveTab] = useState("new");
  const [userLeaves, setUserLeaves] = useState({});
  const [soldes, setSoldes] = useState({ CA: 25, RCA: 10});
  const [formData, setFormData] = useState({
    type_conge: "CA",
    date_debut: "",
    date_fin: "",
    commentaire: ""
  });
  const [submitMessage, setSubmitMessage] = useState({ text: "", type: ""});

  const tabs = [
    { id: "new", label: "Nouvelle demande" },
    { id: "history", label: "Mes demandes" }
  ];

  const fetchUserLeaves = async () => {
    try {
      const data = await api.get("/leaves");
      setUserLeaves(data);
    } catch (err) {
      console.error("Erreur lors de la récupération des congés:", err);
    }
  };

  useEffect(() => {
    fetchUserLeaves();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.tatget.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/leaves", formData);
      setSubmitMessage({ text: "Demande soumise avec succès", type: "success" });
      setFormData({
        type_conge: "CA",
        date_debut: "",
        date_fin: "",
        commentaire: ""
      });
      fetchUserLeaves();
      setActiveTab("history");
    } catch (err) {
      setSubmitMessage({ text: "Erreur lors de la soumission", type: "error"});
      console.error("Erreur", err);
    }
  };

  return (
    <BasePage title="Congés">
      <h1>Mes congés</h1>

      <div classeName="leave-balacnce-cards">
        <div className="balance-card">
          <h3>Congés annuels</h3>
          <p className="balance-value">{soldes.CA} jours</p>
        </div>
        <div className="balance-card">
          <h3>RTT</h3>
          <p className="balance-card">{soldes.RCA} jours</p>
        </div>
      </div>

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
                <option value="CA">Congés Annuels ({soldes.CA} jours restants)</option>
                <option value="RCA"> RTT ({soldes.RCA} jours restants)</option>
                <option value="Autre">Autre congé</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date_debut"> Date de début</label>
              <input
                type="date"
                id="date_debut"
                name="date_debut"
                value={formData.date_debut}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-grouop">
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
              <label htmlFor="commentaire">Commentaire(optionnel)</label>
              <textarea
                id="commentaire"
                name="commentaire"
                value={formData.commentaire}
                onChange={handleChange}
                rows="3"
              />
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
                        onClick={() => {/*ajt code pr annuler un jour*/}}
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
