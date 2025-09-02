import Header from "../components/Header.jsx";

export default function adminPage() {
    return (
        <div>
            <Header title="Admin" />

            <div style={{ boxSizing: "border-box", padding: "2rem", backgroundColor: "red" }}>
                <h1>Bienvenue sur la AdminPage</h1>
                <p>Depuis ici vous pouvez administrer vos agents.</p>
            </div>
        </div>
    );
}
