import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Elements.css';

const Elements: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>ELEMENTS</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">ELEMENTS</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Elements page" />
      </IonContent>
    </IonPage>
  );
};

export default Elements;
