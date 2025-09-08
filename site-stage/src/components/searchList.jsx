import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importer useNavigate
import "../styles/SearchList.css";

export default function SearchList() {
  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState("");
  const [civilite, setCivilite] = useState("");
  const [poste, setPoste] = useState("");
  const [adressePro, setAdressePro] = useState("");
  const [stage, setStage] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate(); // Initialiser useNavigate

  const fetchAgents = async (page = 1, limit = 20, search = "", civilite = "", poste = "", adressePro = "", stage = "") => {
    const response = await fetch(
      `http://localhost:5000/agents?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&civilite=${encodeURIComponent(civilite)}&poste=${encodeURIComponent(poste)}&adresse_pro=${encodeURIComponent(adressePro)}&stage=${encodeURIComponent(stage)}`
    );
    const data = await response.json();
    return data;
  };

  useEffect(() => {
    const loadAgents = async () => {
      const data = await fetchAgents(page, 20, search, civilite, poste, adressePro, stage);
      setAgents(data.data);
      setTotalPages(data.totalPages);
    };

    loadAgents();
  }, [page, search, civilite, poste, adressePro, stage]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCiviliteChange = (e) => {
    setCivilite(e.target.value);
    setPage(1);
  };

  const handlePosteChange = (e) => {
    setPoste(e.target.value);
    setPage(1);
  };

  const handleAdresseProChange = (e) => {
    setAdressePro(e.target.value);
    setPage(1);
  };

  const handleStageChange = (e) => {
    setStage(e.target.value);
    setPage(1);
  };

  const resetFilters = () => {
    setCivilite("");
    setPoste("");
    setAdressePro("");
    setStage("");
    setPage(1);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleAgentClick = (agent) => {
    // Naviguer vers la page AgentsProfile avec l'état contenant les informations de l'agent
    navigate("/agents-profile", { state: { agent } });
  };

  return (
    <div className="search-list-container">
      <h1 className="search-list-title">Liste des agents</h1>
      
      <input
        type="text"
        className="search-list-input"
        placeholder="Rechercher un agent..."
        value={search}
        onChange={handleSearchChange}
      />
      
      <div className="filters-container">
        <button 
          className={`filters-toggle ${showFilters ? 'active' : ''}`}
          onClick={toggleFilters}
        >
          <span className={`filter-icon ${showFilters ? 'rotated' : ''}`}>▼</span>
          {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
        </button>
        
        <div className={`filters-row ${showFilters ? 'visible' : 'hidden'}`}>
          <span className="filters-label">Filtrer par :</span>
          
          <select className="filter-select" value={civilite} onChange={handleCiviliteChange}>
            <option value="">Toutes les civilités</option>
            <option value="Monsieur">Monsieur</option>
            <option value="Madame">Madame</option>
            <option value="Mademoiselle">Mademoiselle</option>
          </select>
          
          <select className="filter-select" value={poste} onChange={handlePosteChange}>
            <option value="">Tous les postes</option>
            <option value="Chef de Service">Chef de Service</option>
            <option value="Direction">Direction</option>
            <option value="Coordinateur">Coordinateur</option>
            <option value="Directeur">Directeur</option>
            <option value="Adjoint de Direction">Adjoint de Direction</option>
            <option value="Animateur">Animateur</option>
          </select>
          
          <select className="filter-select" value={adressePro} onChange={handleAdresseProChange}>
            <option value="">Toutes les adresses pro.</option>
            <option value="Néo">Néo</option>
            <option value="Impé">Impé</option>
            <option value="Sclos">Sclos</option>
            <option value="Auberge">Auberge</option>
          </select>
          
          <select className="filter-select" value={stage} onChange={handleStageChange}>
            <option value="">Tous les stages</option>
            <option value="Terra">Terra</option>
            <option value="Mare">Mare</option>
            <option value="Boulega">Boulega</option>
            <option value="Nice Chef">Nice Chef</option>
            <option value="Découverte">Découverte</option>
            <option value="Ski">Ski</option>
          </select>
          
          <button className="filters-reset" onClick={resetFilters}>
            Réinitialiser
          </button>
        </div>
      </div>
      
      <ul className="search-list">
        {agents.length > 0 ? (
          agents.map((agent) => (
            <li
              key={agent.id}
              className="search-list-item"
              onClick={() => handleAgentClick(agent)} // Appeler handleAgentClick au clic
              style={{ cursor: "pointer" }}
            >
              {agent.nom} {agent.prenom} -{" "}
              <span className="agent-matricule">{agent.matricule}</span>
            </li>
          ))
        ) : (
          <li className="empty">Aucun agent trouvé</li>
        )}
      </ul>
      {totalPages <= 1 ? null : (
        <div className="search-list-pagination">
          <button
            className="pagination-button"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Précédent
          </button>
          <span className="pagination-info">Page {page} sur {totalPages}</span>
          <button
            className="pagination-button"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}