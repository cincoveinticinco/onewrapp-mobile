import {
  IonContent, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter, useIonViewWillLeave,
} from '@ionic/react';
import {
  useContext, useEffect, useRef, useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import DatabaseContext from '../../context/Database/Database.context';
import useErrorToast from '../../Shared/hooks/useErrorToast';
import useHideTabs from '../../Shared/hooks/useHideTabs';
import AppLoader from '../../Shared/hooks/AppLoader';
import useSuccessToast from '../../Shared/hooks/useSuccessToast';
import SecondaryPagesLayout from '../../Layouts/SecondaryPagesLayout/SecondaryPagesLayout';
import { DatabaseContextProps } from '../../context/Database/types/Database.types';

const EditScene: React.FC = () => {
  const history = useHistory();
  const contentRef = useRef<HTMLIonContentElement>(null);
  const { id } = useParams<{ id: string }>();
  const projectId = parseInt(id);
  const handleBack = () => history.push(`/my/projects/${projectId}/strips`);
  const updatedAt = new Date().toISOString();
  const { oneWrapDb, offlineScenes } = useContext<DatabaseContextProps>(DatabaseContext);
  const successMessageToast = useSuccessToast();
  const errorToast = useErrorToast();
  const [sceneDataIsLoading, setSceneDataIsLoading] = useState<boolean>(true);

  const sceneDefaultValues = {
    projectId,
    id: null,
    episodeNumber: null,
    sceneNumber: null,
    sceneType: null,
    protectionType: null,
    intOrExtOption: null,
    dayOrNightOption: null,
    locationName: null,
    setName: null,
    scriptDay: null,
    year: null,
    synopsis: null,
    page: null,
    pages: null,
    estimatedSeconds: null,
    characters: null,
    extras: null,
    elements: null,
    notes: [],
    updatedAt,
  };

  const [formData, setFormData] = useState<any>(sceneDefaultValues);
  const { sceneId }: any = useParams();

  const getExistingScene = async () => {
    const scene = await oneWrapDb?.scenes.findOne({ selector: { sceneId: parseInt(sceneId) } }).exec();
    return scene?._data;
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({ defaultValues: formData });

  const fetchScene = async () => {
    if (sceneId) {
      const existingScene = await getExistingScene();
      Object.keys(existingScene).forEach((key) => {
        setValue(key, existingScene[key]);
        setFormData({ ...formData, [key]: existingScene[key] });
        setTimeout(
          () => setSceneDataIsLoading(false),
          100,
        );
      });
    }
  };

  useIonViewDidEnter(() => {
    fetchScene();
  });

  useEffect(() => {
    fetchScene();
  }, [offlineScenes]);

  const scrollToTop = () => {
    contentRef.current?.scrollToTop();
  };

  const sceneFormId = 'edit-scene-form-id';

  const updateScene = async (formData: any) => {
    try {
      await oneWrapDb?.scenes.upsert(formData);
      successMessageToast('Scene updated successfully!');
      handleBack();
    } catch (error: any) {
      errorToast(error ? error.message : 'Error updating scene');
      console.error(error);
      scrollToTop();
    }

    scrollToTop();
  };

  const onSubmit = (formData: any): void => {
    scrollToTop();
    sceneId ? updateScene(formData) : errorToast('Error updating scene');
  };

  const handleSave = () => {
    scrollToTop();
    handleSubmit(onSubmit)();
  };

  const { hideTabs, showTabs } = useHideTabs();

  useIonViewWillEnter(() => {
    hideTabs();
  });

  useIonViewWillLeave(() => {
    showTabs();
  });

  const clearData = () => {
    reset();
    setFormData(sceneDefaultValues);
    setSceneDataIsLoading(true);
  };

  useIonViewDidLeave(clearData);

  return (
    <SecondaryPagesLayout
      resetSelections={handleBack}
      pageTitle="Edit Scene"
      handleSave={handleSave}
      handleBack={handleBack}
    >
      <IonContent color="tertiary" ref={contentRef}>
        {
          sceneDataIsLoading && (
            AppLoader()
          )
        }
      </IonContent>
    </SecondaryPagesLayout>
  );
};

export default EditScene;
