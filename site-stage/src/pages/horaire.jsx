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

  // Each entry: { statut, categorie, start, end, pause }
  const [timeEntries, setTimeEntries] = useState({});

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
      setSelectedContract(activeContracts[0] || data[0] || null);
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
        label: new Intl.DateTimeFormat("fr-FR", { month: "short", year: "2-digit" }).format(current),
        fullLabel: new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(current),
      });
      current.setMonth(current.getMonth() + 1);
    }
    return months;
  };

  const generateCalendarDays = (selectedMonth, contract) => {
    if (!selectedMonth || !contract) return [];
    const year = selectedMonth.date.getFullYear();
    const month = selectedMonth.date.getMonth();
    const contractStart = new Date(contract.date_debut);
    const contractEnd = new Date(contract.date_fin);
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startDate = contractStart > firstDayOfMonth ? contractStart : firstDayOfMonth;
    const endDate = contractEnd < lastDayOfMonth ? contractEnd : lastDayOfMonth;

    const days = [];
    for (let day = startDate.getDate(); day <= endDate.getDate(); day++) {
      const currentDate = new Date(year, month, day);
      const dayOfWeek = currentDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
      days.push({
        date: currentDate,
        day,
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
      [date]: { ...prev[date], statut: value, categorie: "" },
    }));
  };

  const handleCategorieChange = (date, value) => {
    setTimeEntries((prev) => ({
      ...prev,
      [date]: { ...prev[date], categorie: value },
    }));
  };

  const handleTimeChange = (date, field, value) => {
    setTimeEntries((prev) => ({
      ...prev,
      [date]: { ...prev[date], [field]: value },
    }));
  };

  const timeToMinutes = (t) => {
    if (!t) return 0;
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const minutesToTime = (min) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  const calculateTotal = (start, end, pause) => {
    const total = Math.max(timeToMinutes(end) - timeToMinutes(start) - timeToMinutes(pause), 0);
    return minutesToTime(total);
  };

  const renderTimeOptions = () =>
    Array.from({ length: 24 }, (_, hour) =>
      [0, 15, 30, 45].map((minute) => {
        const h = hour.toString().padStart(2, "0");
        const m = minute.toString().padStart(2, "0");
        return (
          <option key={`${h}:${m}`} value={`${h}:${m}`}>
            {`${h}:${m}`}
          </option>
        );
      })
    ).flat();

  const contractMonths = selectedContract ? getContractMonths(selectedContract) : [];
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

                {selectedMonth && (
                  <div className="calendar-container2">
                    <div className="calendar-header2">
                      Fiche horaire de {selectedMonth.fullLabel}
                    </div>

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
                          start: "09:00",
                          end: "17:30",
                          pause: "00:30",
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

                            <div className="time-cell2">{!day.isWeekend && "5:00"}</div>

                            <div className="action-cell2">
                              {!day.isWeekend && (
                                <select
                                  className="action-button2"
                                  value={entry.statut}
                                  onChange={(e) =>
                                    handleStatutChange(day.fullDate, e.target.value)
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
                                    handleCategorieChange(day.fullDate, e.target.value)
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
                              {!day.isWeekend && (
                                <select
                                  className="time-picker"
                                  value={entry.start}
                                  onChange={(e) =>
                                    handleTimeChange(day.fullDate, "start", e.target.value)
                                  }
                                >
                                  {renderTimeOptions()}
                                </select>
                              )}
                            </div>

                            <div className="time-cell2">
                              {!day.isWeekend && (
                                <select
                                  className="time-picker"
                                  value={entry.end}
                                  onChange={(e) =>
                                    handleTimeChange(day.fullDate, "end", e.target.value)
                                  }
                                >
                                  {renderTimeOptions()}
                                </select>
                              )}
                            </div>

                            <div className="time-cell2">
                              {!day.isWeekend && (
                                <select
                                  className="time-picker"
                                  value={entry.pause}
                                  onChange={(e) =>
                                    handleTimeChange(day.fullDate, "pause", e.target.value)
                                  }
                                >
                                  {renderTimeOptions()}
                                </select>
                              )}
                            </div>

                            <div className="total-cell2">
                              {!day.isWeekend &&
                                calculateTotal(entry.start, entry.end, entry.pause)}
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
          !loadingContracts && <p>Aucun contrat trouvé pour cet utilisateur.</p>
        )}
      </div>
    </BasePage>
  );
}
