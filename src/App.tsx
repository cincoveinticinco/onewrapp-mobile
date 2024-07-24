import React from 'react';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
} from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import { IonReactRouter } from '@ionic/react-router';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginPage from './pages/LoginPage/LoginPage';
import Projects from './pages/Projects/Projects';
import AppTabs from './components/Shared/AppTabs/AppTabs';
import { ScenesContextProvider } from './context/ScenesContext';
import DatabaseContext, { DatabaseContextProvider } from './hooks/Shared/database';
import { AuthProvider, useAuth } from './context/Auth';
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

setupIonicReact();

const AppContent: React.FC = () => {
  const { loggedIn, loading } = useAuth();
  const { isDatabaseReady } = React.useContext(DatabaseContext);

  if (loading || !isDatabaseReady) {
    return useLoader();
  }

  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/login">
          <LoginPage />
        </Route>
        {loggedIn ? (
          <>
            <Route exact path="/my/projects">
              <Projects />
            </Route>
            <Route path="/my/projects/:id">
              <AppTabs />
            </Route>
            <Route exact path="/">
              <Redirect to="/my/projects" />
            </Route>
          </>
        ) : (
          <Route>
            <Redirect to="/login" />
          </Route>
        )}
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId={environment.CLIENT_ID}>
      <IonApp>
        <AuthProvider>
          <DatabaseContextProvider>
            <ScenesContextProvider>
              <AppContent />
            </ScenesContextProvider>
          </DatabaseContextProvider>
        </AuthProvider>
      </IonApp>
    </GoogleOAuthProvider>
  );
};

export default App;