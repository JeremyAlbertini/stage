import { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import '../styles/Header.css';

export default function NotificationBell() {
    const api = useApi();
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        api.get("/api/notifications").then(setNotifications);
    }, []);

    const markAsRead = async (id) => {
        await api.post(`/api/notifications/${id}/read`);
        setNotifications(notifications.filter(n => n.id !== id));
    };

    return (
        <div className="notification-bell">
            <button onClick={() => setOpen(!open)}>
                🔔 {notifications.filter(n => !n.is_read).length > 0 && (
                    <span className="notif-count">{notifications.filter(n => !n.is_read).length}</span>
                )}
            </button>
            {open && (
                <div className="notif-dropdown">
                    {notifications.length === 0 ? (
                        <div className="notif-empty">Aucune notification</div>
                    ) : (
                        <ul>
                            {notifications.map(n => (
                                <li key={n.id}>
                                    <span>{n.message}</span>
                                    <button onClick={() => markAsRead(n.id)}>Marquer comme lue</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}