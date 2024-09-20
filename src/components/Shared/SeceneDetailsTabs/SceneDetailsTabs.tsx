import {
  IonIcon, IonLabel, IonTabBar, IonTabButton,
} from '@ionic/react';

import { documentTextOutline, serverOutline } from 'ionicons/icons';
import useIsMobile from '../../../hooks/Shared/useIsMobile';
import './SceneDetailsTabs.scss';
import { useParams } from 'react-router';

interface SceneDetailsTabsProps {
  sceneId?: string;
}

const SceneDetailsTabs: React.FC<SceneDetailsTabsProps> = ({ sceneId }) => {
  // const { loggedIn } = useAuth();

  const isMobile = useIsMobile();

  const defineButtonClass = !isMobile ? 'tab-bar-buttons' : 'tab-bar-buttons tablet';

  const { id } = useParams<{ id: string }>();

  // EXACT PATHS

  return (
    <IonTabBar slot="bottom" className="scene-details-tabs-container" color="dark" mode="md">
      <IonTabButton
        tab="scenedetails"
        className={defineButtonClass}
        href={`/my/projects/${id}/strips/details/scene/${sceneId}`}
        onClick={() => localStorage.setItem('editionBackRoute', `/my/projects/${id}/strips/details/scene/${sceneId}`)}
      >
        <IonIcon icon={serverOutline} className="tab-bar-icons" />
        <IonLabel>SCENE DETAILS</IonLabel>
      </IonTabButton>
      <IonTabButton
        tab="scenescript"
        className="tab-bar-buttons"
        href={`/my/projects/${id}/strips/details/script/${sceneId}`}
        onClick={() => localStorage.setItem('editionBackRoute', `/my/projects/${id}/strips/details/script/${sceneId}`)}
      >
        <IonIcon icon={documentTextOutline} className="tab-bar-icons" />
        <IonLabel>SCENE SCRIPT</IonLabel>
      </IonTabButton>
    </IonTabBar>
  );
};

export default SceneDetailsTabs;
