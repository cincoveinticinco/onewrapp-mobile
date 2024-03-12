
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewDidLeave,
} from '@ionic/react';
import ExploreContainer from '../../components/Shared/ExploreContainer/ExploreContainer';
import useHideTabs from '../../hooks/useHideTabs';
import { useHistory, useParams } from 'react-router';
import { useEffect } from 'react';
import Toolbar from '../../components/Shared/Toolbar/Toolbar';
import SceneDetailsTabs from '../../components/Shared/SeceneDetailsTabs/SceneDetailsTabs';

const SceneDetails: React.FC = () => {
 const {hideTabs, showTabs} = useHideTabs()
 const { sceneId } = useParams<{ sceneId: string }>()
 const history = useHistory()

 const handleBack = () => {
  history.push('/my/projects/163/strips')
 }

 useEffect(() => {
    hideTabs()
    return () => {
      showTabs()
    }
 }, [])  

 useIonViewDidEnter(() => {
   hideTabs()
  });

  return (
    <IonPage>
      <IonHeader>
        <Toolbar name='' back handleBack={handleBack}/>
      </IonHeader>
      <IonContent color="tertiary" fullscreen>
        <ExploreContainer name="Scene Details Page" />
      </IonContent>
      <SceneDetailsTabs sceneId={sceneId} />
    </IonPage>
  )
}

;

export default SceneDetails;
