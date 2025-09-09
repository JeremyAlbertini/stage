import '../styles/Header.css';
import { useAuth } from "../context/AuthContext";
import UserMenu from './UserMenu';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect, use } from 'react';

export default function Header({ 
  title, 
  backgroundColor = "white",
  userMenuItems = []
}) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const searchInputRef = useRef(null);
  const modalRef = useRef(null);

  const searchItems = [
    { page: "/admin", label: "Création de compte", subtitle: "Administration -> Création de compte", tab: "create" , is_admin: true},
    { page: "/admin", label: "Gestion des agents", subtitle: "Administration -> Gestion des agents", tab: "liste", is_admin: true },
    { page: "/users", label: "Utilisateurs" , subtitle: "Liste des utilisateurs", is_admin: false },
    { page: "/profile", label: "Mon profil", subtitle: "Voir et modifier mon profil", is_admin: false },
  ];

  const { user, loading } = useAuth();

  const filteredResults = searchItems.filter(item => {
    const hasPermission = !item.is_admin || (user && user.isAdmin);
    if (!hasPermission) return false;
    if (!searchQuery) return true;
    return item.label.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Ouvrir la modal de recherche
  const openSearchModal = () => {
    setShowSearchModal(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  // Fermer la modal de recherche
  const closeSearchModal = () => {
    setShowSearchModal(false);
    setSearchQuery('');
  };

  // Gérer les clics en dehors de la modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeSearchModal();
      }
    };

    if (showSearchModal) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Empêcher le scroll du body
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [showSearchModal]);

  // Gérer les touches du clavier
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeSearchModal();
      }
      // Ouvrir la recherche avec Ctrl+K ou Cmd+K
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        openSearchModal();
      }
      // Navigation avec Enter
      if (event.key === 'Enter' && showSearchModal && filteredResults.length > 0) {
        handleResultClick(filteredResults[0]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSearchModal, filteredResults]); // Ajout des dépendances

  const handleResultClick = (result) => {
    if (result.tab) {
      navigate(result.page, { state: { defaultTab: result.tab } });
    } else {
      navigate(result.page);
    }
    closeSearchModal();
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  if (loading) {
    return (
      <header className="main-header" style={{ backgroundColor }}>
        <h1 className="title-header">{title}</h1>
        <div className="loading">Chargement...</div>
      </header>
    );
  }

  return (
    <>
      <header className="main-header" style={{ backgroundColor }}>
        {/* Groupe titre + loupe */}
        <div className="header-left">
          <h1 className="title-header">{title}</h1>
          <div className="search-trigger" onClick={openSearchModal}>
            <div className="search-icon">🔍</div>
          </div>
        </div>
  
        {user && (
          <UserMenu userMenuItems={userMenuItems} />
        )}
      </header>
  
      {/* Modal de recherche - reste inchangée */}
      {showSearchModal && (
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
              <button className="search-modal-close" onClick={closeSearchModal}>
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
      )}
    </>
  );
}