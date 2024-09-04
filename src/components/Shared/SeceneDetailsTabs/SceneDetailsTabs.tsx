import {
  IonIcon, IonLabel, IonTabBar, IonTabButton,
} from '@ionic/react';

import { documentTextOutline, serverOutline } from 'ionicons/icons';
import useIsMobile from '../../../hooks/Shared/useIsMobile';
import './SceneDetailsTabs.scss';
import { useParams } from 'react-router';

interface SceneDetailsTabsProps {
  routeDetails?: string;
  routeScript?: string;
}

const SceneDetailsTabs: React.FC<SceneDetailsTabsProps> = ({ routeDetails, routeScript}) => {
  // const { loggedIn } = useAuth();

  const isMobile = useIsMobile();

  const defineButtonClass = !isMobile ? 'tab-bar-buttons' : 'tab-bar-buttons tablet'

  // EXACT PATHS

  return (
    <IonTabBar slot="bottom" className="scene-details-tabs-container" color="dark" mode="md">
      <IonTabButton
        tab="scenedetails"
        className={defineButtonClass}
        href={`${routeDetails}`}
        onClick={() => localStorage.setItem('editionBackRoute', `${routeDetails}`)}
      >
        <IonIcon icon={serverOutline} className="tab-bar-icons" />
        <IonLabel>SCENE DETAILS</IonLabel>
      </IonTabButton>
      <IonTabButton
        tab="scenescript"
        className="tab-bar-buttons"
        href={`${routeScript}`}
        onClick={() => localStorage.setItem('editionBackRoute', `${routeScript}`)}
      >
        <IonIcon icon={documentTextOutline} className="tab-bar-icons" />
        <IonLabel>SCENE SCRIPT</IonLabel>
      </IonTabButton>
    </IonTabBar>
  );
};

export default SceneDetailsTabs;
