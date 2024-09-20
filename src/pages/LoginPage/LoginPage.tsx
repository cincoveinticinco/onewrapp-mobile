import { IonButton, IonIcon, IonPage, IonContent } from '@ionic/react';
import { logoGoogle } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { useGoogleLogin } from '@react-oauth/google'; // Para web
import { isPlatform } from '@ionic/react'; // Detectar plataforma
import { useAuth } from '../../context/Auth.context';
import useErrorToast from '../../hooks/Shared/useErrorToast';
import './LoginPage.css';
import environment from '../../../environment';

const LoginPage: React.FC = () => {
  const { saveLogin } = useAuth();
  const errorToast = useErrorToast();
  const history = useHistory();

  // Función para el login en móvil usando Capacitor
  const handleGoogleLoginMobile = async () => {
    try {
      const googleUser = await GoogleAuth.signIn();
      const accessToken = googleUser.authentication.idToken;

      const response = await fetch(`${environment.URL_PATH}/google_sign_in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_token: accessToken }),
      });
      const data = await response.json();

      if (data.token) {
        saveLogin(data.token, data.user);
        history.push('/my/projects');
      } else {
        history.push('/user-not-found');
        errorToast(data.error);
      }
    } catch (error) {
      errorToast('Error during Google Sign In');
    }
  };

  // Función para el login en web usando @react-oauth/google
  const handleGoogleLoginWeb = useGoogleLogin({
    onSuccess: async (response) => {
      const accessToken = response.access_token;

      const res = await fetch(`${environment.URL_PATH}/google_sign_in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_token: accessToken }),
      });
      const data = await res.json();

      if (data.token) {
        saveLogin(data.token, data.user);
        history.push('/my/projects');
      } else {
        history.push('/user-not-found');
        errorToast(data.error);
      }
    },
    onError: (errorResponse) => errorToast(errorResponse.error_description || 'Error during Google Sign In'),
  });

  // Detectar la plataforma y ejecutar el código correspondiente
  const login = () => {
    if (isPlatform('capacitor')) {
      handleGoogleLoginMobile();
    } else {
      handleGoogleLoginWeb();
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonButton onClick={login} expand="block" className="login-button ion-no-padding">
          <IonIcon icon={logoGoogle} slot="start" />
          SIGN IN WITH GOOGLE
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
