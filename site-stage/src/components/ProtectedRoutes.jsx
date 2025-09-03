import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function ProtectedRoute({ children, requireAdmin = false }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    // const userString = localStorage.getItem('user');

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("http://localhost:5000/me", {
                    credentials: "include"
                });

                const data = await response.json();

                if (data.loggedIn) {
                    setIsAuthenticated(true);
                    setIsAdmin(data.user.isAdmin);
                    setUser(data.user);
                } else {
                    setIsAuthenticated(false);
                    localStorage.removeItem('user');
                }
            } catch (error) {
                console.error("Erreur de vérification d'authentification:", error);
                setIsAuthenticated(false);
                localStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                CHARGEZ CHARGER BRRRRRRRRRRRR
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && !isAdmin) {
        return <Navigate to="/" replace />;
    }
    
    return children;
    // if (!userString) {
    //     return <Navigate to="/login" replace/>
    // }

    // const user = JSON.parse(userString);

    // if (requireAdmin && !user.isAdmin) {
    //     return <Navigate to="/" replace />
    // }

    // return children;
}