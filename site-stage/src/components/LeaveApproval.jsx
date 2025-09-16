import { useState, useEffect } from "react";
import Button from "./Button";;
import { useApi } from "../hooks/useApi";
import "../styles/conges.css";

export default function LeaveApproval() {
    const [leaves, setLeaves] = useState([]);
    const [filter, setFilter] = useState("En Attente");
    const api = useApi();

    const LoadLeaves = async () => {
        try {
            const data = await api.get("/api/admin/conges");
            setLeaves(data);
        } catch (error) {
            console.error("Erreur lors du chargement des congés", error);
        }
    };

    useEffect(() => {
        LoadLeaves();
    }, []);

    const handleStatusChange = async (leaveId, status) => {
        try {
            if (status === "Approuvé") {
                await api.patch(`/api/conges/${leaveId}/accept`);
            } else {
                await api.put(`/api/conges/${leaveId}`, { status });
            }
            LoadLeaves();
        } catch (err) {
            console.error("Erreur lors de la mise à jour:", err);
        }
    };

    const filteredLeaves = leaves.filter(leave => filter === "Tous" || leave.statut === filter);

    return (
        <div className="filter-buttons">
            <button
                className={filter === "En Attente" ? "active" : ""}
                onClick={() => setFilter("En Attente")}
            >
                En Attente
            </button>
            <button
                className={filter === "Rejeté" ? "active" : ""}
                onClick={() => setFilter("Rejeté")}
            >
                Rejetés
            </button>
            <button
                className={filter === "Tous" ? "active" : ""}
                onClick={() => setFilter("Tous")}
            >
                Tous
            </button>
        
            <table className="leaves-table">
                <thead>
                    <tr>
                        <th>Agent</th>
                        <th>Type</th>
                        <th>Dates</th>
                        <th>Durée</th>
                        <th>Commentaire</th>
                        <th>Actions</th>
                    </tr>
                </thead>
            <tbody>
                {filteredLeaves.length > 0 ? (
                    filteredLeaves.map(leave => (
                        <tr key={leave.id}>
                            <td>{leave.nom} {leave.prenom}</td>
                            <td>{leave.type_conge}</td>
                            <td>{new Date(leave.date_debut).toLocaleDateString()} - {new Date(leave.date_fin).toLocaleDateString()}</td>
                            <td>{leave.duree} jours</td>
                            <td>{leave.commentaire || "-"}</td>
                            <td>
                                {leave.statut === "En Attente" && (
                                    <div className="button-group">
                                        <Button onClick={() => handleStatusChange(leave.id, "Approuvé")}>
                                            Approuver
                                        </Button>
                                        <Button secondary onClick={() => handleStatusChange(leave.id, "Rejeté")}>
                                            Rejeter
                                        </Button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6" className="no-data"> Aucune demadne {filter !=="Tous" ? filter.toLowerCase() : ""}</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}