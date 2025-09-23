import Header from "./Header";
import LeftBand from "./LeftBand";

export default function BasePage({ title, children, activate }) {
  // A helper function to return styles based on `activate`
  const getContentStyle = () => {
    if (activate === 1) {
      return {
        flex: 1,
        boxSizing: "border-box",
        padding: "2rem",
        backgroundColor: "white",
      };
    }
    return {};
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header title={title} />
      <div style={{ display: "flex", flex: 1 }}>
        <LeftBand />
        <div style={getContentStyle()}>
          {children}
        </div>
      </div>
    </div>
  );
}
