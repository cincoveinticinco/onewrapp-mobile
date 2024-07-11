import {
  IonButton, IonContent, IonHeader, IonItem, IonPage, IonReorderGroup,
  ItemReorderEventDetail, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter
} from '@ionic/react';
import { useContext, useEffect, useState } from 'react';
import Toolbar from '../../components/Shared/Toolbar/Toolbar';
import ShootingDetailTabs from '../../components/ShootingDetail/ShootingDetailTabs/ShootingDetailTabs';
import { useHistory, useParams } from 'react-router';
import DatabaseContext from '../../context/database';
import SceneCard from '../../components/Strips/SceneCard';
import { ShootingSceneStatusEnum } from '../../Ennums/ennums';
import useLoader from '../../hooks/useLoader';
import ShootingBanner from '../../components/ShootingDetail/ShootingBannerCard/ShootingBanner';
import { ShootingScene, ShootingBanner as ShootingBanerType } from '../../interfaces/shootingTypes';
import { IoMdAdd } from "react-icons/io";
import './ShootingDetail.css';
import EditionModal from '../../components/Shared/EditionModal/EditionModal';
import { Scene } from '../../interfaces/scenesTypes';
import InputModalScene from '../../Layouts/InputModalScene/InputModalScene';


export type ShootingViews = 'scenes' | 'info';

