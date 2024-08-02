import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
} from '@ionic/react';
import { useHistory } from 'react-router';
import ExploreContainer from '../../components/Shared/ExploreContainer/ExploreContainer';
import OutlineLightButton from '../../components/Shared/OutlineLightButton/OutlineLightButton';
import OutlinePrimaryButton from '../../components/Shared/OutlinePrimaryButton/OutlinePrimaryButton';
import { useAuth } from '../../context/Auth.context';

const Settings: React.FC = () => {
  const { logout } = useAuth();

  const history = useHistory();

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="tertiary">
          <IonTitle>SETTINGS</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color="tertiary" fullscreen>
        <OutlinePrimaryButton
          buttonName="LOG OUT"
          onClick={handleLogout}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </IonContent>
    </IonPage>
  );
};

export default Settings;
