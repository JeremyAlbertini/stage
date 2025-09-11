import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DropdownMenu from './DropdownMenu';

export default function UserMenu({ userMenuItems = [] }) {
  const navigate = useNavigate();
  const { user, handleLogout, checkPermission } = useAuth();
  const [hovered, setHovered] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);

  // Fonction de logout avec feedback
  const handleLogoutClick = async () => {
    try {
      await handleLogout();
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
    } finally {
      navigate('/login');
    }
  };

  // Générer les items par défaut du menu
  const getDefaultMenuItems = () => {
    const items = [];

    // Vérifie dans le cache des permissions
    if (checkPermission("admin")) {
      items.push({
        id: 'admin',
        label: 'Administration',
        icon: '⚙️',
        backgroundColor: '#6c757d',
        hoverColor: '#5a6268',
        onClick: () => navigate('/admin')
      });
    }

    items.push({
      id: 'logout',
      label: 'Déconnexion',
      icon: '🚪',
      backgroundColor: '#dc3545',
      hoverColor: '#c82333',
      onClick: handleLogoutClick
    });

    return items;
  };

  const menuItems = userMenuItems.length > 0 ? userMenuItems : getDefaultMenuItems();

  const handleMenuItemClick = () => {
    setHovered(false);
  };

  if (!user) {
    return null; // Placeholder ou loader si nécessaire
  }

  return (
    <div
      className="user-menu"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        className="user-menu-button"
        style={{
          backgroundColor: buttonHovered ? '#0056b3' : '#007bff',
        }}
        onClick={() => navigate('/profile')}
        onMouseEnter={() => setButtonHovered(true)}
        onMouseLeave={() => setButtonHovered(false)}
      >
        <span>mon compte</span>
        <img 
          src={user.avatar || "/ano.jpg"}
          alt="Avatar" 
          className="avatar"
        />
      </button>

      <DropdownMenu
        items={menuItems}
        isVisible={hovered}
        onItemClick={handleMenuItemClick}
      />
    </div>
  );
}
