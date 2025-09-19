import React, { useState } from "react";
import "../styles/homeCalendar.css";

const WeekCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Utils
  const isSameDate = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const startOfWeek = (date) => {
    const d = new Date(date);
    const day = (d.getDay() + 6) % 7; // lundi=0
    d.setDate(d.getDate() - day);
    return d;
  };

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

  const goToToday = () => setCurrentDate(new Date());

  // Rendu vertical semaine
  const renderWeek = () => {
    const start = startOfWeek(currentDate);
    const days = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);

      const isToday = isSameDate(d, new Date()) ? "wc-today" : "";
      const isSelected =
        selectedDate && isSameDate(d, selectedDate) ? "wc-selected" : "";

      days.push(
        <div
          key={d.toISOString()}
          className={`wc-day-cell ${isToday} ${isSelected}`}
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

  return (
    <div className="wc-container">
      <div className="wc-header">
        <button onClick={previousWeek} className="wc-nav-btn">‹</button>
        <div className="wc-week-label">
          Semaine du {startOfWeek(currentDate).toLocaleDateString()}
        </div>
        <button onClick={nextWeek} className="wc-nav-btn">›</button>
      </div>

      <div className="wc-controls">
        <button onClick={goToToday} className="wc-control-btn">Aujourd’hui</button>
      </div>

      <div className="wc-grid-vertical">
        {renderWeek()}
      </div>

      <div className="wc-events">
        {selectedDate ? (
          <p>
            📅 Événements pour le {selectedDate.toLocaleDateString()}
          </p>
        ) : (
          <p>Sélectionne un jour</p>
        )}
      </div>
    </div>
  );
};

export default WeekCalendar;
