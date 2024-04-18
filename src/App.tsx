import React, { useState } from 'react';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
} from '@ionic/react';
import { Redirect, Route } from 'react-router';
import { IonReactRouter } from '@ionic/react-router';
import { AuthContext } from './context/auth';
import LoginPage from './pages/LoginPage/LoginPage';
import Projects from './pages/Projects/Projects';
import AppTabs from './components/Shared/AppTabs/AppTabs';
import { ScenesContextProvider } from './context/ScenesContext';

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
import { DatabaseContextProvider } from './context/database';

setupIonicReact();

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  if(!loggedIn) {
    return (
        <IonApp>
          <IonReactRouter>
            <IonRouterOutlet>
              <Redirect to="/login" />
              <Route exact path="/login">
                <LoginPage onLogin={() => setLoggedIn(true)} />
              </Route>
            </IonRouterOutlet>
          </IonReactRouter>
      </IonApp>
    )
  }

  return (
    <IonApp>
      <DatabaseContextProvider>
        <AuthContext.Provider value={{ loggedIn }}>
          <ScenesContextProvider>
            <IonReactRouter>
              <IonRouterOutlet>
                <Route exact path="/login">
                  <LoginPage onLogin={() => setLoggedIn(true)} />
                </Route>
                <Route exact path="/my/projects">
                  <Projects />
                </Route>
                <Redirect exact path="/" to="/my/projects" />
                <Route path="/my/projects/:id">
                  <AppTabs />
                </Route>
              </IonRouterOutlet>
            </IonReactRouter>
          </ScenesContextProvider>
        </AuthContext.Provider>
      </DatabaseContextProvider>
    </IonApp>
  );
};

export default App;
