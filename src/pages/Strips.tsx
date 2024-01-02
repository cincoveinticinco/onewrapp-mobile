import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Strips.css';

const Strips: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>STRIPS</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">STRIPS</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Strips page" />
      </IonContent>
    </IonPage>
  );
};

export default Strips;
