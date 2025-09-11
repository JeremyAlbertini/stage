import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import BasePage from "../components/BasePage";
import "../styles/contrats.css";

export default function Contrat() {
  const { user, loading } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [error, setError] = useState("");
  const [loadingContracts, setLoadingContracts] = useState(false);

  const typeContratLabels = {
    Titulaire: "F.T.P Titulaire",
    Contractuel: "F.T.P Contractuel",
    CDI: "F.T.P CDI",
    Stagiaire: "F.T.P Stagiaire",
    Stage: "Stage",
    Vacataire: "Vacataire",
  };

  useEffect(() => {
    if (user?.matricule) {
      fetchContracts();
    }
  }, [user?.matricule]);

  const fetchContracts = async () => {
    setLoadingContracts(true);
    setError("");
    try {
      const res = await fetch(
        `http://localhost:5000/contrats/${user.matricule}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Erreur lors du chargement des contrats");
      const data = await res.json();
      setContracts(data);
    } catch (err) {
      console.error("Error fetching contracts:", err);
      setError(err.message || "Erreur lors du chargement des contrats");
    } finally {
      setLoadingContracts(false);
    }
  };

  if (loading) return <p>Chargement de l'utilisateur...</p>;

  return (
    <BasePage title="Hébésoft">
      <div className="contracts-container">
        <h1>Mes Contrats</h1>

        {error && (
          <div
            style={{
              color: "red",
              marginBottom: "10px",
              padding: "10px",
              background: "#ffebee",
              borderRadius: "4px",
            }}
          >
            {error}
          </div>
        )}

        {loadingContracts ? (
          <p>Chargement des contrats...</p>
        ) : contracts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              color: "#666",
              fontStyle: "italic",
            }}
          >
            Aucun contrat trouvé
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Période</th>
                <th>Statut Administratif</th>
                <th>CA</th>
                <th>CF</th>
                <th>JS</th>
                <th>RCA</th>
                <th>Heures</th>
                <th>Statut</th>
                <th>Contrat PDF</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract) => (
                <tr key={contract.id}>
                  <td
                    className={contract.statut === "Actif" ? "active" : "inactive"}
                  >
                    {`Période du ${new Date(
                      contract.date_debut
                    ).toLocaleDateString("fr-FR")} au ${new Date(
                      contract.date_fin
                    ).toLocaleDateString("fr-FR")}`}
                  </td>
                  <td>{typeContratLabels[contract.type_contrat] || contract.type_contrat}</td>
                  <td>{contract.ca}</td>
                  <td>{contract.cf}</td>
                  <td>{contract.js}</td>
                  <td>{contract.rca}</td>
                  <td>{contract.heure}h</td>
                  <td>
                    <span
                      className={
                        contract.statut === "Actif" ? "status-active" : "status-inactive"
                      }
                    >
                      {contract.statut}
                    </span>
                  </td>
                  <td>
                    {contract.pdf_file ? (
                      <button
                        className="download"
                        onClick={() =>
                          window.open(
                            `http://localhost:5000/contrats/${contract.id}/download`,
                            "_blank"
                          )
                        }
                        aria-label={`Télécharger le PDF du contrat ${contract.id}`}
                      >
                        📄 Télécharger le PDF
                      </button>
                    ) : (
                      <span style={{ color: "#999", fontSize: "0.85rem" }}>Aucun PDF</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </BasePage>
  );
}
