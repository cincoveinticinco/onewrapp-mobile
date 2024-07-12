import {
  IonButton, IonContent, IonHeader, IonItem, IonPage, IonReorderGroup,
  ItemReorderEventDetail, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter
} from '@ionic/react';
import { useContext, useEffect, useRef, useState } from 'react';
import Toolbar from '../../components/Shared/Toolbar/Toolbar';
import ShootingDetailTabs from '../../components/ShootingDetail/ShootingDetailTabs/ShootingDetailTabs';
import { useHistory, useParams } from 'react-router';
import DatabaseContext from '../../context/database';
import SceneCard from '../../components/Strips/SceneCard';
import { ShootingSceneStatusEnum } from '../../Ennums/ennums';
import useLoader from '../../hooks/useLoader';
import { ShootingScene, ShootingBanner as ShootingBannerType, LocationInfo, AdvanceCalls, meals } from '../../interfaces/shootingTypes';
import { IoMdAdd } from "react-icons/io";
import './ShootingDetail.css';
import EditionModal from '../../components/Shared/EditionModal/EditionModal';
import { Scene } from '../../interfaces/scenesTypes';
import InputModalScene from '../../Layouts/InputModalScene/InputModalScene';
import ShootingBanner from '../../components/ShootingDetail/ShootingBannerCard/ShootingBanner';
import floatToFraction from '../../utils/floatToFraction';
import secondsToMinSec from '../../utils/secondsToMinSec';
import ShootingBasicInfo from '../../components/ShootingDetail/ShootingBasicInfo/ShootingBasicInfo';
import DropDownButton from '../../components/Shared/DropDownButton/DropDownButton';


export type ShootingViews = 'scenes' | 'info';
type cardType = {
  cardType: string;
};
type mergedSceneBanner = (Scene & ShootingScene & cardType) | (ShootingBannerType & cardType)
interface ShootingInfo  {
  generalCall: string;
  readyToShoot: string;
  estimatedWrap: string;
  wrap: string;
  lastOut: string;
  sets: number;
  scenes: number;
  pages: string;
  min: string;
  locations: LocationInfo[];
  hospitals: LocationInfo[];
  advanceCalls: AdvanceCalls[]
  meals: meals[];
}

interface ShootingDataProps {
  scenes: mergedSceneBanner[];
  notIncludedScenes: Scene[];
  showAddMenu: boolean;
  shotingInfo: ShootingInfo;
  shootingFormattedDate: string;
}

