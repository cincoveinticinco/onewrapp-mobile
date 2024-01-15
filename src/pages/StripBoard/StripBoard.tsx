import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
} from '@ionic/react';
import ExploreContainer from '../../components/Shared/ExploreContainer';
import './StripBoard.css';

const StripBoard: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar color="tertiary">
        <IonTitle>STRIP</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent color="tertiary" fullscreen>
      <ExploreContainer name="Strip Board page" />
    </IonContent>
  </IonPage>
);

export default StripBoard;
