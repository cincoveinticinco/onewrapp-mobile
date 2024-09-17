import {
  IonButton, IonContent, IonHeader, IonIcon, IonPage,
} from '@ionic/react';
import { Redirect, useHistory } from 'react-router';
import { useAuth } from '../../context/Auth.context';
import ReactPlayer from 'react-player';
import './LoginPage.css';
import {
  logoApple, logoGoogle, logoWindows, mail,
} from 'ionicons/icons';
import { useGoogleLogin } from '@react-oauth/google';
import footerLogo from '../../assets/images/footerLogo.png';
import logo from '../../assets/images/logo_onewrapp.png';
import environment from '../../../environment';
import useErrorToast from '../../hooks/Shared/useErrorToast';

interface Props {
}

const LoginPage: React.FC<Props> = ({}) => {
  const { saveLogin } = useAuth();
  const errorToast = useErrorToast()

  const history = useHistory();

  const errorMessage = (error: any): any => {
    errorToast(error)
  };

  const login = useGoogleLogin({
    onSuccess: (response) => {
      const accessToken = response.access_token;

      // Envía el token al backend
      fetch(`${environment.URL_PATH}/google_sign_in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_token: accessToken }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.token) {
            saveLogin(data.token, data.user);
            history.push('/my/projects');
          } else {
          // Maneja el error
            console.error(data.error);
            history.push('/user-not-found');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    },
    onError: errorMessage,
  });

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
