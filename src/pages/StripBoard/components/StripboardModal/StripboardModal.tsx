import { useContext, useEffect, useState } from "react";
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
import { StripboardContext } from "../../context/StripboardContext/StripboardContext";
import ModalToolbar from "../../../../Shared/Components/modals/ModalToolbar/ModalToolbar";
import SplitLayout from "../../../../Shared/Components/organizers/SplitLayout/SplitLayout";
import ScenesList from "../ScenesList/ScenesList";
import AppLoader from "../../../../Shared/Components/loaders/AppLoader/AppLoader";

interface StripboardModalProps {
  scenes: SceneDocType[];
  scenesNotIncluded: SceneDocType[];
  startDate: string | null
}

const INITIAL_LOAD_COUNT = 70; // Cantidad inicial de escenas mostradas
const LOAD_MORE_COUNT = 5; // Cantidad a cargar en cada scroll

const StripboardModal: React.FC<StripboardModalProps> = ({ scenes, scenesNotIncluded, startDate}) => {
  const { detailIsOpen, setDetailIsOpen, setShowOptionsModal } = useContext(StripboardContext);

  // Estados para manejar la cantidad de escenas mostradas
  const [scenesToDisplay, setScenesToDisplay] = useState(INITIAL_LOAD_COUNT);
  const [scenesNotIncludedToDisplay, setScenesNotIncludedToDisplay] = useState(INITIAL_LOAD_COUNT);
  const [scenesCopy, setScenesCopy] = useState<SceneDocType[]>([]);
  const [scenesNotIncludedCopy, setScenesNotIncludedCopy] = useState<SceneDocType[]>([]);
  const [scenesAreLoading, setScenesAreLoading] = useState(true);
  const [weeksInStripboard, setWeeksInStripboard] = useState<string[]>([])

  useEffect(() => {
    const scenesStructCopy = structuredClone(scenes);
    const scenesNotIncludedStrucCopy = structuredClone(scenesNotIncluded);
    if(scenesStructCopy && scenesNotIncludedStrucCopy) {
      setScenesCopy(scenesStructCopy);
      setScenesNotIncludedCopy(scenesNotIncludedStrucCopy);
      setScenesAreLoading(false);
    }
  }, [scenes, scenesNotIncluded]);

  useEffect(() => {

  }, [])
  
  const loadMoreScenes = (ev: CustomEvent, type: "included" | "notIncluded") => {
    console.log(`🔄 Ejecutando loadMoreScenes para: ${type}`);
  
    // Almacena una referencia al elemento para asegurarse de que complete() se llama
    const scrollElement = ev.target as HTMLIonInfiniteScrollElement;
    
    setTimeout(() => {
      if (type === "included") {
        setScenesToDisplay((prev) => {
          const newCount = Math.min(prev + LOAD_MORE_COUNT, scenesCopy.length);
          console.log(`✅ Nuevas escenas mostradas (included): ${newCount}`);
          return newCount;
        });
      } else {
        setScenesNotIncludedToDisplay((prev) => {
          const newCount = Math.min(prev + LOAD_MORE_COUNT, scenesNotIncludedCopy.length);
          console.log(`✅ Nuevas escenas mostradas (notIncluded): ${newCount}`);
          return newCount;
        });
      }
  
      // Asegurarse de que complete() se llama incluso si ocurre algún error
      try {
        scrollElement.complete();
      } catch (error) {
        console.error("Error al completar infinite scroll:", error);
        // Intentar resetear el estado
        setTimeout(() => {
          try {
            scrollElement.disabled = true;
            setTimeout(() => {
              scrollElement.disabled = false;
            }, 100);
          } catch (e) {
            // Ignorar errores secundarios
          }
        }, 100);
      }
    }, 500);
  };

  const sectionToolbar = (sectionName: string) => (
    <ModalToolbar
      toolbarTitle={sectionName}
      customButtons={[]}
    />
  )

  useEffect(() => {
    if (detailIsOpen) {
      // Cuando se abre el modal, damos tiempo a que se renderice y luego reseteamos los scrolls
      setTimeout(() => {
        const ionContents = document.querySelectorAll('ion-content');
        ionContents.forEach(content => {
          try {
            // Esto forzará a Ionic a recalcular los scrolls
            (content as any).scrollToTop(0);
          } catch (e) {
            // Ignorar errores
          }
        });
      }, 300);
    }
  }, [detailIsOpen]);

  return (
    <IonModal isOpen={detailIsOpen} onDidDismiss={() => setDetailIsOpen(false)} color="tertiary" className="modal-styles">
      <IonHeader style={{ zIndex: '20' }}>
        <ModalToolbar
          toolbarTitle="Stripboard"
          handleBack={() => setDetailIsOpen(false)}
          customButtons={[
            () => (
              <IonButton fill='clear' key="settings" onClick={() => setShowOptionsModal(true)} slot="end" color='light'>
                <IonIcon icon={settings} />
              </IonButton>
            )
          ]}
        />
      </IonHeader>
      {
        scenesAreLoading ? (
          <IonContent scrollEvents={true}> 
            <AppLoader  />
          </IonContent>
        ) : (
          <IonContent scrollEvents={true}>
            <SplitLayout>
            {/* Lista de escenas incluidas */}
            <IonContent color="tertiary" scrollEvents={true} className="hide-scrollbar">
              <ScenesList 
                scenes={scenesCopy} 
                scenesToDisplay={scenesToDisplay} 
                setScenes={setScenesCopy} 
                listId="included-scenes" 
                sectionToolbar={sectionToolbar("Included Scenes")}
                >
                <IonInfiniteScroll
                  threshold="150px"
                  onIonInfinite={(e) => loadMoreScenes(e, "included")}
                  disabled={scenesToDisplay >= scenesCopy.length}
                >
                  <IonInfiniteScrollContent />
                </IonInfiniteScroll>
              </ScenesList>
            </IonContent>
            {/* Lista de escenas NO incluidas */}
            <IonContent color="tertiary" scrollEvents={true} className="hide-scrollbar">
              <ScenesList 
                scenes={scenesNotIncludedCopy} 
                scenesToDisplay={scenesNotIncludedToDisplay} 
                setScenes={setScenesNotIncludedCopy} 
                listId="not-included-scenes" 
                sectionToolbar={sectionToolbar("Not Included Scenes")}
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
        )
      }
        
    </IonModal>
  );
};

export default StripboardModal;
