import { useEffect, useState } from "react";
import BasePage from "../components/BasePage";
import { useAuth } from "../context/AuthContext";
import "../styles/horaire.css";

export default function Horaire() {
  const { user, loading } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [loadingContracts, setLoadingContracts] = useState(false);
  const [error, setError] = useState("");
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
  const [timeEntries, setTimeEntries] = useState([]);

  useEffect(() => {
    if (user?.matricule) {
      fetchContracts(user.matricule);
    }
  }, [user?.matricule]);

  const fetchContracts = async (matricule) => {
    setLoadingContracts(true);
    setError("");
    try {
      const res = await fetch(
        `http://localhost:5000/contrats/${matricule}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Erreur lors du chargement des contrats");
      const data = await res.json();
      setContracts(data);

      const activeContracts = data.filter((c) => c.statut === "Actif");
      if (activeContracts.length > 0) {
        setSelectedContract(activeContracts[0]);
      } else {
        setSelectedContract(data[0] || null);
      }
    } catch (err) {
      console.error("Error fetching contracts:", err);
      setError(err.message || "Erreur lors du chargement des contrats");
    } finally {
      setLoadingContracts(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const getContractMonths = (contract) => {
    if (!contract?.date_debut || !contract?.date_fin) return [];
    
    const startDate = new Date(contract.date_debut);
    const endDate = new Date(contract.date_fin);
    const months = [];
    
    const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    
    while (current <= endDate) {
      months.push({
        date: new Date(current),
        label: new Intl.DateTimeFormat("fr-FR", { 
          month: "short", 
          year: "2-digit" 
        }).format(current),
        fullLabel: new Intl.DateTimeFormat("fr-FR", { 
          month: "long", 
          year: "numeric" 
        }).format(current)
      });
      current.setMonth(current.getMonth() + 1);
    }
    
    return months;
  };

  const generateCalendarDays = (selectedMonth) => {
    if (!selectedMonth) return [];
    
    const year = selectedMonth.date.getFullYear();
    const month = selectedMonth.date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const currentDate = new Date(year, month, day);
      const dayOfWeek = currentDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      
      days.push({
        date: currentDate,
        day: day,
        dayName: dayNames[dayOfWeek],
        isWeekend,
        fullDate: currentDate.toISOString().split('T')[0]
      });
    }
    
    return days;
  };

  const contractMonths = selectedContract ? getContractMonths(selectedContract) : [];
  const selectedMonth = contractMonths[selectedMonthIndex];
  const calendarDays = generateCalendarDays(selectedMonth);

  return (
    <BasePage title="Hébésoft">
      <div className="horaire-container2">
        <h1>Fiche Horaire</h1>

        {loading || loadingContracts ? <p>Chargement...</p> : null}
        {error && <p className="error-message2">{error}</p>}

        {contracts.length > 0 ? (
          <div className="contract-section2">
            <label htmlFor="contract-select2" className="contract-label2">
              Sélectionnez le contrat :
              <select
                id="contract-select2"
                value={selectedContract?.id || ""}
                onChange={(e) => {
                  const contract = contracts.find(
                    (c) => c.id === parseInt(e.target.value)
                  );
                  setSelectedContract(contract);
                  setSelectedMonthIndex(0);
                }}
                className="contract-select2"
              >
                {contracts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.type_contrat} ({formatDate(c.date_debut)} → {formatDate(c.date_fin)}){" "}
                    {c.statut === "Actif" ? "⭐" : ""}
                  </option>
                ))}
              </select>
            </label>

            {selectedContract && (
              <div className="contract-details2">
                <p><strong>Date de début:</strong> {formatDate(selectedContract.date_debut)}</p>
                <p><strong>Date de fin:</strong> {formatDate(selectedContract.date_fin)}</p>
                <p><strong>Durée (jours):</strong> {selectedContract.duree_contrat}</p>
                <p><strong>Statut:</strong> {selectedContract.statut}</p>
              </div>
            )}

            {contractMonths.length > 0 && (
              <div className="calendar-section2">
                {/* Month Navigation */}
                <div className="month-navigation2">
                  {contractMonths.map((month, index) => (
                    <button
                      key={index}
                      className={`month-button ${index === selectedMonthIndex ? 'active' : ''}`}
                      onClick={() => setSelectedMonthIndex(index)}
                    >
                      {month.label}
                    </button>
                  ))}
                </div>

                {/* Calendar Header */}
                {selectedMonth && (
                  <div className="calendar-container2">
                    <div className="calendar-header2">
                      Fiche horaire de {selectedMonth.fullLabel}
                    </div>

                    {/* Calendar Table */}
                    <div className="calendar-table2">
                      <div className="calendar-header-row2">
                        <div className="header-cell2">Dates</div>
                        <div className="header-cell2">Statut</div>
                        <div className="header-cell2">Catégorisation</div>
                        <div className="header-cell2">Début</div>
                        <div className="header-cell2">Fin</div>
                        <div className="header-cell2">Pause</div>
                        <div className="header-cell2">Total</div>
                      </div>

                      {calendarDays.map((day) => (
                        <div 
                          key={day.fullDate} 
                          className={`calendar-row2 ${day.isWeekend ? 'weekend' : ''}`}
                        >
                          <div className="day-cell2">
                            <div className="day-name2">{day.dayName} {day.day}</div>
                          </div>
                          <div className="action-cell2">
                            {!day.isWeekend && (
                              <>
                                <select className="action-button2">Statut
                                  <option value="">--- Sélectionner une catégorie ---</option>
                                  <option value="Présent">Présent</option>
                                  <option value="Modification">Modification</option>
                                  <option value="Récupération">Récupération</option>
                                  <option value="Congés">Congés</option>
                                  <option value="Santé">Santé</option>
                                  <option value="Autres">Autres</option>
                                </select>
                              </>
                            )}
                          </div>
                          <div className="action-cell2">
                          </div>
                          <div className="time-cell2">
                            {!day.isWeekend && "9:00"}
                          </div>
                          <div className="time-cell2">
                            {!day.isWeekend && "15:30"}
                          </div>
                          <div className="time-cell2">
                            {!day.isWeekend && "5:00"}
                          </div>
                          <div className="total-cell2">
                            {!day.isWeekend && "5:30"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          !loadingContracts && <p>Aucun contrat trouvé pour cet utilisateur.</p>
        )}
      </div>
    </BasePage>
  );
}