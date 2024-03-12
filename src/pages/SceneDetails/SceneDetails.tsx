
import {
  IonCol,
  IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewDidLeave,
} from '@ionic/react';
import ExploreContainer from '../../components/Shared/ExploreContainer/ExploreContainer';
import useHideTabs from '../../hooks/useHideTabs';
import { useHistory, useParams } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import Toolbar from '../../components/Shared/Toolbar/Toolbar';
import SceneDetailsTabs from '../../components/Shared/SeceneDetailsTabs/SceneDetailsTabs';
import DatabaseContext from '../../context/database';
import { chevronBack, chevronForward } from 'ionicons/icons';
import { Scene } from '../../interfaces/scenesTypes';
import floatToFraction from '../../utils/floatToFraction';
import secondsToMinSec from '../../utils/secondsToMinSec';

interface SceneInfoLabelsProps {
  info: string;
  title: string;
}

interface SceneBasicInfoProps {
  scene: Scene;
}

const SceneInfoLabels: React.FC<SceneInfoLabelsProps> = ({ info, title }) => {
  return (
    <div className='ion-flex-column' style={{textAlign: 'center', height: '100%', justifyContent: 'space-around'}}>
      <p className='ion-no-margin' style={{fontSize: '18px'}}><b>{info.toUpperCase()}</b></p>
      <p className='ion-no-margin' style={{fontSize: '12px', margin: '6px'}}>{title.toUpperCase()}</p>
    </div>
  )
}

const SceneBasicInfo: React.FC<SceneBasicInfoProps> = ({ scene }) => {
  return (
    <IonGrid fixed={true} style={{ width: '100%'}}>
      <IonRow>
        <IonCol>
          <SceneInfoLabels info={scene.episodeNumber ? scene.episodeNumber : '-'} title='Episode' />
        </IonCol>
        <IonCol>
          <SceneInfoLabels info={scene.sceneNumber ? scene.sceneNumber : '-'} title='Scene' />
        </IonCol>
        <IonCol>
          <SceneInfoLabels info={scene.scriptDay ? scene.scriptDay : '-'} title='Script Day' />
        </IonCol>
        <IonCol>
          <SceneInfoLabels info={scene.year ? scene.year : '-'} title='Year' />
        </IonCol>
        <IonCol>
          <SceneInfoLabels info={scene.page ? `${scene.page}` : '-'} title='Page' />
        </IonCol>
        <IonCol>
          <SceneInfoLabels info={scene.pages ? `${scene.pages}`: '-'} title='Pages' />
        </IonCol>
        <IonCol>
          <SceneInfoLabels info={scene.estimatedSeconds ? secondsToMinSec(scene.estimatedSeconds) : '-'} title='Time' />
        </IonCol>
        <IonCol>
          <SceneInfoLabels info='-:--' title='SHOT. TIME' />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size='2'>
          <SceneInfoLabels info={scene.intOrExtOption ? scene.intOrExtOption : '-'} title='Int/Ext' />
        </IonCol>
        <IonCol>
          <SceneInfoLabels info={scene.locationName ? scene.locationName : '-'} title='Location' />
        </IonCol>
        <IonCol>
          <SceneInfoLabels info={scene.setName ? scene.setName : '-'} title='Set' />
        </IonCol>
        <IonCol size='2'>
          <SceneInfoLabels info={scene.dayOrNightOption ? scene.dayOrNightOption : '-'} title='Day/Night' />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <p style={{textAlign: 'center', fontSize: '18px'}}><b>{scene.synopsis}</b></p>
        </IonCol>
      </IonRow>
    </IonGrid>
  )
}

const SceneDetails: React.FC = () => {
 const {hideTabs, showTabs} = useHideTabs()
 const { sceneId } = useParams<{ sceneId: string }>()
 const { oneWrapDb } = useContext(DatabaseContext)
 const history = useHistory()
 const [thisScene, setThisScene] = useState<any>(null)
 const [sceneIsLoading, setSceneIsLoading] = useState<boolean>(true)

 const handleBack = () => {
  history.push('/my/projects/163/strips')
 }

 const getCurrentScene = async () => {
  const scene = await oneWrapDb?.scenes.findOne({ selector: { id: sceneId } }).exec()
  return scene._data
 }

 useEffect(() => {
  const fetchScene = async () => {
    if (sceneId) {
      const scene = await getCurrentScene()
      setThisScene(scene)
      setSceneIsLoading(false)
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
        <IonToolbar color="success"  mode='ios'>
          <IonIcon icon={chevronBack} slot='start' size='large' />
          <IonTitle style={{fontWeight: 'lighter'}}>{`${sceneHeader} NOT ASSIGNED`}</IonTitle>
          <IonIcon icon={chevronForward} slot='end' size='large' />
        </IonToolbar>
      </IonHeader>
      <IonContent color="tertiary" fullscreen>
       {
          sceneIsLoading ? <ExploreContainer name='Loading...' /> : <SceneBasicInfo scene={thisScene} />
       }
      </IonContent>
      <SceneDetailsTabs sceneId={sceneId} />
    </IonPage>
  )
}

;

export default SceneDetails;
