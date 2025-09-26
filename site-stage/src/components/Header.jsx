import '../styles/Header.css';
import { useAuth } from "../context/AuthContext";
import UserMenu from './UserMenu';
import SearchModal from './SearchModal';
import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { useUI } from '../context/UIContext';
import NotificationBell from './NotificationBell';

export default function Header({ 
  title, 
  backgroundColor = "white",
  userMenuItems = [],
}) {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const { user, loading } = useAuth();
  const { setIsLeftOpen } = useUI();

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
          <Menu className="menu-icon" size={24} onClick={() => setIsLeftOpen(prev => !prev)}/>
          <h1 className="title-header">{title}</h1>
          <div className="search-trigger" onClick={openSearchModal}>
            <div className="search-icon">🔍</div>
          </div>
        </div>
  
        {user && (
          <div className="header-right">
            <NotificationBell />
            <UserMenu userMenuItems={userMenuItems} />
          </div>
        )}
      </header>
  
      <SearchModal 
        isVisible={showSearchModal} 
        onClose={closeSearchModal} 
      />
    </>
  );
}