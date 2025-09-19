import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, Users, Bell, Plus } from 'lucide-react';

const HomeCalendar = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [events, setEvents] = useState({});
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', time: '', type: 'work' });

  const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  // Générer les dates de la semaine courante
  const getWeekDates = (date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDates = getWeekDates(currentWeek);

  // Initialiser avec quelques événements exemple
  useEffect(() => {
    const initialEvents = {};
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    
    // Événements pour aujourd'hui
    initialEvents[todayKey] = [
      { id: 1, title: 'Réunion équipe', time: '09:00', type: 'meeting', color: '#3b82f6' },
      { id: 2, title: 'Présentation client', time: '14:30', type: 'work', color: '#f59e0b' }
    ];

    // Événements pour demain
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowKey = `${tomorrow.getFullYear()}-${tomorrow.getMonth()}-${tomorrow.getDate()}`;
    initialEvents[tomorrowKey] = [
      { id: 3, title: 'Formation React', time: '10:00', type: 'learning', color: '#10b981' }
    ];

    // Événement après-demain
    const afterTomorrow = new Date(today);
    afterTomorrow.setDate(afterTomorrow.getDate() + 2);
    const afterTomorrowKey = `${afterTomorrow.getFullYear()}-${afterTomorrow.getMonth()}-${afterTomorrow.getDate()}`;
    initialEvents[afterTomorrowKey] = [
      { id: 4, title: 'Deadline projet', time: '18:00', type: 'deadline', color: '#ef4444' },
      { id: 5, title: 'Call international', time: '16:00', type: 'meeting', color: '#3b82f6' }
    ];

    setEvents(initialEvents);
  }, []);

  const getDateKey = (date) => {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const navigateWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction * 7));
    setCurrentWeek(newWeek);
  };

  const handleAddEvent = () => {
    if (!selectedDay || !newEvent.title || !newEvent.time) return;

    const dateKey = getDateKey(selectedDay);
    const eventColor = {
      work: '#f59e0b',
      meeting: '#3b82f6',
      personal: '#8b5cf6',
      deadline: '#ef4444',
      learning: '#10b981'
    }[newEvent.type];

    const event = {
      id: Date.now(),
      title: newEvent.title,
      time: newEvent.time,
      type: newEvent.type,
      color: eventColor
    };

    setEvents(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), event].sort((a, b) => a.time.localeCompare(b.time))
    }));

    setNewEvent({ title: '', time: '', type: 'work' });
    setShowAddEvent(false);
  };

  const deleteEvent = (date, eventId) => {
    const dateKey = getDateKey(date);
    setEvents(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].filter(e => e.id !== eventId)
    }));
  };

  const formatDateRange = () => {
    const firstDay = weekDates[0];
    const lastDay = weekDates[6];
    
    if (firstDay.getMonth() === lastDay.getMonth()) {
      return `${firstDay.getDate()} - ${lastDay.getDate()} ${months[firstDay.getMonth()]} ${firstDay.getFullYear()}`;
    } else if (firstDay.getFullYear() === lastDay.getFullYear()) {
      return `${firstDay.getDate()} ${months[firstDay.getMonth()]} - ${lastDay.getDate()} ${months[lastDay.getMonth()]} ${lastDay.getFullYear()}`;
    } else {
      return `${firstDay.getDate()} ${months[firstDay.getMonth()]} ${firstDay.getFullYear()} - ${lastDay.getDate()} ${months[lastDay.getMonth()]} ${lastDay.getFullYear()}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Mon Espace de Travail</h1>
          <p className="text-gray-600">Bienvenue ! Voici votre planning de la semaine</p>
        </div>

        {/* Calendar Container */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <button 
              onClick={() => navigateWeek(-1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800">Semaine du {formatDateRange()}</h2>
            </div>
            
            <button 
              onClick={() => navigateWeek(1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Week Days Grid */}
          <div className="grid grid-cols-7 gap-3">
            {weekDates.map((date, index) => {
              const dateKey = getDateKey(date);
              const dayEvents = events[dateKey] || [];
              const isSelected = selectedDay && getDateKey(selectedDay) === dateKey;
              const hasEvents = dayEvents.length > 0;

              return (
                <div key={index} className="relative">
                  <button
                    onClick={() => setSelectedDay(date)}
                    className={`
                      w-full p-4 rounded-xl transition-all duration-200 border-2
                      ${isToday(date) 
                        ? 'bg-blue-50 border-blue-300 shadow-md' 
                        : isSelected 
                          ? 'bg-gray-50 border-gray-300 shadow-sm'
                          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }
                    `}
                  >
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      {daysOfWeek[index]}
                    </div>
                    <div className={`text-2xl font-bold mb-2 ${isToday(date) ? 'text-blue-600' : 'text-gray-800'}`}>
                      {date.getDate()}
                    </div>
                    
                    {/* Event indicators */}
                    <div className="flex flex-wrap gap-1 justify-center min-h-[24px]">
                      {dayEvents.slice(0, 3).map((event, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: event.color }}
                          title={`${event.time} - ${event.title}`}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-gray-500">+{dayEvents.length - 3}</div>
                      )}
                    </div>
                  </button>

                  {isToday(date) && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Events */}
        {selectedDay && (
          <div className="bg-white rounded-2xl shadow-xl p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Événements du {selectedDay.getDate()} {months[selectedDay.getMonth()]}
              </h3>
              <button
                onClick={() => setShowAddEvent(!showAddEvent)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Ajouter
              </button>
            </div>

            {/* Add Event Form */}
            {showAddEvent && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Titre de l'événement"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <select
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="work">Travail</option>
                      <option value="meeting">Réunion</option>
                      <option value="personal">Personnel</option>
                      <option value="deadline">Deadline</option>
                      <option value="learning">Formation</option>
                    </select>
                    <button
                      onClick={handleAddEvent}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Valider
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Events List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {(events[getDateKey(selectedDay)] || []).length === 0 ? (
                <p className="text-center text-gray-500 py-8">Aucun événement prévu ce jour</p>
              ) : (
                events[getDateKey(selectedDay)].map(event => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: event.color }}
                      />
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-700">{event.time}</span>
                      <span className="text-gray-800">{event.title}</span>
                      <span className="text-xs px-2 py-1 bg-gray-200 rounded-full text-gray-600">
                        {event.type}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteEvent(selectedDay, event.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all"
                    >
                      Supprimer
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Cette semaine</p>
                <p className="text-2xl font-bold text-gray-800">
                  {Object.values(events).flat().filter(e => {
                    const eventDate = new Date();
                    return weekDates.some(wd => getDateKey(wd) === getDateKey(eventDate));
                  }).length} événements
                </p>
              </div>
              <Bell className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Prochaine réunion</p>
                <p className="text-lg font-semibold text-gray-800">
                  {(() => {
                    const meetings = Object.entries(events)
                      .flatMap(([key, evs]) => evs.filter(e => e.type === 'meeting'))
                      .sort((a, b) => a.time.localeCompare(b.time));
                    return meetings[0]?.title || 'Aucune';
                  })()}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Deadlines proches</p>
                <p className="text-2xl font-bold text-gray-800">
                  {Object.values(events).flat().filter(e => e.type === 'deadline').length}
                </p>
              </div>
              <MapPin className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HomeCalendar;