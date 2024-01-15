import {
  IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
} from '@ionic/react';
import { Redirect } from 'react-router';
import { useAuth } from '../../context/auth';

interface Props {
  onLogin: () => void;
}

const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const { loggedIn } = useAuth();

  if (loggedIn) {
    return <Redirect to="/my/projects" />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>LOGIN</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton expand="block" color="tertiary" onClick={onLogin}>Login</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
