import React, { useEffect } from 'react';
import {
  IonApp,
  IonContent,
  IonPage,
  IonRouterOutlet,
  setupIonicReact,
} from '@ionic/react';
import { Redirect, Route, useHistory } from 'react-router-dom';
import { IonReactRouter } from '@ionic/react-router';
import LoginPage from './pages/LoginPage/LoginPage';
import Projects from './pages/Projects/Projects';
import AppTabs from './components/Shared/AppTabs/AppTabs';
import { ScenesContextProvider } from './context/Scenes/Scenes.context';
import DatabaseContext from './context/Database/Database.context';
import AuthContext from './context/Auth.context';

  import { useLocation } from 'react-router-dom';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/variables.css';
import AppLoader from './hooks/Shared/AppLoader';
import NoUserFounded from './pages/NoUserFounded/NoUserFounded';
import PageNotExists from './pages/PageNotExists/PageNotExists';

setupIonicReact();

const AppContent: React.FC = () => {
  const { isDatabaseReady, oneWrapDb, isOnline } = React.useContext(DatabaseContext);
  const { logout, setLoggedIn, setLoadingAuth, loggedIn, loading } = React.useContext(AuthContext);

  const history = useHistory();

  useEffect(() => {
    // Escucha cambios en la historia de navegación
    const unlisten = history.listen((location) => {
      // Aquí puedes guardar la ruta actual en localStorage o en tu contexto
      console.log('Ruta actual:', location.pathname);
    location.pathname !== '/login' && localStorage.setItem('lastAppRoute', location.pathname);
    });

    // Limpieza para evitar fugas de memoria
    return () => {
      unlisten();
    };
  }, [history]);

  useEffect(() => {
    const getUser = async () => {
      if (oneWrapDb) {
        const user = await oneWrapDb.user.findOne().exec();
        if (user) {
          return user._data;
        }
      }
      return null;
    };

    const fetchUser = async () => {
      setLoadingAuth(true);
      const user = await getUser();
      if (user && loggedIn) {
        const sessionEndsAt = new Date(user.sessionEndsAt).getTime();
        const now = new Date().getTime();
        console.log(user)

        if (now > sessionEndsAt) {
          setLoggedIn(false);
          await logout();
        } else {
          setLoggedIn(true);
          console.log('User is logged in');
        }
      }

      setLoadingAuth(false);
    };

    oneWrapDb && fetchUser();
  }, [isOnline, oneWrapDb]);

  if (!loading && isDatabaseReady && loggedIn) {
    return (
      <>
          <Route exact path="/login">
            <LoginPage />
          </Route>
          <Route exact path="/user-not-found">
            <NoUserFounded />
          </Route>
          {loggedIn && (
            <>
              <Route exact path="/my/projects">
                <Projects />
              </Route>
              <Route path="/my/projects/:id">
                <AppTabs />
              </Route>
              <Route path="/my/projects/:id/unauthorized">
                <PageNotExists />
              </Route>
              <Route exact path="/">
                <Redirect to="/my/projects" />
              </Route>
            </>
          )}
      </>
    );
  }

  if (!loading && isDatabaseReady && !loggedIn) {
    return (
      <>
          <Route path="*">
            <Redirect to="/login" />
          </Route>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <Route exact path="/login">
            <LoginPage />
          </Route>
          <Route exact path="/user-not-found">
            <NoUserFounded />
          </Route>
      </>
    );
  }

  return (
    <IonPage>
      <IonContent color="tertiary">
        <AppLoader />
      </IonContent>
    </IonPage>
  );
};

const App: React.FC = () => (
  <IonApp>
    <ScenesContextProvider>
    <IonReactRouter>
    <IonRouterOutlet>
      <AppContent />
    </IonRouterOutlet>
    </IonReactRouter>
    </ScenesContextProvider>
  </IonApp>
);

export default App;
