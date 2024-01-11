import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
} from '@ionic/react';
import ExploreContainer from '../../components/Shared/ExploreContainer';
import './Calendar.css';

const Calendar: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar color="primary">
        <IonTitle>CALENDAR</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent color="primary" fullscreen>
      <ExploreContainer name="Calendar page" />
    </IonContent>
  </IonPage>
);

export default Calendar;
