import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Création du contexte
const HolidaysContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useHolidays = () => {
  const context = useContext(HolidaysContext);
  if (!context) {
    throw new Error('useHolidays doit être utilisé dans un HolidaysProvider');
  }
  return context;
};

// Utilitaires de date
const parseDateYYYYMMDD = (s) => {
  if (!s) return null;
  const m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
};

const getDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getPreviousAndNextSchoolYearForApi = () => {
  const now = new Date();
  const year = now.getFullYear();
  return "&refine=annee_scolaire:" + String(year-1) + "-" + String(year) + 
         "&refine=annee_scolaire:" + String(year) + "-" + String(year+1) + 
         "&refine=annee_scolaire:" + String(year+1) + "-" + String(year+2);
};

// Provider component
export const HolidaysProvider = ({ children, location = 'Nice' }) => {
  const [holidays, setHolidays] = useState({});
  const [schoolVacations, setSchoolVacations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fonction pour récupérer les jours fériés
  const fetchHolidays = useCallback(async (year) => {
    try {
      const response = await fetch(`https://calendrier.api.gouv.fr/jours-feries/metropole/${year}.json`);
      console.log(`Fetching holidays for year ${year} from https://calendrier.api.gouv.fr/jours-feries/metropole/${year}.json`);
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(`Jours fériés récupérés pour ${year}:`, data);
      return data;
    } catch (err) {
      console.error(`Erreur lors de la récupération des jours fériés pour ${year}:`, err);
      return {};
    }
  }, []);

  // Fonction pour récupérer les vacances scolaires
  const fetchSchoolVacations = useCallback(async ( locationParam = location) => {
    const build_url = getPreviousAndNextSchoolYearForApi();
    const url = `https://data.education.gouv.fr/api/explore/v2.0/catalog/datasets/fr-en-calendrier-scolaire/exports/json?limit=-1${build_url}&refine=location:${locationParam}&timezone=UTC&use_labels=false&compressed=false&epsg=4326`;
    
    console.log("Fetching school vacations from URL:", url);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Vacances scolaires RAW:", data);
      return data;
    } catch (err) {
      console.error('Erreur lors de la récupération des vacances scolaires:', err);
      return [];
    }
  }, [location]);

  // Initialiser les données
  const initializeData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const currentYear = new Date().getFullYear();
      
      // Récupérer les jours fériés pour 3 années (passée, actuelle, suivante)
      const [lastYear, thisYear, nextYear, vacations] = await Promise.all([
        fetchHolidays(currentYear - 1),
        fetchHolidays(currentYear),
        fetchHolidays(currentYear + 1),
        fetchSchoolVacations()
      ]);

      // Fusionner tous les jours fériés
      setHolidays({
        ...lastYear,
        ...thisYear,
        ...nextYear
      });

      setSchoolVacations(vacations);
    } catch (err) {
      console.error('Erreur lors de l\'initialisation des données:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchHolidays, fetchSchoolVacations]);

  // Charger les données au montage du composant
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Recharger les vacances scolaires quand la zone change

  // Fonctions utilitaires pour vérifier les dates
  const isHoliday = useCallback((date) => {
    const isoDate = date.toISOString().split('T')[0];
    return holidays[isoDate] !== undefined;
  }, [holidays]);

  const getHolidayName = useCallback((date) => {
    const isoDate = date.toISOString().split('T')[0];
    return holidays[isoDate] || null;
  }, [holidays]);

  const isSchoolVacation = useCallback((date) => {
    const dateKey = getDateKey(date);
    return schoolVacations.some(vacation => {
      const fields = vacation.fields || vacation;
      const startDate = parseDateYYYYMMDD(fields.date_debut || vacation.start_date);
      const endDate = parseDateYYYYMMDD(fields.date_fin || vacation.end_date);
      
      if (!startDate || !endDate) return false;
      
      return date >= startDate && date <= endDate;
    });
  }, [schoolVacations]);

  const getSchoolVacationName = useCallback((date) => {
    for (const vacation of schoolVacations) {
      const fields = vacation.fields || vacation;
      const startDate = parseDateYYYYMMDD(fields.date_debut || vacation.start_date);
      const endDate = parseDateYYYYMMDD(fields.date_fin || vacation.end_date);
      
      if (!startDate || !endDate) continue;
      
      if (date >= startDate && date <= endDate) {
        return fields.description || vacation.description || 'Vacances scolaires';
      }
    }
    return null;
  }, [schoolVacations]);

  // Générer les événements pour intégration dans un calendrier
  const generateHolidayEvents = useCallback(() => {
    const events = {};
    
    Object.entries(holidays).forEach(([dateStr, holidayName]) => {
      const date = new Date(dateStr);
      const dateKey = getDateKey(date);
      
      if (!events[dateKey]) events[dateKey] = [];
      events[dateKey].push({
        text: holidayName,
        id: `holiday_${dateStr}`,
        type: 'holiday',
        meta: { isHoliday: true }
      });
    });
    
    return events;
  }, [holidays]);

  const generateSchoolVacationEvents = useCallback(() => {
    const events = {};
    
    schoolVacations.forEach(vacation => {
      const fields = vacation.fields || vacation;
      const startDate = parseDateYYYYMMDD(fields.date_debut || vacation.start_date);
      const endDate = parseDateYYYYMMDD(fields.date_fin || vacation.end_date);
      const description = fields.description || vacation.description || 'Vacances scolaires';
      const recordId = vacation.recordid || vacation.id;

      if (!startDate || !endDate) return;

      const cur = new Date(startDate);
      while (cur <= endDate) {
        const dateKey = getDateKey(cur);
        if (!events[dateKey]) events[dateKey] = [];

        events[dateKey].push({
          text: description,
          id: `school_${recordId}_${cur.getTime()}`,
          type: 'school_vacation',
          meta: { 
            isSchoolVacation: true, 
            zone: fields.zones || vacation.zones || null 
          }
        });

        cur.setDate(cur.getDate() + 1);
      }
    });
    
    return events;
  }, [schoolVacations]);

  const value = {
    // État
    holidays,
    schoolVacations,
    loading,
    error,
    
    // Actions
    initializeData,
    
    // Fonctions utilitaires
    isHoliday,
    getHolidayName,
    isSchoolVacation,
    getSchoolVacationName,
    
    // Générateurs d'événements
    generateHolidayEvents,
    generateSchoolVacationEvents,
    
    // Constantes utiles
  };

  return (
    <HolidaysContext.Provider value={value}>
      {children}
    </HolidaysContext.Provider>
  );
};