import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { getUserPerm } from '../utils/permsApi';
import { useApi } from "../hooks/useApi";

export default function SearchModal({ isVisible, onClose }) {
  const api = useApi();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const modalRef = useRef(null);
  const { user } = useAuth();

  const searchItems = [
    { page: "/admin", label: "Création de compte", subtitle: "Administration -> Création de compte", tab: "create", Permission: "create_account" },
    { page: "/admin", label: "Gestion des agents", subtitle: "Administration -> Gestion des agents", tab: "liste", Permission: "all_users" },
    { page: "/users", label: "Utilisateurs", subtitle: "Liste des utilisateurs", Permission: "false" },
    { page: "/profile", label: "Mon profil", subtitle: "Voir et modifier mon profil", Permission: "false" },
    {page: "/calendar", label: "Calendrier", subtitle: "Voir le calendrier des interventions", Permission: "false"},
    { page: "/conges", label: "Congés", subtitle: "Voir et gérer les congés", Permission: "false" },
    { page: "/horaires", label: "Horaires", subtitle: "Voir et gérer les horaires", Permission: "false" },
    { page: "/contrat", label: "Contrats", subtitle: "Voir et gérer les contrats", Permission: "false" },
  ];

  const filteredResults = searchItems.filter(item => {
    if (item.Permission === "false") return true;
    const hasPermission = getUserPerm(api, user.id, item.Permission);
    if (hasPermission) return false;
    if (!searchQuery) return true;
    return item.label.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Focus sur l'input quand la modal s'ouvre
  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isVisible]);

  // Gérer les clics en dehors de la modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  // Gérer les touches du clavier
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isVisible) return;
      
      if (event.key === 'Escape') {
        handleClose();
      }
      
      // Navigation avec Enter
      if (event.key === 'Enter' && filteredResults.length > 0) {
        handleResultClick(filteredResults[0]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, filteredResults]);

  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

  const handleResultClick = (result) => {
    if (result.tab) {
      navigate(result.page, { state: { defaultTab: result.tab } });
    } else {
      navigate(result.page);
    }
    handleClose();
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  if (!isVisible) return null;

  return (
    <div className="search-modal-overlay">
      <div className="search-modal" ref={modalRef}>
        <div className="search-modal-header">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search here"
            className="search-modal-input"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button className="search-modal-close" onClick={handleClose}>
            ✕
          </button>
        </div>
        
        <div className="search-modal-body">
          {filteredResults.length > 0 ? (
            filteredResults.map((result, index) => (
              <div
                key={index}
                className="search-modal-item"
                onClick={() => handleResultClick(result)}
              >
                <div className="search-item-content">
                  <div className="search-item-title">{result.label}</div>
                  {result.subtitle && (
                    <div className="search-item-subtitle">{result.subtitle}</div>
                  )}
                </div>
              </div>
            ))
          ) : searchQuery ? (
            <div className="search-no-results">
              Aucun résultat trouvé pour "{searchQuery}"
            </div>
          ) : (
            <div className="search-placeholder">
              Tapez pour rechercher...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}