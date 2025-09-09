import '../styles/Header.css';
import { useAuth } from "../context/AuthContext";
import UserMenu from './UserMenu';
import SearchModal from './SearchModal';
import { useState, useEffect } from 'react';

export default function Header({ 
  title, 
  backgroundColor = "white",
  userMenuItems = []
}) {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const { user, loading } = useAuth();

  // Ouvrir la modal de recherche
  const openSearchModal = () => {
    setShowSearchModal(true);
  };

  // Fermer la modal de recherche
  const closeSearchModal = () => {
    setShowSearchModal(false);
  };

  // Gérer le raccourci clavier global Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        openSearchModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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
  
      <SearchModal 
        isVisible={showSearchModal} 
        onClose={closeSearchModal} 
      />
    </>
  );
}