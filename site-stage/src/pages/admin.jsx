import Header from "../components/Header.jsx";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import CreateUser from "../components/create_user.jsx";

export default function AdminPage({ users, loadUsers }) {
    const navigate = useNavigate();

    return (
        <div>
            <div style={{
                boxSizing: "border-box",
                padding: "2rem",
                backgroundColor:"rgb(61, 33, 114)",
                marginTop: "60px"
            }}>
                <h1>Bienvenue sur la page administration</h1>
                <p>Ici vous pouvez administrer vos agents.</p>

                <button
                    onClick={() => navigate("create-user")}
                    style={{
                        backgroundColor: "rgb(80, 60, 180)",
                        color: "white",
                        fontWeight: "bold",
                        marginBottom: "20px"
                    }}
                >
                    Créer un nouvel utilisateur
                </button>
                <Routes>
                    <Route path="/" element={
                        <div>
                            <h2>Liste des utilisateurs</h2>
                            <ul>
                                {users.map(user => (
                                    <li key={user.id}>{user.matricule}</li>
                                ))}
                            </ul>
                        </div>
                    }/>

                    <Route path="create-user" element={
                        <div>
                            <button 
                                onClick={() => navigate("/admin")}
                                style={{ marginBottom: "20px" }}
                            >
                                ← Retour à la liste
                            </button>
                            <CreateUser onUserCreated={() => {
                                loadUsers();
                                navigate("/admin");  // Redirection après création réussie
                            }} />
                        </div>
                    } />
                </Routes>
            </div>
        </div>
    );
}
