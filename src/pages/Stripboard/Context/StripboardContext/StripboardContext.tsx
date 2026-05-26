import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { CombinedStripboardType } from '../../../../Shared/types/stripboard.types';
// Definición del tipo para el contexto

interface StripboardContextType {
  detailIsOpen: boolean;
  setDetailIsOpen: (open: boolean) => void;
  selectedStripboard: CombinedStripboardType | null;
  setSelectedStripboard: (stripboard: CombinedStripboardType | null) => void;
}

// Valor por defecto para el contexto
const defaultContextValue: StripboardContextType = {
  detailIsOpen: false,
  setDetailIsOpen: () => {},
  selectedStripboard: null,
  setSelectedStripboard: () => {},
};

// Creación del contexto
export const StripboardContext = createContext<StripboardContextType>(defaultContextValue);

// Proveedor del contexto
interface StripboardProviderProps {
  children: ReactNode;
}

export const StripboardProvider: React.FC<StripboardProviderProps> = ({ children }) => {
  const [detailIsOpen, setDetailIsOpen] = useState(false);
  const [selectedStripboard, setSelectedStripboard] = useState<CombinedStripboardType | null>(null);
  
  return (
    <StripboardContext.Provider 
      value={{
        detailIsOpen,
        setDetailIsOpen,
        selectedStripboard,
        setSelectedStripboard,
      }}
    >
      {children}
    </StripboardContext.Provider>
  );
};