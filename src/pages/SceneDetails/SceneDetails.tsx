
import {
  IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar, useIonViewDidEnter
} from '@ionic/react';
import ExploreContainer from '../../components/Shared/ExploreContainer/ExploreContainer';
import useHideTabs from '../../hooks/useHideTabs';
import { useHistory, useParams } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import Toolbar from '../../components/Shared/Toolbar/Toolbar';
import SceneDetailsTabs from '../../components/Shared/SeceneDetailsTabs/SceneDetailsTabs';
import DatabaseContext from '../../context/database';
import { chevronBack, chevronForward } from 'ionicons/icons';
import getUniqueValuesFromNestedArray from '../../utils/getUniqueValuesFromNestedArray';
import sortArrayAlphabeticaly from '../../utils/sortArrayAlphabeticaly';
import './SceneDetails.scss'
import SceneBasicInfo from '../../components/SceneDetails/SceneBasicInfo';
import DropDownInfo from '../../components/SceneDetails/DropDownInfo';

const SceneDetails: React.FC = () => {
  const {hideTabs, showTabs} = useHideTabs()
  const { sceneId } = useParams<{ sceneId: string }>()
  const { oneWrapDb, offlineScenes } = useContext(DatabaseContext)
  const history = useHistory()
  const [thisScene, setThisScene] = useState<any>(null)
  const [sceneIsLoading, setSceneIsLoading] = useState<boolean>(true)

  const handleBack = () => {
    history.push('/my/projects/163/strips')
  }

  const getCurrentScene = async () => {
    const scene = await oneWrapDb?.scenes.findOne({ selector: { id: sceneId } }).exec()
    return scene._data ? scene._data : null
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

  const sceneCastCategories = sortArrayAlphabeticaly(getUniqueValuesFromNestedArray(offlineScenes, 'characters', 'categoryName').map((category: any) => category.categoryName))

  const sceneExtrasCategories = sortArrayAlphabeticaly(getUniqueValuesFromNestedArray(offlineScenes, 'extras', 'categoryName').map((category: any) => category.categoryName))

  const sceneElementsCategories = sortArrayAlphabeticaly(getUniqueValuesFromNestedArray(offlineScenes, 'elements', 'categoryName').map((category: any) => category.categoryName))

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
        {
          thisScene && (
            <div className='ion-padding-top ion-padding-bottom'>
              <DropDownInfo categories={[...sceneCastCategories]} scene={thisScene} title='CAST' characters />
              <DropDownInfo categories={[...sceneExtrasCategories]} scene={thisScene} title='EXTRAS' extras />
              <DropDownInfo categories={[...sceneElementsCategories]} scene={thisScene} title='ELEMENTS' elements />
            </div>
          )
        }
      </IonContent>
      <SceneDetailsTabs sceneId={sceneId} />
    </IonPage>
  )
}

export default SceneDetails;
