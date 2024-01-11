import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
} from '@ionic/react';
import ExploreContainer from '../../components/Shared/ExploreContainer';
import './Elements.css';

const Elements: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar color="primary">
        <IonTitle>ELEMENTS</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent color="primary" fullscreen>
      <ExploreContainer name="Elements page" />
    </IonContent>
  </IonPage>
);

export default Elements;
