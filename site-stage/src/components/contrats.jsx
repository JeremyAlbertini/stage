import React, { useEffect, useState } from 'react';
import '../styles/contrats.css';
import { useApi } from '../hooks/useApi';

function Contracts({ matricule, agent }) {
  const api = useApi();
  const [contracts, setContracts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [newContract, setNewContract] = useState({
    type_contrat: 'Titulaire',
    date_debut: '',
    date_fin: '',
    duree_contrat: 0,
    ca: 0,
    cf: 0,
    js: 0,
    rca: 0,
    heure: 1607,
  });

  const typeContratLabels = {
    Titulaire: "F.T.P Titulaire",
    Contractuel: "F.T.P Contractuel",
    CDI: "F.T.P CDI",
    Stagiaire: "F.T.P Stagiaire",
    Stage: "Stage",
    Vacataire: "Vacataire",
  };


  useEffect(() => {
    if (agent?.matricule) {
    fetchContracts();
      }
    }, [agent?.matricule]);

  // Calculate contract duration
  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate)
      return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;

    return diffTime > 0 ? Math.ceil(diffTime /
      (1000 * 60 * 60 * 24)) : 0; }; 
    
    // Update duration when dates change
    useEffect(() => {
      const duration = calculateDuration(newContract.date_debut, newContract.date_fin);
      if (duration !== newContract.duree_contrat) { 
        setNewContract(prev => ({ ...prev,
          duree_contrat: duration }));
        }
      }, [newContract.date_debut, newContract.date_fin]);

  // Fetch contracts
    const fetchContracts = async () => {
      try {
        const res = await api.get(`http://localhost:5000/contrats/${agent.matricule}`);
        const data = await res;
        setContracts(data);
      } catch (err) {
        console.error('Error fetching contracts:', err);
        setError('Erreur lors du chargement des contrats');
      }
    };

    // Create contract - ADD credentials
    const handleCreate = async () => {
      setError('');
    
      if (!newContract.date_debut || !newContract.date_fin) {
        setError('Veuillez renseigner les dates de début et de fin');
        return;
      }
    
      if (new Date(newContract.date_fin) <= new Date(newContract.date_debut)) {
        setError('La date de fin doit être postérieure à la date de début');
        return;
      }
    
      try {
        const response = await api.post('http://localhost:5000/contrats', { ...newContract, matricule: agent.matricule });
      
        if (!response.succsess) {
          let errorData;
          try {
            errorData = await response;
          } catch {
            errorData = {};
          }
          console.error('Error response:', errorData);
          throw new Error(errorData.message || 'Erreur lors de la création du contrat');
        }
      
        // Reset form & refresh contracts
        setShowModal(false);
        setNewContract({
          type_contrat: 'Titulaire',
          date_debut: '',
          date_fin: '',
          duree_contrat: 0,
          ca: 0,
          cf: 0,
          js: 0,
          rca: 0,
          heure: 1607,
        });
        fetchContracts();
      } catch (err) {
        console.error('Error creating contract:', err);
        setError(err.message);
      }
    };

    // Archive contract - ADD credentials and fix URL
    const handleArchive = async (id) => {
      try {
        const response = await api.patch(`http://localhost:5000/contrats/${id}/archive`);
        if (!response.success) throw new Error("Erreur lors de l'archivage du contrat");
        fetchContracts();
      } catch (err) {
        console.error('Error archiving contract:', err);
        setError(err.message);
      }
    };

    const handleActivate = async (id) => {
      try {
        const response = await api.patch(`http://localhost:5000/contrats/${id}/activate`);
        if (!response.success) throw new Error("Erreur lors de l'activation du contrat");
        fetchContracts();
      } catch (err) {
        console.error('Error activating contract:', err);
        setError(err.message);
      }
    };

    const handleDelete = async (id) => {
      if (!window.confirm("Voulez-vous vraiment supprimer ce contrat ?")) return;
      try {
        const response = await api.delete(`http://localhost:5000/contrats/${id}`);
        if (!response.success) throw new Error("Erreur lors de la suppression du contrat");
        fetchContracts();
      } catch (err) {
        console.error('Error deleting contract:', err);
        setError(err.message);
      }
    };

  return (
    <div className="contracts-container">
      <h2>CONTRATS DE L'AGENT</h2>

      {error && (
        <div style={{ color: 'red', marginBottom: '10px', padding: '10px', background: '#ffebee', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      <button onClick={() => setShowModal(true)}>+ Nouveau Contrat</button>

      <table>
        <thead>
          <tr>
            <th>Période</th>
            <th>Statut Administratif</th>
            <th>CA</th>
            <th>CF</th>
            <th>JS</th>
            <th>RCA</th>
            <th>Heures</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map(contract => (
            <tr key={contract.id}>
              <td className={contract.statut === 'Actif' ? 'active' : 'inactive'}>
                {`Période du ${new Date(contract.date_debut).toLocaleDateString("fr-FR")} au ${new Date(contract.date_fin).toLocaleDateString("fr-FR")}`}
              </td>
              <td>{typeContratLabels[contract.type_contrat] || contract.type_contrat}</td>
              <td>{contract.ca}</td>
              <td>{contract.cf}</td>
              <td>{contract.js}</td>
              <td>{contract.rca}</td>
              <td>{contract.heure}h</td>
              <td>
                {contract.statut === 'Actif' ? (
                  <button onClick={() => handleArchive(contract.id)}>Archiver</button>
                ) : (
                  <button onClick={() => handleActivate(contract.id)}>Activer</button>
                )}
                <button onClick={() => handleDelete(contract.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Créer un Contrat</h3>

            {error && <div style={{ color: 'red', marginBottom: '15px', fontSize: '0.9rem' }}>{error}</div>}

            <div className="form-group">
              <label>Type de Contrat</label>
              <select
                value={newContract.type_contrat}
                onChange={e => setNewContract({ ...newContract, type_contrat: e.target.value })}
              >
                <option value="Titulaire">F.T.P Titulaire</option>
                <option value="Contractuel">F.T.P Contractuel</option>
                <option value="CDI">F.T.P CDI</option>
                <option value="Stagiaire">F.T.P Stagiaire</option>
                <option value="Stage">Stage</option>
                <option value="Vacataire">Vacataire</option>
              </select>
            </div>

            <div className="form-group">
              <label>Date de Début</label>
              <input
                type="date"
                lang="fr"
                value={newContract.date_debut}
                onChange={e => setNewContract({ ...newContract, date_debut: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Date de Fin</label>
              <input
                type="date"
                lang="fr"
                value={newContract.date_fin}
                onChange={e => setNewContract({ ...newContract, date_fin: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Durée du Contrat (jours)</label>
              <input type="number" value={newContract.duree_contrat} readOnly style={{ backgroundColor: '#f5f5f5' }} />
            </div>

            <div className="form-row">
              <div>
                <label>Congés Annuels</label>
                <input
                  type="number"
                  value={newContract.ca}
                  onChange={e => setNewContract({ ...newContract, ca: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label>Congés Fractionnés</label>
                <input
                  type="number"
                  value={newContract.cf}
                  onChange={e => setNewContract({ ...newContract, cf: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="form-row">
              <div>
                <label>Jours de Sujétions</label>
                <input
                  type="number"
                  value={newContract.js}
                  onChange={e => setNewContract({ ...newContract, js: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label>RCA</label>
                <input
                  type="number"
                  value={newContract.rca}
                  onChange={e => setNewContract({ ...newContract, rca: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Heures</label>
              <input
                type="number"
                value={newContract.heure}
                onChange={e => setNewContract({ ...newContract, heure: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="modal-actions">
              <button onClick={handleCreate}>Enregistrer</button>
              <button onClick={() => { setShowModal(false); setError(''); }}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Contracts;
