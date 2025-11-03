import TabGroup from "../components/TabGroup";
import TabContent from "../components/TabContent";
import Horaire from "../components/horaire_components";
import { useState } from "react";
import BasePage from "../components/BasePage";
import PrevisualisationHoraire from "../components/previHoraire";

const tabs = [
  { id: "fiche_horaire", label: "Fiche Horaire" },
  { id: "previsualisation", label: "Prévisualisation" }
];

export default function PageHoraire() {
  const [activeTab, setActiveTab] = useState("fiche_horaire");

  return (
    <>
      <BasePage title={"Hébésoft"}>
      <TabGroup 
      tabs={tabs} 
      activeTab={activeTab} 
      onTabChange={setActiveTab} 
      />
    
      <TabContent id="fiche_horaire" activeTab={activeTab}>
          <Horaire />
      </TabContent>
      <TabContent id = "previsualisation" activeTab={activeTab}>
        <PrevisualisationHoraire/>
      </TabContent>
      </BasePage>
    </>
  )
}