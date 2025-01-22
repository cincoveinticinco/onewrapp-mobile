import {
  IonContent,
  useIonViewWillEnter, useIonViewWillLeave,
} from '@ionic/react';
import {
  useContext, useEffect, useRef, useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import AddScenesForm from './Components/AddSceneForm';
import DatabaseContext from '../../context/Database/Database.context';
import useErrorToast from '../../Shared/hooks/useErrorToast';
import useHideTabs from '../../Shared/hooks/useHideTabs';
import AppLoader from '../../Shared/hooks/AppLoader';
import useSuccessToast from '../../Shared/hooks/useSuccessToast';
import SecondaryPagesLayout from '../../Layouts/SecondaryPagesLayout/SecondaryPagesLayout';
import './AddScene.css';
import { DatabaseContextProps } from '../../context/Database/types/Database.types';

const AddScene: React.FC = () => {
  const contentRef = useRef<HTMLIonContentElement>(null);
  const { id } = useParams<{ id: string }>();
  const projectId = parseInt(id);
  const updatedAt = new Date().toISOString();
  const { oneWrapDb, offlineScenes, initializeSceneReplication } = useContext<DatabaseContextProps>(DatabaseContext);

  const [dataIsLoading, setDataIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const dataLoading = setTimeout(() => {
      setDataIsLoading(false);
    }, 500);

    return () => {
      clearTimeout(dataLoading);
    };
  }, [offlineScenes]);

  const successMessageToast = useSuccessToast();
  const errorToast = useErrorToast();

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

  const [formData, _] = useState<any>(sceneDefaultValues);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({ defaultValues: formData });

  const sceneFormId = 'add-scene-form-id';

  const history = useHistory();

  const handleBack = () => history.push(`/my/projects/${projectId}/strips`);

  const scrollToTop = () => {
    contentRef.current?.scrollToTop();
  };

  const insertScene = async (formData: any) => {
    try {
      formData.id = `${watch('projectId')}.${watch('episodeNumber')}.${watch('sceneNumber')}`;

      const sceneExists = await oneWrapDb?.scenes.findOne({
        selector: {
          projectId,
          episodeNumber: formData.episodeNumber,
          sceneNumber: formData.sceneNumber,
        },
      }).exec();

      if (sceneExists) {
        errorToast('Scene already exists');
        scrollToTop();
        return;
      }

      await oneWrapDb?.scenes.insert(formData);
      await initializeSceneReplication();
      successMessageToast('Scene created successfully!');

      reset();
      handleBack();
    } catch (error: any) {
      errorToast(error ? error.message : 'Error inserting scene');
      scrollToTop();
    }

    scrollToTop();
  };

  const onSubmit = (formData: any): void => {
    scrollToTop();
    insertScene(formData);
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

  return (
    <SecondaryPagesLayout
      handleBack={handleBack}
      pageTitle="Add Scene"
      handleSave={handleSave}
      resetSelections={handleBack}
    >
      <IonContent color="tertiary" ref={contentRef} style={{ zIndex: '20' }}>
        {
          dataIsLoading && (
            AppLoader()
          )
        }
        {
          !dataIsLoading && (
            <AddScenesForm
              scrollToTop={() => scrollToTop()}
              editMode={false}
              sceneFormId={sceneFormId}
              handleSubmit={handleSubmit}
              control={control}
              errors={errors}
              reset={reset}
              setValue={setValue}
              watch={watch}
              formData={formData}
              onSubmit={onSubmit}
            />
          )
        }
      </IonContent>
    </SecondaryPagesLayout>
  );
};

export default AddScene;
