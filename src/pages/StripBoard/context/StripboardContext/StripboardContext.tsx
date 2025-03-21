import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { DEFAULT_DISPLAY_OPTIONS, SceneCardDisplayOptions } from '../../../../Shared/Components/cards/SceneCard/SceneCard';
import { CombinedStripboardType } from '../../../../Shared/types/stripboard.types';
// Definición del tipo para el contexto

interface StripboardContextType {
  detailIsOpen: boolean;
  setDetailIsOpen: (open: boolean) => void;
  selectedStripboard: CombinedStripboardType | null;
  setSelectedStripboard: (stripboard: CombinedStripboardType | null) => void;
  displayOptions: SceneCardDisplayOptions;
  setDisplayOptions: React.Dispatch<React.SetStateAction<SceneCardDisplayOptions>>;
  showOptionsModal: boolean;
  setShowOptionsModal: (show: boolean) => void;
  handleToggleOption: (option: keyof SceneCardDisplayOptions) => void;
}

// Valor por defecto para el contexto
const defaultContextValue: StripboardContextType = {
  detailIsOpen: false,
  setDetailIsOpen: () => {},
  selectedStripboard: null,
  setSelectedStripboard: () => {},
  displayOptions: DEFAULT_DISPLAY_OPTIONS,
  setDisplayOptions: () => {},
  showOptionsModal: false,
  setShowOptionsModal: () => {},
  handleToggleOption: () => {},
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
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  
  const [displayOptions, setDisplayOptions] = useState<SceneCardDisplayOptions>({
    ...DEFAULT_DISPLAY_OPTIONS,
    showSynopsis: false,
    showCharacters: false,
    showExtras: false, 
    showPageInfo: false,
    showTimeInfo: false,
    showAssignmentDate: false,
  });

  const handleToggleOption = (option: keyof SceneCardDisplayOptions) => {
    setDisplayOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  useEffect(() => {
    if (selectedStripboard) {
      // Crea una copia completamente nueva para asegurar que React detecte el cambio
      setSelectedStripboard({
        ...selectedStripboard,
      });
    }
  }, [displayOptions]);
  
  return (
    <StripboardContext.Provider 
      value={{
        detailIsOpen,
        setDetailIsOpen,
        selectedStripboard,
        setSelectedStripboard,
        displayOptions,
        setDisplayOptions,
        showOptionsModal,
        setShowOptionsModal,
        handleToggleOption,
      }}
    >
      {children}
    </StripboardContext.Provider>
  );
};