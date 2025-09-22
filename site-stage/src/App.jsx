import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { UIProvider } from "./context/UIContext.jsx";
import { HolidaysProvider } from './context/HolidaysProvider.jsx';

function App() {
  return (
    <Router>
      <UIProvider>
        <AuthProvider>
          <HolidaysProvider location="Nice">
            <AppRoutes />
          </HolidaysProvider>
        </AuthProvider>
      </UIProvider>
    </Router>
  );
}

export default App;
