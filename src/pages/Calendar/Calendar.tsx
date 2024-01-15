import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
} from '@ionic/react';
import ExploreContainer from '../../components/Shared/ExploreContainer';
import './Calendar.css';

const Calendar: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar color="tertiary">
        <IonTitle>CALENDAR</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent color="tertiary" fullscreen>
      <ExploreContainer name="Calendar page" />
    </IonContent>
  </IonPage>
);

export default Calendar;
