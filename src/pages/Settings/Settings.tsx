import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
} from '@ionic/react';
import { useHistory } from 'react-router';
import OutlinePrimaryButton from '../../Shared/Components/OutlinePrimaryButton/OutlinePrimaryButton';
import { useAuth } from '../../context/Auth/Auth.context';
import { useContext } from 'react';
import DatabaseContext from '../../context/Database/Database.context';
import { useRxDB } from 'rxdb-hooks';

const Settings: React.FC = () => {
  const { logout } = useAuth();
  const rxdb = useRxDB();

  const hardAppReset = async () => {
    await rxdb.destroy();
  };

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

        <OutlinePrimaryButton
          buttonName="HARD RESET"
          onClick={hardAppReset}
          style={{
            position: 'absolute',
            top: '60%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          className='outline-danger-button'
        />
      </IonContent>
    </IonPage>
  );
};

export default Settings;
