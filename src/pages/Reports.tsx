import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Reports.css';

const Reports: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Reports PAGE</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Reports PAGE</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Reports page" />
      </IonContent>
    </IonPage>
  );
};

export default Reports;
