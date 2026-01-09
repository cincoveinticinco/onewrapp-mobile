import { createContext, useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "react-router";
import { SceneDocType } from "../../../Shared/types/scenes.types";
import { StripboardDocType, StripboardWeeks } from "../../../Shared/types/stripboard.types";
import useStripboardDetail from "../../../hooks/database/useStripboardDetail/useStripboardDetail";
import secondsToMinSec from "../../../Shared/Utils/secondsToMinSec";
import { DEFAULT_DISPLAY_OPTIONS, SceneCardDisplayOptions } from "../../../Shared/Components/cards/SceneCard/SceneCard";

interface StripboardDetailContextType {
  activeScene: number | null;
  setActiveScene: (scene: number | null) => void;
  projectId: string;
  stripboard: StripboardDocType | null;
  isLoading: boolean;
  updateStripboardHasScenes: (sceneId: string | number, dayNumber: number, unitId: number, order: number) => Promise<void>;
  scenesNotIncluded: SceneDocType[];
  setScenesNotIncluded: (scenes: SceneDocType[]) => void;
  scenesNotIncludedToDisplay: number;
  setScenesNotIncludedToDisplay: (count: number) => void;
  weeks: StripboardWeeks[];
  setWeeks: (weeks: StripboardWeeks[]) => void;
  totalMinutesNotIncluded: string;
  loadMoreScenes: (ev: CustomEvent<void>) => void | (() => void);
  resetScrollPosition: () => void;
  displayOptions: SceneCardDisplayOptions;
  setDisplayOptions: React.Dispatch<React.SetStateAction<SceneCardDisplayOptions>>;
  handleToggleOption: (option: keyof SceneCardDisplayOptions) => void;
  showOptions: boolean;
  setShowOptions: (show: boolean) => void;
  deleteStripboardHasScene: (sceneId: number) => void;
  searchText: string;
  setSearchText: (text: string) => void;
}

const defaultContextValue: StripboardDetailContextType = {
  activeScene: null,
  setActiveScene: () => {},
  projectId: '',
  stripboard: null,
  isLoading: false,
  updateStripboardHasScenes: async () => {},
  scenesNotIncluded: [],
  setScenesNotIncluded: () => {},
  scenesNotIncludedToDisplay: 0,
  setScenesNotIncludedToDisplay: () => {},
  weeks: [],
  setWeeks: () => {},
  totalMinutesNotIncluded: '',
  loadMoreScenes: () => {},
  resetScrollPosition: () => {},
  displayOptions: DEFAULT_DISPLAY_OPTIONS,
  setDisplayOptions: () => {},
  handleToggleOption: () => {},
  showOptions: false,
  setShowOptions: () => {},
  deleteStripboardHasScene: (sceneId: number) => {},
  setSearchText: () => {},
  searchText: ''
}

// Constantes
const INITIAL_LOAD_COUNT = 20;
const LOAD_MORE_COUNT = 5;
const SCROLL_RESET_DELAY = 300;
const LOAD_MORE_DELAY = 200;

export const StripboardDetailContext = createContext<StripboardDetailContextType>(defaultContextValue);

export const StripboardDetailProvider = ({ children, stripboardId }: { children: React.ReactNode; stripboardId: string }) => {
  const { id: projectId } = useParams<{ id: string }>();
  const { stripboard, isLoading, updateStripboardHasScenes, deleteStripboardHasScene, searchText, setSearchText } = useStripboardDetail({ 
    stripboardId, 
    projectId 
  });

  // Estados
  const [activeScene, setActiveScene] = useState<number | null>(null);
  const [scenesNotIncluded, setScenesNotIncluded] = useState<SceneDocType[]>([]);
  const [scenesNotIncludedToDisplay, setScenesNotIncludedToDisplay] = useState(INITIAL_LOAD_COUNT);
  const [weeks, setWeeks] = useState<StripboardWeeks[]>([]);
  const [showOptions, setShowOptions] = useState(false);

   
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

  // Controlled state update
  useEffect(() => {
    if (stripboard) {
      // Only update if there are actual changes using deep comparison
      const shouldUpdateScenes = JSON.stringify(scenesNotIncluded) !== JSON.stringify(stripboard.scenesNotIncluded);
      const shouldUpdateWeeks = JSON.stringify(weeks) !== JSON.stringify(stripboard.weeks);

      if (shouldUpdateScenes) {
        setScenesNotIncluded(stripboard.scenesNotIncluded || []);
      }

      if (shouldUpdateWeeks) {
        setWeeks(stripboard.weeks || []);
      }
    }
  }, [stripboard]);

  // Calcular el tiempo total en minutos de las escenas no incluidas
  const totalMinutesNotIncluded = useMemo(() => {
    const totalSeconds = scenesNotIncluded.reduce((acc, scene) => acc + (scene.estimatedSeconds || 0), 0);
    return secondsToMinSec(totalSeconds);
  }, [scenesNotIncluded]);

  const resetScrollPosition = useCallback(() => {
    const ionContents = document.querySelectorAll('ion-content');
    ionContents.forEach(content => {
      try {
        (content as any).scrollToTop(0);
      } catch (e) {
        // Scrolling errors can be safely ignored
        console.warn('Scroll reset error:', e);
      }
    });
  }, []);

  const loadMoreScenes = useCallback((ev: CustomEvent<void>) => {
    const scrollElement = ev.target as HTMLIonInfiniteScrollElement;

    const timer = setTimeout(() => {
      setScenesNotIncludedToDisplay(prev => 
        Math.min(prev + LOAD_MORE_COUNT, scenesNotIncluded?.length)
      );
      
      scrollElement.complete().catch(error => {
        console.error("Error completing infinite scroll:", error);
      });
    }, LOAD_MORE_DELAY);

    // Return cleanup function to clear timer if component unmounts
    return () => clearTimeout(timer);
  }, [scenesNotIncluded?.length]);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo<StripboardDetailContextType>(() => ({
    activeScene,
    setActiveScene,
    projectId,
    stripboard,
    isLoading,
    updateStripboardHasScenes,
    scenesNotIncluded,
    setScenesNotIncluded,
    scenesNotIncludedToDisplay,
    setScenesNotIncludedToDisplay,
    weeks,
    setWeeks,
    totalMinutesNotIncluded,
    loadMoreScenes,
    resetScrollPosition,
    displayOptions,
    setDisplayOptions,
    handleToggleOption,
    showOptions,
    setShowOptions,
    deleteStripboardHasScene,
    searchText,
    setSearchText
  }), [
    activeScene,
    projectId,
    stripboard,
    isLoading,
    updateStripboardHasScenes,
    scenesNotIncluded,
    scenesNotIncludedToDisplay,
    weeks,
    totalMinutesNotIncluded,
    loadMoreScenes,
    resetScrollPosition,
    displayOptions,
    handleToggleOption,
    showOptions,
    setShowOptions
  ]);

  return (
    <StripboardDetailContext.Provider value={contextValue}>
      {children}
    </StripboardDetailContext.Provider>
  );
};

export default StripboardDetailContext;