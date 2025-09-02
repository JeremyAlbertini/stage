import { useEffect, useState } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Liste des utilisateurs</h1>
      <ul>
        {users.map(u => (
          <li key={u.id}>
            {u.matricule}
          </li>
        ))}
      </ul>
    </div>
  );
}
