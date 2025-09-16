import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import BasePage from "../components/BasePage";
import { useAuth } from "../context/AuthContext";
import "../styles/horaire.css";

export default function Horaire() {
  const { user, loading } = useAuth();
  const api = useApi();
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [loadingContracts, setLoadingContracts] = useState(false);
  const [error, setError] = useState("");
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);

  // Each entry: { date, statut, categorie }
  const [timeEntries, setTimeEntries] = useState({});

  // Map Statut → Catégorisation choices
  const optionsMap = {
    Présent: ["Présent", "Récupération", "Récupération A-1"],
    Modification: ["Arrivée Modifiée - Accord Coordination", "Départ Modifiée - Accord Coordination", "Remplacement Direction",
      "Arrivée Retard", "Ouverture Structure (SMA, Réunion...)", "Réunion", "Association", "Evènementiel", "Journée de Préparation",
      "Férié Travaillé", "Retard Parents", "Retard Bus", "RDV Médical Perso", "RDV Médical du Travail", "TT - Temps Thérapeutique", "Divers"],
    Récupération: [],
    Congés: ["CA - Congé Annuel", "RCA - Reliquat Congé Annuel", "CF - Congé Fractionné", "JS - Jour de Sujétion", "MAT - Congé Maternité",
      "PAT - Congé Paternité", "PAR - Congé Parental", "CET", "EX - Journée Exceptionnelle"],
    Santé: ["MAL - Arrêt Maladie", "AT - Accident du Travail", "ALD - Absence Longue Durée", "EMA - Absence Enfant Malade"],
    Autres: ["FORM - Formation", "CCR - Concours", "OFF - Journée Off", "DISP - Disponibilité", "MAD - Mise à Disposition", "GRV - Grève",
      "MAP - Mise à Pied", "ABI - Absence Injustifiée"],
  };

  useEffect(() => {
    if (user?.matricule) {
      fetchContracts(user.matricule);
    }
  }, [user?.matricule]);

  const fetchContracts = async (matricule) => {
    setLoadingContracts(true);
    setError("");
    try {
      const res = await api.get(`http://localhost:5000/contrats/${matricule}`);
      const data = await res;
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
          year: "2-digit",
        }).format(current),
        fullLabel: new Intl.DateTimeFormat("fr-FR", {
          month: "long",
          year: "numeric",
        }).format(current),
      });
      current.setMonth(current.getMonth() + 1);
    }

    return months;
  };

  const generateCalendarDays = (selectedMonth, contract) => {
    if (!selectedMonth || !contract) return [];

    const year = selectedMonth.date.getFullYear();
    const month = selectedMonth.date.getMonth();

    // Get contract dates
    const contractStart = new Date(contract.date_debut);
    const contractEnd = new Date(contract.date_fin);

    // Get the first and last day of the current month
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Determine the actual start and end dates for this month
    const startDate = contractStart > firstDayOfMonth ? contractStart : firstDayOfMonth;
    const endDate = contractEnd < lastDayOfMonth ? contractEnd : lastDayOfMonth;

    const days = [];

    // Generate days only within the contract period
    for (let day = startDate.getDate(); day <= endDate.getDate(); day++) {
      const currentDate = new Date(year, month, day);

      // Skip if the date is outside contract bounds
      if (currentDate < contractStart || currentDate > contractEnd) {
        continue;
      }

      const dayOfWeek = currentDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      const dayNames = ["Dimanche", "Lundi",  "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

      days.push({
        date: currentDate,
        day: day,
        dayName: dayNames[dayOfWeek],
        isWeekend,
        fullDate: currentDate.toISOString().split("T")[0],
      });
    }

    return days;
  };

  const handleStatutChange = (date, value) => {
    setTimeEntries((prev) => ({
      ...prev,
      [date]: { statut: value, categorie: "" }, // reset categorie on change
    }));
  };

  const handleCategorieChange = (date, value) => {
    setTimeEntries((prev) => ({
      ...prev,
      [date]: { ...prev[date], categorie: value },
    }));
  };

  const contractMonths = selectedContract
    ? getContractMonths(selectedContract)
    : [];
  const selectedMonth = contractMonths[selectedMonthIndex];
  const calendarDays = generateCalendarDays(selectedMonth, selectedContract);

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
                    {c.type_contrat} ({formatDate(c.date_debut)} →{" "}
                    {formatDate(c.date_fin)}) {c.statut === "Actif" ? "⭐" : ""}
                  </option>
                ))}
              </select>
            </label>

            {selectedContract && (
              <div className="contract-details2">
                <p>
                  <strong>Date de début:</strong>{" "}
                  {formatDate(selectedContract.date_debut)}
                </p>
                <p>
                  <strong>Date de fin:</strong>{" "}
                  {formatDate(selectedContract.date_fin)}
                </p>
                <p>
                  <strong>Durée (jours):</strong>{" "}
                  {selectedContract.duree_contrat}
                </p>
                <p>
                  <strong>Statut:</strong> {selectedContract.statut}
                </p>
              </div>
            )}

            {contractMonths.length > 0 && (
              <div className="calendar-section2">
                {/* Month Navigation */}
                <div className="month-navigation2">
                  {contractMonths.map((month, index) => (
                    <button
                      key={index}
                      className={`month-button ${
                        index === selectedMonthIndex ? "active" : ""
                      }`}
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
                        <div className="header-cell2">Horaire Prévisionel</div>
                        <div className="header-cell2">Statut</div>
                        <div className="header-cell2">Catégorisation</div>
                        <div className="header-cell2">Début</div>
                        <div className="header-cell2">Fin</div>
                        <div className="header-cell2">Pause</div>
                        <div className="header-cell2">Total</div>
                      </div>

                      {calendarDays.map((day) => {
                        const entry = timeEntries[day.fullDate] || {
                          statut: "",
                          categorie: "",
                        };
                        return (
                          <div
                            key={day.fullDate}
                            className={`calendar-row2 ${
                              day.isWeekend ? "weekend" : ""
                            }`}
                          >
                            <div className="day-cell2">
                              <div className="day-name2">
                                {day.dayName} {day.day}
                              </div>
                            </div>
                            <div className="time-cell2">
                              {!day.isWeekend && "5:00"}
                            </div>
                            <div className="action-cell2">
                              {!day.isWeekend && (
                                <select
                                  className="action-button2"
                                  value={entry.statut}
                                  onChange={(e) =>
                                    handleStatutChange(
                                      day.fullDate,
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="">
                                    --- Sélectionner un statut ---
                                  </option>
                                  {Object.keys(optionsMap).map((s) => (
                                    <option key={s} value={s}>
                                      {s}
                                    </option>
                                  ))}
                                </select>
                              )}
                            </div>
                            <div className="action-cell2">
                              {!day.isWeekend && (
                                <select
                                  className="action-button2"
                                  value={entry.categorie}
                                  onChange={(e) =>
                                    handleCategorieChange(
                                      day.fullDate,
                                      e.target.value
                                    )
                                  }
                                  disabled={!entry.statut}
                                >
                                  <option value="">
                                    --- Sélectionner une catégorie ---
                                  </option>
                                  {entry.statut &&
                                    optionsMap[entry.statut].map((opt) => (
                                      <option key={opt} value={opt}>
                                        {opt}
                                      </option>
                                    ))}
                                </select>
                              )}
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
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          !loadingContracts && (
            <p>Aucun contrat trouvé pour cet utilisateur.</p>
          )
        )}
      </div>
    </BasePage>
  );
}
