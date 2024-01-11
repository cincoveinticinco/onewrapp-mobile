import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
} from '@ionic/react';
import ExploreContainer from '../../components/Shared/ExploreContainer';
import './Strips.css';

const Strips: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar color="primary">
        <IonTitle>STRIPS</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent color="primary" fullscreen>
      <ExploreContainer name="Strips page" />
    </IonContent>
  </IonPage>
);

export default Strips;
