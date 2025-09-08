import Header from "./Header";
import LeftBand from "./LeftBand";

export default function BasePage({ title, children}) {
    return (
        <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>
        <Header title={title} />
        <div style={{ display: "flex", flex: 1 ,}}>
                <LeftBand />
                <div style={{ flex: 1, boxSizing: "border-box", padding: "2rem", backgroundColor: "white" }}>
                {children}
            </div>
        </div>
       </div> 
    );
}