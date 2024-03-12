import { IonIcon, IonLabel, IonTabBar, IonTabButton } from "@ionic/react";

import useIsMobile from "../../../hooks/useIsMobile";
import { documentTextOutline, serverOutline } from "ionicons/icons";
import './SceneDetailsTabs.scss';

interface SceneDetailsTabsProps {
  sceneId?: string;
}

const SceneDetailsTabs: React.FC<SceneDetailsTabsProps> = ({ sceneId }) => {
  // const { loggedIn } = useAuth();

  const isMobile = useIsMobile();

  const defineButtonClass = !isMobile ? 'tab-bar-buttons' : 'tab-bar-buttons tablet';

  // EXACT PATHS

  return (
    <IonTabBar slot="bottom" className="scene-details-tabs-container" color="dark">
      <IonTabButton tab="scenedetails" className={defineButtonClass} href={`/my/projects/163/strips/details/scene/${sceneId}`}>
        <IonIcon icon={serverOutline} className="tab-bar-icons" />
        <IonLabel>SCENE DETAILS</IonLabel>
      </IonTabButton>
      <IonTabButton tab="scenescript" className="tab-bar-buttons" href={`/my/projects/163/strips/details/script/${sceneId}`}>
        <IonIcon icon={documentTextOutline} className="tab-bar-icons" />
        <IonLabel>SCENE SCRIPT</IonLabel>
      </IonTabButton>
    </IonTabBar>
  );
};

export default SceneDetailsTabs;