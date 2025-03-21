import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonModal,
} from "@ionic/react";
import { settings } from "ionicons/icons";
import { SceneDocType } from "../../../../Shared/types/scenes.types";
import ModalToolbar from "../../../../Shared/Components/modals/ModalToolbar/ModalToolbar";
import SplitLayout from "../../../../Shared/Components/organizers/SplitLayout/SplitLayout";
import AppLoader from "../../../../Shared/Components/loaders/AppLoader/AppLoader";
import { StripboardContext } from "../../context/StripboardContext/StripboardContext";
import ScenesList from "../ScenesList/ScenesList";
import WeeksList from "./Components/WeeksList/WeeksList";
import { SearchToolbarButtonProps } from "../../../../Shared/Components/buttons/SearchToolbarButton/SearchToolbarButton";
import secondsToMinSec from "../../../../Shared/Utils/secondsToMinSec";
import useStripboardDetail from "../../../../hooks/database/useStripboardDetail/useStripboardDetail";
import { useParams } from "react-router";
import { StripboardWeeks } from "../../../../Shared/types/stripboard.types";

interface StripboardModalProps {
  stripboardId: string;
}

const INITIAL_LOAD_COUNT = 70;
const LOAD_MORE_COUNT = 5;
const SCROLL_RESET_DELAY = 300;
const LOAD_MORE_DELAY = 200;

export const StripboardModal: React.FC<StripboardModalProps> = ({ stripboardId }) => {
  const { detailIsOpen, setDetailIsOpen, setShowOptionsModal } = useContext(StripboardContext);
  const { id: projectId } = useParams<{ id: string }>();
  const { stripboard, isLoading, updateStripboardHasScenes } = useStripboardDetail({ 
    stripboardId, 
    projectId 
  });

  const [scenesNotIncludedToDisplay, setScenesNotIncludedToDisplay] = useState(INITIAL_LOAD_COUNT);
  const [scenesNotIncludedCopy, setScenesNotIncludedCopy] = useState<SceneDocType[]>([]);
  const [weeksCopy, setWeeksCopy] = useState<StripboardWeeks[]>([]);

  const totalMinutesNotIncluded = useMemo(() => {
    const totalSeconds = scenesNotIncludedCopy.reduce((acc, scene) => acc + (scene.estimatedSeconds || 0), 0);
    return secondsToMinSec(totalSeconds);
  }, [scenesNotIncludedCopy]);

  // Solo actualizamos las copias locales cuando el stripboard cambia y NO estamos en edición
  useEffect(() => {
    if (stripboard) {
      setScenesNotIncludedCopy(stripboard.scenesNotIncluded);
      setWeeksCopy(stripboard.weeks);
    }
  }, [stripboard]);

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

  useEffect(() => {
    if (detailIsOpen) {
      const timer = setTimeout(resetScrollPosition, SCROLL_RESET_DELAY);
      return () => clearTimeout(timer);
    }
  }, [detailIsOpen, resetScrollPosition]);
  
  const loadMoreScenes = useCallback((ev: CustomEvent, type: "included" | "notIncluded") => {
    const scrollElement = ev.target as HTMLIonInfiniteScrollElement;

    const timer = setTimeout(() => {
      if (type === "notIncluded") {
        setScenesNotIncludedToDisplay(prev => 
          Math.min(prev + LOAD_MORE_COUNT, scenesNotIncludedCopy.length)
        );
      }
    }, LOAD_MORE_DELAY);

    scrollElement.complete().catch(error => {
      console.error("Error completing infinite scroll:", error);
    });

    return () => clearTimeout(timer);
  }, [scenesNotIncludedCopy.length]);

  const sectionToolbar = useCallback((sectionName: string, search?: SearchToolbarButtonProps) => (
    <ModalToolbar
      toolbarTitle={sectionName}
      customButtons={[]}
      search={search}
      slotTitle="start"
      color="tertiary-dark"
    />
  ), []);

  // Este es el handler que pasa a WeeksList para manejar actualizaciones locales
  const handleUpdateStripboardHasScenes = useCallback((scenes: SceneDocType[], dayNumber: number, unitId: number) => {
    // Primero actualizamos las copias locales para reflejar inmediatamente el cambio en la UI
    updateStripboardHasScenes(scenes, dayNumber, unitId);
  }, [updateStripboardHasScenes]);

  return (
    <IonModal isOpen={detailIsOpen} onDidDismiss={() => setDetailIsOpen(false)} color="tertiary" className="modal-styles">
      <IonHeader style={{ zIndex: '20' }}>
        <ModalToolbar
          toolbarTitle="Stripboard"
          handleBack={() => setDetailIsOpen(false)}
          customButtons={[
            () => (
              <IonButton fill="clear" key="settings" onClick={() => setShowOptionsModal(true)} slot="end" color="light">
                <IonIcon icon={settings} />
              </IonButton>
            )
          ]}
        />
      </IonHeader>
      {
        isLoading ? (
          <IonContent color='tertiary' fullscreen>
            <AppLoader />
          </IonContent>
        ) : stripboard ? (
          (
            <IonContent scrollEvents={true}>
              <SplitLayout>
                <IonContent color="tertiary" scrollEvents={true} className="hide-scrollbar">
                  <ScenesList 
                    scenes={scenesNotIncludedCopy} 
                    scenesToDisplay={scenesNotIncludedToDisplay} 
                    setScenes={setScenesNotIncludedCopy} 
                    listId="not-included-scenes" 
                    sectionToolbar={(search?: SearchToolbarButtonProps) => sectionToolbar(`Scenes (${scenesNotIncludedCopy.length}) - MIN ${totalMinutesNotIncluded} `, search)}
                  >
                    <IonInfiniteScroll
                      threshold="150px"
                      onIonInfinite={(e) => loadMoreScenes(e, "notIncluded")}
                      disabled={scenesNotIncludedToDisplay >= scenesNotIncludedCopy.length}
                    >
                      <IonInfiniteScrollContent />
                    </IonInfiniteScroll>
                  </ScenesList>
                </IonContent>
                <WeeksList 
                  weeks={weeksCopy}
                  stripboardName={stripboard.name}
                  updateStripboardHasScenes={handleUpdateStripboardHasScenes}
                />
              </SplitLayout>
            </IonContent>
          )
        ) : (
          <IonContent color='tertiary' fullscreen>
            <div>Stripboard not found</div>
          </IonContent>
        )
      }
    </IonModal>
  );
};

export default StripboardModal;