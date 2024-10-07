import {
  IonButton, IonContent, IonHeader,
  IonItem, IonPage, IonReorderGroup,
  ItemReorderEventDetail, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter,
} from '@ionic/react';
import {
  useContext, useEffect, useRef, useState,
} from 'react';
import { IoMdAdd } from 'react-icons/io';
import { VscEdit } from 'react-icons/vsc';
import { useHistory, useParams } from 'react-router';
import { useRxDB } from 'rxdb-hooks';
import EditionModal, { FormInput, SelectOptionsInterface } from '../../components/Shared/EditionModal/EditionModal';
import MapFormModal from '../../components/Shared/MapFormModal/MapFormModal';
import OutlinePrimaryButton from '../../components/Shared/OutlinePrimaryButton/OutlinePrimaryButton';
import Toolbar from '../../components/Shared/Toolbar/Toolbar';
import ShootingBanner from '../../components/ShootingDetail/ShootingBannerCard/ShootingBanner';
import { ShootingInfoLabels } from '../../components/ShootingDetail/ShootingBasicInfo/ShootingBasicInfo';
import ShootingDetailTabs from '../../components/ShootingDetail/ShootingDetailTabs/ShootingDetailTabs';
import InfoView from '../../components/ShootingDetail/ShootingDetailViews/InfoView/InfoView';
import ProductionReportView from '../../components/ShootingDetail/ShootingDetailViews/ProductionReportView/ProductionReportView';
import ScriptReportView from '../../components/ShootingDetail/ShootingDetailViews/ScriptReportView/ScriptReportView';
import WrapReportView from '../../components/ShootingDetail/ShootingDetailViews/WrapReportView/WrapReportView';
import SceneCard from '../../components/Strips/SceneCard';
import DatabaseContext from '../../context/Database.context';
import { ShootingSceneStatusEnum } from '../../Ennums/ennums';
import AppLoader from '../../hooks/Shared/AppLoader';
import useErrorToast from '../../hooks/Shared/useErrorToast';
import useIsMobile from '../../hooks/Shared/useIsMobile';
import useSuccessToast from '../../hooks/Shared/useSuccessToast';
import { Scene } from '../../interfaces/scenes.types';
import {
  AdvanceCall,
  AdvanceCalls,
  LocationInfo,
  Meal,
  ShootingBanner as ShootingBannerType,
  ShootingScene,
} from '../../interfaces/shooting.types';
import InputModalScene from '../../Layouts/InputModalScene/InputModalScene';
import colorIsDark from '../../utils/colorIsDark';
import convertTo24Hour from '../../utils/convertTo24hours';
import floatToFraction from '../../utils/floatToFraction';
import getHourMinutesFomISO from '../../utils/getHoursMinutesFromISO';
import secondsToMinSec from '../../utils/secondsToMinSec';
import separateTimeOrPages from '../../utils/SeparateTimeOrPages';
import './ShootingDetail.css';
import getSceneHeader from '../../utils/getSceneHeader';
import SceneHeader from '../SceneDetails/SceneHeader';

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
  // *************************** CONSTANTS ************************************//

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

  const bannersSelectOptions = availableColors.map((color) => ({
    value: color.value,
    label: color.name,
    style: {
      backgroundColor: color.value,
      color: colorIsDark(color.value) ? 'white' : 'black',
      border: '1px solid var(--ion-color-tertiary-dark)',
    },
  }));

  const fontSizeOptions: SelectOptionsInterface[] = [
    { value: 12, label: '12 px' },
    { value: 14, label: '14 px' },
    { value: 16, label: '16 px' },
    { value: 18, label: '18 px' },
    { value: 20, label: '20 px' },
  ];

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
      selectOptions: bannersSelectOptions,
      col: '4',
    },
  ];

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

  // *************************** CONSTANTS ************************************//

  // *************************** STATES ************************************//

  const [isDisabled, unused_] = useState(false);
  const { shootingId } = useParams<{ shootingId: string }>();
  const oneWrappDb: any = useRxDB();
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
  const [isLoading, setIsLoading] = useState(true);
  const [shootingData, setShootingData] = useState<ShootingDataProps>(shootingDataInitial);
  const [searchText, setSearchText] = useState('');
  const [searchMode, setSearchMode] = useState(false);

  // *************************** STATES ************************************//

  // *************************** REFS ************************************//

  const bannerModalRef = useRef<HTMLIonModalElement>(null);
  const sceneModalRef = useRef<HTMLIonModalElement>(null);
  const advanceCallModalRef = useRef<HTMLIonModalElement>(null);
  const mealModalRef = useRef<HTMLIonModalElement>(null);
  const disableEditions = permissionType !== 1;
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();
  const isMobile = useIsMobile();

  // *************************** REFS ************************************//

  // *************************** CONTEXT ************************************//

  const { setViewTabs } = useContext(DatabaseContext);

  // *************************** CONTEXT ************************************//

  //* ************************* UTILS ********************************************************//

  const validateBannerExistence = (description: string) => {
    const banners = shootingData.mergedSceneBanners.filter((item: any) => item.cardType === 'banner');
    const bannerExists = banners.some((banner: any) => banner.description.toLowerCase() === description.toLowerCase());
    if (bannerExists) {
      return 'banner already exists';
    }

    return false;
  };

  const validateAdvanceCallExistence = (callTime: string) => {
    const { advanceCalls: shootingCalls } = shootingData.shotingInfo;
    const callExists = shootingCalls.some((call: any) => call.dep_name_eng.toLowerCase() === callTime.toLowerCase() || call.dep_name_esp.toLowerCase() === callTime.toLowerCase());
    if (callExists) {
      return 'department already exists in shooting';
    }

    return false;
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

  const validateMealExistence = (meal: string) => {
    const { meals: shootingMeals } = shootingData.shotingInfo;
    const mealExists = shootingMeals.some((m: Meal) => m.meal.toLowerCase() === meal.toLowerCase());
    if (mealExists) {
      return 'meal already exists';
    }

    return false;
  };

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

  const handleBack = () => {
    history.push(`/my/projects/${id}/calendar`);
  };

  const toggleAddMenu = () => {
    setAdditionMenu(!additionMenu);
  };

  const timeToISOString = (time: { hours: string, minutes: string }, shootingDate: string) => {
    const shootingDay = new Date(shootingDate);

    // Crear una nueva fecha con la zona horaria local
    const newDate = new Date(
      shootingDay.getFullYear(),
      shootingDay.getMonth(),
      shootingDay.getDate(),
      parseInt(time.hours, 10),
      parseInt(time.minutes, 10),
    );

    const offset = newDate.getTimezoneOffset();
    const localISOTime = new Date(newDate.getTime() - (offset * 60 * 1000)).toISOString().slice(0, -1);

    return localISOTime;
  };

  const setMergedScenesShootData = (scenes: any) => {
    setShootingData((prev: any) => ({
      ...prev,
      mergedScenesShootData: scenes,
    }));
  };

  //* ************************* UTILS ********************************************************//

  //* ***************************** IONIC HOOKS *****************************/

  useIonViewDidEnter(() => {
    setViewTabs(false);
  });

  useIonViewWillEnter(() => {
    setViewTabs(false);
  });

  useIonViewDidLeave(() => {
    setViewTabs(true);
  });

  //* ***************************** IONIC HOOKS *****************************/

  //* ****************************** MODALS **********************************/

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

  //* ****************************** MODALS **********************************//

  //* ************************* RXDB API CALLS *******************************************//

  const getShootingData = async () => {
    setIsLoading(true);
    const shootings: any = await oneWrappDb?.shootings.find({ selector: { id: shootingId } }).exec();
    const scenesInShoot = shootings[0]._data.scenes;
    const bannersInShoot = shootings[0]._data.banners;
    const scenesIds = scenesInShoot.map((scene: any) => parseInt(scene.sceneId));

    const scenesData = await oneWrappDb?.scenes.find({
      selector: { sceneId: { $in: scenesIds } },
    }).exec();

    const scenesNotIncluded = await oneWrappDb?.scenes.find({
      selector: { projectId: shootings[0]._data.projectId, sceneId: { $nin: scenesIds } },
    }).exec();

    const mergedScenesShootData: mergedSceneShoot[] = scenesData?.map((scene: any) => {
      const sceneShootingData = scenesInShoot.find((sceneInShoot: any) => parseInt(sceneInShoot.sceneId) === parseInt(scene.sceneId));
      return {
        cardType: 'scene',
        backgroundColor: getSceneBackgroundColor(sceneShootingData),
        frontId: scene._data.id,
        sceneHeader: getSceneHeader(scene._data),
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
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const saveScriptReport = async () => {
    try {
      const shooting = await oneWrappDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
      const shootingCopy = { ...shooting._data };
      console.log(shootingCopy);
      shootingCopy.scenes = shootingData.mergedScenesShootData;

      await oneWrappDb?.shootings.upsert(shootingCopy);
    } catch (error) {
      errorToast(`Error saving script report: ${error}`);
      throw error;
    } finally {
      successToast('Script report saved successfully');
      // calculate backgrond color
      const mergedScenesShootData = shootingData.mergedScenesShootData.map((scene: any) => {
        return {
          ...scene,
          backgroundColor: getSceneBackgroundColor(scene),
        };
      })
      setMergedScenesShootData(mergedScenesShootData);
    }
  };

  const updateShootingTime = async (field: 'generalCall' | 'onSet' | 'estimatedWrap' | 'wrap' | 'lastOut', time: string) => {
    if (oneWrappDb && shootingId) {
      try {
        const shooting = await oneWrappDb.shootings.findOne({ selector: { id: shootingId } }).exec();

        if (shooting) {
          const shootingCopy = { ...shooting._data };

          const formattedTime = convertTo24Hour(time);

          const [hours, minutes] = formattedTime.split(':');
          const newTimeISO = timeToISOString({ hours, minutes }, shootingCopy.shootDate);

          shootingCopy[field] = newTimeISO;

          await oneWrappDb.shootings.upsert(shootingCopy);

          fetchData();
        }
      } catch (error) {
        errorToast(`Error updating time: ${error}`);
        throw error;
      }
    }
  };

  const deleteMeal = async (mealToDelete: Meal) => {
    if (oneWrappDb && shootingId) {
      try {
        const shooting = await oneWrappDb.shootings.findOne({ selector: { id: shootingId } }).exec();

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

          await oneWrappDb.shootings.upsert(shootingCopy);

          fetchData();
        }
      } catch (error) {
        errorToast('Error deleting meal');
        throw error;
      }
    }
  };

  const deleteAdvanceCall = async (callToDelete: AdvanceCall) => {
    if (oneWrappDb && shootingId) {
      try {
        const shooting = await oneWrappDb.shootings.findOne({ selector: { id: shootingId } }).exec();

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

          await oneWrappDb.shootings.upsert(shootingCopy);
        }
      } catch (error) {
        errorToast('Error deleting advance call');
        throw error;
      }
    }
  };

  const addNewLocation = async (formData: Partial<LocationInfo>) => {
    try {
      const shooting = await oneWrappDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
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

      await oneWrappDb?.shootings.upsert(shootingCopy);

      fetchData();
    } catch (error) {
      errorToast(`Error adding location: ${error}`);
      return;
    } finally {
      successToast('Location added successfully');
    }
  };

  const addNewHospital = async (formData: Partial<LocationInfo>) => {
    try {
      const shooting = await oneWrappDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
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

      await oneWrappDb?.shootings.upsert(shootingCopy);
      fetchData();
    } catch (error) {
      errorToast('Error adding hospital');
      throw error;
    } finally {
      successToast('Hospital added successfully');
    }
  };

  const updateExistingLocation = async (formData: Partial<LocationInfo>) => {
    try {
      const currentLocationIndex = shootingData.shotingInfo.locations.findIndex((location: LocationInfo) => location.locationName === selectedLocation?.locationName);
      const shooting = await oneWrappDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
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

      await oneWrappDb?.shootings.upsert(shootingCopy);
      fetchData();
    } catch (error) {
      errorToast(`Error updating location: ${error}`);
      throw error;
    } finally {
      successToast('Location updated successfully');
    }
  };

  const updateExistingHospital = async (formData: Partial<LocationInfo>) => {
    try {
      const currentHospitalIndex = shootingData.shotingInfo.hospitals.findIndex((hospital: LocationInfo) => hospital.locationName === selectedHospital?.locationName);
      const shooting = await oneWrappDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
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

      await oneWrappDb?.shootings.upsert(shootingCopy);
      fetchData();
    } catch (error) {
      errorToast(`Error updating hospital: ${error}`);
      throw error;
    } finally {
      successToast('Hospital updated successfully');
    }
  };

  const removeLocation = async (location: LocationInfo, locationIndex: number) => {
    try {
      const shooting = await oneWrappDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
      const shootingCopy = { ...shooting._data };
      const updatedLocations = shootingCopy.locations.filter((loc: LocationInfo, index: number) => index !== locationIndex);
      shootingCopy.locations = updatedLocations;

      await oneWrappDb?.shootings.upsert(shootingCopy);
      fetchData();
    } catch (error) {
      errorToast(`Error removing location: ${error}`);
      throw error;
    } finally {
      successToast('Location removed successfully');
    }
  };

  const removeHospital = async (hospital: LocationInfo, hospitalIndex: number) => {
    try {
      const shooting = await oneWrappDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
      const shootingCopy = { ...shooting._data };
      const updatedHospitals = shootingCopy.hospitals.filter((hosp: LocationInfo, index: number) => index !== hospitalIndex);
      shootingCopy.hospitals = updatedHospitals;

      await oneWrappDb?.shootings.upsert(shootingCopy);
      fetchData();
    } catch (error) {
      errorToast(`Error removing hospital: ${error}`);
      throw error;
    } finally {
      successToast('Hospital removed successfully');
    }
  };

  const addNewBanner = (banner: any) => {
    const bannerCopy = { ...banner };
    bannerCopy.position = shootingData.mergedSceneBanners.length;
    bannerCopy.id = null;
    bannerCopy.fontSize = parseInt(bannerCopy.fontSize);
    bannerCopy.shootingId = parseInt(shootingId);
    bannerCopy.createdAt = new Date().toISOString();
    bannerCopy.updatedAt = new Date().toISOString();

    setShootingData((prev: ShootingDataProps) => ({
      ...prev,
      mergedSceneBanners: [...prev.mergedSceneBanners, { cardType: 'banner', ...bannerCopy }],
    }));
  };

  const addNewAdvanceCall = async (advanceCall: any) => {
    const shooting = await oneWrappDb?.shootings.findOne({ selector: { id: shootingId } }).exec();

    const advanceCallCopy = { ...advanceCall };

    advanceCallCopy.id = `advance-call-${shootingData.shotingInfo.advanceCalls.length + 1}`;
    advanceCallCopy.shootingId = parseInt(shootingId);
    advanceCallCopy.createdAt = new Date().toISOString();
    advanceCallCopy.updatedAt = new Date().toISOString();
    const formatedTime = advanceCallCopy.adv_call_time.split(':');
    advanceCallCopy.adv_call_time = { hours: formatedTime[0], minutes: formatedTime[1] };
    advanceCallCopy.dep_name_esp = advanceCallCopy.dep_name_eng;
    const shootingCopy = { ...shooting._data };
    advanceCallCopy.adv_call_time = timeToISOString(advanceCallCopy.adv_call_time, shootingCopy.shootDate);
    shootingCopy.advanceCalls = [...shootingCopy.advanceCalls, advanceCallCopy];

    try {
      await oneWrappDb?.shootings.upsert(shootingCopy);
    } catch (error) {
      errorToast(`Error adding advance call: ${error}`);
      return;
    } finally {
      successToast('Advance call added successfully');
    }
  };

  const addNewMeal = async (meal: any) => {
    const shooting = await oneWrappDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
    const mealCopy = { ...meal };
    mealCopy.id = `meal-${shootingData.shotingInfo.meals.length + 1}`;
    mealCopy.shootingId = parseInt(shootingId);
    mealCopy.createdAt = new Date().toISOString();
    mealCopy.updatedAt = new Date().toISOString();
    const formatedTimeStart = mealCopy.ready_at.split(':');
    const formatedTimeEnd = mealCopy.end_time.split(':');
    mealCopy.ready_at = { hours: formatedTimeStart[0], minutes: formatedTimeStart[1] };
    mealCopy.end_time = { hours: formatedTimeEnd[0], minutes: formatedTimeEnd[1] };
    const shootingCopy = { ...shooting._data };
    mealCopy.ready_at = timeToISOString(meal.ready_at, shootingCopy.shootDate);
    mealCopy.end_time = timeToISOString(meal.end_time, shootingCopy.shootDate);

    shootingCopy.meals = [...shootingCopy.meals, mealCopy];
    try {
      await oneWrappDb?.shootings.upsert(shootingCopy);
    } catch (error) {
      errorToast(`Error adding meal: ${error}`);
      return;
    } finally {
      successToast('Meal added successfully');
    }
  };

  const handleEditMeal = async (meal: Meal) => {
    if (oneWrappDb && shootingId) {
      try {
        const shooting = await oneWrappDb.shootings.findOne({ selector: { id: shootingId } }).exec();

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

            await oneWrappDb.shootings.upsert(shootingCopy);

            successToast('Meal updated successfully');
          }
        }
      } catch (error) {
        errorToast(`Error updating meal: ${error}`);
        throw error;
      }
    }
  };

  const handleEditAdvanceCall = async (advanceCall: AdvanceCall) => {
    if (oneWrappDb && shootingId) {
      try {
        const shooting = await oneWrappDb.shootings.findOne({ selector: { id: shootingId } }).exec();

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

            await oneWrappDb.shootings.upsert(shootingCopy);
          }
        }
      } catch (error) {
        errorToast(`Error updating advance call: ${error}`);
      } finally {
        successToast('Advance call updated successfully');
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
      const shooting = await oneWrappDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
      const shootingCopy = { ...shooting._data };
      shootingCopy.scenes = updatedItems.filter((item: any) => item.cardType === 'scene').map((scene: any) => formatSceneAsShootingScene(scene));
      // eslint-disable-next-line
      shootingCopy.banners = updatedItems.filter((item: any) => item.cardType === 'banner').map(({ cardType, ...banner } : mergedSceneBanner) => banner);

      await oneWrappDb?.shootings.upsert(shootingCopy);
    } catch (error) {
      errorToast(`Error reordering scenes: ${error}`);
      throw error;
    } finally {
      event.detail.complete();
    }
  };

  const saveShooting = async () => {
    if (oneWrappDb && shootingId && !isLoading) {
      try {
        const shooting = await oneWrappDb.shootings.findOne({ selector: { id: shootingId } }).exec();
        const updatedScenes = shootingData.mergedSceneBanners
          .filter((item: any) => item.cardType === 'scene')
          .map((scene: any) => formatSceneAsShootingScene(scene));
        const updatedBanners = shootingData.mergedSceneBanners.filter((item: mergedSceneBanner) => item.cardType === 'banner')
        // eslint-disable-next-line
          .map(({ cardType, ...banner } : mergedSceneBanner) => banner);

        const shootingCopy = { ...shooting._data };
        shootingCopy.scenes = updatedScenes;
        shootingCopy.banners = updatedBanners;

        await oneWrappDb.shootings.upsert(shootingCopy);
      } catch (error) {
        errorToast('Error saving shooting');
        throw error;
      }
    }
  };

  //* ************************* RXDB API CALLS *******************************************//

  //* ***************************** EFFECTS *****************************/
  useEffect(() => {
    fetchData();
  }, [oneWrappDb]);

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

  //* ***************************** EFFECTS *****************************//

  // *************************** COMPONENTS ************************************//

  const AddNewBanner = () => (
    <EditionModal
      modalRef={bannerModalRef}
      modalTrigger={`open-add-new-banner-modal-${shootingId}`}
      title="Add New Banner"
      formInputs={bannerInputs}
      handleEdition={addNewBanner}
      defaultFormValues={{}}
      modalId="add-new-banner-modal"
      validate={validateBannerExistence}
    />
  );

  const AddNewAdvanceCallModal = () => (
    <EditionModal
      modalRef={advanceCallModalRef}
      modalTrigger={`open-add-new-advance-call-modal-${shootingId}`}
      title="Add New Department Call"
      formInputs={advanceCallInputs}
      handleEdition={addNewAdvanceCall}
      defaultFormValues={{}}
      modalId={`add-new-advance-call-modal-${shootingId}`}
      validate={validateAdvanceCallExistence}
    />
  );

  const AddNewMeal = () => (
    <EditionModal
      modalRef={mealModalRef}
      modalTrigger={`open-add-new-meal-modal-${shootingId}`}
      title="Add New Meal"
      formInputs={mealInputs}
      handleEdition={addNewMeal}
      defaultFormValues={{}}
      modalId={`open-add-new-meal-modal-${shootingId}`}
      validate={validateMealExistence}
    />
  );

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

  const addShoBanSc = () => {
    if (view === 'scenes') {
      return (
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
    }
  };

  const editScriptReportButton: any = () => {
    if (view === 'script-report') {
      if (!scriptReportEditMode) {
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
            <VscEdit size="20px" color="white" />
          </IonButton>
        );
      }
      return (
        <>
          <IonButton
            fill="clear"
            slot="end"
            color="light"
            className="outline-success-button-small"
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
            SAVE
          </IonButton>
          <IonButton
            fill="clear"
            slot="end"
            color="light"
            className="outline-danger-button-small"
            disabled={disableEditions}
            onClick={() => {
              setScriptReportEditMode(false);
            }}
            key="custom-cancel"
          >
            CANCEL
          </IonButton>
        </>
      );
    }
  };

  if (isLoading) {
    return (<IonContent color="tertiary" fullscreen>{ AppLoader()}</IonContent>);
  }

  const renderSearchBar = () => (
    view === 'production-report' && {
      search: true,
      searchMode,
      setSearchMode,
      setSearchText,
      searchText,
    }
  );

  return (
    <IonPage>
      <IonHeader>
        <Toolbar name={shootingData.shootingFormattedDate} customButtons={[editScriptReportButton, addShoBanSc]} back handleBack={handleBack} {...renderSearchBar()} />
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
                AppLoader()
              ) : (
                <>
                  {shootingData.mergedSceneBanners.length === 0 ? (
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
                    shootingData.mergedSceneBanners.map((scene: any) => {
                      if (scene.cardType === 'scene') {
                        return (
                          <SceneCard
                            key={scene.sceneId}
                            scene={scene}
                            isShooting
                            isProduced={scene.status}
                            shootingDeleteScene={() => shootingDeleteScene(scene)}
                            permissionType={permissionType}
                          />
                        );
                      }
                      return (
                        <ShootingBanner
                          key={scene.id}
                          banner={scene}
                          shootingDeleteBanner={() => shootingDeleteBanner(scene)}
                        />
                      );
                    })
                  )}
                </>
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
          <ProductionReportView searchText={searchText} />
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
