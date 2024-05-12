import {
  IonButton, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar,
} from '@ionic/react';
import { Redirect } from 'react-router';
import { useAuth } from '../../context/auth';
import ReactPlayer from 'react-player';
import './LoginPage.css';
import {
  logoApple, logoGoogle, logoWindows, mail,
} from 'ionicons/icons';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { useEffect } from 'react';
import footerLogo from '../../assets/images/footerLogo.png';
import logo from '../../assets/images/logo_onewrapp.png';

interface Props {
  onLogin: () => void;
  setUser: (user: any) => void;
}

const LoginPage: React.FC<Props> = ({ onLogin, setUser }) => {
  const { loggedIn, user } = useAuth();

  if (loggedIn) {
    return <Redirect to="/my/projects" />;
  }

  const responseMessage = (response: any) => {
    console.log(response);
    setUser(response);
    onLogin();
  };
  const errorMessage = (error: any): any => {
    console.log(error);
  };

  const login = useGoogleLogin({
    onSuccess: responseMessage,
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
          <IonButton expand="block" onClick={onLogin} className="login-button ion-no-padding">
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
          </IonButton>
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