const ShootingDetail = () => {
  const [isDisabled, _] = useState(false);
  const { shootingId } = useParams<{ shootingId: string }>();
  const { oneWrapDb } = useContext(DatabaseContext);
  const history = useHistory();
  const [selectedScenes, setSelectedScenes] = useState<any>([]);
  const { id } = useParams<{ id: string }>();
  const [view, setView] = useState<ShootingViews>('scenes');

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const scenesData = await getScenesData();
      setShootingData({
        scenes: scenesData.scenes,
        notIncludedScenes: scenesData.scenesNotIncluded
      });
    } catch (error) {
      console.error('Error fetching scenes:', error);
    } finally {
      console.log(shootingData.scenes);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [oneWrapDb, shootingId]);

  const [shootingData, setShootingData] = useState<any>({
    scenes: [],
    showAddMenu: false,
    notIncludedScenes: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    saveShooting();
  }, [shootingData.scenes]);

  const availableColors = [
    { value: '#19cff9', name: 'blue' },
    { value: '#3dc2ff', name: 'light blue' },
    { value: '#282f3a', name: 'dark gray' },
    { value: '#04feaa', name: 'green' },
    { value: '#ffb203', name: 'orange' },
    { value: '#ff4a8f', name: 'pink' },
    { value: '#fff', name: 'white' },
    { value: '#707070', name: 'gray' },
    { value: '#000', name: 'black' },
    { value: '#f3fb8c', name: 'yellow' },
    { value: '#fdc6f7', name: 'light pink' }
  ];

  const selectOptions = availableColors.map((color) => ({
    value: color.value,
    label: color.name
  }));

  const addNewBanner = (banner: any) => {
    banner.position = shootingData.scenes.length;
    banner.id = `banner-${shootingData.scenes.length}`;
    banner.fontSize = parseInt(banner.fontSize);
    banner.shootingId = parseInt(shootingId);
    banner.createdAt = new Date().toISOString();
    banner.updatedAt = new Date().toISOString();

    setShootingData((prev: any) => ({
      ...prev,
      scenes: [...prev.scenes, { cardType: 'banner', ...banner }]
    }));
  };

  const bannerInputs = [
    { label: 'Description', type: 'text', fieldName: 'description', placeholder: 'INSERT', required: true, inputName: 'add-banner-description-input' },
    { label: 'Font Size', type: 'number', fieldName: 'fontSize', placeholder: 'INSERT', required: false, inputName: 'add-character-name-input' },
    {
      label: 'Color', type: 'select', fieldName: 'backgroundColor', placeholder: 'SELECT COLOR',
      required: false, inputName: 'add-background-color-input', selectOptions: selectOptions
    },
  ];

  const AddNewBanner = () => (
    <EditionModal
      modalTrigger='open-add-new-banner-modal'
      title='Add New Banner'
      formInputs={bannerInputs}
      handleEdition={addNewBanner}
      defaultFormValues={{}}
      modalId='add-new-banner-modal'
    />
  );

  const checkboxScenesToggle = (scene: Scene) => {
    const shootingScene: ShootingScene = {
      id: `${shootingId}.${scene.sceneId}`,
      projectId: parseInt(id),
      shootingId: parseInt(shootingId),
      sceneId: scene.sceneId.toString(),
      status: ShootingSceneStatusEnum.NotShoot,
      position: shootingData.scenes.length,
      rehersalStart: null,
      rehersalEnd: null,
      startShooting: null,
      endShooting: null,
      producedSeconds: 0,
      setups: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setShootingData((prev: any) => ({
      ...prev,
      scenes: [...prev.scenes, { cardType: 'scene', ...shootingScene, ...scene }]
    }));
    setSelectedScenes([...selectedScenes, scene]);
  };

  const AddNewScenes = () => (
    <InputModalScene
      sceneName="Add New Scene"
      listOfScenes={shootingData.notIncludedScenes}
      modalTrigger="open-add-new-scene-modal"
      handleCheckboxToggle={checkboxScenesToggle}
      selectedScenes={selectedScenes}
      setSelectedScenes={setSelectedScenes}
      clearSelections={clearSelectedScenes}
      multipleSelections={true}
    />
  );

  const clearSelectedScenes = () => {
    setSelectedScenes([]);
  };

  const formatSceneAsShootingScene = (scene: any): ShootingScene => {
    return {
      id: scene.id,
      projectId: scene.projectId,
      shootingId: scene.shootingId,
      sceneId: scene.sceneId.toString(),
      status: scene.status,
      position: scene.position,
      rehersalStart: scene.rehersalStart,
      rehersalEnd: scene.rehersalEnd,
      startShooting: scene.startShooting,
      endShooting: scene.endShooting,
      producedSeconds: scene.producedSeconds,
      setups: scene.setups,
      createdAt: scene.createdAt,
      updatedAt: scene.updatedAt
    };
  };

  const saveShooting = async () => {
    if (oneWrapDb && shootingId) {
      try {
        const shooting = await oneWrapDb.shootings.findOne({ selector: { id: shootingId } }).exec();
        
        console.log(shooting, '*******')

        if (shooting) {
          const updatedScenes = shootingData.scenes
            .filter((item: any) => item.cardType === 'scene')
            .map((scene: any) => formatSceneAsShootingScene(scene));
          const updatedBanners = shootingData.scenes.filter((item: any) => item.cardType === 'banner')
            .map(({ cardType, ...banner }: {
              cardType: string;
              id: string;
              position: number;
              description: string;
            }) => banner);

          let shootingCopy = { ...shooting._data };
          shootingCopy.scenes = updatedScenes;
          shootingCopy.banners = updatedBanners;
          shootingCopy.updatedAt = new Date().toISOString();
          
          console.log('Shooting to save:', shootingCopy);
          return await oneWrapDb.shootings.upsert(shootingCopy);
        }
      } catch (error) {
        console.error('Error saving new Shooting:', error);
      }
    }
  };

  const handleReorder = async (event: CustomEvent<ItemReorderEventDetail>) => {
    console.log('Dragged from index', event.detail.from, 'to', event.detail.to);
    
    const items = [...shootingData.scenes];
    const [reorderedItem] = items.splice(event.detail.from, 1);
    items.splice(event.detail.to, 0, reorderedItem);
  
    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index
    }));
  
    setShootingData((prev: any) => ({
      ...prev,
      scenes: updatedItems
    }));

    event.detail.complete();
    
    try {
      console.log('Order saved successfully');
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  const { setViewTabs } = useContext(DatabaseContext);

  useIonViewDidEnter(() => {
    setViewTabs(false);
  });

  useIonViewWillEnter(() => {
    setViewTabs(false);
  });

  useIonViewDidLeave(() => {
    setViewTabs(true);
  });

  const shootingDeleteScene = (scene: ShootingScene & Scene) => {
    shootingData.scenes = shootingData.scenes.filter((s: ShootingScene & Scene) => s.sceneId !== scene.sceneId);
    setShootingData({ ...shootingData });
  };

  const shootingDeleteBanner = (banner: ShootingBanerType) => {
    const updatedScenes = shootingData.scenes.filter((item: any) => {
      if (item.cardType === 'banner' && item.id === banner.id) {
        return false;
      }
      return true;
    });
  
    setShootingData((prev: any) => ({
      ...prev,
      scenes: updatedScenes
    }));
  };

  const getScenesData = async () => {
    const shootings: any = await oneWrapDb?.shootings.find({ selector: { id: shootingId } }).exec();
    
    const scenesInShoot = shootings[0]._data.scenes;
    const bannersInShoot = shootings[0]._data.banners;
    const scenesIds = scenesInShoot.map((scene: any) => parseInt(scene.sceneId));

    const scenesData = await oneWrapDb?.scenes.find({
      selector: { sceneId: { $in: scenesIds } }
    }).exec();

    const scenesNotIncluded = await oneWrapDb?.scenes.find({
      selector: { projectId: shootings[0]._data.projectId, sceneId: { $nin: scenesIds } }
    }).exec();
    
    const mergedScenesData = scenesData?.map((scene: any) => {
      const sceneShootingData = scenesInShoot.find((sceneInShoot: any) => parseInt(sceneInShoot.sceneId) === parseInt(scene.sceneId));
      console.log(sceneShootingData);
      return {
        cardType: 'scene',
        ...scene._data,
        ...sceneShootingData
      };
    }) ?? [];
    
    const bannersWIthType = bannersInShoot.map((banner: any) => ({
      cardType: 'banner', ...banner
    }));
    
    return {
      scenes: [...mergedScenesData, ...bannersWIthType].sort((a: any, b: any) => a.position - b.position),
      scenesNotIncluded: scenesNotIncluded?.map((scene: any) => scene._data) ?? []
    };
  };

  const handleBack = () => {
    history.push(`/my/projects/${id}/calendar`);
  };

  const toggleAddMenu = () => {
    setShootingData((prev: any) => ({
      ...prev,
      showAddMenu: !prev.showAddMenu
    }));
  };

  const addShoBanSc = () => (
    <div className='button-wrapper' slot="end">
      <IonButton fill="clear" slot="end" color="light" className="ion-no-padding toolbar-button" onClick={() => {
        setTimeout(() => {
          toggleAddMenu();
        }, 0);
      }}>
        <IoMdAdd className="toolbar-icon" />
      </IonButton>
    </div>
  );

  return (
    <IonPage>
      <IonHeader>
        <Toolbar name="" addShoBanSc={addShoBanSc} backString handleBack={handleBack} />
      </IonHeader>
      {shootingData.showAddMenu && (
        <div className='add-menu'>
          <IonItem id='open-add-new-scene-modal'>Add Scene</IonItem>
          <IonItem id='open-add-new-banner-modal'>Add Banner</IonItem>
        </div>
      )}
      {
        view === 'scenes' && (
          <IonContent color="tertiary" fullscreen>
          <IonReorderGroup disabled={isDisabled} onIonItemReorder={handleReorder}>
            {isLoading ? (
              useLoader()
            ) : (
              shootingData.scenes.map((scene: any) => (
                scene.cardType === 'scene' ? (
                  <SceneCard 
                    key={scene.sceneId} 
                    scene={scene} 
                    isShooting={true} 
                    isProduced={scene.status !== ShootingSceneStatusEnum.NotShoot}
                    shootingDeleteScene={() => shootingDeleteScene(scene)}
                  />
                ) : (
                  <ShootingBanner 
                    key={scene.id} 
                    banner={scene} 
                    shootingDeleteBanner={() => shootingDeleteBanner(scene)} 
                  />
                )
              ))
            )}
          </IonReorderGroup>
        </IonContent>
        )
      }
      <ShootingDetailTabs setView={setView} view ={view}/>
      <AddNewBanner />
      <AddNewScenes />
    </IonPage>
  );
};

export default ShootingDetail;
