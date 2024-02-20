import React, { useEffect } from 'react';
import {
  useRouteMatch, Redirect, Route, useParams,
} from 'react-router-dom';
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import {
  calendar, list, people, business, reader, settings,
} from 'ionicons/icons';
// import { useAuth } from '../../context/auth';
import AddScene from '../../../pages/AddScene/AddScene';
import SortScenes from '../../../pages/SortScenes/SortScenes';
import FilterScenes from '../../../pages/FilterScenes/FilterScenes';
import Calendar from '../../../pages/Calendar/Calendar';
import Cast from '../../../pages/Cast/Cast';
import Elements from '../../../pages/Elements/Elements';
import Reports from '../../../pages/Reports/Reports';
import Settings from '../../../pages/Settings/Settings';
import Sets from '../../../pages/Sets/Sets';
import StripBoard from '../../../pages/StripBoard/StripBoard';
import Strips from '../../../pages/Strips/Strips';

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
import './AppTabs.scss';
import useIsMobile from '../../../hooks/useIsMobile';
import EditScene from '../../../pages/EditScene/EditScene';

setupIonicReact();

const AppTabs: React.FC = () => {
  // const { loggedIn } = useAuth();

  const isMobile = useIsMobile();

  const url = useRouteMatch().url;
  
  const defineButtonClass = !isMobile ? 'tab-bar-buttons' : 'tab-bar-buttons tablet';

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path={`${url}/addscene`}>
          <AddScene />
        </Route>
        <Route exact path={`${url}/editscene/:sceneId`}>
          <EditScene />
        </Route>
        <Route exact path={`${url}/sortscenes`}>
          <SortScenes />
        </Route>
        <Route exact path={`${url}/strips/filters`}>
          <FilterScenes />
        </Route>
        <Route exact path={`${url}/calendar`}>
          <Calendar />
        </Route>
        <Route exact path={`${url}/strips`}>
          <Strips />
        </Route>
        <Route exact path={`${url}/stripboard`}>
          <StripBoard />
        </Route>
        <Route exact path={`${url}/cast`}>
          <Cast />
        </Route>
        <Route exact path={`${url}/sets`}>
          <Sets />
        </Route>
        <Route exact path={`${url}/elements`}>
          <Elements />
        </Route>
        <Route exact path={`${url}/reports`}>
          <Reports />
        </Route>
        <Route exact path={`${url}/settings`}>
          <Settings />
        </Route>
        <Redirect exact from={`${url}`} to={`${url}/strips`} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom" className="app-tabs-container" color="dark">
        <IonTabButton tab="calendar" className={defineButtonClass} href={`${url}/calendar`}>
          <IonIcon icon={calendar} className="tab-bar-icons" />
          <IonLabel>CALENDAR</IonLabel>
        </IonTabButton>
        <IonTabButton tab="strips" className="tab-bar-buttons" href={`${url}/strips`}>
          <IonIcon icon={list} className="tab-bar-icons" />
          <IonLabel>STRIPS</IonLabel>
        </IonTabButton>
        <IonTabButton tab="stripboard" className="tab-bar-buttons" href={`${url}/stripboard`}>
          <IonIcon icon={calendar} className="tab-bar-icons" />
          <IonLabel>STRIPBOARD</IonLabel>
        </IonTabButton>
        <IonTabButton tab="cast" className="tab-bar-buttons" href={`${url}/cast`}>
          <IonIcon icon={people} className="tab-bar-icons" />
          <IonLabel>CAST</IonLabel>
        </IonTabButton>
        <IonTabButton tab="sets" className="tab-bar-buttons" href={`${url}/sets`}>
          <IonIcon icon={business} className="tab-bar-icons" />
          <IonLabel>SETS</IonLabel>
        </IonTabButton>
        <IonTabButton tab="elements" className="tab-bar-buttons" href={`${url}/elements`}>
          <IonIcon icon={business} className="tab-bar-icons" />
          <IonLabel>ELEMENTS</IonLabel>
        </IonTabButton>
        <IonTabButton tab="reports" className={defineButtonClass} href={`${url}/reports`}>
          <IonIcon icon={reader} className="tab-bar-icons" />
          <IonLabel>REPORTS</IonLabel>
        </IonTabButton>
        <IonTabButton tab="settings" className={defineButtonClass} href={`${url}/settings`}>
          <IonIcon icon={settings} className="tab-bar-icons" />
          <IonLabel>SETTINGS</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default AppTabs;
