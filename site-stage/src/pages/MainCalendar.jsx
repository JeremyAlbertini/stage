import BasePage from "../components/BasePage";
import { useState, useEffect, useMemo } from "react";
import Calendar from "../components/calendar.jsx";
import { useAuth } from "../context/AuthContext";


export default function MainCalendar() {
    const [userId, setUserId] = useState(null);
    const {user} = useAuth();

    useEffect(() => {
        console.log("User from AuthContext:", user);
    }, [user]);

    return (
        <BasePage title="Calendrier">
            <h1>Calendrier</h1>
            <Calendar user_id={user.id}/>
        </BasePage>
    );
}