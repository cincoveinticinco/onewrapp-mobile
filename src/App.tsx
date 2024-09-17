import React, { useEffect } from 'react';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
} from '@ionic/react';
import { Redirect, Route, useParams } from 'react-router-dom';
import { IonReactRouter } from '@ionic/react-router';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginPage from './pages/LoginPage/LoginPage';
import Projects from './pages/Projects/Projects';
import AppTabs from './components/Shared/AppTabs/AppTabs';
import { ScenesContextProvider } from './context/Scenes.context';
import DatabaseContext, { DatabaseContextProvider } from './context/Database.context';
import { AuthProvider, useAuth } from './context/Auth.context';
import environment from '../environment';

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
import useLoader from './hooks/Shared/useLoader';
import NoUserFounded from './pages/NoUserFounded/NoUserFounded';
import PageNotExists from './pages/PageNotExists/PageNotExists';

setupIonicReact();

const AppContent: React.FC = () => {
  const { loggedIn, loading } = useAuth();
  const { isDatabaseReady, projectId, initializeSceneReplication, initializeShootingReplication } = React.useContext(DatabaseContext);

  if (loading || !isDatabaseReady) {
    return useLoader();
  }
  
  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/login">
          <LoginPage />
        </Route>
        <Route exact path="/user-not-found">
          <NoUserFounded />
        </Route>
        {loggedIn ? (
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
        ) : (
          <>
            <Route>
              <Redirect to="/login" />
            </Route>
          </>
        )}
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

const App: React.FC = () => (
  <IonApp>
    <ScenesContextProvider>
      <AppContent />
    </ScenesContextProvider>
  </IonApp>
);

export default App;
