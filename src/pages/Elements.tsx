import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Elements.css';

const Elements: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Elements PAGE</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Elements PAGE</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Elements page" />
      </IonContent>
    </IonPage>
  );
};

export default Elements;
