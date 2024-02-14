import { IonContent } from '@ionic/react';
import './AddScene.css';
import { useRef } from 'react';
import AddScenesForm from '../../components/AddScene/AddSceneForm';
import useHideTabs from '../../hooks/useHideTabs';
import SecondaryPagesLayout from '../../Layouts/SecondaryPagesLayout/SecondaryPagesLayout';
import { useHistory, useParams } from 'react-router';

const AddScene = () => {
  const contentRef = useRef<HTMLIonContentElement>(null);

  useHideTabs();

  const handleSave = () => {
    console.log('I am saving');
  };

  const scrollToTop = () => {
    contentRef.current?.scrollToTop();
  };

  const { id } = useParams<{ id: string }>();

  const history = useHistory();

  const handleBack = () => history.push(`/my/projects/${id}/strips`);

  return (
    <SecondaryPagesLayout saveOptions={handleSave} pageTitle="Add Scene" handleBack={handleBack}>
      <IonContent color="tertiary" ref={contentRef}>
        <AddScenesForm scrollToTop={() => scrollToTop()} />
      </IonContent>
    </SecondaryPagesLayout>
  );
};

export default AddScene;
