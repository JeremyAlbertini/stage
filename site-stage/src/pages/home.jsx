import BasePage from "../components/BasePage.jsx";
import WeeklyAgenda from "../components/HomeCalendar.jsx";

export default function Home() {
  return (
    <BasePage title="Hébésoft">
          <h1>Bienvenue sur le portail Agent 100% Ados</h1>
          <p>Ceci est la page d'accueil.</p>
          <WeeklyAgenda />
    </BasePage>
  );
}
