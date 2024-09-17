import {
  IonButton, IonContent, IonHeader, IonIcon, IonItem, IonPage, IonReorderGroup,
  ItemReorderEventDetail, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter,
} from '@ionic/react';
import {
  useContext, useEffect, useRef, useState,
} from 'react';
import { useHistory, useParams } from 'react-router';
import { IoMdAdd } from 'react-icons/io';
import { save } from 'ionicons/icons';
import { VscEdit } from 'react-icons/vsc';
import Toolbar from '../../components/Shared/Toolbar/Toolbar';
import ShootingDetailTabs from '../../components/ShootingDetail/ShootingDetailTabs/ShootingDetailTabs';
import DatabaseContext from '../../context/Database.context';
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
import MapFormModal from '../../components/Shared/MapFormModal/MapFormModal';
import InfoView from '../../components/ShootingDetail/ShootingDetailViews/InfoView/InfoView';
import ScriptReportView from '../../components/ShootingDetail/ShootingDetailViews/ScriptReportView/ScriptReportView';
import WrapReportView from '../../components/ShootingDetail/ShootingDetailViews/WrapReportView/WrapReportView';
import ProductionReportView from '../../components/ShootingDetail/ShootingDetailViews/ProductionReportView/ProductionReportView';
import OutlinePrimaryButton from '../../components/Shared/OutlinePrimaryButton/OutlinePrimaryButton';
import useSuccessToast from '../../hooks/Shared/useSuccessToast';
import useErrorToast from '../../hooks/Shared/useErrorToast';
import { ShootingInfoLabels } from '../../components/ShootingDetail/ShootingBasicInfo/ShootingBasicInfo';
import getHourMinutesFomISO from '../../utils/getHoursMinutesFromISO';
import separateTimeOrPages from '../../utils/SeparateTimeOrPages';
import useIsMobile from '../../hooks/Shared/useIsMobile';

export type ShootingViews = 'scenes' | 'info' | 'script-report' | 'wrap-report' | 'production-report'
type cardType = {
  cardType: string;
};

export type mergedSceneBanner = (Scene & ShootingScene & cardType) | (ShootingBannerType & cardType)
export type mergedSceneShoot = (Scene & ShootingScene & cardType)
interface ShootingInfo {
  generalCall: string;
  onSet: string;
  estimatedWrap: string;
  wrap: string;
  lastOut: string;
  sets: number;
  scenes: number;
  protectedScenes: number;
  pages: string;
  min: string;
  locations: LocationInfo[];
  hospitals: LocationInfo[];
  advanceCalls: AdvanceCalls[]
  meals: Meal[];
}

export interface ShootingDataProps {
  mergedSceneBanners: mergedSceneBanner[];
  notIncludedScenes: Scene[];
  shotingInfo: ShootingInfo;
  shootingFormattedDate: string;
  mergedScenesShootData: mergedSceneShoot[];
}

