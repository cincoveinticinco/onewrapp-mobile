import {
  IonButton, IonContent, IonHeader, IonItem, IonPage, IonReorderGroup,
  ItemReorderEventDetail, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter,
} from '@ionic/react';
import {
  useContext, useEffect, useRef, useState,
} from 'react';
import { useHistory, useParams } from 'react-router';
import { IoMdAdd } from 'react-icons/io';
import { VscEdit } from 'react-icons/vsc';
import Toolbar from '../../components/Shared/Toolbar/Toolbar';
import ShootingDetailTabs from '../../components/ShootingDetail/ShootingDetailTabs/ShootingDetailTabs';
import DatabaseContext from '../../hooks/Shared/database';
import SceneCard from '../../components/Strips/SceneCard';
import { ShootingSceneStatusEnum } from '../../Ennums/ennums';
import useLoader from '../../hooks/Shared/useLoader';
import {
  ShootingScene, ShootingBanner as ShootingBannerType, LocationInfo, AdvanceCalls, Meal, AdvanceCall,
} from '../../interfaces/shooting.types';
import './ShootingDetail.css';
import EditionModal, { FormInput, SelectOptionsInterface } from '../../components/Shared/EditionModal/EditionModal';
import { Scene } from '../../interfaces/scenes.types';
import InputModalScene from '../../Layouts/InputModalScene/InputModalScene';
import ShootingBanner from '../../components/ShootingDetail/ShootingBannerCard/ShootingBanner';
import floatToFraction from '../../utils/floatToFraction';
import secondsToMinSec from '../../utils/secondsToMinSec';
import ShootingBasicInfo from '../../components/ShootingDetail/ShootingBasicInfo/ShootingBasicInfo';
import DropDownButton from '../../components/Shared/DropDownButton/DropDownButton';
import AddButton from '../../components/Shared/AddButton/AddButton';
import MealInfo from '../../components/ShootingDetail/MealInfo/MealInfo';
import AdvanceCallInfo from '../../components/ShootingDetail/AdvanceCallInfo/AdvanceCallInfo';
import MapFormModal from '../../components/Shared/MapFormModal/MapFormModal';
import DeleteButton from '../../components/Shared/DeleteButton/DeleteButton';
import ExploreContainer from '../../components/Shared/ExploreContainer/ExploreContainer';

export type ShootingViews = 'scenes' | 'info';
type cardType = {
  cardType: string;
};

type mergedSceneBanner = (Scene & ShootingScene & cardType) | (ShootingBannerType & cardType)
interface ShootingInfo {
  generalCall: string;
  onSet: string;
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
  meals: Meal[];
}

interface ShootingDataProps {
  scenes: mergedSceneBanner[];
  notIncludedScenes: Scene[];
  shotingInfo: ShootingInfo;
  shootingFormattedDate: string;
}

