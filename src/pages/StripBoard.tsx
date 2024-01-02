import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './StripBoard.css';

const StripBoard: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Strip Board</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Strip Board</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Strip Board page" />
      </IonContent>
    </IonPage>
  );
};

export default StripBoard;
