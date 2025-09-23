import { useEffect, useState } from "react";
import BasePage from "../components/BasePage.jsx";
import WeekCalendar from "../components/HomeCalendar.jsx";
import NbrOfLeaves from "../components/nbrOfLeaves.jsx";
import "../styles/home.css";

export default function Home() {
  const [order, setOrder] = useState([]);

  useEffect(() => {
    setOrder([WeekCalendar, NbrOfLeaves]);
  }, []);

  const changeorder = () => {
    if (order[0] === WeekCalendar) {
      setOrder([NbrOfLeaves, WeekCalendar]);
    } else {
      setOrder([WeekCalendar, NbrOfLeaves]);
    }
  };

  return (
    <BasePage title="Hébésoft" activate={0}>
      <div className="contenair-home">
        {order.map((Item, index) => (
          <Item key={index} />
        ))}
        <button style={{maxHeight: "fit-content"}} onClick={changeorder}>Changer l'ordre</button>
      </div>
    </BasePage>
  );
}
