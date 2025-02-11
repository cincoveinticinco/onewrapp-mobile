import { useCallback, useState } from "react";
import { useRxDB } from "rxdb-hooks";
import { useParams } from "react-router";
import { mergedSceneBanner, mergedSceneShoot, ShootingDataProps, ShootingInfo } from "../types/ShootingDetail.types";
import { getSceneBackgroundColor } from "../utils/getSceneBackgroundColor.util";
import getSceneHeader from "../../../Shared/Utils/getSceneHeader";
import floatToFraction from "../../../Shared/Utils/floatToFraction";
import secondsToMinSec from "../../../Shared/Utils/secondsToMinSec";
import { SceneDocType } from "../../../Shared/types/scenes.types";
import useSuccessToast from "../../../Shared/hooks/useSuccessToast";
import useErrorToast from "../../../Shared/hooks/useErrorToast";
import convertTo24Hour from "../../../Shared/Utils/convertTo24hours";
import { timeToISOString } from "../utils/timeToISOString.util";
import { AdvanceCall, LocationInfo, Meal, ShootingScene } from "../../../Shared/types/shooting.types";
import { ItemReorderEventDetail } from "@ionic/react";
import { formatShootingDate } from "../utils/formatShootingDate.util";

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

export const useShootingInfo = () => {

  const oneWrappDb: any = useRxDB();

  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  const [selectedLocation, setSelectedLocation] = useState<LocationInfo | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<LocationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shootingData, setShootingData] = useState<ShootingDataProps>(shootingDataInitial);
  const [generalCallDiffHours, setGeneralCallDiffHours ] = useState<number>(0)
  const [moveDiffHoursAlertOpen, setMoveDiffHoursAlertOpen] = useState(false);
  const { shootingId } = useParams<{ shootingId: string }>();

  const calculateUpdatedInfo = (scenes: any[]) => {
    const scenesOnly = scenes.filter((item: any) => item.cardType === 'scene');
    const setNames = new Set();
    let totalPages = 0;
    let totalTime = 0;
  
    for (const scene of scenesOnly) {
      if (scene.setName) setNames.add(scene.setName.toUpperCase());
      totalPages += scene.pages || 0;
      totalTime += scene.estimatedSeconds || 0;
    }
  
    return {
      sets: setNames.size,
      scenes: scenesOnly.length,
      pages: floatToFraction(totalPages),
      min: secondsToMinSec(totalTime),
    };
  };

  const waitForIndexedDB = async () => {
    const checkIndexedDB = async () => {
      const shooting = await oneWrappDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
      return shooting !== null;
    };
  
    let attempts = 0;
    while (!(await checkIndexedDB()) && attempts < 10) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }
  };

  const getShootingData = async (): Promise<{
    mergedSceneBanners: any[];
    mergedScenesShootData: mergedSceneShoot[];
    scenesNotIncluded: any[];
    shootingInfo: ShootingInfo;
    formattedDate: string;
  }> => {
    try {
      // Primera query - obtener datos del shooting
      const t1 = new Date().getTime();
      await waitForIndexedDB();
      const shooting = await oneWrappDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
      const scenesInShoot = shooting._data.scenes;
      const bannersInShoot = shooting._data.banners;
      const scenesIds = scenesInShoot.map((scene: any) => parseInt(scene.sceneId));
      console.log('Time for getting shooting data:', new Date().getTime() - t1);
  
      // Queries paralelas para scenes
      const t2 = new Date().getTime();
      const [scenesData, scenesNotIncluded] = await Promise.all([
        oneWrappDb?.scenes.find({
          selector: { sceneId: { $in: scenesIds } },
        }).exec(),
        oneWrappDb?.scenes.find({
          selector: { projectId: shooting._data.projectId, sceneId: { $nin: scenesIds } },
        }).exec()
      ]);
      console.log('Time for parallel scene queries:', new Date().getTime() - t2);
  
      // Crear Map para lookup eficiente
      const t3 = new Date().getTime();
      const sceneShootingDataMap = new Map(
        scenesInShoot.map((scene: any) => [parseInt(scene.sceneId), scene])
      );
  
      const mergedScenesShootData: mergedSceneShoot[] = scenesData?.map((scene: any) => {
        const sceneShootingData = sceneShootingDataMap.get(parseInt(scene.sceneId));
        return {
          cardType: 'scene',
          backgroundColor: getSceneBackgroundColor(sceneShootingData as mergedSceneShoot),
          frontId: scene._data.id,
          sceneHeader: getSceneHeader(scene._data),
          ...scene._data,
          ...(typeof sceneShootingData === 'object' ? sceneShootingData : {}),
        };
      }) ?? [];
      console.log('Time for merging scenes data:', new Date().getTime() - t3);
  
      // Procesar banners
      const t4 = new Date().getTime();
      const bannersWithType: mergedSceneBanner[] = bannersInShoot.map((banner: any) => ({
        cardType: 'banner',
        ...banner,
      }));
      console.log('Time for processing banners:', new Date().getTime() - t4);
  
      // Merge y sort final
      const t5 = new Date().getTime();
      const mergedScenes = [...mergedScenesShootData, ...bannersWithType].sort(
        (a: any, b: any) => a.position - b.position
      );
      console.log('Time for final merge and sort:', new Date().getTime() - t5);
  
      // Calcular información actualizada
      const t6 = new Date().getTime();
      const updatedInfo = calculateUpdatedInfo(mergedScenes);
      console.log('Time for calculating updated info:', new Date().getTime() - t6);
  
      const t7 = new Date().getTime();
      const shootingInfo: ShootingInfo = {
        ...updatedInfo,
        generalCall: shooting._data.generalCall,
        onSet: shooting._data.onSet,
        estimatedWrap: shooting._data.estimatedWrap,
        wrap: shooting._data.wrap,
        lastOut: shooting._data.lastOut,
        locations: shooting._data.locations,
        hospitals: shooting._data.hospitals,
        advanceCalls: shooting._data.advanceCalls,
        meals: shooting._data.meals,
        protectedScenes: scenesData?.filter((scene: SceneDocType) => scene.protectionType).length || 0,
      };
      console.log('Time for creating shooting info:', new Date().getTime() - t7);
  
      const t8 = new Date().getTime();
      const shootingFormattedDate = formatShootingDate(shooting._data.shootDate, shooting._data.unitNumber);
      console.log('Time for formatting date:', new Date().getTime() - t8);
  
      const timeTrackerEnd = new Date().getTime();
      return {
        mergedSceneBanners: mergedScenes,
        mergedScenesShootData,
        scenesNotIncluded: scenesNotIncluded?.map((scene: any) => scene._data) ?? [],
        shootingInfo,
        formattedDate: shootingFormattedDate,
      };
    } catch (error) {
      console.error('Error in getShootingData:', error);
      throw error;
    }
  };

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const scenesData = await getShootingData();
      setShootingData({
        mergedSceneBanners: scenesData.mergedSceneBanners,
        mergedScenesShootData: scenesData.mergedScenesShootData.map((scene: any) => {
          return {
            ...scene,
            backgroundColor: getSceneBackgroundColor(scene),
          };
        }),
        notIncludedScenes: scenesData.scenesNotIncluded,
        shotingInfo: scenesData.shootingInfo,
        shootingFormattedDate: scenesData.formattedDate,
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }, [oneWrappDb, shootingId]);

  const saveScriptReport = async () => {
    try {
      const shooting = await oneWrappDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
      const shootingCopy = { ...shooting._data };
      shootingCopy.scenes = shootingData.mergedScenesShootData;
      await oneWrappDb?.shootings.upsert(shootingCopy);
      successToast('Script report saved successfully');
    } catch (error) {
      errorToast(`Error saving script report: ${error}`);
      throw error;
    } finally {
      await fetchData();
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


            if(shootingCopy.generalCall && field === 'generalCall') {
            // Normalize the time to ensure they are in the same time zone and format
            const previousGeneralCallDate = new Date(shootingCopy.generalCall);
            const newGeneralCallDate = new Date(newTimeISO);

            console.log('previousGeneralCallDate', previousGeneralCallDate);
            console.log('newGeneralCallDate', newGeneralCallDate);

            // Convert both times to military hours
            const previousGeneralCallHours = previousGeneralCallDate.getHours();
            const newGeneralCallHours = newGeneralCallDate.getHours();

            const diff = newGeneralCallHours - previousGeneralCallHours;
            setGeneralCallDiffHours(diff);
            }

          shootingCopy[field] = newTimeISO;
          await oneWrappDb.shootings.upsert(shootingCopy);
          const shootingDataCopy = structuredClone(shootingData);
          shootingDataCopy.shotingInfo[field] = newTimeISO;
          setShootingData(shootingDataCopy)

          if(field === 'generalCall') {
            setMoveDiffHoursAlertOpen(true)
          }
          successToast('Time updated successfully');
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
              && meal.readyAt === mealToDelete.readyAt
              && meal.endTime === mealToDelete.endTime);
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
      } finally {
        await fetchData();
        successToast('Meal deleted successfully');
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
      } finally {
        await fetchData();
        successToast('Advance call deleted successfully');
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
      await fetchData();
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
      await fetchData();
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
      await fetchData();
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
      await fetchData();
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
      await fetchData();
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
      await fetchData();
      successToast('Hospital removed successfully');
    }
  };

  const addNewBanner = async (banner: any) => {
    try {
      const bannerCopy = { ...banner };
      bannerCopy.position = shootingData.mergedSceneBanners.length;
      // Generamos un ID temporal único
      bannerCopy.id = null;
      bannerCopy.fontSize = parseInt(bannerCopy.fontSize);
      bannerCopy.shootingId = parseInt(shootingId);
      bannerCopy.createdAt = new Date().toISOString();
      bannerCopy.updatedAt = new Date().toISOString();
  
      const shooting = await oneWrappDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
      const shootingCopy = { 
        ...shooting._data,
        banners: [...shooting._data.banners, bannerCopy]
      }
  
      await oneWrappDb?.shootings.upsert(shootingCopy);
      await fetchData();
      successToast('Banner added successfully'); 
    } catch {
      errorToast('Error adding banner');
      return;
    }
  };
  
  const addNewAdvanceCall = async (advanceCall: any) => {
    const shooting = await oneWrappDb?.shootings.findOne({ selector: { id: shootingId } }).exec();

    const advanceCallCopy = { ...advanceCall };

    advanceCallCopy.id = `advance-call-${shootingData.shotingInfo.advanceCalls.length + 1}`;
    advanceCallCopy.shootingId = parseInt(shootingId);
    advanceCallCopy.createdAt = new Date().toISOString();
    advanceCallCopy.updatedAt = new Date().toISOString();
    const formatedTime = advanceCallCopy.adv_call_time.split(':');
    advanceCallCopy.dep_name_esp = advanceCallCopy.dep_name_eng;
    const shootingCopy = { ...shooting._data };
    advanceCallCopy.adv_call_time = timeToISOString({ hours: formatedTime[0], minutes: formatedTime[1] }, shootingCopy.shootDate);
    shootingCopy.advanceCalls = [...shootingCopy.advanceCalls, advanceCallCopy];

    try {
      await oneWrappDb?.shootings.upsert(shootingCopy);
    } catch (error) {
      errorToast(`Error adding advance call: ${error}`);
      return;
    } finally {
      await fetchData();
      successToast('Advance call added successfully');
    }
  };

  const addNewMeal = async (meal: Meal) => {
    try {
      const shooting = await oneWrappDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
      const mealCopy = { ...meal };
      mealCopy.id = meal.meal; // this is a temporary id, in the backend the logic is (meal.meal == id, so it means that meal is new and should be created)
      mealCopy.shootingId = parseInt(shootingId);
      mealCopy.quantity = Number(meal.quantity);
      const formatedTimeStart = mealCopy.readyAt?.split(':') || ["00", "00"];
      const formatedTimeEnd = mealCopy.endTime?.split(':') || ["00", "00"];
      const shootingCopy = { ...shooting._data };
      mealCopy.readyAt = timeToISOString({ hours: formatedTimeStart[0], minutes: formatedTimeStart[1] }, shootingCopy.shootDate);
      mealCopy.endTime = timeToISOString({ hours: formatedTimeEnd[0], minutes: formatedTimeEnd[1] }, shootingCopy.shootDate);
  
      shootingCopy.meals = [...shootingCopy.meals, mealCopy];
      await oneWrappDb?.shootings.upsert(shootingCopy);
      successToast('Meal added successfully');
    } catch (error: any) {
      errorToast(`Error adding meal: ${error}`);
      console.error(error?.message  || 'Error adding meal'); 
      return;
    } finally {
      await fetchData();
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

            if (!meal.readyAt || !meal.endTime) {
              throw new Error('Invalid time');
            }

            // Convertir los tiempos a formato ISO
            updatedMeals[index] = {
              ...meal,
              quantity: Number(meal.quantity),
              readyAt: timeToISOString({ hours: meal.readyAt.split(':')[0], minutes: meal.readyAt.split(':')[1] }, shootingCopy.shootDate),
              endTime: timeToISOString({ hours: meal.endTime.split(':')[0], minutes: meal.endTime.split(':')[1] }, shootingCopy.shootDate),
            };
     
            shootingCopy.meals = updatedMeals;

            await oneWrappDb.shootings.upsert(shootingCopy);

            successToast('Meal updated successfully');
          }
        }
      } catch (error) {
        errorToast(`Error updating meal: ${error}`);
        throw error;
      } finally {
        await fetchData();
        successToast('Meal updated successfully');
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

            if (!advanceCall.adv_call_time) {
              throw new Error('Invalid time');
            }

            // Convertir el tiempo a formato ISO
            updatedAdvanceCalls[index] = {
              ...advanceCall,
              dep_name_esp: advanceCall.dep_name_eng,
              adv_call_time: timeToISOString({ hours: advanceCall.adv_call_time.split(':')[0], minutes: advanceCall.adv_call_time.split(':')[1] }, shootingCopy.shootDate),
            };

            shootingCopy.advanceCalls = updatedAdvanceCalls;

            await oneWrappDb.shootings.upsert(shootingCopy);
          }
        }
      } catch (error) {
        errorToast(`Error updating advance call: ${error}`);
      } finally {
        await fetchData();
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
      event.detail.complete();
      await oneWrappDb?.shootings.upsert(shootingCopy);
    } catch (error) {
      errorToast(`Error reordering scenes: ${error}`);
      throw error;
    }
  };

  const formatSceneAsShootingScene = (scene: any): ShootingScene => ({
    id: scene.id,
    projectId: scene.projectId,
    shootingId: scene.shootingId,
    sceneId: scene.sceneId.toString(),
    status: scene.status,
    position: scene.position,
    rehearsalStart: scene.rehearsalStart,
    rehearsalEnd: scene.rehearsalEnd,
    startShooting: scene.startShooting,
    endShooting: scene.endShooting,
    producedSeconds: scene.producedSeconds,
    comment: scene.comment,
    partiality: scene.partiality,
    setups: scene.setups,
    createdAt: scene.createdAt,
    updatedAt: scene.updatedAt,
  });

  return {
    shootingData,
    setShootingData,
    fetchData,
    isLoading,
    saveScriptReport,
    addNewLocation,
    addNewHospital,
    updateExistingLocation,
    updateExistingHospital,
    removeLocation,
    removeHospital,
    selectedLocation,
    setSelectedLocation,
    selectedHospital,
    setSelectedHospital,
    addNewBanner,
    handleReorder,
    addNewAdvanceCall,
    addNewMeal,
    deleteMeal,
    deleteAdvanceCall,
    handleEditAdvanceCall,
    handleEditMeal,
    updateShootingTime,
    generalCallDiffHours,
    moveDiffHoursAlertOpen,
    setMoveDiffHoursAlertOpen,
    oneWrappDb
  };
}