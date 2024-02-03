import { IonContent } from '@ionic/react';
import './AddScene.css';
import AddScenesForm from '../../components/AddScene/AddSceneForm';
import useHideTabs from '../../hooks/useHideTabs';
import SecondaryPagesLayout from '../../Layouts/SecondaryPagesLayout/SecondaryPagesLayout';

const AddScene = () => {
  useHideTabs();

  const handleSave = () => {
    console.log('I am saving');
  };

  return (
    <SecondaryPagesLayout saveOptions={handleSave} pageTitle='Add Strip'>
      <IonContent color="tertiary">
        <AddScenesForm />
      </IonContent>
    </SecondaryPagesLayout>
  );
};

export default AddScene;