const ShootingDetail = () => {
  const [isDisabled, _] = useState(false);
  const { shootingId } = useParams<{ shootingId: string }>();
  const { oneWrapDb } = useContext(DatabaseContext);
  const history = useHistory();
  const [selectedScenes, setSelectedScenes] = useState<any>([]);
  const { id } = useParams<{ id: string }>();
  const [view, setView] = useState<ShootingViews>('scenes');
  const [openLocations, setOpenLocations] = useState(false);
  const [openHospitals, setOpenHospitals] = useState(false);
  const [openadvanceCalls, setOpenadvanceCalls] = useState(false);
  const [openMeals, setOpenMeals] = useState(false);

  const [shootingData, setShootingData] = useState<ShootingDataProps>({
    scenes: [],
    showAddMenu: false,
    notIncludedScenes: [],
    shotingInfo: {
      generalCall: '--:--',
      readyToShoot: '--:--',
      estimatedWrap: '--:--',
      wrap: '--:--',
      lastOut: '--:--',
      sets: 1,
      scenes: 0,
      pages: '0/0',
      min: '--:--',
      locations: [],
      hospitals: [],
      advanceCalls: [],
      meals: []
    },
    shootingFormattedDate: ''
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const scenesData = await getShootingData();
      setShootingData({
        scenes: scenesData.scenes,
        notIncludedScenes: scenesData.scenesNotIncluded,
        showAddMenu: false,
        shotingInfo: scenesData.shootingInfo,
        shootingFormattedDate: scenesData.formattedDate
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

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    saveShooting();
  }, [shootingData.scenes]);

  const availableColors = [
    { value: '#3dc2ff', name: 'light blue' },
    { value: '#282f3a', name: 'dark gray' },
    { value: '#04feaa', name: 'green' },
    { value: '#ffb203', name: 'orange' },
    { value: '#ff4a8f', name: 'pink' },
    { value: '#707070', name: 'gray' },
    { value: '#000', name: 'black' },
    { value: '#f3fb8c', name: 'yellow' },
    { value: '#fdc6f7', name: 'light pink' }
  ];

  const selectOptions = availableColors.map((color) => ({
    value: color.value,
    label: color.name
  }));

  const fontSizeOptions = [
    {
      value: 12,
      label: '12 px'
    },
    {
      value: 14,
      label: '14 px'
    },
    {
      value: 16,
      label: '16 px'
    },
    {
      value: 18,
      label: '18 px'
    },
    {
      value: 20,
      label: '20 px'
    }
  ]

  const addNewBanner = (banner: any) => {
    banner.position = shootingData.scenes.length;
    banner.id = null;
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
    { 
      label: 'Description', type: 'text', fieldName: 'description', placeholder: 'INSERT', required: true, inputName: 'add-banner-description-input', col: '4' 
    },
    { 
      label: 'Font Size', type: 'select', fieldName: 'fontSize', placeholder: 'INSERT', required: false, inputName: 'add-character-name-input', col: '4', selectOptions: fontSizeOptions
    },
    {
      label: 'Color', type: 'select', fieldName: 'backgroundColor', placeholder: 'SELECT COLOR',
      required: false, inputName: 'add-background-color-input', selectOptions: selectOptions, col: '4'
    },
  ];

  const AddNewBanner = () => (
    <EditionModal
      modalTrigger={'open-add-new-banner-modal' + '-' + shootingId}
      title='Add New Banner'
      formInputs={bannerInputs}
      handleEdition={addNewBanner}
      defaultFormValues={{}}
      modalId='add-new-banner-modal'
    />
  );

  const checkboxScenesToggle = (scene: Scene) => {
    const shootingScene: ShootingScene = {
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
      modalTrigger={'open-add-new-scene-modal' + '-' + shootingId}
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
          const updatedBanners = shootingData.scenes.filter((item: mergedSceneBanner) => item.cardType === 'banner')
            .map(({ cardType, ...banner } : mergedSceneBanner) => banner);

          let shootingCopy = { ...shooting._data };
          shootingCopy.scenes = updatedScenes;
          shootingCopy.banners = updatedBanners;
          
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
    const updatedScenes = shootingData.scenes.filter((s: any) => {
      if (s.cardType === 'scene') {
        if (s.id === null) {
          // Para escenas recién creadas, comparamos por posición
          return s.position !== scene.position;
        } else {
          // Para escenas existentes, comparamos por sceneId
          return s.sceneId !== scene.sceneId;
        }
      }
      return true;
    });
    setShootingData({ ...shootingData, scenes: updatedScenes });
  };
  
  const shootingDeleteBanner = (banner: mergedSceneBanner) => {
    const updatedScenes = shootingData.scenes.filter((item: any) => {
      if (item.cardType === 'banner') {
        if (item.id === null) {
          // Para banners recién creados, comparamos por posición
          return item.position !== banner.position;
        } else {
          // Para banners existentes, comparamos por id
          return item.id !== banner.id;
        }
      }
      return true;
    });
  
    setShootingData((prev: any) => ({
      ...prev,
      scenes: updatedScenes
    }));
  };

  const getHourMinutesFomISO = (iso: string) => {
    const date = new Date(iso);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  }

  const getShootingData = async () => {
    const shootings: any = await oneWrapDb?.shootings.find({ selector: { id: shootingId } }).exec();
    
    const scenesInShoot = shootings[0]._data.scenes;
    const bannersInShoot = shootings[0]._data.banners;
    const scenesIds = scenesInShoot.map((scene: any) => parseInt(scene.sceneId));

    console.log(scenesInShoot, 'scenesInShoot')

    // from 2000-01-01T06:00:00.000-05:00 to 06:00

    const scenesData = await oneWrapDb?.scenes.find({
      selector: { sceneId: { $in: scenesIds } }
    }).exec();

    const scenesNotIncluded = await oneWrapDb?.scenes.find({
      selector: { projectId: shootings[0]._data.projectId, sceneId: { $nin: scenesIds } }
    }).exec();
    
    const mergedScenesData: mergedSceneBanner[] = scenesData?.map((scene: any) => {
      const sceneShootingData = scenesInShoot.find((sceneInShoot: any) => parseInt(sceneInShoot.sceneId) === parseInt(scene.sceneId));
      console.log(sceneShootingData);
      return {
        cardType: 'scene',
        ...scene._data,
        ...sceneShootingData
      };
    }) ?? [];

    const uniqueSets = new Set(mergedScenesData.map((scene: any) => scene.setName && scene.setName.toUpperCase()))
    const totalPages = mergedScenesData.reduce((acc: number, scene: any) => acc + (scene.pages || 0), 0);
    const totalTime = mergedScenesData.reduce((acc: number, scene: any) => acc + (scene.estimatedSeconds || 0), 0);

    const shootingInfo: ShootingInfo = {
      generalCall: getHourMinutesFomISO(shootings[0]._data.generalCall),
      readyToShoot: getHourMinutesFomISO(shootings[0]._data.onSet),
      estimatedWrap: getHourMinutesFomISO(shootings[0]._data.estimatedWrap),
      wrap: getHourMinutesFomISO(shootings[0]._data.wrap),
      lastOut: getHourMinutesFomISO(shootings[0]._data.lastOut),
      sets: Array.from(uniqueSets).length,
      scenes: scenesInShoot.length,
      pages: floatToFraction(totalPages),
      min: secondsToMinSec(totalTime),
      locations: shootings[0]._data.locations,
      hospitals: shootings[0]._data.hospitals,
      advanceCalls: shootings[0]._data.advanceCalls.advanceCalls,
      meals: shootings[0]._data.meals
    }

    const formatShootingDate = (dateString: string, unitNumber: number) => {
      const date = new Date(dateString);
      const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      
      const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const dayOfWeek = weekdays[date.getDay()];
    
      const dayNumber = date.getDay() === 0 ? 7 : date.getDay();
    
      const formattedDate = `${dayOfWeek}. DAY #${dayNumber}. ${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}. UNIT ${unitNumber}`;
    
      return formattedDate;
    };

    const shootingFormattedDate = formatShootingDate(shootings[0]._data.shootDate, shootings[0]._data.unitNumber);

    const bannersWIthType: mergedSceneBanner[] = bannersInShoot.map((banner: any) => ({
      cardType: 'banner', ...banner
    }));
    
    return {
      scenes: [...mergedScenesData, ...bannersWIthType].sort((a: any, b: any) => a.position - b.position),
      scenesNotIncluded: scenesNotIncluded?.map((scene: any) => scene._data) ?? [],
      shootingInfo,
      formattedDate: shootingFormattedDate
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
        <Toolbar name={shootingData.shootingFormattedDate} addShoBanSc={addShoBanSc} back handleBack={handleBack} />
      </IonHeader>
      {shootingData.showAddMenu && (
        <div className='add-menu'>
          <IonItem id={'open-add-new-scene-modal' + '-' + shootingId}>Add Scene</IonItem>
          <IonItem id={'open-add-new-banner-modal' + '-' + shootingId}>Add Banner</IonItem>
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
                    isProduced={scene.status}
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
      {
        view === 'info' && (
          <IonContent color="tertiary" fullscreen>
            <ShootingBasicInfo shootingInfo={shootingData.shotingInfo} />
            
            <div className="ion-flex ion-justify-content-between ion-padding-start" style={{ border: '1px solid black', backgroundColor: 'var(--ion-color-tertiary-shade)' }} onClick={() => setOpenLocations(!openLocations)}>
              <p style={{ fontSize: '18px' }}><b>LOCATIONS</b></p>
              <DropDownButton open={openLocations} />
            </div>
            {openLocations && (
              shootingData.shotingInfo.locations.length > 0 ? (
                shootingData.shotingInfo.locations.map((location: LocationInfo) => (
                  <div key={location.id} className="ion-padding-start">
                    <h5><b>{location.location_address.toUpperCase()}</b></h5>
                    <p>{location.location_full_address}</p>
                  </div>
                ))
              ) : (
                <div className="ion-padding-start">
                  <p>NO LOCATIONS ADDED</p>
                </div>
              )
            )}

            <div className="ion-flex ion-justify-content-between ion-padding-start" style={{ border: '1px solid black', backgroundColor: 'var(--ion-color-tertiary-shade)' }} onClick={() => setOpenHospitals(!openHospitals)}>
              <p style={{ fontSize: '18px' }}><b>NEAR HOSPITALS</b></p>
              <DropDownButton open={openHospitals} />
            </div>
            {openHospitals && (
              shootingData.shotingInfo.hospitals.length > 0 ? (
                shootingData.shotingInfo.hospitals.map((hospital: LocationInfo) => (
                  <div key={hospital.id} className="ion-padding-start">
                    <h5><b>{hospital.location_address.toUpperCase()}</b></h5>
                    <p>{hospital.location_full_address}</p>
                  </div>
                ))
              ) : (
                <div className="ion-padding-start">
                  <p>NO HOSPITALS ADDED</p>
                </div>
              )
            )}

            <div className="ion-flex ion-justify-content-between ion-padding-start" style={{ border: '1px solid black', backgroundColor: 'var(--ion-color-tertiary-shade)' }} onClick={() => setOpenadvanceCalls(!openadvanceCalls)}>
              <p style={{ fontSize: '18px' }}><b>ADVANCED CALLS</b></p>
              <DropDownButton open={openadvanceCalls} />
            </div>
            {
            openadvanceCalls && (
              shootingData.shotingInfo.advanceCalls.length > 0 ? (
                shootingData.shotingInfo.advanceCalls.map((call: any) => (
                  <div key={call.id} className="ion-padding-start">
                    <p><b>{call.dep_name_eng.toUpperCase()}: </b></p>
                    <p>{getHourMinutesFomISO(call.adv_call_time)}</p>
                  </div>
                ))
              ) : (
                <div className="ion-padding-start">
                  <p>NO ADVANCED CALLS ADDED</p>
                </div>
              )
            )}

            <div className="ion-flex ion-justify-content-between ion-padding-start" style={{ border: '1px solid black', backgroundColor: 'var(--ion-color-tertiary-shade)' }} onClick={() => setOpenMeals(!openMeals)}>
              <p style={{ fontSize: '18px' }}><b>MEALS</b></p>
              <DropDownButton open={openMeals} />
            </div>
            {openMeals && (
              Object.keys(shootingData.shotingInfo.meals).length > 0 ? (
                Object.entries(shootingData.shotingInfo.meals).map(([key, meal]) => (
                  <div key={key} className="ion-padding-start">
                    <p><b>{meal.meal.toUpperCase()}: </b> {getHourMinutesFomISO(meal.ready_at)} / {getHourMinutesFomISO(meal.end_time)} </p>
                    <p>{meal.meal_type}</p>
                  </div>
                ))
              ) : (
                <div className="ion-padding-start">
                  <p>NO MEALS ADDED</p>
                </div>
              )
            )}
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
