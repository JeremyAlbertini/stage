import { useEffect, useState } from "react";
import CreateUser from "./components/create_user";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Gestion des utilisateurs</h1>
      
      {}
      <CreateUser />
      
      {}
      <h2>Liste des utilisateurs</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.matricule}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
