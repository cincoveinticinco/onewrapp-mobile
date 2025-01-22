import {
  IonIcon, IonLabel, IonTabBar, IonTabButton,
} from '@ionic/react';

import { documentTextOutline, serverOutline } from 'ionicons/icons';
import useIsMobile from '../../hooks/useIsMobile';
import './SceneDetailsTabs.scss';

interface SceneDetailsTabsProps {
  routeDetails?: string;
  routeScript?: string;
  currentRoute?: 'scenedetails' | 'scenescript';
}

const SceneDetailsTabs: React.FC<SceneDetailsTabsProps> = ({ routeDetails, routeScript, currentRoute }) => {
  // const { loggedIn } = useAuth();

  const isMobile = useIsMobile();

  const defineButtonClass = !isMobile ? 'tab-bar-buttons' : 'tab-bar-buttons tablet';

  // EXACT PATHS

  return (
    <IonTabBar slot="bottom" className="scene-details-tabs-container" color="dark" mode="md">
      <IonTabButton
        tab="scenedetails"
        className={defineButtonClass}
        href={`${routeDetails}`}
        onClick={() => localStorage.setItem('editionBackRoute', `${routeDetails}`)}
      >
        <IonIcon icon={serverOutline} className="tab-bar-icons" color={currentRoute === 'scenedetails' ? 'primary' : 'light'} />
        <IonLabel color={currentRoute === 'scenedetails' ? 'primary' : 'light'}>SCENE DETAILS</IonLabel>
      </IonTabButton>
      <IonTabButton
        tab="scenescript"
        className="tab-bar-buttons"
        href={`${routeScript}`}
        onClick={() => localStorage.setItem('editionBackRoute', `${routeScript}`)}
      >
        <IonIcon icon={documentTextOutline} className="tab-bar-icons" color={currentRoute === 'scenescript' ? 'primary' : 'light'} />
        <IonLabel color={currentRoute === 'scenescript' ? 'primary' : 'light'}>SCENE SCRIPT</IonLabel>
      </IonTabButton>
    </IonTabBar>
  );
};

export default SceneDetailsTabs;
