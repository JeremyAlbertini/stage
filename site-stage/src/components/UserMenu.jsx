import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import DropdownMenu from './DropdownMenu';
import { hasAnyUserPerm, hasUserPerms } from "../utils/permsApi";
import { useApi } from "../hooks/useApi";

export default function UserMenu({ userMenuItems = [] }) {
  const api = useApi();
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();
  const [hovered, setHovered] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);
  const [ok, setOk] = useState(false); // Ajout d'un état pour la permission

  useEffect(() => {
    hasAnyUserPerm(api, user.id, ["create_account", "all_users"]).then(result => {
      setOk(result); // Stocke le résultat dans l'état
    });
  }, [user.id]);

  const getDefaultMenuItems = () => {
    const items = [];
    console.log("Permission admin:", ok);
    if (ok) {
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
      onClick: handleLogout
    });
    return items;
  };

  const menuItems = userMenuItems.length > 0 ? userMenuItems : getDefaultMenuItems();

  const handleMenuItemClick = () => {
    setHovered(false);
  };

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
        <span>{user.name || 'Mon Compte'}</span>
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