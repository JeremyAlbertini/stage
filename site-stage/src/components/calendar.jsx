import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/calendar.css';
import BasePage from "./BasePage.jsx";
import { useHolidays } from '../context/HolidaysProvider.jsx';
import { useApi } from '../hooks/useApi.js';

const Calendar = ({user_id}) => {
  // Hook pour accéder aux données des jours fériés et vacances scolaires
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
  const api = useApi();

  // État du calendrier
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [events, setEvents] = useState({});
  const [showEventInput, setShowEventInput] = useState(false);
  const [eventText, setEventText] = useState('');
  const [eventType, setEventType] = useState('event');
  const [clickSelectionMode, setClickSelectionMode] = useState(false);
  const [firstSelectedDate, setFirstSelectedDate] = useState(null);
  const [userLeaves, setUserLeaves] = useState([]);

  const calendarRef = useRef(null);

  const months = [
    'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  // Types d'événements disponibles
  const eventTypes = [
    { value: 'event', label: 'Événement', color: '#74b9ff' },
    { value: 'vacation', label: 'Vacances', color: '#fd79a8' },
    { value: 'meeting', label: 'Réunion', color: '#fdcb6e' },
    { value: 'birthday', label: 'Anniversaire', color: '#e17055' },
    { value: 'holiday', label: 'Jour férié', color: '#00b894' },
    { value: 'work', label: 'Travail', color: '#6c5ce7' },
    { value: 'personal', label: 'Personnel', color: '#a29bfe' },
    { value: 'medical', label: 'Médical', color: '#ff7675' },
    { value: 'school_vacation', label: 'Vacances scolaires', color: '#fab1a0' }
  ];

  // Obtenir info d'un type
  const getEventTypeInfo = (type) => {
    return eventTypes.find(et => et.value === type) || eventTypes[0];
  };

  // Parse date renvoyée par l'API en "date locale" (ignore heure/UTC pour éviter les décalages)
  const parseDateFromAPI = (value) => {
    if (!value) return null;
    return new Date(value);
  };

  const fetchUserLeaves = useCallback(async () => {
    try {
      const response = await api.get(`http://localhost:5000/api/conges/${String(user_id)}`);
      console.log("Fetching user leaves from /api/conges/", user_id, response);
    
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
  }, []);

  // Initialiser les congés utilisateur
  useEffect(() => {
    fetchUserLeaves();
  }, [fetchUserLeaves]);

  // Intégrer les jours fériés dans les événements
  useEffect(() => {
    if (Object.keys(holidays).length === 0) return;

    const holidayEvents = generateHolidayEvents();
    
    setEvents(prevEvents => {
      const newEvents = { ...prevEvents };
      
      // Supprimer les anciens jours fériés
      Object.keys(newEvents).forEach(dateKey => {
        newEvents[dateKey] = newEvents[dateKey].filter(event => event.type !== 'holiday');
        if (newEvents[dateKey].length === 0) {
          delete newEvents[dateKey];
        }
      });
      
      // Ajouter les nouveaux jours fériés
      Object.keys(holidayEvents).forEach(dateKey => {
        if (!newEvents[dateKey]) newEvents[dateKey] = [];
        newEvents[dateKey].push(...holidayEvents[dateKey]);
      });

      return newEvents;
    });
  }, [holidays, generateHolidayEvents]);

  // Intégrer les vacances scolaires dans les événements
  useEffect(() => {
    console.log("Mise à jour des vacances scolaires dans events:", schoolVacations);
    
    const schoolEvents = generateSchoolVacationEvents();

    setEvents(prevEvents => {
      const newEvents = { ...prevEvents };
      
      // Supprimer les anciennes vacances scolaires
      Object.keys(newEvents).forEach(dateKey => {
        newEvents[dateKey] = newEvents[dateKey].filter(event => event.type !== 'school_vacation');
        if (newEvents[dateKey].length === 0) {
          delete newEvents[dateKey];
        }
      });
      
      // Ajouter les nouvelles vacances scolaires
      Object.keys(schoolEvents).forEach(dateKey => {
        if (!newEvents[dateKey]) newEvents[dateKey] = [];
        newEvents[dateKey].push(...schoolEvents[dateKey]);
      });

      return newEvents;
    });
  }, [schoolVacations, generateSchoolVacationEvents]);

  // Ajouter les congés utilisateur dans events
  useEffect(() => {
    console.log("Mise à jour des congés utilisateur dans events:", userLeaves);
    if (!Array.isArray(userLeaves) || userLeaves.length === 0) {
      // Supprimer les congés existants
      setEvents(prevEvents => {
        const newEvents = { ...prevEvents };
        Object.keys(newEvents).forEach(dateKey => {
          newEvents[dateKey] = newEvents[dateKey].filter(event => 
            !(event.type === 'vacation' && event.meta?.apiId)
          );
          if (newEvents[dateKey].length === 0) {
            delete newEvents[dateKey];
          }
        });
        return newEvents;
      });
      return;
    }
  
    setEvents(prevEvents => {
      const newEvents = { ...prevEvents };
      
      // Supprimer les anciens congés API
      Object.keys(newEvents).forEach(dateKey => {
        newEvents[dateKey] = newEvents[dateKey].filter(event => 
          !(event.type === 'vacation' && event.meta?.apiId)
        );
        if (newEvents[dateKey].length === 0) {
          delete newEvents[dateKey];
        }
      });
  
      // Ajouter les nouveaux congés
      userLeaves.forEach(leave => {
        const startDate = parseDateFromAPI(leave.date_debut);
        const endDate = parseDateFromAPI(leave.date_fin);
        if (!startDate || !endDate) return;
  
        const cur = new Date(startDate);
        while (cur <= endDate) {
          const dateKey = getDateKey(cur);
          if (!newEvents[dateKey]) newEvents[dateKey] = [];
  
          const existingLeave = newEvents[dateKey].find(event => 
            event.type === 'vacation' && event.meta?.apiId === leave.id
          );
  
          if (!existingLeave) {
            newEvents[dateKey].push({
              text: leave.type_conge || leave.type || 'Congé',
              id: `leave_${leave.id}_${cur.getTime()}`,
              type: 'vacation',
              meta: { apiId: leave.id }
            });
          }
  
          cur.setDate(cur.getDate() + 1);
        }
      });
  
      return newEvents;
    });
  }, [userLeaves]);

  // Empêcher sélection de texte & finir sélection au mouseup global
  useEffect(() => {
    const handleMouseUp = () => {
      if (isSelecting) finishSelection();
    };

    const handleSelectStart = (e) => {
      if (isSelecting) e.preventDefault();
    };

    document.addEventListener('mouseup', handleMouseUp);
    if (calendarRef.current) {
      calendarRef.current.addEventListener('selectstart', handleSelectStart);
    }

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      if (calendarRef.current) {
        calendarRef.current.removeEventListener('selectstart', handleSelectStart);
      }
    };
  }, [isSelecting]);

  // === utilitaires de date / key ===
  const getDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSameDate = (date1, date2) => {
    if (!date1 || !date2) return false;
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const isDateInRange = (date, start, end) => {
    if (!start || !end) return false;
    const time = date.getTime();
    return time >= start.getTime() && time <= end.getTime();
  };

  const isRangeStart = (date) => {
    return selectedRange.start && selectedRange.end &&
           isSameDate(date, selectedRange.start) &&
           !isSameDate(selectedRange.start, selectedRange.end);
  };

  const isRangeEnd = (date) => {
    return selectedRange.start && selectedRange.end &&
           isSameDate(date, selectedRange.end) &&
           !isSameDate(selectedRange.start, selectedRange.end);
  };

  const isRangeMiddle = (date) => {
    if (!selectedRange.start || !selectedRange.end) return false;
    if (isSameDate(selectedRange.start, selectedRange.end)) return false;
    return isDateInRange(date, selectedRange.start, selectedRange.end) &&
           !isSameDate(date, selectedRange.start) &&
           !isSameDate(date, selectedRange.end);
  };

  const isFirstSelected = (date) => {
    return firstSelectedDate && isSameDate(date, firstSelectedDate);
  };

  // === sélection par glisser / clic ===
  const startSelection = (date) => {
    setIsSelecting(true);
    setSelectionStart(new Date(date));
    setSelectedRange({ start: new Date(date), end: new Date(date) });
    setSelectedDate(new Date(date));
  };

  const updateSelection = (date) => {
    if (!isSelecting || !selectionStart) return;

    const startTime = selectionStart.getTime();
    const currentTime = date.getTime();

    if (currentTime >= startTime) {
      setSelectedRange({ start: new Date(selectionStart), end: new Date(date) });
    } else {
      setSelectedRange({ start: new Date(date), end: new Date(selectionStart) });
    }
  };

  const finishSelection = () => {
    setIsSelecting(false);
    setSelectionStart(null);
  };

  // Mode sélection par clic (deux clics pour choisir intervalle)
  const startClickSelection = () => {
    setClickSelectionMode(true);
    setFirstSelectedDate(null);
    setSelectedRange({ start: null, end: null });
    setSelectedDate(null);
  };

  const cancelClickSelection = () => {
    setClickSelectionMode(false);
    setFirstSelectedDate(null);
  };

  const handleDateClick = (date) => {
    if (clickSelectionMode) {
      if (!firstSelectedDate) {
        setFirstSelectedDate(new Date(date));
        setSelectedRange({ start: new Date(date), end: new Date(date) });
        setSelectedDate(new Date(date));
      } else {
        const start = new Date(firstSelectedDate);
        const end = new Date(date);
        if (start.getTime() > end.getTime()) {
          setSelectedRange({ start: end, end: start });
        } else {
          setSelectedRange({ start, end });
        }
        setClickSelectionMode(false);
        setFirstSelectedDate(null);
      }
    } else {
      setSelectedRange({ start: new Date(date), end: new Date(date) });
      setSelectedDate(new Date(date));
    }
  };

  // === gestion événements ===
  const hasEvent = (date) => {
    const dateKey = getDateKey(date);
    return events[dateKey] && events[dateKey].length > 0;
  };

  const getEventTypes = (date) => {
    const dateKey = getDateKey(date);
    if (events[dateKey] && events[dateKey].length > 0) {
      return [...new Set(events[dateKey].map(event => event.type))];
    }
    return [];
  };

  const saveEvent = () => {
    if (!selectedRange.start || !eventText.trim()) return;

    setEvents(prev => {
      const newEvents = { ...prev };
      const start = new Date(selectedRange.start);
      const end = new Date(selectedRange.end);
      const cur = new Date(start);

      while (cur <= end) {
        const key = getDateKey(cur);
        if (!newEvents[key]) newEvents[key] = [];
        newEvents[key].push({
          text: eventText.trim(),
          id: Date.now() + cur.getTime() + Math.floor(Math.random() * 1000),
          type: eventType
        });
        cur.setDate(cur.getDate() + 1);
      }

      return newEvents;
    });

    setShowEventInput(false);
    setEventText('');
    setEventType('event');
  };

  const deleteEvent = (dateKey, eventId) => {
    setEvents(prev => {
      const newEvents = { ...prev };
      if (newEvents[dateKey]) {
        newEvents[dateKey] = newEvents[dateKey].filter(ev => ev.id !== eventId);
        if (newEvents[dateKey].length === 0) delete newEvents[dateKey];
      }
      return newEvents;
    });
  };

  const deleteGroupedEvent = (eventIds, dateKeys) => {
    setEvents(prev => {
      const newEvents = { ...prev };
      eventIds.forEach((eid, idx) => {
        const dateKey = dateKeys[idx];
        if (!dateKey || !newEvents[dateKey]) return;
        newEvents[dateKey] = newEvents[dateKey].filter(ev => ev.id !== eid);
        if (newEvents[dateKey].length === 0) delete newEvents[dateKey];
      });
      return newEvents;
    });
  };

  const handleShowEventInput = () => {
    if (!selectedRange.start) return;
    setShowEventInput(true);
  };

  const hideEventInput = () => {
    setShowEventInput(false);
    setEventText('');
    setEventType('event');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveEvent();
    }
  };

  // === navigation mois / today ===
  const previousMonth = () => {
    const nd = new Date(currentDate);
    nd.setMonth(nd.getMonth() - 1);
    setCurrentDate(nd);
  };

  const nextMonth = () => {
    const nd = new Date(currentDate);
    nd.setMonth(nd.getMonth() + 1);
    setCurrentDate(nd);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
    setSelectedRange({ start: today, end: today });
    setClickSelectionMode(false);
    setFirstSelectedDate(null);
  };

  // === rendu calendrier ===
  const renderCalendar = () => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startDate = new Date(firstDay);
    const dayOfWeek = (firstDay.getDay() + 6) % 7; // Lundi = 0
    startDate.setDate(startDate.getDate() - dayOfWeek);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 34);

    const days = [];
    let currentDateIter = new Date(startDate);

    while (currentDateIter <= endDate) {
      const dateToSelect = new Date(currentDateIter);
      const dateKey = getDateKey(currentDateIter);
      const dayNumber = currentDateIter.getDate();

      const dayClasses = ['day-cell'];
      if (currentDateIter.getMonth() !== currentDate.getMonth()) dayClasses.push('other-month');
      if (isToday(currentDateIter)) dayClasses.push('today');
      if (isHoliday(currentDateIter)) dayClasses.push('holiday');
      if (isSchoolVacation(currentDateIter)) dayClasses.push('school-vacation');

      // selection classes
      if (selectedRange.start && isSameDate(currentDateIter, selectedRange.start) && isSameDate(selectedRange.start, selectedRange.end)) {
        dayClasses.push('selected');
      } else if (isRangeStart(currentDateIter)) {
        dayClasses.push('range-start');
      } else if (isRangeEnd(currentDateIter)) {
        dayClasses.push('range-end');
      } else if (isRangeMiddle(currentDateIter)) {
        dayClasses.push('range-middle');
      }

      if (isFirstSelected(currentDateIter)) dayClasses.push('first-selected');
      if (hasEvent(currentDateIter)) dayClasses.push('has-event');

      days.push(
        <div
          key={currentDateIter.getTime()}
          className={dayClasses.join(' ')}
          onMouseDown={(e) => {
            if (!clickSelectionMode) {
              e.preventDefault();
              startSelection(dateToSelect);
            }
          }}
          onMouseEnter={() => {
            if (isSelecting && !clickSelectionMode) updateSelection(dateToSelect);
          }}
          onMouseUp={() => {
            if (!clickSelectionMode) finishSelection();
          }}
          onClick={(e) => {
            e.preventDefault();
            if (!isSelecting) handleDateClick(dateToSelect);
          }}
        >
          <div className="day-number">{dayNumber}</div>
          {hasEvent(currentDateIter) && (
            <div className="event-indicators">
              {getEventTypes(currentDateIter).map(type => (
                type != 'school_vacation' && (
                <div
                  key={type}
                  className="event-dot"
                  style={{ backgroundColor: getEventTypeInfo(type).color }}
                  title={getEventTypeInfo(type).label}
                />)
              ))}
            </div>
          )}
        </div>
      );

      currentDateIter.setDate(currentDateIter.getDate() + 1);
    }

    return days;
  };

  // === rendu events pour la plage sélectionnée ===
  const renderEvents = () => {
    if (!selectedRange.start) {
      return (
        <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
          Sélectionne une date ou une plage pour voir les événements.
        </p>
      );
    }
  
    // collecter events entre start & end
    const allEvents = [];
    const start = new Date(selectedRange.start);
    const end = new Date(selectedRange.end);
    const cur = new Date(start);
  
    while (cur <= end) {
      const key = getDateKey(cur);
      const dateEvents = events[key] || [];
      dateEvents.forEach(ev => {
        allEvents.push({ ...ev, date: new Date(cur), dateKey: key });
      });
      cur.setDate(cur.getDate() + 1);
    }
  
    if (allEvents.length === 0) {
      const rangeText = isSameDate(selectedRange.start, selectedRange.end)
        ? selectedRange.start.toLocaleDateString()
        : `${selectedRange.start.toLocaleDateString()} - ${selectedRange.end.toLocaleDateString()}`;
  
      return (
        <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
          Aucun événement pour {rangeText}
        </p>
      );
    }
  
    // 🆕 DÉDUPLICATION + GROUPEMENT
    const groupedEvents = {};
  
    allEvents.forEach(ev => {
      const groupKey = `${ev.text}_${ev.type}`;
      const dateKey = ev.dateKey;
  
      if (!groupedEvents[groupKey]) {
        groupedEvents[groupKey] = {
          text: ev.text,
          type: ev.type,
          meta: ev.meta,
          dates: new Set(),   // objets Date
          eventIds: [],
          dateKeys: new Set()
        };
      }
  
      if (!groupedEvents[groupKey].dateKeys.has(dateKey)) {
        groupedEvents[groupKey].dates.add(ev.date); // garde en Date
        groupedEvents[groupKey].dateKeys.add(dateKey);
        groupedEvents[groupKey].eventIds.push(ev.id);
      }
    });
  
    // Convertir en arrays triées
    Object.values(groupedEvents).forEach(group => {
      group.dates = Array.from(group.dates).sort((a, b) => a - b);
      group.dateKeys = Array.from(group.dateKeys);
    });
  
    // Trier les groupes par première date
    const sortedGroups = Object.values(groupedEvents).sort((a, b) => 
      a.dates[0] - b.dates[0]
    );
  
    // Formater l'affichage des dates
    const formatDateRange = (dates) => {
      if (dates.length === 1) {
        return dates[0].toLocaleDateString();
      }
  
      const sortedDates = [...dates].sort((a, b) => a - b);
  
      // Vérifier si les dates sont consécutives
      let isConsecutive = true;
      for (let i = 1; i < sortedDates.length; i++) {
        const diff = (sortedDates[i] - sortedDates[i-1]) / (1000 * 60 * 60 * 24);
        if (diff !== 1) {
          isConsecutive = false;
          break;
        }
      }
  
      if (isConsecutive) {
        const firstDate = sortedDates[0];
        const lastDate = sortedDates[sortedDates.length - 1];
  
        if (firstDate.getFullYear() === lastDate.getFullYear() &&
            firstDate.getMonth() === lastDate.getMonth()) {
          return `${firstDate.getDate()} - ${lastDate.toLocaleDateString()}`;
        } else {
          return `${firstDate.toLocaleDateString()} - ${lastDate.toLocaleDateString()}`;
        }
      } else {
        if (sortedDates.length > 5) {
          const first3 = sortedDates.slice(0, 3).map(d => d.toLocaleDateString());
          const last = sortedDates[sortedDates.length - 1].toLocaleDateString();
          return `${first3.join(', ')} ... ${last}`;
        } else {
          return sortedDates.map(d => d.toLocaleDateString()).join(', ');
        }
      }
    };
  
    return (
      <>
        <h3 style={{ marginBottom: '15px', color: '#667eea', textAlign: 'center' }}>
          Événements du {isSameDate(selectedRange.start, selectedRange.end) 
            ? selectedRange.start.toLocaleDateString() 
            : `${selectedRange.start.toLocaleDateString()} - ${selectedRange.end.toLocaleDateString()}`}
        </h3>
  
        {sortedGroups.map((group, index) => (
          <div key={`group_${group.type}_${group.text}_${index}`} className="event-item">
            <div className="event-content">
              <div 
                className="event-type-indicator" 
                style={{ backgroundColor: getEventTypeInfo(group.type).color }} 
              />
              <div className="event-details">
                <div className="event-text-with-count">
                  <span className="event-text">{group.text}</span>
                  {group.dates.length > 1 && (
                    <span className="event-count">×{group.dates.length}</span>
                  )}
                </div>
                <span className="event-type-label">
                  {getEventTypeInfo(group.type).label}
                </span>
                <div style={{ fontSize: '0.9em', color: '#666', marginTop: '4px' }}>
                  📅 {formatDateRange(group.dates)}
                </div>
              </div>
            </div>
  
            {!group.meta?.isHoliday && !group.meta?.isSchoolVacation && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="delete-event"
                  onClick={() => deleteGroupedEvent(group.eventIds, group.dateKeys)}
                  title={group.dates.length > 1 
                    ? `Supprimer ${group.dates.length} événements` 
                    : "Supprimer l'événement"}
                >
                  Supprimer {group.dates.length > 1 ? `(${group.dates.length})` : ''}
                </button>
              </div>
            )}
          </div>
        ))}
      </>
    );
  };

  // Affichage de l'état de chargement ou d'erreur
  if (holidaysLoading) {
    return (
      <BasePage title='Hébésoft' >
        <h1>Calendrier</h1>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Chargement des données des jours fériés et vacances scolaires...</p>
        </div>
      </BasePage>
    );
  }

  if (holidaysError) {
    return (
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          <p>Erreur lors du chargement des données: {holidaysError}</p>
        </div>
    );
  }

  return (
      <div className="calendar-page">
        <div className={`calendar-container ${showEventInput ? 'expanded' : ''}`}>
          <div className="calendar-header">
            <button className="nav-btn" onClick={previousMonth}>‹</button>
            <div className="month-year">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </div>
            <button className="nav-btn" onClick={nextMonth}>›</button>
          </div>

          <div className="controls">
            <button className="control-btn" onClick={goToToday}>Today</button>
            <button className="control-btn" onClick={handleShowEventInput}>Add Event</button>

            {!clickSelectionMode ? (
              <button className="control-btn" onClick={startClickSelection}>
                Sélection par clic
              </button>
            ) : (
              <>
                <button className="control-btn active" disabled>
                  {firstSelectedDate ? 'Cliquez sur la date de fin' : 'Cliquez sur la date de début'}
                </button>
                <button className="control-btn" onClick={cancelClickSelection}>Annuler</button>
              </>
            )}
          </div>

          {showEventInput && (
            <div className="event-input show">
              <div className="input-group">
                <input
                  type="text"
                  value={eventText}
                  onChange={(e) => setEventText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Description de l'événement"
                />
              </div>
              <div className="input-group">
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="event-type-select"
                >
                  {eventTypes.filter(t => !['holiday', 'school_vacation'].includes(t.value)).map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <div className="event-type-preview" style={{ backgroundColor: getEventTypeInfo(eventType).color }} />
              </div>
              <div className="button-group">
                <button onClick={saveEvent}>Sauvegarder</button>
                <button onClick={hideEventInput}>Annuler</button>
              </div>
            </div>
          )}

          <div className="calendar-grid" ref={calendarRef}>
            {daysOfWeek.map(day => (
              <div key={day} className="day-header">{day}</div>
            ))}
            {renderCalendar()}
          </div>
        </div>

        <div className={`events-list ${!selectedRange.start ? 'empty' : ''}`}>
          {renderEvents()}
        </div>
      </div>
  );
};

export default Calendar;