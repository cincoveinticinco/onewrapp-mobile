import {
  IonButton, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar,
} from '@ionic/react';
import { Redirect } from 'react-router';
import { useAuth } from '../../context/auth';
import ReactPlayer from 'react-player';
import './LoginPage.css';
import { logoApple, logoGoogle, logoWindows, mail } from 'ionicons/icons';
import logo from '../../assets/images/logo_onewrapp.png'
import footerLogo from '../../assets/images/footerLogo.png'

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
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <div className="login-video-wrapper">
          <ReactPlayer
            className='react-player fixed-bottom'
            url= 'videos/backgroundLogin.mp4'
            width='100%'
            height='100%'
            controls={false}
            muted={true}
            playing={true} // Add this line to autoplay the video
          />
        </div>
        <div className='main-logo-wrapper'>
          <img src={logo} alt='logo' className='login-logo' />
        </div>
        <div className='login-buttons-container'>
          <IonButton expand="block" onClick={onLogin} className='login-button ion-no-padding'>
            <IonIcon slot="start" icon={logoGoogle} color='dark'/>
            <span className='button-text'>SIGN IN WITH GOOGLE</span>
          </IonButton>
          <IonButton expand="block" onClick={onLogin} className='login-button ion-no-padding'>
            <IonIcon slot="start" icon={logoWindows} color='dark'/>
            <span className='button-text'>SIGN IN WITH MICROSOFT</span>
          </IonButton>
          <IonButton expand="block" onClick={onLogin} className='login-button ion-no-padding'>
            <IonIcon slot="start" icon={logoApple} color='dark'/>
            <span className='button-text'>SIGN IN WITH APPLE</span>
          </IonButton>
          <IonButton expand="block" onClick={onLogin} className='login-button ion-no-padding'>
            <IonIcon slot="start" icon={mail} color='dark'/>
            <span className='button-text'>SIGN IN WITH APPLE</span>
          </IonButton>
        </div>
        <div className='footer-login'>
          <span className='footer-text'>ALL RIGHTS RESERVED ©2023.</span>
          <img src={footerLogo} alt='logo' className='footer-logo' />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
