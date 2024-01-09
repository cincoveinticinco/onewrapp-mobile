import React, { useState } from 'react';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact
} from '@ionic/react';
import { Redirect, Route } from 'react-router';
import { AuthContext } from './context/auth';
import { IonReactRouter } from '@ionic/react-router';
import LoginPage from './pages/LoginPage/LoginPage';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Projects from './pages/Projects/Projects';
import AppTabs from './AppTabs';
import { AppDataBase } from './RXdatabase/database';
import { ProjectsSchema } from './RXdatabase/schemas/projects';
import { ScenesSchema } from './RXdatabase/schemas/scenes';
import { DatabaseContext } from './context/database';

setupIonicReact();

const sceneCollection = new ScenesSchema()
const projectCollection = new ProjectsSchema()

const RXdatabase = new AppDataBase([
    sceneCollection,
    projectCollection
  ]
)

const App: React.FC = () => {
const [loggedIn, setLoggedIn] = useState(false);

return (
  <IonApp>
    <AuthContext.Provider value={{ loggedIn }}>
      <DatabaseContext.Provider value={{db: RXdatabase}}>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route exact path="/login">
              <LoginPage onLogin={() => setLoggedIn(true)} />
            </Route>
            <Route exact path="/my/projects">
              <Projects />
            </Route>
            <Redirect exact path="/" to="/my/projects" />
          </IonRouterOutlet>
          <Route path="/my/projects/:id">
              <AppTabs />
          </Route>
        </IonReactRouter>
      </DatabaseContext.Provider>
    </AuthContext.Provider>
  </IonApp>
)};

export default App;

