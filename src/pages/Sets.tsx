import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Sets.css';

const Sets: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sets PAGE</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Sets PAGE</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Sets page" />
      </IonContent>
    </IonPage>
  );
};

export default Sets;
