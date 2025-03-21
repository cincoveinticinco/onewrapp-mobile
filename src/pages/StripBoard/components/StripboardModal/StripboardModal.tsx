import { useContext, useEffect } from "react";
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
import ModalToolbar from "../../../../Shared/Components/modals/ModalToolbar/ModalToolbar";
import SplitLayout from "../../../../Shared/Components/organizers/SplitLayout/SplitLayout";
import AppLoader from "../../../../Shared/Components/loaders/AppLoader/AppLoader";
import { StripboardContext } from "../../context/StripboardContext/StripboardContext";
import ScenesList from "../ScenesList/ScenesList";
import WeeksList from "./Components/WeeksList/WeeksList";
import { SearchToolbarButtonProps } from "../../../../Shared/Components/buttons/SearchToolbarButton/SearchToolbarButton";
import { StripboardDetailContext, StripboardDetailProvider } from "./Context/StripboardDetailContext";

interface StripboardModalProps {
  stripboardId: string;
}

const StripboardModalContent: React.FC = () => {
  const { detailIsOpen, setDetailIsOpen, setShowOptionsModal } = useContext(StripboardContext);

  const { 
    isLoading, 
    stripboard, 
    scenesNotIncluded, 
    scenesNotIncludedToDisplay, 
    totalMinutesNotIncluded, 
    loadMoreScenes, 
    resetScrollPosition, 
    weeks,
    activeScene
  } = useContext(StripboardDetailContext);

  useEffect(() => {
    if (detailIsOpen) {
      const timer = setTimeout(resetScrollPosition, 300);
      return () => clearTimeout(timer);
    }
  }, [detailIsOpen, resetScrollPosition]);

  const sectionToolbar = (sectionName: string, search?: SearchToolbarButtonProps) => (
    <ModalToolbar
      toolbarTitle={sectionName}
      customButtons={[]}
      search={search}
      slotTitle="start"
      color="tertiary-dark"
    />
  );

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
                    scenes={scenesNotIncluded} 
                    scenesToDisplay={scenesNotIncludedToDisplay}
                    listId="not-included-scenes" 
                    sectionToolbar={(search?: SearchToolbarButtonProps) => sectionToolbar(`Scenes (${scenesNotIncluded.length}) - MIN ${totalMinutesNotIncluded} ${activeScene} `, search)}
                  >
                    <IonInfiniteScroll
                      threshold="150px"
                      onIonInfinite={loadMoreScenes}
                      disabled={scenesNotIncludedToDisplay >= scenesNotIncluded.length}
                    >
                      <IonInfiniteScrollContent />
                    </IonInfiniteScroll>
                  </ScenesList>
                </IonContent>
                <WeeksList 
                  weeks={weeks}
                  stripboardName={stripboard.name}
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

export const StripboardModal: React.FC<StripboardModalProps> = ({ stripboardId }) => {
  return (
    <StripboardDetailProvider stripboardId={stripboardId}>
      <StripboardModalContent />
    </StripboardDetailProvider>
  );
};

export default StripboardModal;