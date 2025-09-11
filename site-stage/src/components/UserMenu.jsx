import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import DropdownMenu from './DropdownMenu';
import { hasAnyUserPerm } from "../utils/permsApi";
import { useApi } from "../hooks/useApi";

export default function UserMenu({ userMenuItems = [] }) {
  const api = useApi();
  const navigate = useNavigate();
  // ✅ CORRECTION : Utilisation de handleLogout qui existe maintenant
  const { user, handleLogout, logout } = useAuth();
  const [hovered, setHovered] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);
  const [ok, setOk] = useState(false);

  // ✅ CORRECTION : Vérification que user existe avant d'accéder à user.id
  useEffect(() => {
    if (user?.id) {
      hasAnyUserPerm(api, user.id, ["create_account", "all_users"])
        .then(result => {
          console.log("Permission admin résultat:", result);
          setOk(result);
        })
        .catch(err => {
          console.error("Erreur lors de la vérification des permissions:", err);
          setOk(false);
        });
    }
  }, [user?.id, api]);

  // ✅ CORRECTION : Fonction de logout avec feedback utilisateur
  const handleLogoutClick = async () => {
    try {
      console.log("Clic sur déconnexion");
      await handleLogout();
      console.log("Déconnexion terminée");
      navigate('/login');
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
      // ✅ Même en cas d'erreur, on peut forcer la redirection
      navigate('/login');
    }
  };

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
        onClick: () => {
          console.log("Navigation vers admin");
          navigate('/admin');
        }
      });
    }
    
    items.push({
      id: 'logout',
      label: 'Déconnexion',
      icon: '🚪',
      backgroundColor: '#dc3545',
      hoverColor: '#c82333',
      onClick: handleLogoutClick // ✅ Utilisation de la fonction corrigée
    });
    
    return items;
  };

  const menuItems = userMenuItems.length > 0 ? userMenuItems : getDefaultMenuItems();

  const handleMenuItemClick = () => {
    setHovered(false);
  };

  // ✅ CORRECTION : Vérification que user existe
  if (!user) {
    return null; // Ou un placeholder/loader
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
        onClick={() => {
          console.log("Navigation vers profil");
          navigate('/profile');
        }}
        onMouseEnter={() => setButtonHovered(true)}
        onMouseLeave={() => setButtonHovered(false)}
      >
        <span>{'mon compte'}</span>
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
