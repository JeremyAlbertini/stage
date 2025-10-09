import { useState, useEffect, useCallback } from "react";
import "../styles/previ.css";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";
import { useHolidays } from "../context/HolidaysProvider";

export default function PrevisualisationHoraire() {
    const [agentName, setAgentName] = useState('');
    const [startDate, setStartDate] = useState('01/01/2024');
    const [endDate, setEndDate] = useState('31/12/2024');
    const [contracts, setContracts] = useState([]);
    const [selectedContract, setSelectedContract] = useState(null);
    const { user, loading } = useAuth();
    const [loadingContracts, setLoadingContracts] = useState(false);
    const [CA, setCA] = useState(0);
    const [CF, setCF] = useState(0);
    const [JS, setJS] = useState(0);
    const [RCA, setRCA] = useState(0);
    const [userLeaves, setUserLeaves] = useState({});
    const api = useApi();
    const {
        holidays,
        schoolVacations,
        loading: holidaysLoading,
        error: holidaysError,
        isHoliday,
        getHolidayName,
        isSchoolVacation,
        getSchoolVacationName,
        generateHolidayEvents,
        generateSchoolVacationEvents,
    } = useHolidays();

    const fetchUserLeaves = useCallback(async () => {
        try {
            const response = await api.get(`http://localhost:5000/api/conges/${user?.id}`);
            console.log("Fetching user leaves from /api/conges/", user?.id, response);
        
            const data = await response;
            console.log("Réponse API /api/conges :", data);

            if (Array.isArray(data)) {
                console.log("Congés utilisateur récupérés:", data);
                setUserLeaves(data);
            } else {
                console.error("La réponse n'est pas un tableau :", data);
                setUserLeaves([]);
            }
        } catch (err) {
            console.error("Erreur lors de la récupération des congés:", err);
            setUserLeaves([]);
        }
    }, [api, user?.id]);

    useEffect(() => {
        console.log("azzz", holidays, schoolVacations);
    }, [holidays, schoolVacations]);

    useEffect(() => {
        if (user?.matricule) {
            fetchContracts(user.matricule);
        }
    }, [user?.matricule]);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(date);
    };

    useEffect(() => {
        console.log("non", selectedContract);
        if (!selectedContract) return;
        setStartDate(formatDate(selectedContract.date_debut));
        setEndDate(formatDate(selectedContract.date_fin));
        setAgentName(selectedContract.matricule);
        setCA(selectedContract.ca);
        setCF(selectedContract.cf);
        setJS(selectedContract.js);
        setRCA(selectedContract.rca);
    }, [selectedContract]);

    const fetchContracts = async (matricule) => {
        setLoadingContracts(true);
        try {
            const res = await api.get(`http://localhost:5000/contrats/${matricule}`);
            const data = await res;
            setContracts(data);
    
            const activeContracts = data.filter((c) => c.statut === "Actif");
            setSelectedContract(activeContracts[0] || data[0] || null);
        } catch (err) {
            console.error("Error fetching contracts:", err);
        } finally {
            setLoadingContracts(false);
        }
    };

    // Fonction pour parser une date au format DD/MM/YYYY
    const parseDate = (dateStr) => {
        const [day, month, year] = dateStr.split('/');
        return new Date(year, month - 1, day);
    };

    // Fonction pour formater une date en français
    const formatDateFr = (date) => {
        const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
        const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
        return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`;
    };

    // Fonction pour filtrer les vacances qui se chevauchent avec le contrat
    const getFilteredVacations = () => {
        if (!startDate || !endDate || !schoolVacations) return {};
        
        const contractStart = parseDate(startDate);
        const contractEnd = parseDate(endDate);
        
        const filteredByYear = {};
        
        schoolVacations.forEach(vacation => {
            const vacationStart = new Date(vacation.start_date);
            const vacationEnd = new Date(vacation.end_date);
            
            // Vérifier si la vacation chevauche la période du contrat
            if (vacationEnd >= contractStart && vacationStart <= contractEnd) {
                const year = vacationStart.getFullYear();
                
                if (!filteredByYear[year]) {
                    filteredByYear[year] = {};
                }
                
                filteredByYear[year][vacation.description] = {
                    debut: formatDateFr(vacationStart),
                    fin: formatDateFr(vacationEnd),
                    faux: vacationEnd < new Date(),
                    vrai: vacationEnd >= new Date()
                };
            }
        });
        console.log(filteredByYear);
        return filteredByYear;
    };

    // Fonction pour filtrer les jours fériés qui se chevauchent avec le contrat
    const getFilteredHolidays = () => {
        if (!startDate || !endDate || !holidays) return {};
        
        const contractStart = parseDate(startDate);
        const contractEnd = parseDate(endDate);
        
        const filteredByYear = {};
        
        Object.entries(holidays).forEach(([dateKey, holidayName]) => {
            const holidayDate = new Date(dateKey);
            
            // Vérifier si le jour férié est dans la période du contrat
            if (holidayDate >= contractStart && holidayDate <= contractEnd) {
                const year = holidayDate.getFullYear();
                
                if (!filteredByYear[year]) {
                    filteredByYear[year] = {};
                }
                
                const day = String(holidayDate.getDate()).padStart(2, '0');
                const month = String(holidayDate.getMonth() + 1).padStart(2, '0');
                
                filteredByYear[year][holidayName] = `${day}/${month}/${year}`;
            }
        });
        
        return filteredByYear;
    };

    // Fonction pour vérifier si une date est pendant les vacances scolaires
    const isDateDuringVacation = (dateStr) => {
        if (!dateStr || !schoolVacations) return false;
        
        const [day, month, year] = dateStr.split('/');
        const checkDate = new Date(year, month - 1, day);
        
        return schoolVacations.some(vacation => {
            const vacationStart = new Date(vacation.start_date);
            const vacationEnd = new Date(vacation.end_date);
            return checkDate >= vacationStart && checkDate <= vacationEnd;
        });
    };

    // Fonction pour obtenir le statut d'un jour férié (VRAI si pendant vacances, FAUX sinon)
    const getHolidayStatus = (annee) => {
        const holidayNames = [
            '1er janvier',
            'Lundi de Pâques',
            '1er mai',
            '8 mai',
            'Ascension',
            'Lundi de Pentecôte',
            '14 juillet',
            'Assomption',
            'Toussaint',
            '11 novembre',
            'Jour de Noël'
        ];
        
        const alternativeNames = {
            '1er mai': 'Fête du Travail',
            '8 mai': 'Victoire de 1945',
            'Ascension': 'Jeudi de l\'Ascension',
            '14 juillet': 'Fête nationale',
            '11 novembre': 'Armistice',
            'Jour de Noël': 'Noël'
        };

        if (!joursFeries[annee]) return [];
        
        return holidayNames.map(name => {
            const altName = alternativeNames[name];
            const dateStr = joursFeries[annee][name] || joursFeries[annee][altName];
            
            if (!dateStr) return null; // Jour férié pas dans le contrat
            
            return isDateDuringVacation(dateStr);
        });
    };

    const vacancesData = getFilteredVacations();
    const joursFeries = getFilteredHolidays();

    // Données de test pour les heures de travail
    const workingHours = {
        heuresAEffectuer: '1607:00',
        congesAnnuels: CA,
        congesFractionnes: CF,
        joursSupplementaires: JS,
        reliquatRecuperation: '00:00',
        reliquatCongesAnnuels: RCA,
        compteEpargneTemps: '0'
    };

    return (
        <div className="contract-form-container">
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
            
            <div className="nom-header">
                {agentName}
            </div>

            <div className="contract-dates-section">
                <div className="dates-row">
                    <div className="date-column">
                        <div className="date-label">
                            Date de début de contrat :
                        </div>
                        <div className="date-input-container">
                            <input 
                                type="text" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="date-input"
                            />
                        </div>
                    </div>
                    
                    <div className="date-column">
                        <div className="date-label">
                            Date de fin de contrat :
                        </div>
                        <div className="date-input-container">
                            <input 
                                type="text" 
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="date-input"
                            />
                        </div>
                    </div>
                </div>

                <div className="hours-table">
                    <div className="hours-header-row">
                        <div className="hours-header-cell">HEURES A EFFECTUER</div>
                        <div className="hours-header-cell">CONGÉS ANNUELS</div>
                        <div className="hours-header-cell">CONGÉS FRACTIONNÉS</div>
                        <div className="hours-header-cell">JOURS SUPPLÉMENTAIRES</div>
                        <div className="hours-header-cell">RELIQUAT RÉCUPÉRATION</div>
                        <div className="hours-header-cell">RELIQUAT CONGÉS ANNUELS</div>
                        <div className="hours-header-cell">COMPTE EPARGNE-TEMPS</div>
                    </div>
                    <div className="hours-values-row">
                        <div className="hours-value-cell">{workingHours.heuresAEffectuer}</div>
                        <div className="hours-value-cell">{workingHours.congesAnnuels}</div>
                        <div className="hours-value-cell">{workingHours.congesFractionnes}</div>
                        <div className="hours-value-cell">{workingHours.joursSupplementaires}</div>
                        <div className="hours-value-cell">{workingHours.reliquatRecuperation}</div>
                        <div className="hours-value-cell">{workingHours.reliquatCongesAnnuels}</div>
                        <div className="hours-value-cell">{workingHours.compteEpargneTemps}</div>
                    </div>
                </div>
            </div>

            <div className="vacances-header">
                DATES DES VACANCES SCOLAIRES ET JOURS FÉRIÉS
            </div>

            <div className="vacances-section">
                {Object.entries(vacancesData).map(([annee, vacances]) => (
                    <div key={annee}>
                        <div className="year-header">{annee}</div>
                        {Object.entries(vacances).reverse().map(([nom, dates]) => (
                            <div key={nom} className="vacance-row">
                                <div className="vacance-cell vacance-name">{nom}</div>
                                <div className="vacance-cell vacance-date">{dates.debut}</div>
                                <div className="vacance-cell vacance-date">{dates.fin}</div>
                                <div className={`vacance-cell ${dates.faux ? 'status-faux' : ''}`}>
                                    {dates.faux ? 'FAUX' : ''}
                                </div>
                                <div className={`vacance-cell ${dates.faux ? 'status-faux' : ''}`}>
                                    {dates.faux ? 'FAUX' : ''}
                                </div>
                                <div className={`vacance-cell ${dates.vrai ? 'status-vrai' : ''}`}>
                                    {dates.vrai ? 'VRAI' : ''}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}

                <div className="jours-feries-section">
                    <div className="feries-header-row">
                        <div className="ferie-header-cell">Jour de l'an</div>
                        <div className="ferie-header-cell">Lundi de Pâques</div>
                        <div className="ferie-header-cell">Fête du Travail</div>
                        <div className="ferie-header-cell">Victoire de 1945</div>
                        <div className="ferie-header-cell">Jeudi de l'Ascension</div>
                        <div className="ferie-header-cell">Lundi de Pentecôte</div>
                        <div className="ferie-header-cell">Fête nationale</div>
                        <div className="ferie-header-cell">Assomption</div>
                        <div className="ferie-header-cell">Toussaint</div>
                        <div className="ferie-header-cell">Armistice</div>
                        <div className="ferie-header-cell">Noël</div>
                    </div>
                    
                    {Object.entries(joursFeries).map(([annee, jours]) => {
                        const holidayStatuses = getHolidayStatus(annee);
                        
                        return (
                            <div key={annee}>
                                <div className="year-label">{annee}</div>
                                <div className="feries-dates-row">
                                    <div className="ferie-date-cell">{jours['1er janvier']}</div>
                                    <div className="ferie-date-cell">{jours['Lundi de Pâques']}</div>
                                    <div className="ferie-date-cell">{jours['Fête du Travail'] || jours['1er mai']}</div>
                                    <div className="ferie-date-cell">{jours['Victoire de 1945'] || jours['8 mai']}</div>
                                    <div className="ferie-date-cell">{jours['Jeudi de l\'Ascension'] || jours['Ascension']}</div>
                                    <div className="ferie-date-cell">{jours['Lundi de Pentecôte']}</div>
                                    <div className="ferie-date-cell">{jours['Fête nationale'] || jours['14 juillet']}</div>
                                    <div className="ferie-date-cell">{jours['Assomption']}</div>
                                    <div className="ferie-date-cell">{jours['Toussaint']}</div>
                                    <div className="ferie-date-cell">{jours['Armistice'] || jours['11 novembre']}</div>
                                    <div className="ferie-date-cell">{jours['Noël'] || jours['Jour de Noël']}</div>
                                </div>
                                <div className="feries-status-row">
                                    {holidayStatuses.map((isVrai, index) => (
                                        <div 
                                            key={index} 
                                            className={`ferie-status-cell ${
                                                isVrai === null ? '' : 
                                                isVrai ? 'ferie-status-vrai' : 'ferie-status-faux'
                                            }`}
                                        >
                                            {isVrai === null ? '' : isVrai ? 'VRAI' : 'FAUX'}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}