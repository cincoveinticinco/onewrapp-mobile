import { Redirect, Route } from 'react-router-dom';
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import {
  business, calendar, list, people, reader, settings,
} from 'ionicons/icons';
import { useAuth } from '../../context/auth';
import Calendar from '../../pages/Calendar/Calendar';
import Cast from '../../pages/Cast/Cast';
import Elements from '../../pages/Elements/Elements';
import Reports from '../../pages/Reports/Reports';
import Settings from '../../pages/Settings/Settings';
import Sets from '../../pages/Sets/Sets';
import StripBoard from '../../pages/StripBoard/StripBoard';
import Strips from '../../pages/Strips/Strips';

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

/* Personalized CSS */
import './AppTabs.css';
import AddScene from '../../pages/AddScene/AddScene';
import SortScenes from '../../pages/SortScenes/SortScenes';
import FilterScenes from '../../pages/FilterScenes/FilterScenes';

setupIonicReact();

const AppTabs: React.FC = () => {
  const { loggedIn } = useAuth();

  if (!loggedIn) {
    return <Redirect to="/login" />;
  }

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/my/projects/:id/addscene">
          <AddScene />
        </Route>
        <Route exact path="/my/projects/:id/sortscenes">
          <SortScenes />
        </Route>
        <Route exact path="/my/projects/:id/filterscenes">
          <FilterScenes />
        </Route>
        <Route exact path="/my/projects/:id/calendar">
          <Calendar />
        </Route>
        <Route exact path="/my/projects/:id/strips">
          <Strips />
        </Route>
        <Route exact path="/my/projects/:id/stripboard">
          <StripBoard />
        </Route>
        <Route exact path="/my/projects/:id/cast">
          <Cast />
        </Route>
        <Route exact path="/my/projects/:id/sets">
          <Sets />
        </Route>
        <Route exact path="/my/projects/:id/elements">
          <Elements />
        </Route>
        <Route exact path="/my/projects/:id/reports">
          <Reports />
        </Route>
        <Route exact path="/my/projects/:id/settings">
          <Settings />
        </Route>
        <Redirect exact path="/my/projects/:id" to="/my/projects/:id/strips" />
      </IonRouterOutlet>
      <IonTabBar slot="bottom" className='app-tabs-container' color='dark'>
        <IonTabButton tab="calendar" href="/my/projects/:id/calendar">
          <IonIcon icon={calendar} className='tab-bar-icons'/>
          <IonLabel>CALENDAR</IonLabel>
        </IonTabButton>
        <IonTabButton tab="strips" href="/my/projects/:id/strips">
          <IonIcon icon={list} className='tab-bar-icons'/>
          <IonLabel>STRIPS</IonLabel>
        </IonTabButton>
        <IonTabButton tab="stripboard" href="/my/projects/:id/stripboard">
          <IonIcon icon={calendar} className='tab-bar-icons'/>
          <IonLabel>STRIPBOARD</IonLabel>
        </IonTabButton>
        <IonTabButton tab="cast" href="/my/projects/:id/cast">
          <IonIcon icon={people} className='tab-bar-icons'/>
          <IonLabel>CAST</IonLabel>
        </IonTabButton>
        <IonTabButton tab="sets" href="/my/projects/:id/sets">
          <IonIcon icon={business} className='tab-bar-icons'/>
          <IonLabel>SETS</IonLabel>
        </IonTabButton>
        <IonTabButton tab="elements" href="/my/projects/:id/elements">
          <IonIcon icon={business} className='tab-bar-icons'/>
          <IonLabel>ELEMENTS</IonLabel>
        </IonTabButton>
        <IonTabButton tab="reports" href="/my/projects/:id/reports">
          <IonIcon icon={reader} className='tab-bar-icons'/>
          <IonLabel>REPORTS</IonLabel>
        </IonTabButton>
        <IonTabButton tab="settings" href="/my/projects/:id/settings">
          <IonIcon icon={settings} className='tab-bar-icons'/>
          <IonLabel>SETTINGS</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};
export default AppTabs;
