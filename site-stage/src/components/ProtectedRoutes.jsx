import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requireAdmin = false }) {
    const userString = localStorage.getItem('user');

    if (!userString) {
        return <Navigate to="/login" replace/>
    }

    const user = JSON.parse(userString);

    if (requireAdmin && !user.isAdmin) {
        return <Navigate to="/" replace />
    }

    return children;
}