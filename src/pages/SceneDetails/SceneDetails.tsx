
import {
  IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewDidLeave,
} from '@ionic/react';
import ExploreContainer from '../../components/Shared/ExploreContainer/ExploreContainer';
import useHideTabs from '../../hooks/useHideTabs';
import { useHistory, useParams } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import Toolbar from '../../components/Shared/Toolbar/Toolbar';
import SceneDetailsTabs from '../../components/Shared/SeceneDetailsTabs/SceneDetailsTabs';
import DatabaseContext from '../../context/database';
import { chevronBack, chevronForward } from 'ionicons/icons';

const SceneDetails: React.FC = () => {
 const {hideTabs, showTabs} = useHideTabs()
 const { sceneId } = useParams<{ sceneId: string }>()
 const { oneWrapDb } = useContext(DatabaseContext)
 const history = useHistory()
 const [thisScene, setThisScene] = useState<any>(null)

 const handleBack = () => {
  history.push('/my/projects/163/strips')
 }

 const getCurrentScene = async () => {
  const scene = await oneWrapDb.scenes.findOne({ selector: { id: sceneId } }).exec()
  return scene._data
 }

 useEffect(() => {
  const fetchScene = async () => {
    if (sceneId) {
      const scene = await getCurrentScene()
      setThisScene(scene)
    }
  }

  fetchScene()
 }, [
  oneWrapDb
 ])

 

 const sceneHeader = thisScene ? `${parseInt(thisScene.episodeNumber) > 0 ? (thisScene.episodeNumber + '.') : ''}${thisScene.sceneNumber}` : ''

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
        <Toolbar name='' backString handleBack={handleBack}/>
      </IonHeader>
      <IonContent color="tertiary" fullscreen>
        <IonToolbar color="success"  mode='ios'>
          <IonIcon icon={chevronBack} slot='start' size='large' />
          <IonTitle style={{fontWeight: 'lighter'}}>{`${sceneHeader} NOT ASSIGNED`}</IonTitle>
          <IonIcon icon={chevronForward} slot='end' size='large' />
        </IonToolbar>
        <ExploreContainer name="Scene Details Page" />
      </IonContent>
      <SceneDetailsTabs sceneId={sceneId} />
    </IonPage>
  )
}

;

export default SceneDetails;
