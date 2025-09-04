import Button from './Button';
import Dropdown from './Dropdown';
import '../styles/Header.css';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

export default function Header({ title, backgroundColor = "white" }) {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();
  const [hovered, setHovered] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false); 
  
  return (
    <header className="main-header" style={{ backgroundColor }}>
      <h1 className='title-header'>{title}</h1>
      
      <div
        style={{ 
          position: "relative", 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "flex-start"
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Bouton principal avec alignement corrigé */}
        <button
          style={{
            width: '150px',
            maxHeight: "40px",
            padding: "0.75rem 1rem",
            borderRadius: "6px",
            cursor: "pointer",
            backgroundColor: buttonHovered ? '#0056b3' : '#007bff',
            color: "white",
            border: "none",
            transition: "all 0.3s ease",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem'
          }}
          onClick={() => navigate('/profile')} // ✅ corrigé ici
          onMouseEnter={() => setButtonHovered(true)}
          onMouseLeave={() => setButtonHovered(false)}
        >
          <span>Mon Compte</span>
          <img 
            src="/ano.jpg" 
            alt="Avatar" 
            className="avatar"
            style={{
              width: '1.8rem',
              height: '1.8rem',
              borderRadius: '50%',
              objectFit: 'cover',
              flexShrink: 0
            }}
          />
        </button>


        {/* Menu déroulant avec transition */}
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: '150px',
            backgroundColor: "white",
            borderRadius: "6px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            maxHeight: hovered ? "120px" : "0",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(-10px)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            zIndex: 1001,
            marginTop: "2px"
          }}
        >
          <button 
            style={{
              width: '100%',
              padding: "0.75rem 1rem",
              cursor: "pointer",
              backgroundColor: '#dc3545',
              color: "white",
              border: "none",
              transition: "background-color 0.2s ease"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
            onClick={handleLogout}
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
}