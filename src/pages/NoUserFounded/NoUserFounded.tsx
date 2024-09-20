import { IonContent, IonHeader, IonPage } from '@ionic/react';
import ReactPlayer from 'react-player';
import footerLogo from '../../assets/images/footerLogo.png';
import logo from '../../assets/images/logo_onewrapp.png';
import './NoUserFounded.scss';

interface Props {
  text?: string;
}

const NoUserFounded = ({ text = 'User not found, please contact your provider.' }: Props) => (
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
      <div className="text-wrapper">
        <p>
          {text}
        </p>
      </div>
      <div className="footer-login">
        <span className="footer-text">ALL RIGHTS RESERVED ©2023.</span>
        <img src={footerLogo} alt="logo" className="footer-logo" />
      </div>
    </IonContent>
  </IonPage>
);

export default NoUserFounded;
