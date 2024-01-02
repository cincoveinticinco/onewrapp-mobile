import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { businessOutline, calendarOutline, ellipse, listOutline, peopleOutline, readerOutline, settingsOutline, square, triangle } from 'ionicons/icons';
import Calendar from './pages/Calendar';
import Cast from './pages/Cast';
import Elements from './pages/Elements';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Sets from './pages/Sets';
import StripBoard from './pages/StripBoard';
import Strips from './pages/Strips';

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

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/calendar">
            <Calendar />
          </Route>
          <Route exact path="/strips">
            <Strips />
          </Route>
          <Route exact path="/stripboard">
            <StripBoard />
          </Route>
          <Route exact path="/cast">
            <Cast />
          </Route>
          <Route exact path="/sets">
            <Sets />
          </Route>
          <Route exact path="/elements">
            <Elements />
          </Route>
          <Route exact path="/reports">
            <Reports />
          </Route>
          <Route exact path="/settings">
            <Settings />
          </Route>
          <Route exact path="/">
            <Redirect to="/strips" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="calendar" href="/calendar">
            <IonIcon icon={calendarOutline} />
            <IonLabel>CALENDAR</IonLabel>
          </IonTabButton>
          <IonTabButton tab="strips" href="/strips">
            <IonIcon icon={listOutline} />
            <IonLabel>STRIPS</IonLabel>
          </IonTabButton>
          <IonTabButton tab="stripboard" href="/stripboard">
            <IonIcon icon={calendarOutline} />
            <IonLabel>STRIPBOARD</IonLabel>
          </IonTabButton>
          <IonTabButton tab="cast" href="/cast">
            <IonIcon icon={peopleOutline} />
            <IonLabel>CAST</IonLabel>
          </IonTabButton>
          <IonTabButton tab="sets" href="/sets">
            <IonIcon icon={businessOutline} />
            <IonLabel>SETS</IonLabel>
          </IonTabButton>
          <IonTabButton tab="elements" href="/elements">
            <IonIcon icon={businessOutline} />
            <IonLabel>ELEMENTS</IonLabel>
          </IonTabButton>
          <IonTabButton tab="reports" href="/reports">
            <IonIcon icon={readerOutline} />
            <IonLabel>REPORTS</IonLabel>
          </IonTabButton>
          <IonTabButton tab="settings" href="/settings">
            <IonIcon icon={settingsOutline} />
            <IonLabel>SETTINGS</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;

