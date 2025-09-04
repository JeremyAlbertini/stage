import '../styles/Header.css';
import { useAuth } from "../context/AuthContext";
import UserMenu from './UserMenu';

export default function Header({ 
  title, 
  backgroundColor = "white",
  userMenuItems = []
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <header className="main-header" style={{ backgroundColor }}>
        <h1 className="title-header">{title}</h1>
        <div className="loading">Chargement...</div>
      </header>
    );
  }

  return (
    <header className="main-header" style={{ backgroundColor }}>
      <h1 className="title-header">{title}</h1>
      
      {user && (
        <UserMenu userMenuItems={userMenuItems} />
      )}
    </header>
  );
}