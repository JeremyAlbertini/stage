import React, { useState, useEffect, useRef } from 'react';
import '../styles/calendar.css';
import Header from "../components/Header";
import LeftBand from "../components/LeftBand.jsx";
import BasePage from "../components/BasePage.jsx";


const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [events, setEvents] = useState({});
  const [showEventInput, setShowEventInput] = useState(false);
  const [eventText, setEventText] = useState('');

  const calendarRef = useRef(null);

  const months = [
    'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  // Global mouse events for range selection
  useEffect(() => {
    const handleMouseUp = () => {
      if (isSelecting) {
        finishSelection();
      }
    };

    const handleSelectStart = (e) => {
      if (isSelecting) {
        e.preventDefault();
      }
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

  const previousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
    setSelectedRange({ start: today, end: today });
  };

  const handleShowEventInput = () => {
    if (!selectedRange.start) {
      return;
    }
    setShowEventInput(true);
  };

  const hideEventInput = () => {
    setShowEventInput(false);
    setEventText('');
  };

  const saveEvent = () => {
    if (!selectedRange.start || !eventText.trim()) {
      return;
    }

    const newEvents = { ...events };
    const startDate = new Date(selectedRange.start);
    const endDate = new Date(selectedRange.end);
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateKey = getDateKey(currentDate);
      if (!newEvents[dateKey]) {
        newEvents[dateKey] = [];
      }
      
      newEvents[dateKey].push({
        text: eventText.trim(),
        id: Date.now() + currentDate.getTime()
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    setEvents(newEvents);
    hideEventInput();
  };

  const deleteEvent = (dateKey, eventId) => {
    const newEvents = { ...events };
    if (newEvents[dateKey]) {
      newEvents[dateKey] = newEvents[dateKey].filter(event => event.id !== eventId);
      if (newEvents[dateKey].length === 0) {
        delete newEvents[dateKey];
      }
    }
    setEvents(newEvents);
  };

  const getDateKey = (date) => {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
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
    const dateTime = date.getTime();
    return dateTime >= start.getTime() && dateTime <= end.getTime();
  };

  const isRangeStart = (date) => {
    return selectedRange.start && isSameDate(date, selectedRange.start) && 
           selectedRange.end && !isSameDate(selectedRange.start, selectedRange.end);
  };

  const isRangeEnd = (date) => {
    return selectedRange.end && isSameDate(date, selectedRange.end) && 
           selectedRange.start && !isSameDate(selectedRange.start, selectedRange.end);
  };

  const isRangeMiddle = (date) => {
    if (!selectedRange.start || !selectedRange.end) return false;
    if (isSameDate(selectedRange.start, selectedRange.end)) return false;
    return isDateInRange(date, selectedRange.start, selectedRange.end) &&
           !isSameDate(date, selectedRange.start) &&
           !isSameDate(date, selectedRange.end);
  };

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
      setSelectedRange({ 
        start: new Date(selectionStart), 
        end: new Date(date) 
      });
    } else {
      setSelectedRange({ 
        start: new Date(date), 
        end: new Date(selectionStart) 
      });
    }
  };

  const finishSelection = () => {
    setIsSelecting(false);
    setSelectionStart(null);
  };

  const hasEvent = (date) => {
    const dateKey = getDateKey(date);
    return events[dateKey] && events[dateKey].length > 0;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveEvent();
    }
  };

  const renderCalendar = () => {
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const startDate = new Date(firstDay);
        const dayOfWeek = (firstDay.getDay() + 6) % 7; // Monday = 0, Sunday = 6
        startDate.setDate(startDate.getDate() - dayOfWeek);


    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 34);

    const days = [];
    let currentDateIter = new Date(startDate);
    
    while (currentDateIter <= endDate) {
      const dateToSelect = new Date(currentDateIter);
      let dayClasses = ['day-cell'];

      // Add appropriate classes
      if (currentDateIter.getMonth() !== currentDate.getMonth()) {
        dayClasses.push('other-month');
      }

      if (isToday(currentDateIter)) {
        dayClasses.push('today');
      }

      // Handle range selection styling
      if (isSameDate(currentDateIter, selectedRange.start) && 
          isSameDate(selectedRange.start, selectedRange.end)) {
        dayClasses.push('selected');
      } else if (isRangeStart(currentDateIter)) {
        dayClasses.push('range-start');
      } else if (isRangeEnd(currentDateIter)) {
        dayClasses.push('range-end');
      } else if (isRangeMiddle(currentDateIter)) {
        dayClasses.push('range-middle');
      }

      if (hasEvent(currentDateIter)) {
        dayClasses.push('has-event');
      }

      days.push(
        <div
          key={currentDateIter.getTime()}
          className={dayClasses.join(' ')}
          onMouseDown={(e) => {
            e.preventDefault();
            startSelection(dateToSelect);
          }}
          onMouseEnter={() => {
            if (isSelecting) {
              updateSelection(dateToSelect);
            }
          }}
          onClick={(e) => {
            if (!isSelecting) {
              setSelectedRange({ start: dateToSelect, end: dateToSelect });
              setSelectedDate(dateToSelect);
            }
          }}
        >
          {currentDateIter.getDate()}
        </div>
      );

      currentDateIter.setDate(currentDateIter.getDate() + 1);
    }

    return days;
  };

  const renderEvents = () => {
    if (!selectedRange.start) return null;

    // Get all events in the selected range
    const allEvents = [];
    const startDate = new Date(selectedRange.start);
    const endDate = new Date(selectedRange.end);
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateKey = getDateKey(currentDate);
      const dateEvents = events[dateKey] || [];
      dateEvents.forEach(event => {
        allEvents.push({
          ...event,
          date: new Date(currentDate),
          dateKey: dateKey
        });
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (allEvents.length === 0) {
      const rangeText = isSameDate(selectedRange.start, selectedRange.end) 
        ? selectedRange.start.toLocaleDateString()
        : `${selectedRange.start.toLocaleDateString()} - ${selectedRange.end.toLocaleDateString()}`;
      return (
        <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
          No events for {rangeText}
        </p>
      );
    }

    const rangeText = isSameDate(selectedRange.start, selectedRange.end) 
      ? selectedRange.start.toLocaleDateString()
      : `${selectedRange.start.toLocaleDateString()} - ${selectedRange.end.toLocaleDateString()}`;

    // Group events by date
    const eventsByDate = {};
    allEvents.forEach(event => {
      const dateStr = event.date.toLocaleDateString();
      if (!eventsByDate[dateStr]) {
        eventsByDate[dateStr] = [];
      }
      eventsByDate[dateStr].push(event);
    });

    return (
      <>
        <h3 style={{ marginBottom: '15px', color: '#667eea', textAlign: 'center' }}>
          Events for {rangeText}
        </h3>
        {Object.keys(eventsByDate).sort().map(dateStr => (
          <div key={dateStr}>
            {Object.keys(eventsByDate).length > 1 && (
              <h4 style={{ margin: '15px 0 10px 0', color: '#764ba2', fontSize: '1rem' }}>
                {dateStr}
              </h4>
            )}
            {eventsByDate[dateStr].map(event => (
              <div key={event.id} className="event-item">
                <span>{event.text}</span>
                <button 
                  className="delete-event" 
                  onClick={() => deleteEvent(event.dateKey, event.id)}
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        ))}
      </>
    );
  };

  return (
  <BasePage title='Hébésoft'>
    <h1>Calendrier</h1>
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
        </div>
        {showEventInput && (
          <div className="event-input show">
            <input 
              type="text" 
              value={eventText}
              onChange={(e) => setEventText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter event description"
            />
            <button onClick={saveEvent}>Sauvegarder</button>
            <button onClick={hideEventInput}>Annuler</button>
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
  </BasePage>
  );
};

export default Calendar;
