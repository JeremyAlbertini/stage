import Button from './Button';
import Dropdown from './Dropdown';
import '../styles/Header.css';
import { useNavigate } from 'react-router-dom';

export default function Header({ title, backgroundColor }) {
  const navigate = useNavigate();
  
  return (
    <header className="main-header" style={{ backgroundColor }}>
      <h1>{title}</h1>
      
      <Dropdown 
        trigger={<Button>Mon Compte</Button>}
      >
        <Button>Mon Compte</Button>
        <Button onClick={() => { 
          localStorage.removeItem('user');
          navigate('/login');
        }}>Déconnexion</Button>
        <Button onClick={() => navigate('/profile')}>Mes Infos</Button>
      </Dropdown>
    </header>
  );
}