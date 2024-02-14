import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
} from '@ionic/react';
import ExploreContainer from '../../components/Shared/ExploreContainer/ExploreContainer';
// extract characters from scenes
// scenes quantity (escenes)
// protection scenes quantity
// pages sum
// estimated time sum
// episodes quantity (episodes[].forEach ? scenes quantity, ...)
// sets quantity

const Cast: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar color="tertiary">
        <IonTitle>CAST</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent color="tertiary" fullscreen>
      <ExploreContainer name="Cast page" />
    </IonContent>
  </IonPage>
);

export default Cast;
