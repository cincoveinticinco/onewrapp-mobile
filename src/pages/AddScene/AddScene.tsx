import {
  IonButton, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar,
} from '@ionic/react';
import './AddScene.css';
import { useHistory } from 'react-router';
import { chevronBack } from 'ionicons/icons';
import AddScenesForm from '../../components/AddScene/AddSceneForm';
import useHideTabs from '../../hooks/useHideTabs';
import useIsMobile from '../../hooks/useIsMobile';
import ModalToolbar from '../../components/Shared/ModalToolbar/ModalToolbar';

const AddScene = () => {
  const history = useHistory();
  const isMobile = useIsMobile();
  useHideTabs();

  const handleBack = () => {
    history.goBack();
  };

  const handleSave = () => {
    console.log('I am saving');
  };

  return (
    <IonPage>
      <IonHeader>
        <ModalToolbar handleBack={handleBack} toolbarTitle="Add Strip" saveOptions={handleSave} />
      </IonHeader>
      <IonContent color="tertiary">
        <AddScenesForm />
      </IonContent>
    </IonPage>
  );
};

export default AddScene;
