import { useState } from "react";
import "../styles/CreateUser.css";
import { useAuth } from "../context/AuthContext";

function ModifierUser({ onSave }) {
  const { user } = useAuth();

  if (!user || !user.isAdmin) {
    return <p>Vous n'avez pas la permission de modifier ce compte.</p>;
  }
  return (
    <p></p>
  )
}

export default ModifierUser;
