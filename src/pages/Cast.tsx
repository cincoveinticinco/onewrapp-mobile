import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Cast.css';

const Cast: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>CAST PAGE</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">CAST PAGE</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Cast page" />
      </IonContent>
    </IonPage>
  );
};

export default Cast;
