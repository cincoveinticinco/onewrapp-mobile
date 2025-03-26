import { useContext, useEffect } from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonModal,
  IonPage,
} from "@ionic/react";
import { settings } from "ionicons/icons";
import ModalToolbar from "../../Shared/Components/modals/ModalToolbar/ModalToolbar";
import SplitLayout from "../../Shared/Components/organizers/SplitLayout/SplitLayout";
import AppLoader from "../../Shared/Components/loaders/AppLoader/AppLoader";
import ScenesList from "./Components/ScenesList/ScenesList";
import WeeksList from "./Components/WeeksList/WeeksList";
import { SearchToolbarButtonProps } from "../../Shared/Components/buttons/SearchToolbarButton/SearchToolbarButton";
import { StripboardDetailContext, StripboardDetailProvider } from "./Context/StripboardDetailContext";
import { useParams } from "react-router";
import DisplayOptionsModal from "./Components/DisplayOptionsModal/DisplayOptionsModal";
const StripboardDetailContent: React.FC = () => {

  const { 
    isLoading, 
    stripboard, 
    scenesNotIncluded, 
    scenesNotIncludedToDisplay, 
    totalMinutesNotIncluded, 
    loadMoreScenes, 
    weeks,
    activeScene,
    setShowOptions
  } = useContext(StripboardDetailContext);


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
    <IonPage>
      <IonHeader style={{ zIndex: '20' }}>
        <ModalToolbar
          toolbarTitle="Stripboard"
          handleBack={() => history.back()}
          customButtons={[
            () => (
              <IonButton fill="clear" key="settings" onClick={() => setShowOptions(true)} slot="end" color="light">
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
                  <DisplayOptionsModal />
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
    </IonPage>
  );
};

export const StripboardDetail: React.FC= () => {
  const { stripboardId } = useParams<{ stripboardId: string }>();

  console.log(stripboardId);
  return (
    <StripboardDetailProvider stripboardId={stripboardId}>
      <StripboardDetailContent />
    </StripboardDetailProvider>
  );
};

export default StripboardDetail;