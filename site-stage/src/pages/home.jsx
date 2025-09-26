import { useEffect, useState } from "react";
import BasePage from "../components/BasePage.jsx";
import WeekCalendar from "../components/HomeCalendar.jsx";
import NbrOfLeaves from "../components/nbrOfLeaves.jsx";
import "../styles/home.css";

export default function Home() {
  const [right, setRight] = useState([NbrOfLeaves, NbrOfLeaves, NbrOfLeaves, NbrOfLeaves]);
  const [middle, setMiddle] = useState([NbrOfLeaves, WeekCalendar]);
  const [left, setLeft] = useState([WeekCalendar, NbrOfLeaves]);

  return (
    <BasePage title="Hébésoft" >
      <div className="contenair-home">
        <div className="box-home">
          {left.map((Item, index) => (
            <Item key={index} />
          ))}
        </div>
        <div className="box-home">
          {middle.map((Item, index) => (
            <Item key={index} />
          ))}
        </div>
        <div className="box-home">
          {right.map((Item, index) => (
            <Item key={index} />
          ))}
        </div>
      </div>
    </BasePage>
  );
}