const ShootingDetail = () => {
  const [isDisabled, _] = useState(false);
  const { shootingId } = useParams<{ shootingId: string }>();
  const { oneWrapDb, initializeShootingReplication } = useContext(DatabaseContext);
  const history = useHistory();
  const [selectedScenes, setSelectedScenes] = useState<any>([]);
  const { id } = useParams<{ id: string }>();
  const [view, setView] = useState<ShootingViews>('scenes');
  const [openLocations, setOpenLocations] = useState(true);
  const [openHospitals, setOpenHospitals] = useState(true);
  const [openadvanceCalls, setOpenAdvanceCalls] = useState(true);
  const [openMeals, setOpenMeals] = useState(true);
  const [mealsEditMode, setMealsEditMode] = useState(false);
  const [advanceCallsEditMode, setAdvanceCallsEditMode] = useState(false);
  const [additionMenu, setAdditionMenu] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showHospitalsMapModal, setShowHospitalsMapModal] = useState(false);
  const [locationsEditMode, setLocationsEditMode] = useState(false);
  const [hospitalsEditMode, setHospitalsEditMode] = useState(false);
  const bannerModalRef = useRef<HTMLIonModalElement>(null);
  const sceneModalRef = useRef<HTMLIonModalElement>(null);
  const advanceCallModalRef = useRef<HTMLIonModalElement>(null);
  const mealModalRef = useRef<HTMLIonModalElement>(null);

  const closeMapModal = () => {
    setShowMapModal(false);
  };

  const closeHospitalsMapModal = () => {
    setShowHospitalsMapModal(false);
  };

  const openHospitalsMapModal = () => {
    setShowHospitalsMapModal(true);
  };

  const openMapModal = () => {
    setShowMapModal(true);
  };

  const openAdvanceCallModal = (e: any) => {
    e.stopPropagation();
    advanceCallModalRef.current?.present();
  };

  const openMealModal = (e: any) => {
    e.stopPropagation();
    mealModalRef.current?.present();
  };

  const openBannerModal = async () => {
    setAdditionMenu(false);
    setTimeout(() => {
      bannerModalRef.current?.present();
    }, 100);
  };

  const openSceneModal = async () => {
    setAdditionMenu(false);
    setTimeout(() => {
      sceneModalRef.current?.present();
    }, 100);
  };

  const [shootingData, setShootingData] = useState<ShootingDataProps>({
    scenes: [],
    notIncludedScenes: [],
    shotingInfo: {
      generalCall: '--:--',
      onSet: '--:--',
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
      meals: [],
    },
    shootingFormattedDate: '',
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const scenesData = await getShootingData();
      setShootingData({
        scenes: scenesData.scenes,
        notIncludedScenes: scenesData.scenesNotIncluded,
        shotingInfo: scenesData.shootingInfo,
        shootingFormattedDate: scenesData.formattedDate,
      });
    } catch (error) {
      console.error('Error fetching scenes:', error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [oneWrapDb, shootingId]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      saveShooting();
      setShootingData((prev: any) => {
        const updatedInfo = calculateUpdatedInfo(prev.scenes);
        return {
          ...prev,
          shotingInfo: {
            ...prev.shotingInfo,
            ...updatedInfo,
          },
        };
      });
    }
  }, [shootingData.scenes, isLoading]);

  const availableColors = [
    { value: '#3dc2ff', name: 'light blue' },
    { value: '#282f3a', name: 'dark gray' },
    { value: '#04feaa', name: 'green' },
    { value: '#ffb203', name: 'orange' },
    { value: '#ff4a8f', name: 'pink' },
    { value: '#707070', name: 'gray' },
    { value: '#000', name: 'black' },
    { value: '#f3fb8c', name: 'yellow' },
    { value: '#fdc6f7', name: 'light pink' },
  ];

  const selectOptions = availableColors.map((color) => ({
    value: color.value,
    label: color.name,
  }));

  const fontSizeOptions: SelectOptionsInterface[] = [
    {
      value: 12,
      label: '12 px',
    },
    {
      value: 14,
      label: '14 px',
    },
    {
      value: 16,
      label: '16 px',
    },
    {
      value: 18,
      label: '18 px',
    },
    {
      value: 20,
      label: '20 px',
    },
  ];

  const addNewBanner = (banner: any) => {
    banner.position = shootingData.scenes.length;
    banner.id = null;
    banner.fontSize = parseInt(banner.fontSize);
    banner.shootingId = parseInt(shootingId);
    banner.createdAt = new Date().toISOString();
    banner.updatedAt = new Date().toISOString();

    setShootingData((prev: any) => ({
      ...prev,
      scenes: [...prev.scenes, { cardType: 'banner', ...banner }],
    }));
  };

  const bannerInputs: FormInput[] = [
    {
      label: 'Description', type: 'text', fieldKeyName: 'description', placeholder: 'INSERT', required: true, inputName: 'add-banner-description-input', col: '4',
    },
    {
      label: 'Font Size', type: 'select', fieldKeyName: 'fontSize', placeholder: 'INSERT', required: false, inputName: 'add-character-name-input', col: '4', selectOptions: fontSizeOptions,
    },
    {
      label: 'Color',
      type: 'select',
      fieldKeyName: 'backgroundColor',
      placeholder: 'SELECT COLOR',
      required: false,
      inputName: 'add-background-color-input',
      selectOptions,
      col: '4',
    },
  ];

  // advance calls need the fields Department *, call* and description. department, esta en el key dep_name_esp y dep_name_eng, description en el key description y call en adv_call_time. Por default, tendra el shooting_id de la pagina, el id temporal y el createdAt y updatedAt en la fecha actual.

  const advanceCallInputs = [
    {
      label: 'Department', type: 'text', fieldKeyName: 'dep_name_eng', placeholder: 'INSERT', required: true, inputName: 'add-department-input', col: '4',
    },
    {
      label: 'Call', type: 'time', fieldKeyName: 'adv_call_time', placeholder: 'SELECT TIME', required: true, inputName: 'add-call-input', col: '4',
    },
    {
      label: 'Description', type: 'text', fieldKeyName: 'description', placeholder: 'INSERT', required: false, inputName: 'add-description-input', col: '4',
    },
  ];

  const addNewAdvanceCall = async (advanceCall: any) => {
    const shooting = await oneWrapDb?.shootings.findOne({ selector: { id: shootingId } }).exec();

    advanceCall.id = `advance-call-${shootingData.shotingInfo.advanceCalls.length + 1}`;
    advanceCall.shootingId = parseInt(shootingId);
    advanceCall.createdAt = new Date().toISOString();
    advanceCall.updatedAt = new Date().toISOString();
    const formatedTime = advanceCall.adv_call_time.split(':');
    advanceCall.adv_call_time = { hours: formatedTime[0], minutes: formatedTime[1] };
    advanceCall.dep_name_esp = advanceCall.dep_name_eng;
    const shootingCopy = { ...shooting._data };
    advanceCall.adv_call_time = timeToISOString(advanceCall.adv_call_time, shootingCopy.shootDate);
    shootingCopy.advanceCalls = [...shootingCopy.advanceCalls, advanceCall];

    await oneWrapDb?.shootings.upsert(shootingCopy);

    setShootingData((prev: any) => ({
      ...prev,
      shotingInfo: {
        ...prev.shotingInfo,
        advanceCalls: [...prev.shotingInfo.advanceCalls, advanceCall],
      },
    }));
  };

  // Para anadir un nuevo meal, necesito los campos Meal*, From time*, End time* y quantity. Por default, tendra el shooting_id de la pagina, el id temporal y el createdAt y updatedAt en la fecha actual. Los keys correspondientes son meal, ready_at, end_time y quantity.

  const mealInputs = [
    {
      label: 'Meal', type: 'text', fieldKeyName: 'meal', placeholder: 'INSERT', required: true, inputName: 'add-meal-input', col: '4',
    },
    {
      label: 'From Time', type: 'time', fieldKeyName: 'ready_at', placeholder: 'SELECT TIME', required: true, inputName: 'add-from-time-input', col: '4',
    },
    {
      label: 'End Time', type: 'time', fieldKeyName: 'end_time', placeholder: 'SELECT TIME', required: true, inputName: 'add-end-time-input', col: '4',
    },
    {
      label: 'Quantity', type: 'number', fieldKeyName: 'quantity', placeholder: 'INSERT', required: true, inputName: 'add-quantity-input', col: '4',
    },
  ];

  const addNewMeal = async (meal: any) => {
    const shooting = await oneWrapDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
    meal.id = `meal-${shootingData.shotingInfo.meals.length + 1}`;
    meal.shootingId = parseInt(shootingId);
    meal.createdAt = new Date().toISOString();
    meal.updatedAt = new Date().toISOString();
    const formatedTimeStart = meal.ready_at.split(':');
    const formatedTimeEnd = meal.end_time.split(':');
    meal.ready_at = { hours: formatedTimeStart[0], minutes: formatedTimeStart[1] };
    meal.end_time = { hours: formatedTimeEnd[0], minutes: formatedTimeEnd[1] };
    const shootingCopy = { ...shooting._data };
    meal.ready_at = timeToISOString(meal.ready_at, shootingCopy.shootDate);
    meal.end_time = timeToISOString(meal.end_time, shootingCopy.shootDate);

    shootingCopy.meals = [...shootingCopy.meals, meal];
    await oneWrapDb?.shootings.upsert(shootingCopy);

    setShootingData((prev: any) => ({
      ...prev,
      shotingInfo: {
        ...prev.shotingInfo,
        meals: [...prev.shotingInfo.meals, meal],
      },
    }));
  };

  const handleEditMeal = async (meal: Meal) => {
    initializeShootingReplication();
    if (oneWrapDb && shootingId) {
      try {
        const shooting = await oneWrapDb.shootings.findOne({ selector: { id: shootingId } }).exec();

        if (shooting) {
          const shootingCopy = { ...shooting._data };

          const index = shootingCopy.meals.findIndex((m: Meal) => m.id === meal.id);
          if (index !== -1) {
            const updatedMeals = [...shootingCopy.meals];

            // Convertir los tiempos a formato ISO
            updatedMeals[index] = {
              ...meal,
              ready_at: timeToISOString({ hours: meal.ready_at.split(':')[0], minutes: meal.ready_at.split(':')[1] }, shootingCopy.shootDate),
              end_time: timeToISOString({ hours: meal.end_time.split(':')[0], minutes: meal.end_time.split(':')[1] }, shootingCopy.shootDate),
            };

            shootingCopy.meals = updatedMeals;

            await oneWrapDb.shootings.upsert(shootingCopy);

            setShootingData((prev: any) => ({
              ...prev,
              shotingInfo: {
                ...prev.shotingInfo,
                meals: updatedMeals,
              },
            }));

            console.log('Meal updated successfully');
          }
        }
      } catch (error) {
        console.error('Error updating meal:', error);
      }
    }
  };

  const handleEditAdvanceCall = async (advanceCall: AdvanceCall) => {
    initializeShootingReplication();

    if (oneWrapDb && shootingId) {
      try {
        const shooting = await oneWrapDb.shootings.findOne({ selector: { id: shootingId } }).exec();

        if (shooting) {
          const shootingCopy = { ...shooting._data };

          const index = shootingCopy.advanceCalls.findIndex((a: AdvanceCall) => a.id === advanceCall.id);
          if (index !== -1) {
            const updatedAdvanceCalls = [...shootingCopy.advanceCalls];

            // Convertir el tiempo a formato ISO
            updatedAdvanceCalls[index] = {
              ...advanceCall,
              adv_call_time: timeToISOString({ hours: advanceCall.adv_call_time.split(':')[0], minutes: advanceCall.adv_call_time.split(':')[1] }, shootingCopy.shootDate),
            };

            shootingCopy.advanceCalls = updatedAdvanceCalls;

            await oneWrapDb.shootings.upsert(shootingCopy);

            setShootingData((prev: any) => ({
              ...prev,
              shotingInfo: {
                ...prev.shotingInfo,
                advanceCalls: updatedAdvanceCalls,
              },
            }));

            console.log('Advance Call updated successfully');
          }
        }
      } catch (error) {
        console.error('Error updating advance call:', error);
      }
    }
  };

  const validateBannerExistence = (description: string) => {
    const banners = shootingData.scenes.filter((item: any) => item.cardType === 'banner');
    const bannerExists = banners.some((banner: any) => banner.description.toLowerCase() === description.toLowerCase());
    if (bannerExists) {
      return 'banner already exists';
    }

    return false;
  };

  const AddNewBanner = () => (
    <EditionModal
      modalRef={bannerModalRef}
      modalTrigger={`${'open-add-new-banner-modal' + '-'}${shootingId}`}
      title="Add New Banner"
      formInputs={bannerInputs}
      handleEdition={addNewBanner}
      defaultFormValues={{}}
      modalId="add-new-banner-modal"
      validate={validateBannerExistence}
    />
  );

  const validateAdvanceCallExistence = (callTime: string) => {
    const { advanceCalls: shootingCalls } = shootingData.shotingInfo;
    const callExists = shootingCalls.some((call: any) => call.dep_name_eng.toLowerCase() === callTime.toLowerCase() || call.dep_name_esp.toLowerCase() === callTime.toLowerCase());
    if (callExists) {
      return 'department already exists in shooting';
    }

    return false;
  };

  const AddNewAdvanceCallModal = () => (
    <EditionModal
      modalRef={advanceCallModalRef}
      modalTrigger={`${'open-add-new-advance-call-modal' + '-'}${shootingId}`}
      title="Add New Advance Call"
      formInputs={advanceCallInputs}
      handleEdition={addNewAdvanceCall}
      defaultFormValues={{}}
      modalId={`${'add-new-advance-call-modal' + '-'}${shootingId}`}
      validate={validateAdvanceCallExistence}
    />
  );

  const validateMealExistence = (meal: string) => {
    const { meals: shootingMeals } = shootingData.shotingInfo;
    const mealExists = shootingMeals.some((m: Meal) => m.meal.toLowerCase() === meal.toLowerCase());
    if (mealExists) {
      return 'meal already exists';
    }

    return false;
  };

  const AddNewMeal = () => (
    <EditionModal
      modalRef={mealModalRef}
      modalTrigger={`${'open-add-new-meal-modal' + '-'}${shootingId}`}
      title="Add New Meal"
      formInputs={mealInputs}
      handleEdition={addNewMeal}
      defaultFormValues={{}}
      modalId={`${'open-add-new-meal-modal' + '-'}${shootingId}`}
      validate={validateMealExistence}
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
      updatedAt: new Date().toISOString(),
    };

    setShootingData((prev: any) => {
      const updatedScenes = [...prev.scenes, { cardType: 'scene', ...shootingScene, ...scene }];
      const updatedInfo = calculateUpdatedInfo(updatedScenes);
      return {
        ...prev,
        scenes: updatedScenes,
        shotingInfo: {
          ...prev.shotingInfo,
          ...updatedInfo,
        },
      };
    });
    setSelectedScenes([...selectedScenes, scene]);
  };

  const calculateUpdatedInfo = (scenes: any[]) => {
    const scenesOnly = scenes.filter((item: any) => item.cardType === 'scene');
    const uniqueSets = new Set(scenesOnly.map((scene: any) => scene.setName && scene.setName.toUpperCase()));
    const totalPages = scenesOnly.reduce((acc: number, scene: any) => acc + (scene.pages || 0), 0);
    const totalTime = scenesOnly.reduce((acc: number, scene: any) => acc + (scene.estimatedSeconds || 0), 0);

    return {
      sets: Array.from(uniqueSets).length,
      scenes: scenesOnly.length,
      pages: floatToFraction(totalPages),
      min: secondsToMinSec(totalTime),
    };
  };

  const AddNewScenes = () => (
    <InputModalScene
      sceneName="Add New Scene"
      listOfScenes={shootingData.notIncludedScenes}
      handleCheckboxToggle={checkboxScenesToggle}
      selectedScenes={selectedScenes}
      setSelectedScenes={setSelectedScenes}
      clearSelections={clearSelectedScenes}
      multipleSelections
      modalRef={sceneModalRef}
    />
  );

  const clearSelectedScenes = () => {
    setSelectedScenes([]);
  };

  const formatSceneAsShootingScene = (scene: any): ShootingScene => ({
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
    updatedAt: scene.updatedAt,
  });

  const saveShooting = async () => {
    if (oneWrapDb && shootingId) {
      try {
        const shooting = await oneWrapDb.shootings.findOne({ selector: { id: shootingId } }).exec();

        if (shooting) {
          const updatedScenes = shootingData.scenes
            .filter((item: any) => item.cardType === 'scene')
            .map((scene: any) => formatSceneAsShootingScene(scene));
          const updatedBanners = shootingData.scenes.filter((item: mergedSceneBanner) => item.cardType === 'banner')
            .map(({ cardType, ...banner } : mergedSceneBanner) => banner);

          const shootingCopy = { ...shooting._data };
          shootingCopy.scenes = updatedScenes;
          shootingCopy.banners = updatedBanners;

          return await oneWrapDb.shootings.upsert(shootingCopy);
        }
      } catch (error) {
        console.error('Error saving new Shooting:', error);
      }
    }
  };

  const handleReorder = async (event: CustomEvent<ItemReorderEventDetail>) => {
    const items = [...shootingData.scenes];
    const [reorderedItem] = items.splice(event.detail.from, 1);
    items.splice(event.detail.to, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index,
    }));

    setShootingData((prev: any) => ({
      ...prev,
      scenes: updatedItems,
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
        }
        // Para escenas existentes, comparamos por sceneId
        return s.sceneId !== scene.sceneId;
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
        }
        // Para banners existentes, comparamos por id
        return item.id !== banner.id;
      }
      return true;
    });

    setShootingData((prev: any) => ({
      ...prev,
      scenes: updatedScenes,
    }));
  };

  const getHourMinutesFomISO = (iso: string) => {
    const date = new Date(iso);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours %= 12;
    hours = hours || 12; // la hora '0' debe ser '12'
    return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes} ${ampm}`;
  };

  const getShootingData = async () => {
    const shootings: any = await oneWrapDb?.shootings.find({ selector: { id: shootingId } }).exec();

    const scenesInShoot = shootings[0]._data.scenes;
    const bannersInShoot = shootings[0]._data.banners;
    const scenesIds = scenesInShoot.map((scene: any) => parseInt(scene.sceneId));

    const scenesData = await oneWrapDb?.scenes.find({
      selector: { sceneId: { $in: scenesIds } },
    }).exec();

    const scenesNotIncluded = await oneWrapDb?.scenes.find({
      selector: { projectId: shootings[0]._data.projectId, sceneId: { $nin: scenesIds } },
    }).exec();

    const mergedScenesData: mergedSceneBanner[] = scenesData?.map((scene: any) => {
      const sceneShootingData = scenesInShoot.find((sceneInShoot: any) => parseInt(sceneInShoot.sceneId) === parseInt(scene.sceneId));
      return {
        cardType: 'scene',
        ...scene._data,
        ...sceneShootingData,
      };
    }) ?? [];

    const bannersWIthType: mergedSceneBanner[] = bannersInShoot.map((banner: any) => ({
      cardType: 'banner', ...banner,
    }));

    const mergedScenes = [...mergedScenesData, ...bannersWIthType].sort((a: any, b: any) => a.position - b.position);

    const updatedInfo = calculateUpdatedInfo(mergedScenes);

    const shootingInfo: ShootingInfo = {
      ...updatedInfo,
      generalCall: getHourMinutesFomISO(shootings[0]._data.generalCall),
      onSet: getHourMinutesFomISO(shootings[0]._data.onSet),
      estimatedWrap: getHourMinutesFomISO(shootings[0]._data.estimatedWrap),
      wrap: getHourMinutesFomISO(shootings[0]._data.wrap),
      lastOut: getHourMinutesFomISO(shootings[0]._data.lastOut),
      locations: shootings[0]._data.locations,
      hospitals: shootings[0]._data.hospitals,
      advanceCalls: shootings[0]._data.advanceCalls,
      meals: shootings[0]._data.meals,
    };

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

    return {
      scenes: mergedScenes,
      scenesNotIncluded: scenesNotIncluded?.map((scene: any) => scene._data) ?? [],
      shootingInfo,
      formattedDate: shootingFormattedDate,
    };
  };

  const handleBack = () => {
    history.push(`/my/projects/${id}/calendar`);
  };

  const toggleAddMenu = () => {
    setAdditionMenu(!additionMenu);
  };

  const addShoBanSc = () => (
    <div className="button-wrapper" slot="end">
      <IonButton
        fill="clear"
        slot="end"
        color="light"
        className="ion-no-padding toolbar-button"
        onClick={() => {
          setTimeout(() => {
            toggleAddMenu();
          }, 0);
        }}
      >
        <IoMdAdd className="toolbar-icon" />
      </IonButton>
    </div>
  );

  const timeToISOString = (time: { hours: string, minutes: string }, shootingDate: string) => {
    const shootingDay = new Date(shootingDate);

    const newDate = new Date(
      shootingDay.getFullYear(),
      shootingDay.getMonth(),
      shootingDay.getDate(),
      parseInt(time.hours),
      parseInt(time.minutes),
    );

    return newDate.toISOString();
  };

  const updateShootingTime = async (field: 'generalCall' | 'onSet' | 'estimatedWrap' | 'wrap' | 'lastOut', time: { hours: string, minutes: string }) => {
    if (oneWrapDb && shootingId) {
      try {
        const shooting = await oneWrapDb.shootings.findOne({ selector: { id: shootingId } }).exec();

        if (shooting) {
          const shootingCopy = { ...shooting._data };

          const newTimeISO = timeToISOString(time, shootingCopy.shootDate);

          shootingCopy[field] = newTimeISO;

          await oneWrapDb.shootings.upsert(shootingCopy);

          setShootingData((prev: any) => ({
            ...prev,
            shotingInfo: {
              ...prev.shotingInfo,
              [field]: `${time.hours.padStart(2, '0')}:${time.minutes.padStart(2, '0')}`,
            },
          }));

          console.log(`${field} updated successfully`);
        }
      } catch (error) {
        console.error(`Error updating ${field}:`, error);
      }
    }
  };

  const deleteMeal = async (mealToDelete: Meal) => {
    if (oneWrapDb && shootingId) {
      try {
        const shooting = await oneWrapDb.shootings.findOne({ selector: { id: shootingId } }).exec();

        if (shooting) {
          const shootingCopy = { ...shooting._data };

          // If the meal has an id, filter it out based on the id
          // Otherwise, use the index to remove it
          if (mealToDelete.id !== null) {
            shootingCopy.meals = shootingCopy.meals.filter((meal: Meal) => meal.id !== mealToDelete.id);
          } else {
            const indexToDelete = shootingCopy.meals.findIndex((meal: Meal) => meal.meal === mealToDelete.meal
              && meal.ready_at === mealToDelete.ready_at
              && meal.end_time === mealToDelete.end_time);
            if (indexToDelete !== -1) {
              shootingCopy.meals.splice(indexToDelete, 1);
            }
          }

          await oneWrapDb.shootings.upsert(shootingCopy);

          setShootingData((prev: any) => ({
            ...prev,
            shotingInfo: {
              ...prev.shotingInfo,
              meals: shootingCopy.meals,
            },
          }));

          console.log('Meal deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting meal:', error);
      }
    }
  };

  const deleteAdvanceCall = async (callToDelete: AdvanceCall) => {
    if (oneWrapDb && shootingId) {
      try {
        const shooting = await oneWrapDb.shootings.findOne({ selector: { id: shootingId } }).exec();

        if (shooting) {
          const shootingCopy = { ...shooting._data };

          // If the advance call has an id, filter it out based on the id
          // Otherwise, use the index to remove it
          if (callToDelete.id !== null) {
            shootingCopy.advanceCalls = shootingCopy.advanceCalls.filter((call: AdvanceCall) => call.id !== callToDelete.id);
          } else {
            const indexToDelete = shootingCopy.advanceCalls.findIndex((call: AdvanceCall) => call.dep_name_eng === callToDelete.dep_name_eng
              && call.adv_call_time === callToDelete.adv_call_time
              && call.description === callToDelete.description);
            if (indexToDelete !== -1) {
              shootingCopy.advanceCalls.splice(indexToDelete, 1);
            }
          }

          await oneWrapDb.shootings.upsert(shootingCopy);

          setShootingData((prev: any) => ({
            ...prev,
            shotingInfo: {
              ...prev.shotingInfo,
              advanceCalls: shootingCopy.advanceCalls,
            },
          }));

          console.log('Advance call deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting advance call:', error);
      }
    }
  };

  const addNewLocation = async (formData: Partial<LocationInfo>) => {
    try {
      const shooting = await oneWrapDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
      const shootingDate = new Date(shooting._data.shootDate);
      const locationInfo = {
        id: `location-${shootingData.shotingInfo.locations.length + 1}`,
        location_type_id: formData.location_type_id ?? null,
        location_id: null,
        call_time: formData.call_time ?? null,
        location_full_address: formData.location_full_address ?? null,
        location_city_state: formData.location_city_state ?? null,
        company_id: formData.company_id ?? null,
        location_name: formData.location_name ?? null,
        location_address: formData.location_address ?? null,
        location_addres_2: formData.location_address ?? null,
        city_id: formData.city_id ?? null,
        location_postal_code: formData.location_postal_code ?? null,
        lat: formData.lat ?? null,
        lng: formData.lng ?? null,
        city_name_eng: formData.city_name_eng ?? null,
        city_name_esp: formData.city_name_esp ?? null,
        state_id: formData.state_id ?? null,
        state_name_eng: formData.state_name_eng ?? null,
        state_name_esp: formData.state_name_esp ?? null,
        country_id: formData.country_id ?? null,
        country_name_eng: formData.country_name_eng ?? null,
        country_name_esp: formData.country_name_esp ?? null,
        shoot_date: shootingDate.toISOString(),
      };

      const shootingCopy = {
        ...shooting._data,
        locations: [...shooting._data.locations, locationInfo],
      };

      await oneWrapDb?.shootings.upsert(shootingCopy);

      setShootingData((prev: any) => ({
        ...prev,
        shotingInfo: {
          ...prev.shotingInfo,
          locations: [...prev.shotingInfo.locations, locationInfo],
        },
      }));
    } catch (error) {
      console.error('Error adding new location:', error);
    }
  };

  const removeLocation = async (location: LocationInfo) => {
    const locationId = location.id;
    try {
      const shooting = await oneWrapDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
      const shootingCopy = { ...shooting._data };
      const updatedLocations = shootingCopy.locations.filter((loc: LocationInfo) => loc.id !== locationId);
      shootingCopy.locations = updatedLocations;

      await oneWrapDb?.shootings.upsert(shootingCopy);

      setShootingData((prev: any) => ({
        ...prev,
        shotingInfo: {
          ...prev.shotingInfo,
          locations: updatedLocations,
        },
      }));

      initializeShootingReplication();
    } catch (error) {
      console.error('Error removing location:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <Toolbar name={shootingData.shootingFormattedDate} customButtons={[addShoBanSc]} back handleBack={handleBack} />
      </IonHeader>
      {additionMenu && (
        <div className="add-menu" style={{ backgroundColor: 'black', outline: '1px solid white' }}>
          <IonButton onClick={openSceneModal} fill="clear" className="ion-no-margin ion-no-padding" style={{ width: '100%' }}>
            <IonItem color="dark" style={{ width: '100%', borderRadius: '0px' }}>ADD SCENE</IonItem>
          </IonButton>
          <IonButton onClick={openBannerModal} fill="clear" className="ion-no-margin ion-no-padding" style={{ width: '100%' }}>
            <IonItem color="dark" style={{ width: '100%', borderTop: '1px solid white' }}>ADD BANNER</IonItem>
          </IonButton>
        </div>
      )}
      {view === 'scenes' && (
        <IonContent color="tertiary" fullscreen>
          <IonReorderGroup disabled={isDisabled} onIonItemReorder={handleReorder}>
            {isLoading ? (
              useLoader()
            ) : shootingData.scenes.length === 0 ? (
              <div className="ion-padding-start">
                <ExploreContainer name="NO SCENES ADDED" />
              </div>
            ) : (
              shootingData.scenes.map((scene: any) => (
                scene.cardType === 'scene' ? (
                  <SceneCard
                    key={scene.sceneId}
                    scene={scene}
                    isShooting
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
      )}
      {
        view === 'info' && (
          <IonContent color="tertiary" fullscreen>
            <ShootingBasicInfo
              shootingInfo={shootingData.shotingInfo}
              updateShootingTime={updateShootingTime}
            />

            <div
              className="ion-flex ion-justify-content-between ion-padding-start"
              style={{
                border: '1px solid black',
                backgroundColor: 'var(--ion-color-tertiary-shade)',
              }}
              onClick={() => setOpenLocations(!openLocations)}
            >
              <p style={{ fontSize: '18px' }}><b>LOCATIONS</b></p>
              <div onClick={(e) => e.stopPropagation()}>
                {
                  shootingData.shotingInfo.locations.length > 0
                  && (
                  <IonButton fill="clear" slot="end" color="light" className="toolbar-button" onClick={() => setLocationsEditMode(!locationsEditMode)}>
                    <VscEdit
                      className="toolbar-icon"
                      style={locationsEditMode ? { color: 'var(--ion-color-primary)' } : { color: 'var(--ion-color-light)' }}
                    />
                  </IonButton>
                  )
                }
                <AddButton onClick={() => openMapModal()} />
                <DropDownButton open={openLocations} />
              </div>
            </div>
            {openLocations && (
              shootingData.shotingInfo.locations.length > 0 ? (
                shootingData.shotingInfo.locations.map((location: LocationInfo) => (
                  <div key={location.id} className="ion-padding-start">
                    <h5><b>{location.location_name.toUpperCase()}</b></h5>
                    <div style={
                      {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }
                    }
                    >
                      <p>{location.location_full_address}</p>
                      {
                          locationsEditMode && (
                            <DeleteButton onClick={() => removeLocation(location)} />

                          )
                        }
                    </div>

                  </div>
                ))
              ) : (
                <div className="ion-padding-start">
                  <p>NO LOCATIONS ADDED</p>
                </div>
              )
            )}

            <div
              className="ion-flex ion-justify-content-between ion-padding-start"
              style={{
                border: '1px solid black',
                backgroundColor: 'var(--ion-color-tertiary-shade)',
              }}
              onClick={() => setOpenHospitals(!openHospitals)}
            >
              <p style={{ fontSize: '18px' }}><b>NEAR HOSPITALS</b></p>
              <div onClick={(e) => e.preventDefault()}>
                <AddButton onClick={() => openHospitalsMapModal()} />
                <DropDownButton open={openHospitals} />
              </div>

            </div>
            {openHospitals && (
              shootingData.shotingInfo.hospitals.length > 0 ? (
                shootingData.shotingInfo.hospitals.map((hospital: LocationInfo) => (
                  <div key={hospital.id} className="ion-padding-start">
                    <h5><b>{hospital.location_name.toUpperCase()}</b></h5>
                    <p>{hospital.location_full_address}</p>
                  </div>
                ))
              ) : (
                <div className="ion-padding-start">
                  <p>NO HOSPITALS ADDED</p>
                </div>
              )
            )}

            <div
              className="ion-flex ion-justify-content-between ion-padding-start"
              style={{ border: '1px solid black', backgroundColor: 'var(--ion-color-tertiary-shade)' }}
              onClick={() => setOpenAdvanceCalls(!openadvanceCalls)}
            >
              <p style={{ fontSize: '18px' }}><b>ADVANCE CALLS</b></p>
              <div onClick={(e) => e.stopPropagation()}>
                <IonButton fill="clear" slot="end" color="light" className="toolbar-button" onClick={() => setAdvanceCallsEditMode(!advanceCallsEditMode)}>
                  {
                  shootingData.shotingInfo.advanceCalls.length > 0
                  && (
                  <VscEdit
                    className="toolbar-icon"
                    style={advanceCallsEditMode ? { color: 'var(--ion-color-primary)' } : { color: 'var(--ion-color-light)' }}
                  />
                  )
                }
                </IonButton>
                <AddButton onClick={(e) => openAdvanceCallModal(e)} />
                <DropDownButton open={openadvanceCalls} />
              </div>
            </div>
            {
              openadvanceCalls && shootingData.shotingInfo.advanceCalls && (
                shootingData.shotingInfo.advanceCalls.length > 0 ? (
                  shootingData.shotingInfo.advanceCalls.map((call: any) => (
                    <AdvanceCallInfo
                      key={call.id}
                      call={call}
                      editMode={advanceCallsEditMode}
                      getHourMinutesFomISO={getHourMinutesFomISO}
                      deleteAdvanceCall={deleteAdvanceCall}
                      editionInputs={advanceCallInputs}
                      handleEdition={handleEditAdvanceCall}
                    />
                  ))
                ) : (
                  <div className="ion-padding-start">
                    <p>NO ADVANCE CALLS ADDED</p>
                  </div>
                )
              )
            }

            <div
              className="ion-flex ion-justify-content-between ion-padding-start"
              style={{ border: '1px solid black', backgroundColor: 'var(--ion-color-tertiary-shade)' }}
              onClick={() => setOpenMeals(!openMeals)}
            >
              <p style={{ fontSize: '18px' }}><b>MEALS</b></p>
              <div onClick={(e) => e.stopPropagation()}>
                <IonButton fill="clear" slot="end" color="light" className="toolbar-button" onClick={() => setMealsEditMode(!mealsEditMode)}>

                  {
                  shootingData.shotingInfo.meals.length > 0
                  && (
                  <VscEdit
                    className="toolbar-icon"
                    style={mealsEditMode ? { color: 'var(--ion-color-primary)' } : { color: 'var(--ion-color-light)' }}
                  />
                  )
                }
                </IonButton>
                <AddButton onClick={(e) => openMealModal(e)} />
                <DropDownButton open={openMeals} />
              </div>
            </div>
            {
              openMeals && (
                Object.keys(shootingData.shotingInfo.meals).length > 0 ? (
                  Object.entries(shootingData.shotingInfo.meals).map(([key, meal]) => (
                    <MealInfo
                      key={meal.id}
                      meal={meal}
                      editMode={mealsEditMode}
                      getHourMinutesFomISO={getHourMinutesFomISO}
                      deleteMeal={deleteMeal}
                      editionInputs={mealInputs}
                      handleEdition={handleEditMeal}
                    />
                  ))
                ) : (
                  <div className="ion-padding-start">
                    <p>NO MEALS ADDED</p>
                  </div>
                )
              )
            }
          </IonContent>
        )
      }
      <ShootingDetailTabs setView={setView} view={view} />
      <AddNewBanner />
      <AddNewScenes />
      <AddNewAdvanceCallModal />
      <AddNewMeal />
      <MapFormModal isOpen={showMapModal} closeModal={closeMapModal} onSubmit={addNewLocation} />
      <MapFormModal isOpen={showHospitalsMapModal} closeModal={closeHospitalsMapModal} onSubmit={addNewLocation} />
    </IonPage>
  );
};

export default ShootingDetail;
