
import {
  IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter
} from '@ionic/react';
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
import InputAlert from '../../components/Shared/InputAlert/InputAlert';
import useSuccessToast from '../../hooks/useSuccessToast';
import { set } from 'lodash';
import useLoader from '../../hooks/useLoader';
import ScenesContext from '../../context/ScenesContext';
import applyFilters from '../../utils/applyFilters';

const SceneDetails: React.FC = () => {
  const {hideTabs, showTabs} = useHideTabs()
  const { sceneId } = useParams<{ sceneId: string }>()
  const { oneWrapDb, offlineScenes } = useContext(DatabaseContext)
  const history = useHistory()
  const [thisScene, setThisScene] = useState<any>(null)
  const [sceneIsLoading, setSceneIsLoading] = useState<boolean>(true)
  const { selectedFilterOptions } = useContext(ScenesContext)

  const filteredScenes = selectedFilterOptions && applyFilters(offlineScenes, selectedFilterOptions)

  const currentSceneIndex = filteredScenes.findIndex((scene: any) => scene.id === sceneId)
  const nextScene = filteredScenes[currentSceneIndex + 1]
  const previousScene = filteredScenes[currentSceneIndex - 1]

  const changeToNextScene = () => {
    if(nextScene) {
      history.push(`/my/projects/163/strips/details/scene/${nextScene.id}`)
    }
  }

  const changeToPreviousScene = () => {
    if(previousScene) {
      history.push(`/my/projects/163/strips/details/scene/${previousScene.id}`)
    }
  }

  const successMessageSceneToast = useSuccessToast();

  const handleBack = () => {
    history.push('/my/projects/163/strips')
  }

  const getCurrentScene = async () => {
    const scene = await oneWrapDb?.scenes.findOne({ selector: { id: sceneId } }).exec()
    return scene._data ? scene._data : null
  }

  const fetchScene = async () => {
    if (sceneId) {
      const scene = await getCurrentScene()
      setThisScene(scene)
      setTimeout(() => {
        setSceneIsLoading(false)
      }, 200)
    }
  }


  useIonViewWillEnter(() => {
    fetchScene()
  })

  useEffect(() => {
    fetchScene()
  }, [offlineScenes])

  useIonViewDidLeave(() => {
    setSceneIsLoading(true)
    setThisScene(null)
  })

  

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

  const deleteScene = async () => {
    try {
      const sceneToDelete = await oneWrapDb?.scenes.findOne({ selector: { id: sceneId } }).exec();
      await sceneToDelete?.remove();
      history.push('/my/projects/163/strips')
      successMessageSceneToast('Scene deleted successfully');
    } catch (error) {
      console.error('Error deleting scene:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <Toolbar name='' backString prohibited deleteButton edit editRoute={`/my/projects/163/editscene/${sceneId}/details`} handleBack={handleBack} deleteTrigger={`open-delete-scene-alert-${sceneId}-details`} />
        <IonToolbar color="success"  mode='ios' style={{
          border: '1px solid black',
        }}>
          {
            previousScene &&
            <IonIcon icon={chevronBack} slot='start' size='large' onClick={changeToPreviousScene} className='change-scene-button' />
          }
          <IonTitle style={{fontWeight: 'light'}}>{`${sceneHeader} NOT ASSIGNED`}</IonTitle>
          {
            nextScene &&
            <IonIcon icon={chevronForward} slot='end' size='large' onClick={changeToNextScene} className='change-scene-button' />
          }
        </IonToolbar>
      </IonHeader>
      <IonContent color="tertiary" fullscreen>
        {
            sceneIsLoading ? useLoader() : <SceneBasicInfo scene={thisScene} />
        }
        { !sceneIsLoading &&
          thisScene && (
            <div className='ion-padding-top ion-padding-bottom'>
              <DropDownInfo categories={[...sceneCastCategories]} scene={thisScene} title='CAST' characters />
              <DropDownInfo categories={[...sceneExtrasCategories]} scene={thisScene} title='EXTRAS' extras />
              <DropDownInfo categories={[...sceneElementsCategories]} scene={thisScene} title='ELEMENTS' elements />
              <DropDownInfo categories={[]} scene={thisScene} title='NOTES' notes />
            </div>
          )
        }
      </IonContent>
      <SceneDetailsTabs sceneId={sceneId} />
      <InputAlert
        header="Delete Scene"
        message={`Are you sure you want to delete scene ${sceneHeader}?`}
        handleOk={() => deleteScene()}
        inputs={[]}
        trigger={`open-delete-scene-alert-${sceneId}-details`}
      />
    </IonPage>
  )
}

export default SceneDetails;