const ShootingDetail: React.FC<{
  permissionType?: number | null;
}> = ({
  permissionType,
}) => {
  const [isDisabled, _] = useState(false);
  const { shootingId } = useParams<{ shootingId: string }>();
  const { oneWrapDb, initializeShootingReplication } = useContext(DatabaseContext);
  const history = useHistory();
  const [selectedScenes, setSelectedScenes] = useState<any>([]);
  const { id } = useParams<{ id: string }>();
  const [view, setView] = useState<ShootingViews>('info');
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
  const [scriptReportEditMode, setScriptReportEditMode] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationInfo | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<LocationInfo | null>(null);
  const bannerModalRef = useRef<HTMLIonModalElement>(null);
  const sceneModalRef = useRef<HTMLIonModalElement>(null);
  const advanceCallModalRef = useRef<HTMLIonModalElement>(null);
  const mealModalRef = useRef<HTMLIonModalElement>(null);
  const disableEditions = permissionType !== 1;
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();
  const isMobile = useIsMobile();

  const closeMapModal = () => {
    setShowMapModal(false);
    setSelectedLocation(null);
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

  const shootingDataInitial: ShootingDataProps = {
    mergedSceneBanners: [],
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
      protectedScenes: 0,
    },
    shootingFormattedDate: '',
    mergedScenesShootData: [],
  };

  const [shootingData, setShootingData] = useState<ShootingDataProps>(shootingDataInitial);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const scenesData = await getShootingData();
      setShootingData({
        mergedSceneBanners: scenesData.mergedSceneBanners,
        mergedScenesShootData: scenesData.mergedScenesShootData,
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
  }, [oneWrapDb, shootingId, permissionType]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      saveShooting();
      setShootingData((prev: ShootingDataProps) => {
        const updatedInfo = calculateUpdatedInfo(prev.mergedSceneBanners);
        return {
          ...prev,
          shotingInfo: {
            ...prev.shotingInfo,
            ...updatedInfo,
          },
        };
      });
    }
  }, [shootingData.mergedSceneBanners, isLoading]);

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

  const colorIsDark = (color: string) => {
    const rgb = parseInt(color.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma < 128;
  };

  const selectOptions = availableColors.map((color) => ({
    value: color.value,
    label: color.name,
    style: {
      backgroundColor: color.value,
      color: colorIsDark(color.value) ? 'white' : 'black',
      border: '1px solid var(--ion-color-tertiary-dark)',
    },
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
    banner.position = shootingData.mergedSceneBanners.length;
    banner.id = null;
    banner.fontSize = parseInt(banner.fontSize);
    banner.shootingId = parseInt(shootingId);
    banner.createdAt = new Date().toISOString();
    banner.updatedAt = new Date().toISOString();

    setShootingData((prev: ShootingDataProps) => ({
      ...prev,
      mergedSceneBanners: [...prev.mergedSceneBanners, { cardType: 'banner', ...banner }],
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
      label: 'Department', type: 'text', fieldKeyName: 'dep_name_eng', placeholder: 'INSERT', required: true, inputName: 'add-department-input', col: '6',
    },
    {
      label: 'Call', type: 'time', fieldKeyName: 'adv_call_time', placeholder: 'SELECT TIME', required: true, inputName: 'add-call-input', col: '6',
    },
    {
      label: 'Description', type: 'text', fieldKeyName: 'description', placeholder: 'INSERT', required: false, inputName: 'add-description-input', col: '12',
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

    try {
      await oneWrapDb?.shootings.upsert(shootingCopy);
    } catch (error) {
      errorToast(`Error adding advance call: ${error}`);
      return;
    } finally {
      successToast('Advance call added successfully');
    }

    setShootingData((prev: any) => ({
      ...prev,
      shotingInfo: {
        ...prev.shotingInfo,
        advanceCalls: [...prev.shotingInfo.advanceCalls, advanceCall],
      },
    }));
  };

  // Para anadir un nuevo meal, necesito los campos Meal*, From time*, End time* y quantity. Por default, tendra el shooting_id de la pagina, el id temporal y el createdAt y updatedAt en la fecha actual. Los keys correspondientes son meal, ready_at, end_time y quantity.

  const mealInputs:FormInput[] = [
    {
      label: 'Meal', type: 'text', fieldKeyName: 'meal', placeholder: 'INSERT', required: true, inputName: 'add-meal-input', col: '9',
    },
    {
      label: 'Quantity', type: 'number', fieldKeyName: 'quantity', placeholder: 'INSERT', required: true, inputName: 'add-quantity-input', col: '3',
    },
    {
      label: 'From Time', type: 'time', fieldKeyName: 'ready_at', placeholder: 'SELECT TIME', required: true, inputName: 'add-from-time-input', col: '6',
    },
    {
      label: 'End Time', type: 'time', fieldKeyName: 'end_time', placeholder: 'SELECT TIME', required: true, inputName: 'add-end-time-input', col: '6',
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
    try {
      await oneWrapDb?.shootings.upsert(shootingCopy);
    } catch (error) {
      errorToast(`Error adding meal: ${error}`);
      return;
    } finally {
      successToast('Meal added successfully');
    }

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

            successToast('Meal updated successfully');
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
          }
        }
      } catch (error) {
        errorToast(`Error updating advance call: ${error}`);
        return;
      } finally {
        successToast('Advance call updated successfully');
      }
    }
  };

  const validateBannerExistence = (description: string) => {
    const banners = shootingData.mergedSceneBanners.filter((item: any) => item.cardType === 'banner');
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
      title="Add New Department Call"
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
      position: shootingData.mergedSceneBanners.length,
      rehersalStart: null,
      rehersalEnd: null,
      comment: '',
      partiality: false,
      startShooting: null,
      endShooting: null,
      producedSeconds: 0,
      setups: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setShootingData((prev: any) => {
      const updatedScenes = [...prev.mergedSceneBanners, { cardType: 'scene', ...shootingScene, ...scene }];
      const updatedInfo = calculateUpdatedInfo(updatedScenes);
      return {
        ...prev,
        mergedSceneBanners: updatedScenes,
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
    comment: scene.comment,
    partiality: scene.partiality,
    setups: scene.setups,
    createdAt: scene.createdAt,
    updatedAt: scene.updatedAt,
  });

  const saveShooting = async () => {
    if (oneWrapDb && shootingId && !isLoading) {
      try {
        const shooting = await oneWrapDb.shootings.findOne({ selector: { id: shootingId } }).exec();
        const updatedScenes = shootingData.mergedSceneBanners
          .filter((item: any) => item.cardType === 'scene')
          .map((scene: any) => formatSceneAsShootingScene(scene));
        const updatedBanners = shootingData.mergedSceneBanners.filter((item: mergedSceneBanner) => item.cardType === 'banner')
          .map(({ cardType, ...banner } : mergedSceneBanner) => banner);

        const shootingCopy = { ...shooting._data };
        shootingCopy.scenes = updatedScenes;
        shootingCopy.banners = updatedBanners;

        return await oneWrapDb.shootings.upsert(shootingCopy);
      } catch (error) {
        console.error('Error saving new Shooting:', error);
      }
    }
  };

  const handleReorder = async (event: CustomEvent<ItemReorderEventDetail>) => {
    const items = [...shootingData.mergedSceneBanners];
    const [reorderedItem] = items.splice(event.detail.from, 1);
    items.splice(event.detail.to, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index,
    }));

    setShootingData((prev: any) => ({
      ...prev,
      mergedSceneBanners: updatedItems,
    }));

    try {
      const shooting = await oneWrapDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
      const shootingCopy = { ...shooting._data };
      shootingCopy.scenes = updatedItems.filter((item: any) => item.cardType === 'scene').map((scene: any) => formatSceneAsShootingScene(scene));
      shootingCopy.banners = updatedItems.filter((item: any) => item.cardType === 'banner').map(({ cardType, ...banner } : mergedSceneBanner) => banner);

      await oneWrapDb?.shootings.upsert(shootingCopy);
    } catch (error) {
      console.error('Error reordering scenes:', error);
    } finally {
      event.detail.complete();
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
    const updatedScenes = shootingData.mergedSceneBanners.filter((s: any) => {
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
    setShootingData({ ...shootingData, mergedSceneBanners: updatedScenes });
    successToast('Scene deleted successfully');
  };

  const shootingDeleteBanner = (banner: mergedSceneBanner) => {
    const updatedScenes = shootingData.mergedSceneBanners.filter((item: any) => {
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
    successToast('Banner deleted successfully');
  };

  const getSceneBackgroundColor = (scene: mergedSceneShoot) => {
    if (scene.status === ShootingSceneStatusEnum.NotShoot) {
      return 'var(--ion-color-danger-shade)';
    } if (scene.status === ShootingSceneStatusEnum.Shoot) {
      return 'var(--ion-color-success-shade)';
    }
    return 'var(--ion-color-tertiary-dark)';
  };

  const getShootingData = async () => {
    setIsLoading(true);
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

    const mergedScenesShootData: mergedSceneShoot[] = scenesData?.map((scene: any) => {
      const sceneShootingData = scenesInShoot.find((sceneInShoot: any) => parseInt(sceneInShoot.sceneId) === parseInt(scene.sceneId));
      return {
        cardType: 'scene',
        backgroundColor: getSceneBackgroundColor(sceneShootingData),
        frontId: scene._data.id,
        ...scene._data,
        ...sceneShootingData,
      };
    }) ?? [];

    const bannersWithType: mergedSceneBanner[] = bannersInShoot.map((banner: any) => ({
      cardType: 'banner', ...banner,
    }));

    const mergedScenes = [...mergedScenesShootData, ...bannersWithType].sort((a: any, b: any) => a.position - b.position);

    const updatedInfo = calculateUpdatedInfo(mergedScenes);

    const shootingInfo: ShootingInfo = {
      ...updatedInfo,
      generalCall: shootings[0]._data.generalCall,
      onSet: shootings[0]._data.onSet,
      estimatedWrap: shootings[0]._data.estimatedWrap,
      wrap: shootings[0]._data.wrap,
      lastOut: shootings[0]._data.lastOut,
      locations: shootings[0]._data.locations,
      hospitals: shootings[0]._data.hospitals,
      advanceCalls: shootings[0]._data.advanceCalls,
      meals: shootings[0]._data.meals,
      protectedScenes: scenesData?.filter((scene: Scene) => scene.protectionType).length || 0,
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

    setIsLoading(false);

    return {
      mergedSceneBanners: mergedScenes,
      mergedScenesShootData,
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
    <div className="button-wrapper" slot="end" key="custom-add-button">
      <IonButton
        fill="clear"
        slot="end"
        color="light"
        className="ion-no-padding toolbar-button"
        disabled={disableEditions}
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

    // Crear una nueva fecha con la zona horaria local
    const newDate = new Date(
      shootingDay.getFullYear(),
      shootingDay.getMonth(),
      shootingDay.getDate(),
      parseInt(time.hours),
      parseInt(time.minutes),
    );

    // Convertir a ISO string pero ajustar para la zona horaria local
    const offset = newDate.getTimezoneOffset();
    const localISOTime = new Date(newDate.getTime() - (offset * 60 * 1000)).toISOString().slice(0, -1);

    return localISOTime;
  };

  const updateShootingTime = async (field: 'generalCall' | 'onSet' | 'estimatedWrap' | 'wrap' | 'lastOut', time: string) => {
    if (oneWrapDb && shootingId) {
      try {
        const shooting = await oneWrapDb.shootings.findOne({ selector: { id: shootingId } }).exec();

        if (shooting) {
          const shootingCopy = { ...shooting._data };

          // Asegurarse de que el tiempo esté en formato de 24 horas
          const formattedTime = convertTo24Hour(time);

          const [hours, minutes] = formattedTime.split(':');
          const newTimeISO = timeToISOString({ hours, minutes }, shootingCopy.shootDate);

          shootingCopy[field] = newTimeISO;

          await oneWrapDb.shootings.upsert(shootingCopy);

          setShootingData((prev: any) => ({
            ...prev,
            shotingInfo: {
              ...prev.shotingInfo,
              [field]: newTimeISO,
            },
          }));

        }
      } catch (error) {
        console.error(`Error updating ${field}:`, error);
      }
    }
  };

  const convertTo24Hour = (time: string): string => {
    const [timeStr, period] = time.split(' ');
    const [hours, minutes] = timeStr.split(':');
    let hour = parseInt(hours, 10);

    if (period && period.toLowerCase() === 'pm' && hour !== 12) {
      hour += 12;
    } else if (period && period.toLowerCase() === 'am' && hour === 12) {
      hour = 0;
    }

    return `${hour.toString().padStart(2, '0')}:${minutes}`;
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

        }
      } catch (error) {
        console.error('Error deleting advance call:', error);
      }
    }
  };

  const addNewLocation = async (formData: Partial<LocationInfo>) => {
    try {
      const shooting = await oneWrapDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
      const locationInfo = {
        locationTypeId: formData.locationTypeId,
        locationName: formData.locationName,
        locationAddress: formData.locationAddress,
        lat: formData.lat,
        lng: formData.lng,
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
      errorToast(`Error adding location: ${error}`);
      return;
    } finally {
      successToast('Location added successfully');
    }
  };

  const addNewHospital = async (formData: Partial<LocationInfo>) => {
    try {
      const shooting = await oneWrapDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
      const shootingDate = new Date(shooting._data.shootDate);
      const hospitalInfo = {
        locationTypeId: formData.locationTypeId,
        locationName: formData.locationName,
        locationAddress: formData.locationAddress,
        lat: formData.lat,
        lng: formData.lng,
      };

      const shootingCopy = {
        ...shooting._data,
        hospitals: [...shooting._data.hospitals, hospitalInfo],
      };

      await oneWrapDb?.shootings.upsert(shootingCopy);

      setShootingData((prev: any) => ({
        ...prev,
        shotingInfo: {
          ...prev.shotingInfo,
          hospitals: [...prev.shotingInfo.hospitals, hospitalInfo],
        },
      }));
    } catch (error) {
      errorToast('Error adding hospital');
      console.error('Error adding hospital:', error);
      return;
    } finally {
      successToast('Hospital added successfully');
    }
  };

  const updateExistingLocation = async (formData: Partial<LocationInfo>) => {
    try {
      const currentLocationIndex = shootingData.shotingInfo.locations.findIndex((location: LocationInfo) => location.locationName === selectedLocation?.locationName);
      const shooting = await oneWrapDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
      const shootingCopy = { ...shooting._data };
      const updatedLocations = [...shootingCopy.locations];
      updatedLocations[currentLocationIndex] = {
        locationTypeId: formData.locationTypeId,
        locationName: formData.locationName,
        locationAddress: formData.locationAddress,
        lat: formData.lat,
        lng: formData.lng,
      };

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
      console.error('Error updating location:', error);
      errorToast(`Error updating location: ${error}`);
      return;
    } finally {
      successToast('Location updated successfully');
    }
  };

  const updateExistingHospital = async (formData: Partial<LocationInfo>) => {
    try {
      const currentHospitalIndex = shootingData.shotingInfo.hospitals.findIndex((hospital: LocationInfo) => hospital.locationName === selectedHospital?.locationName);
      const shooting = await oneWrapDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
      const shootingCopy = { ...shooting._data };
      const updatedHospitals = [...shootingCopy.hospitals];
      updatedHospitals[currentHospitalIndex] = {
        locationTypeId: formData.locationTypeId,
        locationName: formData.locationName,
        locationAddress: formData.locationAddress,
        lat: formData.lat,
        lng: formData.lng,
      };

      shootingCopy.hospitals = updatedHospitals;

      await oneWrapDb?.shootings.upsert(shootingCopy);

      setShootingData((prev: any) => ({
        ...prev,
        shotingInfo: {
          ...prev.shotingInfo,
          hospitals: updatedHospitals,
        },
      }));

      initializeShootingReplication();
    } catch (error) {
      console.error('Error updating hospital:', error);
      errorToast(`Error updating hospital: ${error}`);
      return;
    } finally {
      successToast('Hospital updated successfully');
    }
  };

  const removeLocation = async (location: LocationInfo, locationIndex: number) => {
    try {
      const shooting = await oneWrapDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
      const shootingCopy = { ...shooting._data };
      const updatedLocations = shootingCopy.locations.filter((loc: LocationInfo, index: number) => index !== locationIndex);
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
      errorToast(`Error removing location: ${error}`);
      return;
    } finally {
      successToast('Location removed successfully');
    }
  };

  const removeHospital = async (hospital: LocationInfo, hospitalIndex: number) => {
    try {
      const shooting = await oneWrapDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
      const shootingCopy = { ...shooting._data };
      const updatedHospitals = shootingCopy.hospitals.filter((hosp: LocationInfo, index: number) => index !== hospitalIndex);
      shootingCopy.hospitals = updatedHospitals;

      await oneWrapDb?.shootings.upsert(shootingCopy);

      setShootingData((prev: any) => ({
        ...prev,
        shotingInfo: {
          ...prev.shotingInfo,
          hospitals: updatedHospitals,
        },
      }));

      initializeShootingReplication();
    } catch (error) {
      console.error('Error removing hospital:', error);
      errorToast(`Error removing hospital: ${error}`);
      return;
    } finally {
      successToast('Hospital removed successfully');
    }
  };

  const editScriptReportButton: any = () => {
    if (view === 'script-report') {
      return (
        <IonButton
          fill="clear"
          slot="end"
          color="light"
          className="ion-no-padding toolbar-button"
          disabled={disableEditions}
          onClick={() => {
            if (scriptReportEditMode) {
              saveScriptReport();
              setScriptReportEditMode(!scriptReportEditMode);
            } else {
              setScriptReportEditMode(!scriptReportEditMode);
            }
          }}
          key="custom-edit"
        >
          {scriptReportEditMode
            ? <IonIcon icon={save} color="success" />
            : <VscEdit size="20px" color="white" />}
        </IonButton>
      );
    }
  };

  const saveScriptReport = async () => {
    try {
      const shooting = await oneWrapDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
      const shootingCopy = { ...shooting._data };
      shootingCopy.scenes = shootingData.mergedScenesShootData;

      await oneWrapDb?.shootings.upsert(shootingCopy);
      const updatedData = await getShootingData();

      setShootingData((prev: any) => {
        const newState = {
          ...prev,
          ...updatedData,
          mergedScenesShootData: updatedData.mergedScenesShootData.map((scene: any) => ({
            ...scene,
            backgroundColor: getSceneBackgroundColor(scene),
          })),
        };
        return newState;
      });
    } catch (error) {
      console.error('Error saving script report:', error);
      errorToast(`Error saving script report: ${error}`);
      return;
    } finally {
      successToast('Script report saved successfully');
    }
  };

  const setMergedScenesShootData = (scenes: any) => {
    setShootingData((prev: any) => ({
      ...prev,
      mergedScenesShootData: scenes,
    }));
  };

  const openEditionModal = (locationIndex: number): any => {
    const location = shootingData.shotingInfo.locations[locationIndex];
    const defaultValues = {
      locationTypeId: location.locationTypeId,
      locationName: location.locationName,
      locationAddress: location.locationAddress,
      locationPostalCode: location.locationPostalCode,
      lat: location.lat,
      lng: location.lng,
    };

    setSelectedLocation(defaultValues);
    setTimeout(() => {
      openMapModal();
    }, 10);
  };

  const openHospitalEditionModal = (hospitalIndex: number): any => {
    const hospital = shootingData.shotingInfo.hospitals[hospitalIndex];
    const defaultValues = {
      locationTypeId: hospital.locationTypeId,
      locationName: hospital.locationName,
      locationAddress: hospital.locationAddress,
      locationPostalCode: hospital.locationPostalCode,
      lat: hospital.lat,
      lng: hospital.lng,
    };

    setSelectedHospital(defaultValues);
    setTimeout(() => {
      openHospitalsMapModal();
    }, 10);
  };

  if (isLoading) {
    return (<IonContent color="tertiary" fullscreen>{ useLoader()}</IonContent>);
  }

  return (
    <IonPage>
      <IonHeader>
        <Toolbar name={shootingData.shootingFormattedDate} customButtons={[editScriptReportButton, addShoBanSc]} back handleBack={handleBack} />
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
          <div className="shooting-scenes-info">
            {/* PRINT GENERAL CALL, READY TO SHOOT, PROTECTIONS, PAGES, MINUTES */}
            <div className={`shooting-scenes-info-item ion-flex ion-padding ion-justify-content-between${isMobile ? ' mobile-shooting-scenes-info' : ''}`}>
              <ShootingInfoLabels
                info={getHourMinutesFomISO(shootingData.shotingInfo.generalCall, true)}
                title="General Call"
              />
              <ShootingInfoLabels
                info={getHourMinutesFomISO(shootingData.shotingInfo.onSet, true)}
                title="On Set"
                isEditable={false}
              />
              <ShootingInfoLabels
                info={shootingData.shotingInfo.scenes.toString()}
                title="Scenes"
                isEditable={false}
              />
              <ShootingInfoLabels
                info={shootingData.shotingInfo.protectedScenes.toString()}
                title="Protections"
                isEditable={false}
              />
              <ShootingInfoLabels
                info={separateTimeOrPages(shootingData.shotingInfo.pages).main}
                symbol={separateTimeOrPages(shootingData.shotingInfo.pages).symbol}
                title="Pages"
              />
              <ShootingInfoLabels
                info={separateTimeOrPages(shootingData.shotingInfo.min).main}
                symbol={separateTimeOrPages(shootingData.shotingInfo.min).symbol}
                title="Minutes"
              />
            </div>

          </div>
          <div className="ion-padding">
            <IonReorderGroup disabled={isDisabled} onIonItemReorder={handleReorder}>
              {isLoading ? (
                useLoader()
              ) : shootingData.mergedSceneBanners.length === 0 ? (
                <div
                  className="ion-padding-start ion-flex"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <OutlinePrimaryButton onClick={openSceneModal} buttonName="Add New" disabled={disableEditions} />
                </div>
              ) : (
                shootingData.mergedSceneBanners.map((scene: any) => (
                  scene.cardType === 'scene' ? (
                    <SceneCard
                      key={scene.sceneId}
                      scene={scene}
                      isShooting
                      isProduced={scene.status}
                      shootingDeleteScene={() => shootingDeleteScene(scene)}
                      permissionType={permissionType}
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
          </div>
        </IonContent>
      )}
      {
        view === 'info'
        && (
        <InfoView
          shootingData={shootingData}
          updateShootingTime={updateShootingTime}
          setOpenLocations={setOpenLocations}
          openLocations={openLocations}
          setLocationsEditMode={setLocationsEditMode}
          locationsEditMode={locationsEditMode}
          openMapModal={openMapModal}
          removeLocation={removeLocation}
          setOpenHospitals={setOpenHospitals}
          openHospitals={openHospitals}
          openHospitalsMapModal={openHospitalsMapModal}
          setOpenAdvanceCalls={setOpenAdvanceCalls}
          openadvanceCalls={openadvanceCalls}
          setAdvanceCallsEditMode={setAdvanceCallsEditMode}
          advanceCallsEditMode={advanceCallsEditMode}
          openAdvanceCallModal={openAdvanceCallModal}
          getHourMinutesFomISO={getHourMinutesFomISO}
          deleteAdvanceCall={deleteAdvanceCall}
          advanceCallInputs={advanceCallInputs}
          handleEditAdvanceCall={handleEditAdvanceCall}
          setOpenMeals={setOpenMeals}
          openMeals={openMeals}
          setMealsEditMode={setMealsEditMode}
          mealsEditMode={mealsEditMode}
          openMealModal={openMealModal}
          deleteMeal={deleteMeal}
          mealInputs={mealInputs}
          handleEditMeal={handleEditMeal}
          permissionType={permissionType}
          openEditModal={openEditionModal}
          openEditHospitalModal={openHospitalEditionModal}
          removeHospital={removeHospital}
        />
        )
      }
      {
        view === 'script-report'
        && (
        <IonContent color="tertiary" fullscreen>
          <ScriptReportView
            mergedScenesShoot={shootingData.mergedScenesShootData}
            editMode={scriptReportEditMode}
            setMergedScenesShoot={setMergedScenesShootData}
            permissionType={permissionType}
            openSceneModal={openSceneModal}
          />
        </IonContent>
        )
      }
      {
        view === 'wrap-report'
        && (
        <IonContent color="tertiary" fullscreen>
          <WrapReportView
            shootingData={shootingData}
            updateShootingTime={updateShootingTime}
            setOpenLocations={setOpenLocations}
            openLocations={openLocations}
            setLocationsEditMode={setLocationsEditMode}
            locationsEditMode={locationsEditMode}
            openMapModal={openMapModal}
            removeLocation={removeLocation}
            setOpenHospitals={setOpenHospitals}
            openHospitals={openHospitals}
            openHospitalsMapModal={openHospitalsMapModal}
            setOpenAdvanceCalls={setOpenAdvanceCalls}
            openadvanceCalls={openadvanceCalls}
            setAdvanceCallsEditMode={setAdvanceCallsEditMode}
            advanceCallsEditMode={advanceCallsEditMode}
            openAdvanceCallModal={openAdvanceCallModal}
            getHourMinutesFomISO={getHourMinutesFomISO}
            deleteAdvanceCall={deleteAdvanceCall}
            advanceCallInputs={advanceCallInputs}
            handleEditAdvanceCall={handleEditAdvanceCall}
            setOpenMeals={setOpenMeals}
            openMeals={openMeals}
            setMealsEditMode={setMealsEditMode}
            mealsEditMode={mealsEditMode}
            openMealModal={openMealModal}
            deleteMeal={deleteMeal}
            mealInputs={mealInputs}
            handleEditMeal={handleEditMeal}
            mergedScenesShoot={shootingData.mergedScenesShootData}
            editMode={scriptReportEditMode}
            setMergedScenesShoot={setMergedScenesShootData}
            saveScriptReport={saveScriptReport}
            permissionType={permissionType}
            openEditLocationModal={openEditionModal}
            openEditHospitalModal={openHospitalEditionModal}
            removeHospital={removeHospital}
          />
        </IonContent>
        )
      }
      {
        view === 'production-report'
        && (
        <IonContent color="tertiary" fullscreen>
          <ProductionReportView />
        </IonContent>
        )
      }
      <ShootingDetailTabs setView={setView} view={view} handleBack={handleBack} />
      <AddNewBanner />
      <AddNewScenes />
      <AddNewAdvanceCallModal />
      <AddNewMeal />
      <MapFormModal isOpen={showMapModal} closeModal={closeMapModal} onSubmit={selectedLocation ? updateExistingLocation : addNewLocation} selectedLocation={selectedLocation} />
      <MapFormModal isOpen={showHospitalsMapModal} closeModal={closeHospitalsMapModal} onSubmit={selectedHospital ? updateExistingHospital : addNewHospital} hospital selectedLocation={selectedHospital} />
    </IonPage>
  );
};

export default ShootingDetail;
