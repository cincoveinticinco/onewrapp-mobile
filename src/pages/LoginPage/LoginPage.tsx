import {
  IonButton, IonContent, IonHeader, IonIcon, IonInput, IonPage,
  isPlatform,
  useIonViewDidEnter,
  useIonViewWillEnter,
} from '@ionic/react';
// import { useGoogleLogin } from '@react-oauth/google';
import {
  keyOutline,
  logoGoogle,
  save,
} from 'ionicons/icons';
import ReactPlayer from 'react-player';
import { useHistory } from 'react-router';
import environment from '../../../environment';
import footerLogo from '../../assets/images/footerLogo.png';
import logo from '../../assets/images/logo_onewrapp.png';
import { useAuth } from '../../context/Auth/Auth.context';
import useErrorToast from '../../Shared/hooks/useErrorToast';
import './LoginPage.css';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { useGoogleLogin } from '@react-oauth/google';
import { useContext, useState } from 'react';
import AppLoader from '../../Shared/hooks/AppLoader';
import useNetworkStatus from '../../Shared/hooks/useNetworkStatus';
import DatabaseContext from '../../context/Database/Database.context';

const LoginPage: React.FC = () => {
  const { saveLogin, loggedIn } = useAuth();
  const errorToast = useErrorToast();
  const history = useHistory();
  const isOnline = useNetworkStatus();

  const { oneWrapDb } = useContext(DatabaseContext)



  const [ isLoading, setIsLoading ] = useState(false)
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ showAppLogin, setShowAppLogin ] = useState(false)
  
  useIonViewWillEnter(() => {
    GoogleAuth.initialize({
      clientId: environment.CLIENT_ID,
      scopes: ['profile', 'email'],
      grantOfflineAccess: true,
    })
  })

  useIonViewDidEnter(() => {
    if (loggedIn) {
      const localPath = localStorage.getItem('lastAppRoute');
      console.log(localPath, 'localPath');
      history.push(localPath || '/my/projects');
    }
  });

  // THE APP LOGIN CONSUMES app_sign_in AND NEED TO SEND THE PARAMS email AND password

  const appLogin = async () => {
    try {
      const response = await fetch(`${environment.URL_PATH}/app_sign_in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (data.token) {
        saveLogin(data.token, data.user);
        history.push('/my/projects');
      } else {
        errorToast(data.error);
      }
    } catch (error) {
      errorToast('Error during App Sign In');
      console.error(error);
    }
  }

  const handleGoogleLoginMobile = async () => {
    if(isOnline) {
      try {
        const googleUser = await GoogleAuth.signIn();
        const accessToken = googleUser.authentication.accessToken;
        setIsLoading(true);
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
        errorToast('Error during Google Sign In (Mobile)');
        console.error(error)
      } finally {
        setIsLoading(false);
      }
    } else {
       try {
        const getUser = async () => {
          if(oneWrapDb) {
            const user = await oneWrapDb.user.findOne().exec();
            if(user) {
              return user._data;
            }
          }
  
          return null;
        }
  
        const user = await getUser();
  
        if (user) {
          const sessionEndsAt = new Date(user.sessionEndsAt).getTime();
          const now = new Date().getTime();
  
          if (now < sessionEndsAt) {
            console.log('User is logged in');
            saveLogin(user.sessionToken, user);
          }
       }
      } catch (error) {
        console.error(error);
      }
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
    onError: (errorResponse:any) => errorToast(errorResponse.error_description || 'Error during Google Sign In'),
  });

  const handleOfflineLoginWeb = async () => {
    try {
      const getUser = async () => {
        if(oneWrapDb) {
          const user = await oneWrapDb.user.findOne().exec();
          if(user) {
            return user._data;
          }
        }
        return null;
      }

      const user = await getUser();

      if (user) {
        const sessionEndsAt = new Date(user.sessionEndsAt).getTime();
        const now = new Date().getTime();

        if (now < sessionEndsAt) {
          console.log('User is logged in');
          saveLogin(user.sessionToken, user);
          history.push('/my/projects');
        } else {
          errorToast('Session expired. Please log in again.');
        }
      } else {
        errorToast('No user found. Please log in.');
      }
    } catch (error) {
      console.error(error);
      errorToast('Error during offline login');
    }
  };

  // Detectar la plataforma y ejecutar el código correspondiente
  const login = () => {
    if (isPlatform('capacitor') || isPlatform('cordova') || isPlatform('android') || isPlatform('ios') || isPlatform('electron')) {
      handleGoogleLoginMobile();
    } else {
      
      if(isOnline || navigator.onLine) {
        handleGoogleLoginWeb();
      } else {
        handleOfflineLoginWeb();
      }
    }
  };
  
  const renderLoginForm = () => {
    return (
      <div className="login-form">
        <IonInput
          type="email"
          placeholder="Email"
          value={email}
          onIonInput={(e) => setEmail(e.detail.value!)}
        />
        <IonInput
          type="password"
          placeholder="Password"
          value={password}
          onIonInput={(e) => setPassword(e.detail.value!)}
        />
       <div className='ion-flex ion-flex-column login-buttons-wrapper'>
        <IonButton onClick={appLogin} className='filled-success-button'>
            Login
          </IonButton>
          <IonButton onClick={() => setShowAppLogin(false)} className="outline-danger-button">
            Cancel
          </IonButton>
       </div>
      </div>
    )
  }

  return (
      <IonPage>
        <IonHeader />
        <IonContent className="ion-padding" fullscreen color="tertiary">
          {
            showAppLogin ? 
            (
              <>
                <div className="login-video-wrapper">
                  <ReactPlayer
                    className="react-player fixed-bottom"
                    url="videos/backgroundLogin.mp4"
                    width="100%"
                    height="100%"
                    controls={false}
                    muted
                    playing
                    playsinline
                    onReady={() => setIsLoading(false)}
                  />
                </div>
                {renderLoginForm()}
              </>
            )
            : (
              isLoading ? (
                <>
                  <AppLoader />
                </>
              ) : (
                <>
                  <div className="login-video-wrapper">
                    <ReactPlayer
                      className="react-player fixed-bottom"
                      url="videos/backgroundLogin.mp4"
                      width="100%"
                      height="100%"
                      controls={false}
                      muted
                      playing
                      playsinline
                      onReady={() => setIsLoading(false)}
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
                    <IonButton expand="block" onClick={() => setShowAppLogin(true)} className="login-button ion-no-padding">
                      <IonIcon slot="start" icon={keyOutline} color="dark" />
                      <span className="button-text">SIGN IN WITH PASSWORD</span>
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
                </>
              )
            )
          }
        </IonContent>
      </IonPage>
  );
};

export default LoginPage;
