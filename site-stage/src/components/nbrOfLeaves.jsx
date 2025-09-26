import { useApi } from "../hooks/useApi";
import { useState, useCallback, useEffect } from "react";
import "../styles/nbrOfLeaves.css"
import { NavLink } from "react-router-dom";

export default function NbrOfLeaves() {
    const api = useApi();
    const [soldes, setSoldes] = useState({ CA: 25, RCA: 10});
    const [soldesError, setSoldesError] = useState("");

    const fetchSoldes = useCallback(async () => {
      try {
        const res = await api.get("/api/soldes");
        if (res.error) {
          setSoldesError(res.error);
          setSoldes(null);
        } else {
          setSoldes(res);
          setSoldesError("");
        }
      } catch (err) {
        setSoldesError("Impossible de récupérer les soldes.");
        setSoldes(null);
        console.error("Erreur lors de la récupération des soldes:", err);
      }
    }, []);

    useEffect(() => {
        fetchSoldes();
    }, [fetchSoldes]);

    return(
        <div className="div-contair-solde">
            <div className="header-titlee">
                <h3 className="title-solde">Congés restants :</h3>
                <NavLink className={"navlink-solde"} to={"/conges"}>aller aux congés</NavLink>
            </div>
            <div className="leave-balance-cards-home">
            {soldesError ? (
                <div className="message message-error">{soldesError}</div>
            ) : (
                <>
                <div className="balance-card">
                    <h3>Congés payés (CA)</h3>
                    <p className="balance-value">{soldes?.CA ?? "-"}</p>
                </div>
                <div className="balance-card">
                    <h3>RTT</h3>
                    <p className="balance-value">{soldes?.RCA ?? "-"}</p>
                </div>
                </>
            )}
            </div>
        </div>
    )
}
