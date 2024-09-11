import {
  IonIcon, IonLabel, IonTabBar, IonTabButton,
} from '@ionic/react';
import { documentTextOutline, home, informationCircleOutline, serverOutline } from 'ionicons/icons';
import React from 'react';
import { ShootingViews } from '../../../pages/ShootingDetail/ShootingDetail';
import './ShootingDetailTabs.css';
import { useHistory, useParams } from 'react-router';

interface ShootingDetailTabsProps {
  setView: (view: ShootingViews) => void;
  view: ShootingViews;
  handleBack: () => void;
}

const ShootingDetailTabs: React.FC<ShootingDetailTabsProps> = ({ setView, view, handleBack }) => {
  const { shootingId } = useParams<{ shootingId: string }>();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const goToCallSheet = () => {
    history.push(`/my/projects/${id}/shooting/${shootingId}/callsheet`);
  };

  return (
    <IonTabBar slot="bottom" color="dark" mode="md">
        <IonTabButton
          tab="shootingScenes"
          className="tab-bar-buttons"
          onClick={() => handleBack()}
        >
        <IonIcon icon={home} />
        <IonLabel>
          BACK
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
          SHOOTING INFO
        </IonLabel>
      </IonTabButton>
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
        tab="shootingCallTime"
        className="tab-bar-buttons"
        onClick={goToCallSheet}
      >
        <IonIcon icon={documentTextOutline} className="tab-bar-icons" color="light" />
        <IonLabel>
          CALL TIME
        </IonLabel>
      </IonTabButton>
      <IonTabButton
        tab="shootingOthers"
        className="tab-bar-buttons"
        onClick={() => setView('script-report')}>
        <IonIcon icon={documentTextOutline} className="tab-bar-icons" color={view === 'script-report' ? 'primary' : 'light'} />
        <IonLabel style={
            {
              color: view === 'script-report' ? 'var(--ion-color-primary)' : 'var(--ion-color-light)',
            }
          }
          >
          SCRIPT REPORT
          </IonLabel>
      </IonTabButton>
      <IonTabButton
        tab="shootingOthers"
        className="tab-bar-buttons"
        onClick={() => setView('wrap-report')}>
        <IonIcon icon={documentTextOutline} className="tab-bar-icons" color="light" />
        <IonLabel
          style={
            {
              color: view === 'wrap-report' ? 'var(--ion-color-primary)' : 'var(--ion-color-light)',
            }
          }
        >
          WRAP REPORT
        </IonLabel>
      </IonTabButton>
      {/* PRODUCTION REPORT */}
      <IonTabButton
        tab="shootingOthers"
        className="tab-bar-buttons"
        onClick={() => setView('production-report')}
      >
        <IonIcon icon={documentTextOutline} className="tab-bar-icons" color="light" />
        <IonLabel
          style={
            {
              color: view === 'production-report' ? 'var(--ion-color-primary)' : 'var(--ion-color-light)',
            }
          }
        >
          SERVICES
        </IonLabel>
      </IonTabButton>
    </IonTabBar>
  );
};

export default ShootingDetailTabs;
