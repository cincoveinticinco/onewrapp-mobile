import {
  IonContent, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter,
} from '@ionic/react';
import {
  useContext, useEffect, useRef, useState,
} from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import AddScenesForm from '../../components/AddScene/AddSceneForm';
import useHideTabs from '../../hooks/Shared/useHideTabs';
import SecondaryPagesLayout from '../../Layouts/SecondaryPagesLayout/SecondaryPagesLayout';
import DatabaseContext, { DatabaseContextProps } from '../../hooks/Shared/database';
import useSuccessToast from '../../hooks/Shared/useSuccessToast';
import useErrorToast from '../../hooks/Shared/useErrorToast';
import useLoader from '../../hooks/Shared/useLoader';

const EditSceneToDetails: React.FC = () => {
  const history = useHistory();
  const contentRef = useRef<HTMLIonContentElement>(null);
  const { id } = useParams<{ id: string }>();
  const { sceneId }: any = useParams();
  const projectId = parseInt(id);
  const handleBack = () => {
    const backRoute = localStorage.getItem('editionBackRoute');
    console.log(backRoute);
    backRoute
      ? history.push(backRoute)
      : history.push(`/my/projects/${projectId}/strips/details/scene/${sceneId}`);
  };
  const updatedAt = new Date().toISOString();
  const { oneWrapDb } = useContext<DatabaseContextProps>(DatabaseContext);
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

  const getExistingScene = async () => {
    const scene = await oneWrapDb?.scenes.findOne({ selector: { id: sceneId } }).exec();
    return scene._data;
  };

  useEffect(() => {
    const fetchScene = async () => {
      if (sceneId) {
        const existingScene = await getExistingScene();
        Object.keys(existingScene).forEach((key) => {
          setValue(key, existingScene[key]);
          setFormData({ ...formData, [key]: existingScene[key] });
          setTimeout(
            () => setSceneDataIsLoading(false),
            300,
          );
        });
      }
    };

    fetchScene();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({ defaultValues: formData });

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
      scrollToTop();
    }

    scrollToTop();
  };

  const onSubmit = (formData: any): void => {
    scrollToTop();
    sceneId ? updateScene(formData) : console.error('No sceneId found');
  };

  const handleSave = () => {
    scrollToTop();
    handleSubmit(onSubmit)();
  };

  const { hideTabs, showTabs } = useHideTabs();

  useIonViewWillEnter(() => {
    hideTabs();
  });

  return (
    <SecondaryPagesLayout
      resetSelections={handleBack}
      pageTitle="Edit Scene"
      handleSave={handleSave}
      handleBack={handleBack}
    >
      <IonContent color="tertiary" ref={contentRef}>
        {
          sceneDataIsLoading
            ? useLoader()
            : (
              <AddScenesForm
                scrollToTop={() => scrollToTop()}
                detailsEditMode
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

export default EditSceneToDetails;
