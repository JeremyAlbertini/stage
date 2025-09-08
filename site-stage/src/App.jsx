import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
