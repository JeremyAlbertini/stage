import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { UIProvider } from "./context/UIContext.jsx";

function App() {
  return (
    <Router>
      <UIProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </UIProvider>
    </Router>
  );
}

export default App;
