import {
  IonContent, IonHeader, IonPage, useIonViewDidEnter,
} from '@ionic/react';
import React from 'react';
import { useParams } from 'react-router';
import useHideTabs from '../../hooks/utils/useHideTabs/useHideTabs';
import AppLoader from '../../Shared/Components/loaders/AppLoader/AppLoader';
import { SceneDocType } from '../../Shared/types/scenes.types';
import SceneHeader from './Components/SceneHeader/SceneHeader';
import UnassignSceneAlert from '../../Shared/Components/modals/UnassignSceneAlert/UnassignSceneAlert';
import DeleteSceneAlert from '../../Shared/Components/modals/DeleteSceneAlert/DeleteSceneAlert';
import SceneDetailsTabs from '../../Shared/Components/navigation/SeceneDetailsTabs/SceneDetailsTabs';
import { SceneDetailsProvider, useSceneDetailsContext } from './Context/SceneDetailsContext';
import SceneDetailToolbar from './Components/SceneDetailToolbar/SceneDetailToolbar';
import SceneBasicInfoForm from './Components/ScenebasicInfoForm/SceneBasicInfoForm';
import SceneDetailsNotesSection from './Components/SceneDetailsNotesSection/SceneDetailsNotesSection';
import SceneDetailsItemsSection from './Components/SceneDetailsItemsSection/SceneDetailsItemsSection';
import SceneDetailShootingSection from './Components/SceneDetailShootingSection/SceneDetailShootingSection';
import './SceneDetails.scss';

// Componente de presentación que consume el contexto
const SceneDetailsContent: React.FC = () => {
  const {
    thisScene,
    sceneIsLoading,
    sceneColor,
    loadScene,
    editMode,
    
    previousScene,
    nextScene,
    changeToPreviousScene,
    changeToNextScene,
    handleBack,
    
    thisShooting,
    thisSceneShooting,
    fetchSceneShooting,
    openDeleteSceneAlert,
    setOpenDeleteSceneAlert,
    openUnassignAlert,
    setOpenUnassignAlert,
    
    isShooting,
    creationMode,
    sceneHeader,
    rootRoute,
    rootRouteScript,
    getSceneStatus,

    sceneId
  } = useSceneDetailsContext();

  const toggleTabs = useHideTabs();
  const { id } = useParams<{ id: string }>();
  
  useIonViewDidEnter(() => {
    loadScene();
    
    if (!creationMode) {
      setTimeout(() => {
        toggleTabs.hideTabs();
      }, 150);
    }
  });

  const renderSceneHeader = () => {
    return (
      <SceneHeader
        sceneColor={sceneColor}
        sceneHeader={sceneHeader}
        previousScene={previousScene}
        nextScene={nextScene}
        changeToPreviousScene={changeToPreviousScene}
        changeToNextScene={changeToNextScene}
        status={thisSceneShooting ? getSceneStatus(thisSceneShooting) : 'NOT ASSIGNED'}
      />
    );
  };

  const renderSceneContent = () => (
    <>
      {!creationMode && !editMode && renderSceneHeader()}
      {sceneIsLoading ? <AppLoader /> : thisScene && <SceneBasicInfoForm />}
      <SceneDetailShootingSection />
      {!sceneIsLoading && thisScene && (
        <div className="grid-scene-info">
          <SceneDetailsItemsSection />
          <SceneDetailsNotesSection />
        </div>
      )}
    </>
  );

  // Para modo creación
  if (creationMode) {
    return (
      <IonPage>
        <IonHeader>
          <SceneDetailToolbar />
        </IonHeader>
        <IonContent color="tertiary" fullscreen>
          <SceneBasicInfoForm />
          <div className="grid-scene-info">
            <SceneDetailsItemsSection />
            <SceneDetailsNotesSection />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  // Para modo normal o shooting
  return (
    <IonPage>
      <IonHeader>
        <SceneDetailToolbar />
      </IonHeader>
      <IonContent color="tertiary" fullscreen>
        {renderSceneContent()}
      </IonContent>
      {
        !editMode && (
          <SceneDetailsTabs
            routeDetails={`${rootRoute}/${sceneId}${isShooting ? "?isShooting=true" : ""}`}
            routeScript={`${rootRouteScript}/${sceneId}${isShooting ? "?isShooting=true" : ""}`}
            currentRoute="scenedetails"
          />
        )
      }
      <DeleteSceneAlert
        alertIsOpen={openDeleteSceneAlert}
        setAlertIsOpen={setOpenDeleteSceneAlert}
        sceneId={sceneId}
        projectId={id}
        sceneHeader={sceneHeader}
        onSuccess={handleBack}
      />
      {
        thisShooting?.id &&
        <UnassignSceneAlert
          alertIsOpen={openUnassignAlert}
          setAlertIsOpen={setOpenUnassignAlert}
          sceneId={sceneId}
          shootingId={thisShooting?.id}
          sceneHeader={sceneHeader}
          onSuccess={() => fetchSceneShooting(thisScene as SceneDocType)}
        />
      }
    </IonPage>
  );
};

// Componente contenedor que proporciona el contexto
const SceneDetails: React.FC<{
  isShooting?: boolean;
  creationMode?: boolean;
}> = ({ isShooting = false, creationMode = false }) => {
  return (
    <SceneDetailsProvider isShooting={isShooting} creationMode={creationMode}>
      <SceneDetailsContent />
    </SceneDetailsProvider>
  );
};

export default SceneDetails;