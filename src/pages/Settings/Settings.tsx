import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
} from '@ionic/react';
import ExploreContainer from '../../components/Shared/ExploreContainer';
import './Settings.css';

const Settings: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar color="primary">
        <IonTitle>SETTINGS</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent color="primary" fullscreen>
      <ExploreContainer name="Settings page" />
    </IonContent>
  </IonPage>
);

export default Settings;
