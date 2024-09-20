import {
  IonButton, IonContent, IonHeader, IonIcon, IonPage,
  isPlatform,
} from '@ionic/react';
import { useGoogleLogin } from '@react-oauth/google';
import {
  logoGoogle,
} from 'ionicons/icons';
import ReactPlayer from 'react-player';
import { useHistory } from 'react-router';
import environment from '../../../environment';
import footerLogo from '../../assets/images/footerLogo.png';
import logo from '../../assets/images/logo_onewrapp.png';
import { useAuth } from '../../context/Auth.context';
import useErrorToast from '../../hooks/Shared/useErrorToast';
import './LoginPage.css';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

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
        <IonHeader />
        <IonContent className="ion-padding" fullscreen color="tertiary">
          <div className="login-video-wrapper">
            <ReactPlayer
              className="react-player fixed-bottom"
              url="videos/backgroundLogin.mp4"
              width="100%"
              height="100%"
              controls={false}
              muted
              playing
            />
          </div>
          <div className="main-logo-wrapper">
            <img src={logo} alt="logo" className="login-logo" />
          </div>
          <div className="login-buttons-container">
            {/* <GoogleLogin onSuccess={responseMessage} onError={errorMessage as any} /> */}
            <IonButton expand="block" onClick={() => login()} className="login-button ion-no-padding">
              <IonIcon slot="start" icon={logoGoogle} color="dark" />
              <span className="button-text">SIGN IN WITH GOOGLE</span>
            </IonButton>
            {/* <IonButton expand="block" onClick={onLogin} className="login-button ion-no-padding">
              <IonIcon slot="start" icon={logoWindows} color="dark" />
              <span className="button-text">SIGN IN WITH MICROSOFT</span>
            </IonButton>
            <IonButton expand="block" onClick={onLogin} className="login-button ion-no-padding">
              <IonIcon slot="start" icon={logoApple} color="dark" />
              <span className="button-text">SIGN IN WITH APPLE</span>
            </IonButton>
            <IonButton expand="block" onClick={onLogin} className="login-button ion-no-padding">
              <IonIcon slot="start" icon={mail} color="dark" />
              <span className="button-text">SIGN IN WITH APPLE</span>
            </IonButton> */}
          </div>
          <div className="footer-login">
            <span className="footer-text">ALL RIGHTS RESERVED ©2023.</span>
            <img src={footerLogo} alt="logo" className="footer-logo" />
          </div>
        </IonContent>
      </IonPage>
  );
};

export default LoginPage;
