import { useEffect, useState } from "react";
import { getUserPerms } from "../utils/permsApi";
import '../styles/ManagePerms.css';
import React from "react";
import { useApi } from "../hooks/useApi";
import { data } from "react-router-dom";

/**
 * Liste des permissions modifiables
 */
const PERMS_LIST = [
  { key: "change_perms", label: "Modifier les permissions" },
  { key: "create_account", label: "Créer un utilisateur" },
  { key: "request", label: "Accepter les demandes" },
  { key: "modify_account", label: "Modifier un compte" },
  { key: "all_users", label: "Voir tous les utilisateurs" },
];

function ManagePerms({ agent, onUpdate }) {
  const api = useApi();
  const [perms, setPerms] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '', visible: false });

  useEffect(() => {
    if (agent && agent.user_id) {
      setLoading(true);
      getUserPerms(api, agent.user_id).then(data => {
        setPerms(data || {});
        setLoading(false);
      });
    }
  }, [agent?.user_id]);

  // Fonction pour afficher un message temporaire
  const showMessage = (type, text) => {
    setMessage({ type, text, visible: true });
    setTimeout(() => {
      setMessage(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

  // Gestion du changement de checkbox
  const handleChange = (e) => {
    const { name, checked } = e.target;
    setPerms(prev => ({
      ...prev,
      [name]: checked ? 1 : 0
    }));
  };

  // Envoi des modifications au backend
  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await api.put(`http://localhost:5000/perms/${agent.user_id}`, perms);
      
      const result = await response;
      
      if (result.success) {
        showMessage('success', 'Permissions mises à jour avec succès !');
        if (onUpdate) {
          onUpdate(agent);
        }
      } else {
        showMessage('error', result.message || 'Erreur lors de la sauvegarde des permissions');
      }
    } catch (err) {
      showMessage('error', 'Erreur de connexion au serveur');
      console.error('Erreur:', err);
    }
    setSaving(false);
  };


  return (
    <div className="manage-perms">
      <h1 className="admin-title">Gestion des Permissions</h1>
      
      <form>
        {PERMS_LIST.map(perm => (
          <label key={perm.key} className="perm-checkbox" htmlFor={perm.key}>
            <input
              type="checkbox"
              id={perm.key}
              name={perm.key}
              checked={!!perms[perm.key]}
              onChange={handleChange}
            />
            <span>{perm.label}</span>
          </label>
        ))}
        
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          style={{ marginTop: "1rem" }}
        >
          {saving ? "Sauvegarde..." : "Enregistrer"}
        </button>
      </form>
      {message.visible && (
        <div className={`status-message ${message.type}`}>
          {/* <span className="message-icon">
            {message.type === 'success' ? '✓' : '⚠'}
          </span> */}
          {message.text}
        </div>
      )}
    </div>
  );
}

export default ManagePerms;