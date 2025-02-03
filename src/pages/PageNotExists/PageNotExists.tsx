import {
  IonContent, IonHeader,
  IonPage,
} from '@ionic/react';
import ReactPlayer from 'react-player';
import { useHistory } from 'react-router';
import footerLogo from '../../assets/images/footerLogo.png';
import logo from '../../assets/images/logo_onewrapp.png';
import './PageNotExists.scss';
import { useEffect, useState } from 'react';

interface PageNotExistsProps {
  unauthorized: boolean;
}

const PageNotExists = ({
  unauthorized = false
}) => {
  const history = useHistory();
  const [pageText, setPageText] = useState<string>('The page you are looking for does not exist. Go');
 
  useEffect(() => {
    if (unauthorized) {
      setPageText('You are not authorized to view this page. Go');
    }
  }, [unauthorized]);

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
            {pageText}
            {' '}
            <a onClick={() => handleGoBack()} style={{cursor: 'pointer'}}>back</a>
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
