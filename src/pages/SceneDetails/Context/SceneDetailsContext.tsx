import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useHistory, useParams } from 'react-router';
import { useForm, UseFormReturn } from 'react-hook-form';
import { SceneDocType, Note, Character } from '../../../Shared/types/scenes.types';
import { ShootingScene } from '../../../Shared/types/shooting.types';
import { ShootingSceneStatusEnum } from '../../../Shared/enums/ennums';
import { useDataInSceneDetail } from '../../../hooks/database/useDataInSceneDetail/useDataInSceneDetail';
import { useScenesFiltering } from '../../../hooks/utils/useScenesFiltering/useScenesFiltering';
import useSceneDetailNavigation from '../../../hooks/database/useSceneDetailNavigation/useSceneDetailNavigation';
import useShootingSceneData from '../../../hooks/database/useShootingSceneDetail/useShootingSceneDetail';
import useUser from '../../../hooks/database/useUser/useUser';
import useAlertToast from '../../../hooks/utils/useToastAlert/useToastAlert';
import DatabaseContext from '../../../context/Database/Database.context';

interface SceneDetailsContextProps {
  // Scene data
  thisScene: SceneDocType | null;
  sceneIsLoading: boolean;
  sceneColor: string;
  loadScene: () => Promise<void>;
  saveScene: (data: SceneDocType) => Promise<number | boolean>;
  
  // Form
  form: UseFormReturn<SceneDocType | any>;
  
  // Edit mode
  editMode: boolean;
  toggleEditMode: () => void;
  activateEditMode: () => void;
  
  // Navigation
  previousScene: SceneDocType | null;
  nextScene: SceneDocType | null;
  changeToPreviousScene: () => void;
  changeToNextScene: () => void;
  handleBack: () => void;
  
  // Shooting data
  thisShooting: any;
  thisSceneShooting: ShootingScene | null;
  fetchSceneShooting: (scene: SceneDocType) => Promise<void>;
  updateShootingTime: (field: string, value: string) => Promise<void>;
  updateProducedSeconds: (minutes: number, seconds: number) => Promise<void>;
  updatePartiality: (checked: boolean) => Promise<void>;
  toggleShootingSceneStatus: (currentStatus: ShootingSceneStatusEnum | undefined, action: 'shoot' | 'notShoot') => ShootingSceneStatusEnum;
  updateSceneStatus: (newStatus: ShootingSceneStatusEnum) => Promise<void>;
  
  // Modal states
  addNoteModalOpen: boolean;
  setAddNoteModalOpen: (open: boolean) => void;
  openDeleteSceneAlert: boolean;
  setOpenDeleteSceneAlert: (open: boolean) => void;
  openUnassignAlert: boolean;
  setOpenUnassignAlert: (open: boolean) => void;
  
  // Misc
  isShooting: boolean;
  creationMode?: boolean;
  currentUser: any;
  sceneHeader: string;
  rootRoute: string;
  rootRouteScript: string;
  
  // Scene actions
  handleShootClick: () => void;
  handleNotShootClick: () => void;
  getSceneStatus: (scene: ShootingScene) => string;
  onSubmitForm: (data: SceneDocType) => Promise<void>;

  sceneId: string;
}

export const SceneDetailsContext = createContext<SceneDetailsContextProps | undefined>(undefined);

