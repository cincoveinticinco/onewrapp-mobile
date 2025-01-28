import {
  IonButton, IonContent, IonHeader,
  IonItem, IonPage, IonReorderGroup,
  useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter,
} from '@ionic/react';
import {
  useContext, useEffect, useRef, useState,
} from 'react';
import { IoMdAdd } from 'react-icons/io';
import { VscEdit } from 'react-icons/vsc';
import { useHistory, useParams } from 'react-router';
import { useRxData } from 'rxdb-hooks';
import EditionModal, { SelectOptionsInterface } from '../../Shared/Components/EditionModal/EditionModal';
import MapFormModal from '../../Shared/Components/MapFormModal/MapFormModal';
import OutlinePrimaryButton from '../../Shared/Components/OutlinePrimaryButton/OutlinePrimaryButton';
import Toolbar from '../../Shared/Components/Toolbar/Toolbar';
import ShootingBanner from './Components/ShootingBannerCard/ShootingBanner';
import { ShootingInfoLabels } from './Components/ShootingBasicInfo/ShootingBasicInfo';
import ShootingDetailTabs from './Components/ShootingDetailTabs/ShootingDetailTabs';
import InfoView from './Components/ShootingDetailViews/InfoView/InfoView';
import ProductionReportView from './Components/ShootingDetailViews/ProductionReportView/ProductionReportView';
import ScriptReportView from './Components/ShootingDetailViews/ScriptReportView/ScriptReportView';
import WrapReportView from './Components/ShootingDetailViews/WrapReportView/WrapReportView';
import SceneCard from '../Strips/Components/SceneCard/SceneCard';
import DatabaseContext from '../../context/Database/Database.context';
import { ShootingSceneStatusEnum } from '../../Shared/ennums/ennums';
import AppLoader from '../../Shared/hooks/AppLoader';
import useErrorToast from '../../Shared/hooks/useErrorToast';
import useIsMobile from '../../Shared/hooks/useIsMobile';
import useSuccessToast from '../../Shared/hooks/useSuccessToast';
import { SceneDocType } from '../../Shared/types/scenes.types';
import { AdvanceCall, Meal, ShootingScene } from '../../Shared/types/shooting.types';
import InputModalScene from '../../Layouts/InputModalScene/InputModalScene';
import floatToFraction from '../../Shared/Utils/floatToFraction';
import getHourMinutesFomISO from '../../Shared/Utils/getHoursMinutesFromISO';
import secondsToMinSec from '../../Shared/Utils/secondsToMinSec';
import separateTimeOrPages from '../../Shared/Utils/SeparateTimeOrPages';
import './ShootingDetail.css';
import Legend from '../../Shared/Components/Legend/Legend';
import CallSheet from '../CallSheet/CallSheet';
import InputAlert from '../../Layouts/InputAlert/InputAlert';
import { CrewDocType } from '../../Shared/types/crew.types';
import { mealInputs } from './Inputs/meal.inputs';
import { bannerInputs } from './Inputs/baner.inputs';
import { mergedSceneBanner, ShootingDataProps, ShootingViews } from './types/ShootingDetail.types';
import { advanceCallInputs } from './Inputs/AdvanceCall.inputs';
import { useShootingInfo } from './hooks/useShootingInfo';
import { normalizeString } from 'rxdb';

