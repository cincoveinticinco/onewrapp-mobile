import {
  IonIcon, IonLabel, IonTabBar, IonTabButton,
} from '@ionic/react';
import { documentTextOutline, informationCircleOutline, serverOutline } from 'ionicons/icons';
import React from 'react';
import { ShootingViews } from '../../../pages/ShootingDetail/ShootingDetail';
import './ShootingDetailTabs.css';
import { useHistory, useParams } from 'react-router';

interface ShootingDetailTabsProps {
  setView: (view: ShootingViews) => void;
  view: ShootingViews;
}

const ShootingDetailTabs: React.FC<ShootingDetailTabsProps> = ({ setView, view }) => {
  const { shootingId } = useParams<{ shootingId: string }>();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const goToCallSheet = () => {
    history.push(`/my/projects/${id}/shooting/${shootingId}/callsheet`);
  }

  return (
    <IonTabBar slot="bottom" color="dark" mode="md">
      <IonTabButton
        tab="shootingScenes"
        className="tab-bar-buttons"
        onClick={() => setView('scenes')}
      >
        <IonIcon icon={serverOutline} color={view === 'scenes' ? 'primary' : 'light'} />
        <IonLabel style={
            {
              color: view === 'scenes' ? 'var(--ion-color-primary)' : 'var(--ion-color-light)',
            }
          }
        >
          SCENES
        </IonLabel>
      </IonTabButton>
      <IonTabButton
        tab="shootingInfo"
        className="tab-bar-buttons"
        onClick={() => setView('info')}
      >
        <IonIcon icon={informationCircleOutline} className="tab-bar-icons" color={view === 'info' ? 'primary' : 'light'} />
        <IonLabel style={
            {
              color: view === 'info' ? 'var(--ion-color-primary)' : 'var(--ion-color-light)',
            }
          }
        >
          DAY INFO
        </IonLabel>
      </IonTabButton>
      <IonTabButton
        tab="shootingCallTime"
        className="tab-bar-buttons"
        onClick={goToCallSheet}
      >
        <IonIcon icon={documentTextOutline} className="tab-bar-icons" color='light' />
        <IonLabel>
          CALL TIME
        </IonLabel>
      </IonTabButton>
    </IonTabBar>
  );
}

export default ShootingDetailTabs;
