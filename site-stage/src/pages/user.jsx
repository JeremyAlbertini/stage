import { useEffect, useState } from "react";
import Header from "../components/Header";
import LeftBand from "../components/LeftBand";
import BasePage from "../components/BasePage";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <BasePage title='Users'>
        <h1>Liste des utilisateurs</h1>
        <ul>
            {users.map(u => (
            <li key={u.id}>
                {u.matricule} - {u.password}
            </li>
            ))}
        </ul>
    </BasePage>
  );
}