export const SceneDetailsProvider: React.FC<{
  children: ReactNode;
  isShooting?: boolean;
  creationMode?: boolean;
}> = ({ children, isShooting = false, creationMode }) => {
  const { sceneId, id, shootingId: urlShootingId } = useParams<{ sceneId: string; id: string; shootingId: string }>();
  const { oneWrapDb } = useContext(DatabaseContext);
  const { filteredScenes } = useScenesFiltering('');
  
  const {
    thisScene,
    sceneIsLoading,
    sceneColor,
    emptyScene,
    loadScene,
    saveScene,
    setThisScene
  } = useDataInSceneDetail(sceneId, id, creationMode);

  useEffect(() => {
    if (thisScene) {
      setThisScene(thisScene);
      reset(thisScene);
    }
  }, [thisScene]);

  const {
    previousScene,
    nextScene,
    changeToNextScene,
    changeToPreviousScene
  } = useSceneDetailNavigation(filteredScenes, sceneId, isShooting, id, urlShootingId);

  const {
    thisShooting,
    thisSceneShooting,
    fetchSceneShooting,
    updateShootingTime,
    updateProducedSeconds,
    updatePartiality,
    toggleShootingSceneStatus,
    updateSceneStatus,
    setThisSceneShooting
  } = useShootingSceneData(sceneId, urlShootingId);

  // Form setup
  const form = useForm<SceneDocType | typeof emptyScene>({
    defaultValues: emptyScene
  });

  const { reset, setValue, watch, handleSubmit, formState: { errors } } = form;
  
  // State
  const [shootingId, setShootingId] = useState<string | undefined>(urlShootingId);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [addNoteModalOpen, setAddNoteModalOpen] = useState<boolean>(false);
  const [openDeleteSceneAlert, setOpenDeleteSceneAlert] = useState<boolean>(false);
  const [openUnassignAlert, setOpenUnassignAlert] = useState<boolean>(false);
  
  const { errorToast } = useAlertToast();
  const { currentUser } = useUser();
  const history = useHistory()

  // Handlers and helpers
  const activateEditMode = () => {
    if(thisScene) {
      setEditMode(true);
      Object.keys(thisScene).forEach((key) => {
        setValue(key as keyof SceneDocType, thisScene[key as keyof SceneDocType]);
      });
    }
  };

  const toggleEditMode = () => {
    if (editMode && thisScene) {
      setEditMode(false);
      reset(thisScene);
    } else {
      activateEditMode();
    }
  };

  const handleShootClick = () => {
    const newStatus = toggleShootingSceneStatus(thisSceneShooting?.status, 'shoot');
    updateSceneStatus(newStatus);
  };

  const handleNotShootClick = () => {
    const newStatus = toggleShootingSceneStatus(thisSceneShooting?.status, 'notShoot');
    updateSceneStatus(newStatus);
  };

  const handleBack = () => {
    if (creationMode) {
      history.push(`/my/projects/${id}/strips`);
    } else {
      const backRoute = isShooting ? `/my/projects/${id}/shooting/${shootingId}` : `/my/projects/${id}/strips`;
      history.push(backRoute);
    }
  };

  const sceneHeader = thisScene 
    ? editMode 
      ? `EDIT SCENE ${thisScene.episodeNumber}.${thisScene.sceneNumber}` 
      : `${thisScene.episodeNumber}.${thisScene.sceneNumber}` 
    : '';

  const getSceneStatus = (scene: ShootingScene) => {
    switch (scene.status) {
      case ShootingSceneStatusEnum.Assigned: return 'ASSIGNED';
      case ShootingSceneStatusEnum.NotShoot: return 'NOT SHOOT';
      case ShootingSceneStatusEnum.Shoot: return 'SHOOT';
      default: return 'NOT ASSIGNED';
    }
  };

  const onSubmitForm = async (data: SceneDocType) => {
    try {
      await saveScene(data);
      toggleEditMode();
    } catch (error: any) {
      errorToast(error.message || error || 'Error updating scene');
    }
  };

  // Routes
  const rootRoute = isShooting 
    ? `/my/projects/${id}/shooting/${shootingId}/details/scene` 
    : `/my/projects/${id}/strips/details/scene`;

  const rootRouteScript = isShooting 
    ? `/my/projects/${id}/shooting/${shootingId}/details/script` 
    : `/my/projects/${id}/strips/details/script`;

  // Effects
  useEffect(() => {
    if (urlShootingId) {
      setShootingId(urlShootingId);
    }
  }, [urlShootingId]);

  useEffect(() => {
    if(thisScene) {
      fetchSceneShooting(thisScene);
    }
  }, [shootingId, oneWrapDb, thisScene]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const edit = params.get('edit');
    setTimeout(() => {
      if (edit) {
        activateEditMode();
      }
    }, 500);
  }, [thisScene]);

  // Provider value
  const contextValue: SceneDetailsContextProps = {
    thisScene,
    sceneIsLoading,
    sceneColor,
    loadScene,
    saveScene,
    
    form,
    
    editMode,
    toggleEditMode,
    activateEditMode,
    
    previousScene,
    nextScene,
    changeToPreviousScene,
    changeToNextScene,
    handleBack,
    
    thisShooting,
    thisSceneShooting,
    fetchSceneShooting,
    updateShootingTime,
    updateProducedSeconds,
    updatePartiality,
    toggleShootingSceneStatus,
    updateSceneStatus,
    
    addNoteModalOpen,
    setAddNoteModalOpen,
    openDeleteSceneAlert,
    setOpenDeleteSceneAlert,
    openUnassignAlert,
    setOpenUnassignAlert,
    
    isShooting,
    creationMode,
    currentUser,
    sceneHeader,
    rootRoute,
    rootRouteScript,
    
    handleShootClick,
    handleNotShootClick,
    getSceneStatus,
    onSubmitForm,

    sceneId
  };

  return (
    <SceneDetailsContext.Provider value={contextValue}>
      {children}
    </SceneDetailsContext.Provider>
  );
};

export const useSceneDetailsContext = () => {
  const context = useContext(SceneDetailsContext);
  if (context === undefined) {
    throw new Error('useSceneDetails must be used within a SceneDetailsProvider');
  }
  return context;
};