import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
} from '@ionic/react';
import ExploreContainer from '../../components/Shared/ExploreContainer/ExploreContainer';

const Reports: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar color="tertiary">
        <IonTitle>REPORTS</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent color="tertiary" fullscreen>
      <ExploreContainer name="Reports page" />
    </IonContent>
  </IonPage>
);

export default Reports;
