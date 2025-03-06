import { useContext, useState } from "react";
import { 
  IonButton, 
  IonContent, 
  IonHeader, 
  IonIcon, 
  IonInfiniteScroll, 
  IonInfiniteScrollContent, 
  IonList, 
  IonModal
} from "@ionic/react";
import { settings } from "ionicons/icons";
import { SceneDocType } from "../../../../Shared/types/scenes.types";
import { StripboardContext } from "../../context/StripboardContext/StripboardContext";
import ModalToolbar from "../../../../Shared/Components/modals/ModalToolbar/ModalToolbar";
import SplitLayout from "../../../../Shared/Components/organizers/SplitLayout/SplitLayout";
import ScenesList from "../ScenesList/ScenesList";

interface StripboardModalProps {
  scenes: SceneDocType[];
  scenesNotIncluded: SceneDocType[];
}

const INITIAL_LOAD_COUNT = 30; // Cantidad inicial de escenas mostradas
const LOAD_MORE_COUNT = 5; // Cantidad a cargar en cada scroll

const StripboardModal: React.FC<StripboardModalProps> = ({ scenes, scenesNotIncluded }) => {
  const { detailIsOpen, setDetailIsOpen, setShowOptionsModal } = useContext(StripboardContext);

  // Estados para manejar la cantidad de escenas mostradas
  const [scenesToDisplay, setScenesToDisplay] = useState(INITIAL_LOAD_COUNT);
  const [scenesNotIncludedToDisplay, setScenesNotIncludedToDisplay] = useState(INITIAL_LOAD_COUNT);
  

  // Función para cargar más escenas
  const loadMoreScenes = (ev: CustomEvent, type: "included" | "notIncluded") => {
    console.log(`🔄 Ejecutando loadMoreScenes para: ${type}`);

    setTimeout(() => {
      if (type === "included") {
        setScenesToDisplay((prev) => {
          const newCount = Math.min(prev + LOAD_MORE_COUNT, scenes.length);
          console.log(`✅ Nuevas escenas mostradas (included): ${newCount}`);
          return newCount;
        });
      } else {
        setScenesNotIncludedToDisplay((prev) => {
          const newCount = Math.min(prev + LOAD_MORE_COUNT, scenesNotIncluded.length);
          console.log(`✅ Nuevas escenas mostradas (notIncluded): ${newCount}`);
          return newCount;
        });
      }

      (ev.target as HTMLIonInfiniteScrollElement).complete(); // Detiene la animación del infinito scroll
    }, 500);
  };

  return (
    <IonModal isOpen={detailIsOpen} onDidDismiss={() => setDetailIsOpen(false)} color="tertiary" className="modal-styles">
      <IonHeader>
        <ModalToolbar
          toolbarTitle="Stripboard"
          handleBack={() => setDetailIsOpen(false)}
          customButtons={[
            () => (
              <IonButton key="settings" onClick={() => setShowOptionsModal(true)} slot="end">
                <IonIcon icon={settings} />
              </IonButton>
            )
          ]}
        />
      </IonHeader>

      <IonContent color="tertiary" scrollEvents={true}>
        <SplitLayout>
          {/* Lista de escenas incluidas */}
          <IonContent color='tertiary-dark'>
            <ScenesList scenes={structuredClone(scenes)} scenesToDisplay={scenesToDisplay} />
            <IonInfiniteScroll 
              threshold="100px" 
              onIonInfinite={(e) => loadMoreScenes(e, "included")}
              disabled={scenesToDisplay >= scenes.length}
            >
              <IonInfiniteScrollContent loadingText="Cargando más escenas..." />
            </IonInfiniteScroll>
          </IonContent>

          {/* Lista de escenas NO incluidas */}
          <IonContent color='tertiary-dark'>
            <ScenesList scenes={(scenesNotIncluded)} scenesToDisplay={scenesNotIncludedToDisplay} />
            <IonInfiniteScroll 
              threshold="50px" 
              onIonInfinite={(e) => loadMoreScenes(e, "notIncluded")}
              disabled={scenesNotIncludedToDisplay >= scenesNotIncluded.length}
            >
              <IonInfiniteScrollContent loadingText="Cargando más escenas..." />
            </IonInfiniteScroll>
          </IonContent>
        </SplitLayout>
      </IonContent>
    </IonModal>
  );
};

export default StripboardModal;
