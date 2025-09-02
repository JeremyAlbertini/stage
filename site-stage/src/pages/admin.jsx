import Header from "../components/Header.jsx";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import CreateUser from "../components/create_user.jsx";
import "../styles/admin.css";

export default function AdminPage({ users, loadUsers }) {
    const navigate = useNavigate();

    return (
        <div>

        <div className="admin-container">
            <div className="admin-card">
                <h1 className="admin-title">Bienvenue sur la page administration</h1>
                <p className="admin-text">Ici vous pouvez administrer vos agents.</p>

                <button
                    onClick={() => navigate("/admin/create-user")}
                    className="admin-button"
                >
                Créer un nouvel utilisateur
                </button>
            </div>
    
            <Routes>
                <Route path="/" element={
                    <div className="admin-card">
                        <h2 className="admin-subtitle">Liste des utilisateurs</h2>
                        <ul className="user-list">
                        {users.map(user => (
                        <li key={user.id}>{user.matricule}</li>
                        ))}
                    </ul>
                    </div>
                }/>
    
                <Route path="create-user" element={
                    <div className="admin-card">
                        <button 
                        onClick={() => navigate("/admin")}
                        className="admin-button admin-button-secondary"
                    >
                        ← Retour à la liste
                    </button>
                    <CreateUser onUserCreated={() => {
                        loadUsers();
                        navigate("/admin");
                    }} />
                    </div>
                } />
            </Routes>
            </div>
        </div>
    );
}
