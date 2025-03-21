import { createContext, useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "react-router";
import { SceneDocType } from "../../../../../Shared/types/scenes.types";
import { StripboardDocType, StripboardWeeks } from "../../../../../Shared/types/stripboard.types";
import useStripboardDetail from "../../../../../hooks/database/useStripboardDetail/useStripboardDetail";
import secondsToMinSec from "../../../../../Shared/Utils/secondsToMinSec";

interface StripboardDetailContextType {
  activeScene: number | null;
  setActiveScene: (scene: number | null) => void;
  projectId: string;
  stripboard: StripboardDocType | null;
  isLoading: boolean;
  updateStripboardHasScenes: (sceneId: string | number, dayNumber: number, unitId: number, order: number) => void;
  scenesNotIncluded: SceneDocType[];
  setScenesNotIncluded: (scenes: SceneDocType[]) => void;
  scenesNotIncludedToDisplay: number;
  setScenesNotIncludedToDisplay: (count: number) => void;
  weeks: StripboardWeeks[];
  setWeeks: (weeks: StripboardWeeks[]) => void;
  totalMinutesNotIncluded: string;
  loadMoreScenes: (ev: CustomEvent<void>) => void;
  resetScrollPosition: () => void;
}

const defaultContextValue: StripboardDetailContextType = {
  activeScene: null,
  setActiveScene: () => {},
  projectId: '',
  stripboard: null,
  isLoading: false,
  updateStripboardHasScenes: () => {},
  scenesNotIncluded: [],
  setScenesNotIncluded: () => {},
  scenesNotIncludedToDisplay: 0,
  setScenesNotIncludedToDisplay: () => {},
  weeks: [],
  setWeeks: () => {},
  totalMinutesNotIncluded: '',
  loadMoreScenes: () => {},
  resetScrollPosition: () => {}
}

export const StripboardDetailContext = createContext<StripboardDetailContextType>(defaultContextValue);

// Constantes
const INITIAL_LOAD_COUNT = 20;
const LOAD_MORE_COUNT = 5;
const SCROLL_RESET_DELAY = 300;
const LOAD_MORE_DELAY = 200;

export const StripboardDetailProvider = ({ children, stripboardId }: { children: React.ReactNode; stripboardId: string }) => {
  const { id: projectId } = useParams<{ id: string }>();
  const { stripboard, isLoading, updateStripboardHasScenes } = useStripboardDetail({ 
    stripboardId, 
    projectId 
  });

  // Estados
  const [activeScene, setActiveScene] = useState<number | null>(null);
  const [scenesNotIncluded, setScenesNotIncluded] = useState<SceneDocType[]>([]);
  const [scenesNotIncludedToDisplay, setScenesNotIncludedToDisplay] = useState(INITIAL_LOAD_COUNT);
  const [weeks, setWeeks] = useState<StripboardWeeks[]>([]);

  // Actualizamos las copias locales cuando el stripboard cambia
  useEffect(() => {
    if (stripboard) {
      setScenesNotIncluded(stripboard.scenesNotIncluded);
      setWeeks(stripboard.weeks);
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
      }
    });
  }, []);

  const loadMoreScenes = useCallback((ev: CustomEvent<void>) => {
    const scrollElement = ev.target as HTMLIonInfiniteScrollElement;

    const timer = setTimeout(() => {
      setScenesNotIncludedToDisplay(prev => 
        Math.min(prev + LOAD_MORE_COUNT, scenesNotIncluded.length)
      );
      
      scrollElement.complete().catch(error => {
        console.error("Error completing infinite scroll:", error);
      });
    }, LOAD_MORE_DELAY);

    return () => clearTimeout(timer);
  }, [scenesNotIncluded.length]);


  const contextValue: StripboardDetailContextType = {
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
    resetScrollPosition
  };

  return (
    <StripboardDetailContext.Provider value={contextValue}>
      {children}
    </StripboardDetailContext.Provider>
  );
}