const ShootingDetail: React.FC<{
  permissionType?: number | null;
}> = ({
  permissionType,
}) => {
  // *************************** CONSTANTS ************************************//
  const { id } = useParams<{ id: string }>();

  const legendItems = [
    { color: 'var(--ion-color-danger)', label: 'NOT SHOOT' },
    { color: 'var(--ion-color-success)', label: 'SHOOT' },
  ];

  // *************************** CUSTOM HOOKS ******************************** /

  const {
    shootingData,
    fetchData,
    isLoading,
    updateShootingTime,
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
    generalCallDiffHours,
    moveDiffHoursAlertOpen,
    setMoveDiffHoursAlertOpen,
    oneWrappDb,
    setShootingData
  } = useShootingInfo()

  //* ***************************** RXDB HOOKS *****************************/

  const { result: crew, isFetching: isFetchingCrew } = useRxData<CrewDocType>('crew', (collection) => collection.find());

  //* ***************************** RXDB HOOKS *****************************/

  const [departments, setDepartments] = useState<SelectOptionsInterface[]>([]);

  const getCrewDepartments = () => {
    const departments = crew.map((c: CrewDocType) => c.depNameEng);
    const uniqueDepartments = Array.from(new Set(departments)).filter((dep): dep is string => dep !== null);
    return uniqueDepartments.map((dep: string) => ({ value: dep, label: dep }));
  }

  useEffect(() => {
    if(crew && !isFetchingCrew ) {
      setDepartments(getCrewDepartments());
    }
  }, [crew, isFetchingCrew]);

  // *************************** CONSTANTS ************************************//

  // *************************** STATES ************************************//

  const [isDisabled, unused_] = useState(false);
  const { shootingId } = useParams<{ shootingId: string }>();
  const history = useHistory();
  const [selectedScenes, setSelectedScenes] = useState<any>([]);
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
  const [searchText, setSearchText] = useState('');
  const [searchMode, setSearchMode] = useState(false);
  const [formattedAdvancedCallInputs, setFormattedAdvancedCallInputs] = useState<any>([]);

  useEffect(() => {
    setFormattedAdvancedCallInputs(advanceCallInputs(departments));
  }, [departments])

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
    const callExists = shootingCalls.some((call: any) => call.dep_name_eng?.toLowerCase() === callTime?.toLowerCase() || call.dep_name_esp?.toLowerCase() === callTime?.toLowerCase());
    if (callExists) {
      return 'department call already exists in shooting';
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
    const mealExists = shootingMeals.some((m: Meal) => m.meal && m.meal.toLowerCase() === meal.toLowerCase());
    if (mealExists) {
      return 'meal already exists';
    }

    return false;
  };

  const addNewScene = async (scene: SceneDocType) => {
    try {
      const shooting = await oneWrappDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
      if (!shooting) throw new Error('Shooting not found');

      if(!scene.sceneId) throw new Error('SceneId is required');
  
      const shootingScene: ShootingScene = {
        projectId: parseInt(id),
        shootingId: parseInt(shootingId),
        sceneId: scene.sceneId?.toString(),
        status: ShootingSceneStatusEnum.Assigned,
        position: shootingData.mergedSceneBanners.length + 1,
        rehearsalStart: null,
        rehearsalEnd: null,
        comment: '',
        partiality: false,
        startShooting: null,
        endShooting: null,
        producedSeconds: 0,
        setups: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
  
      const shootingCopy = { 
        ...shooting._data,
        scenes: [...(shooting._data.scenes || [])] // Creamos un nuevo array
      };

      shootingCopy.scenes.push(shootingScene);

      console.log('shootingCopy', shootingCopy);
  
      await oneWrappDb?.shootings.upsert(shootingCopy);
      await fetchData();
      successToast('SceneDocType added successfully');
    } catch (error) {
      errorToast('Error adding new scene');
      throw error;
    }
  };

  const clearSelectedScenes = () => {
    setSelectedScenes([]);
  };
  
  const shootingDeleteScene = async (scene: ShootingScene & SceneDocType) => {
    try {
      const shooting = await oneWrappDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
      if (!shooting) throw new Error('Shooting not found');
  
      const shootingCopy = { 
        ...shooting._data,
        scenes: [...(shooting._data.scenes || [])].filter(
          (s: any) => s.sceneId !== scene.sceneId
        )
      };
  
      await oneWrappDb?.shootings.upsert(shootingCopy);
      await fetchData();
      successToast('SceneDocType deleted successfully');
    } catch (error) {
      errorToast('Error deleting scene');
      throw error;
    }
  };

  const shootingDeleteBanner = async (banner: mergedSceneBanner) => {
    try {
      const shooting = await oneWrappDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
      if (!shooting) throw new Error('Shooting not found');
  
      const shootingCopy = { 
        ...shooting._data,
        banners: [...(shooting._data.banners || [])].filter(
          (b: any) => b.id !== banner.id
        )
      };
  
      await oneWrappDb?.shootings.upsert(shootingCopy);
      await fetchData();
      successToast('Banner deleted successfully');
    } catch (error) {
      errorToast('Error deleting banner');
      return;
    }
  };

  const handleBack = () => {
    history.push(`/my/projects/${id}/calendar`);
  };

  const toggleAddMenu = () => {
    setAdditionMenu(!additionMenu);
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
    setSelectedHospital(null);
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

  //* ***************************** EFFECTS *****************************/
  useEffect(() => {
    fetchData();
  }, [oneWrappDb]);

  useEffect(() => {
    if (!isLoading) {
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
      formInputs={formattedAdvancedCallInputs}
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
      sceneName="Add New SceneDocType"
      listOfScenes={shootingData.notIncludedScenes}
      handleCheckboxToggle={addNewScene}
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

  const updateShootingAllTimes = async () => {
    try {
      // Move the advance calls, the meals, the crewCalls, the castCalls, the pictureCars and the otherCalls with the difference in the hours using generalCallDiffHours

      const shooting = await oneWrappDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
      const shootingCopy = { ...shooting._data };

      // Advance Calls
      shootingCopy.advanceCalls = shootingCopy.advanceCalls.map((call: AdvanceCall) => {
        if (call.adv_call_time) {
          const callTime = new Date(call.adv_call_time);
          callTime.setHours(callTime.getHours() + generalCallDiffHours);
          return {
            ...call,
            adv_call_time: callTime.toISOString(),
          };
        }
        return call;
      });

      // Meals
      shootingCopy.meals = shootingCopy.meals.map((meal: Meal) => {
        if (meal.readyAt && meal.endTime) {
          const readyAt = new Date(meal.readyAt);
          readyAt.setHours(readyAt.getHours() + generalCallDiffHours);
          const endTime = new Date(meal.endTime);
          endTime.setHours(endTime.getHours() + generalCallDiffHours);
          return {
            ...meal,
            readyAt: readyAt.toISOString(),
            endTime: endTime.toISOString(),
          };
        }
        return meal;
      });

      // Crew Calls
      shootingCopy.crewCalls = shootingCopy.crewCalls.map((call: any) => {
        if (call.call) {
          const callTime = new Date(call.call);
          callTime.setHours(callTime.getHours() + generalCallDiffHours);
          return {
            ...call,
            call: callTime.toISOString(),
          };
        }
        return call;
      });

      // Cast Calls
      shootingCopy.castCalls = shootingCopy.castCalls.map((call: any) => {
        if (call.callTime) {
          const callTime = new Date(call.callTime);
          callTime.setHours(callTime.getHours() + generalCallDiffHours);
          return {
            ...call,
            callTime: callTime.toISOString(),
          };
        }
        return call;
      });

      // Picture Cars
      shootingCopy.pictureCars = shootingCopy.pictureCars.map((car: any) => {
        if (car.callTime) {
          const callTime = new Date(car.callTime);
          callTime.setHours(callTime.getHours() + generalCallDiffHours);
          return {
            ...car,
            callTime: callTime.toISOString(),
          };
        }
        return car;
      });

      // Other Calls
      shootingCopy.otherCalls = shootingCopy.otherCalls.map((call: any) => {
        if (call.callTime) {
          const callTime = new Date(call.callTime);
          callTime.setHours(callTime.getHours() + generalCallDiffHours);
          return {
            ...call,
            callTime: callTime.toISOString(),
          };
        }
        return call;
      });

      // Update the shooting
      await oneWrappDb?.shootings.upsert(shootingCopy);
      await fetchData();
      successToast('All times updated successfully');
      setMoveDiffHoursAlertOpen(false);
    } catch (error: any) {
      errorToast(`Error updating all times: ${error.message}`);
      console.error(error);
    }
  }

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
    return (
      <IonPage>
        <IonContent color="tertiary" fullscreen>{ AppLoader()}</IonContent>
      </IonPage>
    );
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

  const moveDiffHoursAlert = () => {
    if (generalCallDiffHours !== 0) {
      return (
        <InputAlert
          header="Move all times"
          message={`You are about to move all times ${generalCallDiffHours > 0 ? 'forward' : 'backwards'} ${Math.abs(generalCallDiffHours)} hours. Are you sure you want to continue?`}
          inputs={[]}
          handleOk={updateShootingAllTimes}
          handleCancel={() => setMoveDiffHoursAlertOpen(false)}
          isOpen={moveDiffHoursAlertOpen}
        />  
      )};
  }

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
      {
        view === 'call-sheet' && (
          <CallSheet />
        )
      }
      {view === 'scenes' && (
        <IonContent color="tertiary" fullscreen className='fade-in'>
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
          advanceCallInputs={formattedAdvancedCallInputs}
          handleEditAdvanceCall={handleEditAdvanceCall}
          setOpenMeals={setOpenMeals}
          openMeals={openMeals}
          setMealsEditMode={setMealsEditMode}
          mealsEditMode={mealsEditMode}
          openMealModal={openMealModal}
          deleteMeal={deleteMeal}
          handleEditMeal={handleEditMeal}
          permissionType={permissionType}
          openEditModal={openEditionModal}
          openEditHospitalModal={openHospitalEditionModal}
          removeHospital={removeHospital}
          updateShootingAllTimes={updateShootingAllTimes}
        />
        )
      }
      {
        view === 'script-report'
        && (
        <IonContent color="tertiary" fullscreen className='fade-in'>
          <Legend items={legendItems} />
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
        <IonContent color="tertiary" fullscreen className='fade-in'>
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
            advanceCallInputs={advanceCallInputs(departments)}
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
            updateShootingAllTimes={updateShootingAllTimes}
          />
        </IonContent>
        )
      }
      {
        view === 'production-report'
        && (
        <IonContent color="tertiary" fullscreen className='fade-in'>
          <ProductionReportView searchText={searchText} />
        </IonContent>
        )
      }
      <ShootingDetailTabs setView={setView} view={view} handleBack={handleBack} />
      <AddNewBanner />
      <AddNewScenes />
      <AddNewAdvanceCallModal />
      <AddNewMeal />
      {moveDiffHoursAlert()}
      <MapFormModal isOpen={showMapModal} closeModal={closeMapModal} onSubmit={selectedLocation ? updateExistingLocation : addNewLocation} selectedLocation={selectedLocation} />
      <MapFormModal isOpen={showHospitalsMapModal} closeModal={closeHospitalsMapModal} onSubmit={selectedHospital ? updateExistingHospital : addNewHospital} hospital selectedLocation={selectedHospital} />
    </IonPage>
  );
};

export default ShootingDetail;
