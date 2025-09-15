import { createContext, useContext, useState } from "react";

const UIContext = createContext();

export function UIProvider({ children }) {
  const [isLeftOpen, setIsLeftOpen] = useState(true);

  return (
    <UIContext.Provider value={{ isLeftOpen, setIsLeftOpen }}>
      {children}
    </UIContext.Provider>
  );
}

// Hook pratique pour accéder au contexte
export function useUI() {
  return useContext(UIContext);
}
