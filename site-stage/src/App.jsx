import { useEffect, useState } from "react";
import CreateUser from "./components/create_user";

function App() {
  const [users, setUsers] = useState([]);

  const loadUsers = () => {
    fetch("http://localhost:5000/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div>
      <h1>Gestion des utilisateurs</h1>
      
      {}
      <CreateUser onUserCreated={loadUsers}/>
      
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
