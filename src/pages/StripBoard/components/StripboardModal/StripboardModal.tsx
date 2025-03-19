import { useContext, useEffect, useState, useCallback } from "react";
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
import { StripboardWeeks } from "../../../../hooks/database/useStripboards/useStripboards";
import WeeksList from "./Components/WeeksList/WeeksList";

interface StripboardModalProps {
  scenes: SceneDocType[];
  scenesNotIncluded: SceneDocType[];
  weeks: StripboardWeeks[];
}

const INITIAL_LOAD_COUNT = 70;
const LOAD_MORE_COUNT = 5;
const SCROLL_RESET_DELAY = 300;
const LOAD_MORE_DELAY = 200;

export const StripboardModal: React.FC<StripboardModalProps> = ({ scenes, scenesNotIncluded, weeks }) => {
  const { detailIsOpen, setDetailIsOpen, setShowOptionsModal } = useContext(StripboardContext);

  const [scenesNotIncludedToDisplay, setScenesNotIncludedToDisplay] = useState(INITIAL_LOAD_COUNT);
  const [scenesCopy, setScenesCopy] = useState<SceneDocType[]>([]);
  const [scenesNotIncludedCopy, setScenesNotIncludedCopy] = useState<SceneDocType[]>([]);
  const [scenesAreLoading, setScenesAreLoading] = useState(true);
  
  // Create state for scenes in units
  const [unitScenes, setUnitScenes] = useState<Record<string, SceneDocType[]>>({});

  useEffect(() => {
    if (scenes && scenesNotIncluded) {
      setScenesCopy(structuredClone(scenes));
      setScenesNotIncludedCopy(structuredClone(scenesNotIncluded));
      setScenesAreLoading(false);
      
      // Initialize unit scenes
      const unitScenesMap: Record<string, SceneDocType[]> = {};
      weeks.forEach(week => {
        week.days.forEach(day => {
          day.units.forEach(unit => {
            unitScenesMap[unit.unitId] = structuredClone(unit.scenes);
          });
        });
      });
      setUnitScenes(unitScenesMap);
    }
  }, [scenes, scenesNotIncluded, weeks]);

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

  const sectionToolbar = useCallback((sectionName: string) => (
    <ModalToolbar
      toolbarTitle={sectionName}
      customButtons={[]}
    />
  ), []);

  const updateUnitScenes = useCallback((unitId: number, scenes: SceneDocType[]) => {
    setUnitScenes(prev => ({
      ...prev,
      [unitId]: scenes
    }));
  }, []);

  if (scenesAreLoading) {
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
        <IonContent scrollEvents={true}>
          <AppLoader />
        </IonContent>
      </IonModal>
    );
  }

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
      <IonContent scrollEvents={true}>
        <SplitLayout>
          <>
            <WeeksList 
              weeks={weeks} 
              unitScenes={unitScenes} 
              updateUnitScenes={updateUnitScenes} 
            />
          </>
          <IonContent color="tertiary" scrollEvents={true} className="hide-scrollbar">
            <ScenesList 
              scenes={scenesNotIncludedCopy} 
              scenesToDisplay={scenesNotIncludedToDisplay} 
              setScenes={setScenesNotIncludedCopy} 
              listId="not-included-scenes" 
              sectionToolbar={sectionToolbar(`Scenes (${scenesNotIncludedCopy.length})`)}
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
        </SplitLayout>
      </IonContent>
    </IonModal>
  );
};

export default StripboardModal;