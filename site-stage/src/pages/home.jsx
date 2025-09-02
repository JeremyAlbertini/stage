import Header from "../components/Header.jsx";

export default function Home() {
  return (
    <div>
      <Header title="test" />

      <div style={{ boxSizing: "border-box", padding: "2rem", backgroundColor: "blue" }}>
        <h1>Bienvenue sur mon app</h1>
        <p>Ceci est la page d'accueil.</p>
      </div>
    </div>
  );
}
