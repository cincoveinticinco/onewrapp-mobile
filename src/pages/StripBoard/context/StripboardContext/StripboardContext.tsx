import React, { createContext, useState, ReactNode } from 'react';
import { CombinedStripboardType } from '../../../../hooks/database/useStripboards/useStripboards';
import { DEFAULT_DISPLAY_OPTIONS, SceneCardDisplayOptions } from '../../../../Shared/Components/cards/SceneCard/SceneCard';
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
  
  // Estado para las opciones de visualización
  const [displayOptions, setDisplayOptions] = useState<SceneCardDisplayOptions>({
    ...DEFAULT_DISPLAY_OPTIONS,
    // Por defecto, solo mostrar el encabezado en el StripBoard
    showSynopsis: false,
    showCharacters: false,
    showExtras: false, 
    showPageInfo: false,
    showTimeInfo: false,
    showAssignmentDate: false,
  });

  // Manejador para cambiar una opción de visualización
  const handleToggleOption = (option: keyof SceneCardDisplayOptions) => {
    setDisplayOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

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