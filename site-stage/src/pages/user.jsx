import { useEffect, useState } from "react";
import Header from "../components/Header";
import LeftBand from "../components/LeftBand";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{height: "100vh", display: "flex", flexDirection:"column"}}>
        <Header title='Users' />

        <div style={{ display: "flex", flex: 1, marginTop: '60px' }}>
        <LeftBand />
        <div style={{ flex: 1, boxSizing: "border-box", padding: "2rem", backgroundColor: "blue" }}>
        <h1>Liste des utilisateurs</h1>
        <ul>
            {users.map(u => (
            <li key={u.id}>
                {u.matricule} - {u.password}
            </li>
            ))}
        </ul>
      </div>
    </div>
    </div>
  );
}
