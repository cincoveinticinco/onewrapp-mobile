import {
  IonContent, IonHeader,
  IonPage,
} from '@ionic/react';
import ReactPlayer from 'react-player';
import { useHistory } from 'react-router';
import footerLogo from '../../assets/images/footerLogo.png';
import logo from '../../assets/images/logo_onewrapp.png';
import './PageNotExists.scss';

const PageNotExists = () => {
  const history = useHistory();

  const handleGoBack = () => history.push('/my/projects');
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
        <div className="text-wrapper">
          <p>
            The page you are looking for does not exist. Go
            {' '}
            <a onClick={() => handleGoBack()}>back</a>
            .
          </p>
        </div>
        <div className="footer-login">
          <span className="footer-text">ALL RIGHTS RESERVED ©2023.</span>
          <img src={footerLogo} alt="logo" className="footer-logo" />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PageNotExists;
