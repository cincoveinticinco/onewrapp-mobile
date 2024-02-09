import { IonContent } from '@ionic/react';
import './AddScene.css';
import { useRef } from 'react';
import AddScenesForm from '../../components/AddScene/AddSceneForm';
import useHideTabs from '../../hooks/useHideTabs';
import SecondaryPagesLayout from '../../Layouts/SecondaryPagesLayout/SecondaryPagesLayout';

const AddScene = () => {
  const contentRef = useRef<HTMLIonContentElement>(null);

  useHideTabs();

  const handleSave = () => {
    console.log('I am saving');
  };

  const scrollToTop = () => {
    contentRef.current?.scrollToTop();
  };

  return (
    <SecondaryPagesLayout saveOptions={handleSave} pageTitle="Add Scene">
      <IonContent color="tertiary" ref={contentRef}>
        <AddScenesForm scrollToTop={() => scrollToTop()} />
      </IonContent>
    </SecondaryPagesLayout>
  );
};

export default AddScene;
