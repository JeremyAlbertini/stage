import React, { useState, useEffect } from "react";
import "../styles/homeCalendar.css";
import { useHolidays } from "../context/HolidaysProvider.jsx";
import { useApi } from "../hooks/useApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import { NavLink } from "react-router-dom";

const WeekCalendar = () => {
  const {
    holidays,
    schoolVacations,
    loading: holidaysLoading,
    error: holidaysError,
    isHoliday,
    isSchoolVacation,
    generateHolidayEvents,
    generateSchoolVacationEvents,
  } = useHolidays();
  const { user } = useAuth();
  const user_id = user?.id;
  const api = useApi();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});
  const [userLeaves, setUserLeaves] = useState([]);

  // === utils ===
  const isSameDate = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const getDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const startOfWeek = (date) => {
    const d = new Date(date);
    const day = (d.getDay() + 6) % 7; // lundi = 0
    d.setDate(d.getDate() - day);
    return d;
  };

  // === API : chargement congés utilisateur ===
  useEffect(() => {
    if (!user_id) return; // on ne lance rien tant qu'on n'a pas l'user

    const fetchUserLeaves = async () => {
      try {
        const response = await api.get(
          `http://localhost:5000/api/conges/${String(user_id)}`
        );
        if (Array.isArray(response)) {
          setUserLeaves(response);
        } else {
          setUserLeaves([]);
        }
      } catch (err) {
        console.error("Erreur chargement congés:", err);
        setUserLeaves([]);
      }
    };

    fetchUserLeaves();
  }, []);

  // === intégration jours fériés ===
  useEffect(() => {
    if (Object.keys(holidays).length === 0) return;
    const holidayEvents = generateHolidayEvents();

    setEvents((prev) => {
      const newEvents = { ...prev };
      Object.keys(newEvents).forEach((key) => {
        newEvents[key] = newEvents[key].filter((ev) => ev.type !== "holiday");
        if (newEvents[key].length === 0) delete newEvents[key];
      });
      Object.keys(holidayEvents).forEach((key) => {
        if (!newEvents[key]) newEvents[key] = [];
        newEvents[key].push(...holidayEvents[key]);
      });
      return newEvents;
    });
  }, [holidays, generateHolidayEvents]);

  // === intégration vacances scolaires ===
  useEffect(() => {
    const schoolEvents = generateSchoolVacationEvents();

    setEvents((prev) => {
      const newEvents = { ...prev };
      Object.keys(newEvents).forEach((key) => {
        newEvents[key] = newEvents[key].filter(
          (ev) => ev.type !== "school_vacation"
        );
        if (newEvents[key].length === 0) delete newEvents[key];
      });
      Object.keys(schoolEvents).forEach((key) => {
        if (!newEvents[key]) newEvents[key] = [];
        newEvents[key].push(...schoolEvents[key]);
      });
      return newEvents;
    });
  }, [schoolVacations, generateSchoolVacationEvents]);

  // === intégration congés utilisateur ===
  const parseDateFromAPI = (value) => {
    if (!value) return null;
    return new Date(value);
  };

  useEffect(() => {
    if (!Array.isArray(userLeaves) || userLeaves.length === 0) return;

    setEvents((prev) => {
      const newEvents = { ...prev };

      // Supprimer anciens congés API
      Object.keys(newEvents).forEach((key) => {
        newEvents[key] = newEvents[key].filter(
          (ev) => !(ev.type === "vacation" && ev.meta?.apiId)
        );
        if (newEvents[key].length === 0) delete newEvents[key];
      });

      // Ajouter congés API
      userLeaves.forEach((leave) => {
        const start = parseDateFromAPI(leave.date_debut);
        const end = parseDateFromAPI(leave.date_fin);
        if (!start || !end) return;

        const cur = new Date(start);
        while (cur <= end) {
          const key = getDateKey(cur);
          if (!newEvents[key]) newEvents[key] = [];

          const exists = newEvents[key].find(
            (ev) => ev.type === "vacation" && ev.meta?.apiId === leave.id
          );
          if (!exists) {
            newEvents[key].push({
              text: leave.type_conge || leave.type || "Congé",
              id: `leave_${leave.id}_${cur.getTime()}`,
              type: "vacation",
              meta: { apiId: leave.id },
            });
          }

          cur.setDate(cur.getDate() + 1);
        }
      });

      return newEvents;
    });
  }, [userLeaves]);

  // === navigation semaine ===
  const nextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  };

  const previousWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // === helpers ===
  const hasEvent = (date) => {
    if (isHoliday(date) || isSchoolVacation(date)) return false;
    const key = getDateKey(date);
    return events[key] && events[key].length > 0;
  };

  // === rendu semaine ===
  const renderWeek = () => {
    const start = startOfWeek(currentDate);
    const days = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);

      const isToday = isSameDate(d, new Date()) ? "wc-today" : "";
      const isSelected =
        selectedDate && isSameDate(d, selectedDate) ? "wc-selected" : "";
      const isWeekend = i === 5 || i === 6 ? "weekend" : "";

      days.push(
        <div
          key={d.toISOString()}
          className={`wc-day-cell ${isToday} ${isSelected} ${isWeekend} ${
            isHoliday(d) ? "holiday" : ""
          } ${isSchoolVacation(d) ? "school_vacation" : ""} ${
            hasEvent(d) ? "vacation" : ""
          }`}
          
          onClick={() => setSelectedDate(d)}
        >
          <div className="wc-day-number">{d.getDate()}</div>
          <div className="wc-day-label">
            {d.toLocaleDateString("fr-FR", { weekday: "long" })}
          </div>
        </div>
      );
    }

    return days;
  };

  // === rendu événements du jour ===
  const renderEventsForDay = () => {
    if (!selectedDate) return <p>Sélectionne un jour</p>;

    const key = getDateKey(selectedDate);
    const dayEvents = events[key] || [];

    if (dayEvents.length === 0) {
      return <p>Aucun événement pour ce jour</p>;
    }

    return (
      <ul>
        {dayEvents.map((ev) => (
            <li key={ev.id} className={`wc-event-item ${ev.type}`}>
            <span className="wc-event-dot" /> {ev.text} <em>({ev.type})</em>
            </li>

        ))}
      </ul>
    );
  };

  if (holidaysLoading) {
    return <p>Chargement des données...</p>;
  }

  if (holidaysError) {
    return <p style={{ color: "red" }}>Erreur: {holidaysError}</p>;
  }

  return (
    <>

        <div className="wc-container">
        <div>
            <NavLink to={"/calendar"}> Aller au calendrier</NavLink>
        </div>
        <div className="wc-header">
            <button onClick={previousWeek} className="wc-nav-btn">‹</button>
            <div className="wc-week-label">
                Semaine du {startOfWeek(currentDate).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })}
            </div>

            <button onClick={nextWeek} className="wc-nav-btn">›</button>
        </div>

        <div className="wc-controls">
            <button onClick={goToToday} className="wc-control-btn">Aujourd’hui</button>
        </div>

        <div className="wc-grid-vertical">{renderWeek()}</div>

        <div className="wc-events">{renderEventsForDay()}</div>
        </div>
    </>
  );
};

export default WeekCalendar;
