import Header from "../components/Header.jsx";
import LeftBand from "../components/LeftBand.jsx";

export default function Home() {
  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>
      <Header title="Acceuil" />
      <div style={{ display: "flex", flex: 1 , marginTop: '60px'}}>
        <LeftBand />
        <div style={{ flex: 1, boxSizing: "border-box", padding: "2rem", backgroundColor: "blue" }}>
          <h1>Bienvenue sur mon app</h1>
          <p>Ceci est la page d'accueil.</p>
        </div>
      </div>
    </div>
  );
}
