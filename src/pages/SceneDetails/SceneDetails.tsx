
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
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
import secondsToMinSec from '../../utils/secondsToMinSec';
import DropDownButton from '../../components/Shared/DropDownButton/DropDownButton';
import getUniqueValuesFromNestedArray from '../../utils/getUniqueValuesFromNestedArray';
import { capitalize, set } from 'lodash';
import sortArrayAlphabeticaly from '../../utils/sortArrayAlphabeticaly';
import './SceneDetails.scss'

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
        <IonCol size-xs='3' size-sm='1.5'>
          <SceneInfoLabels info={scene.episodeNumber ? scene.episodeNumber : '-'} title='Episode' />
        </IonCol>
        <IonCol size-xs='3' size-sm='1.5'>
          <SceneInfoLabels info={scene.sceneNumber ? scene.sceneNumber : '-'} title='Scene' />
        </IonCol>
        <IonCol size-xs='3' size-sm='1.5'>
          <SceneInfoLabels info={scene.scriptDay ? scene.scriptDay : '-'} title='Script Day' />
        </IonCol>
        <IonCol size-xs='3' size-sm='1.5'>
          <SceneInfoLabels info={scene.year ? scene.year : '-'} title='Year' />
        </IonCol>
        <IonCol size-xs='3' size-sm='1.5'>
          <SceneInfoLabels info={scene.page ? `${scene.page}` : '-'} title='Page' />
        </IonCol>
        <IonCol size-xs='3' size-sm='1.5'>
          <SceneInfoLabels info={scene.pages ? `${scene.pages}`: '-'} title='Pages' />
        </IonCol>
        <IonCol size-xs='3' size-sm='1.5'>
          <SceneInfoLabels info={scene.estimatedSeconds ? secondsToMinSec(scene.estimatedSeconds) : '-'} title='Time' />
        </IonCol>
        <IonCol size-xs='3' size-sm='1.5'>
          <SceneInfoLabels info='-:--' title='SHOT. TIME' />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size-xs='6' size-sm='2'>
          <SceneInfoLabels info={scene.intOrExtOption ? scene.intOrExtOption : '-'} title='Int/Ext' />
        </IonCol>
        <IonCol size-xs='6' size-sm='4'>
          <SceneInfoLabels info={scene.locationName ? scene.locationName : '-'} title='Location' />
        </IonCol>
        <IonCol size-xs='6' size-sm='4'>
          <SceneInfoLabels info={scene.setName ? scene.setName : '-'} title='Set' />
        </IonCol>
        <IonCol size-xs='6' size-sm='2'>
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

const CategoryContainer = ({ categoryName, scene, characters, extras, elements}: any) => {
  const getCharactersByCategory = (categoryName: string, scene: Scene) => {
    const characters = scene.characters ? scene.characters.filter((character: any) => {
      if(categoryName ==='NO CATEGORY') return character.categoryName === null
      return character.categoryName === categoryName
    }) : []
    return characters
  }

  const getExtrasByCategory = (categoryName: string, scene: Scene) => {
    const extras = scene.extras ? scene.extras.filter((extra: any) => {
      if(categoryName ==='NO CATEGORY') return extra.categoryName === null
      return extra.categoryName === categoryName
    }) : []
    return extras
  }

  const getElementsByCategory = (categoryName: string, scene: Scene) => {
    const elements = scene.elements ? scene.elements.filter((element: any) => {
      if(categoryName ==='NO CATEGORY') return element.categoryName === null
      return element.categoryName === categoryName
    }) : []
    return elements
  }

  const getValuesByCategory = (categoryName: string, scene: Scene) => {
    if(characters) {
      return getCharactersByCategory(categoryName, scene)
    } else if(extras) {
      return getExtrasByCategory(categoryName, scene)
    } else if(elements) {
      return getElementsByCategory(categoryName, scene)
    }
    return []
  }

  if(getCharactersByCategory(categoryName, scene).length > 0 || getExtrasByCategory(categoryName, scene).length > 0 || getElementsByCategory(categoryName, scene).length > 0) {
    return (
      <IonCard 
        color='tertiary'
        className='scene-details-card'
      >
        <IonCardHeader>
          <p  >{capitalize(categoryName)} </p >
        </IonCardHeader>
        <IonCardContent>
          {
            getValuesByCategory(categoryName, scene).map((value: any, i) => {
              return <p 
                style={{fontSize: '16px', margin: '6px 0px'}}
              >
                {
                  characters &&
                  (value.characterNum ? value.characterNum + '. ' + value.characterName.toUpperCase() : value.characterName.toUpperCase())
                }
                {
                  extras &&
                  value.extraName && 
                  value.extraName.toUpperCase()
                }
                {
                  elements &&
                  value.elementName && 
                  value.elementName.toUpperCase()
                }
              </p>
            })
          }
        </IonCardContent>
      </IonCard>
    )
  }
}

const DropDownInfo = ({ categories, scene, title, characters = false, extras = false, elements = false }: any) => {
  const [open, setOpen] = useState<boolean>(true)
  const valuesByCategory = characters ? scene.characters.length === 0 : extras ? scene.extras.length === 0 : elements ? scene.elements.length === 0 : []

  const getUniqueCategoriesFromScene = (scene: any, characters: boolean, extras: boolean, elements: boolean) => {
    const categories = characters ? scene.characters.map((character: any) => character.categoryName) : extras ? scene.extras.map((extra: any) => extra.categoryName) : elements ? scene.elements.map((element: any) => element.categoryName) : []
    return sortArrayAlphabeticaly([...new Set(categories)])
  }

  return (
    <>
      <div className='ion-flex ion-justify-content-between ion-padding-start' style={{border: '1px solid black', backgroundColor: 'var(--ion-color-tertiary-shade)'}} onClick={() => setOpen(!open)}>
        <p style={{fontSize: '18px'}}><b>{title}</b></p>
        <DropDownButton open={open} />
      </div>
      {
        open && (
          <div className='categories-card-container'>
            { scene &&
              categories.map((category: string) => {
                return <CategoryContainer categoryName={category || 'NO CATEGORY'} scene={scene}  key={category + 'details'} characters={characters} extras={extras} elements={elements}/>
              })
            }
            {
              getUniqueCategoriesFromScene(scene, characters, extras, elements ).length % 3 === 1 && <div className='scene-details-card'></div>
            }
            {
              valuesByCategory && 
              <IonCard color="tertiary" className="no-items-card">
                <IonCardHeader>
                  <IonCardSubtitle className="no-items-card-title">
                    {
                      characters &&
                      'NO CHARACTERS ADDED TO THIS SCENE'
                    }
                    {
                      extras &&
                      'NO EXTRAS ADDED TO THIS SCENE'
                    }
                    {
                      elements &&
                      'NO ELEMENTS ADDED TO THIS SCENE'
                    }
                  </IonCardSubtitle>
                </IonCardHeader>
              </IonCard>
            }
          </div>
        )
      }
    </>
  )
}

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

;

export default SceneDetails;
