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
        <Button onClick={() => navigate('/profile'
        )}>Mon Compte</Button>
        <Button onClick={() => { 
          localStorage.removeItem('user');
          navigate('/login');
        }}>Déconnexion</Button>
      </Dropdown>
    </header>
  );
}