import {
  IonIcon, IonLabel, IonTabBar, IonTabButton,
} from '@ionic/react';
import {
  documentTextOutline, home, informationCircleOutline, serverOutline,
} from 'ionicons/icons';
import React from 'react';
import { useHistory, useParams } from 'react-router';
import { ShootingViews } from '../../../pages/ShootingDetail/ShootingDetail';
import './ShootingDetailTabs.css';

interface ShootingDetailTabsProps {
  setView: (view: ShootingViews) => void;
  view: ShootingViews;
  handleBack: () => void;
}

interface TabConfig {
  tab: string;
  label: string;
  icon: string;
  onClick: () => void;
  view?: ShootingViews;
}

const ShootingDetailTabs: React.FC<ShootingDetailTabsProps> = ({ setView, view, handleBack }) => {
  const { shootingId } = useParams<{ shootingId: string }>();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const goToCallSheet = () => {
    history.push(`/my/projects/${id}/shooting/${shootingId}/callsheet`);
  };

  const tabs: TabConfig[] = [
    {
      tab: 'shootingScenes', label: 'CALENDAR', icon: home, onClick: handleBack,
    },
    {
      tab: 'shootingInfo', label: 'SHOOTING INFO', icon: informationCircleOutline, onClick: () => setView('info'), view: 'info',
    },
    {
      tab: 'shootingScenes', label: 'SCENES', icon: serverOutline, onClick: () => setView('scenes'), view: 'scenes',
    },
    {
      tab: 'shootingCallTime', label: 'CALL TIME', icon: documentTextOutline, onClick: () => setView('call-sheet'), view: 'call-sheet',
    },
    {
      tab: 'shootingOthers', label: 'SCRIPT REPORT', icon: documentTextOutline, onClick: () => setView('script-report'), view: 'script-report',
    },
    {
      tab: 'shootingOthers', label: 'WRAP REPORT', icon: documentTextOutline, onClick: () => setView('wrap-report'), view: 'wrap-report',
    },
    {
      tab: 'shootingOthers', label: 'SERVICES', icon: documentTextOutline, onClick: () => setView('production-report'), view: 'production-report',
    },
  ];

  const renderTab = ({
    tab, label, icon, onClick, view: tabView,
  }: TabConfig) => (
    <IonTabButton
      key={label}
      tab={tab}
      className="tab-bar-buttons"
      onClick={onClick}
    >
      <IonIcon icon={icon} color={tabView === view ? 'primary' : 'light'} />
      <IonLabel style={{
        color: tabView === view ? 'var(--ion-color-primary)' : 'var(--ion-color-light)',
      }}
      >
        {label}
      </IonLabel>
    </IonTabButton>
  );

  return (
    <IonTabBar slot="bottom" color="dark" mode="md">
      {tabs.map(renderTab)}
    </IonTabBar>
  );
};

export default ShootingDetailTabs;
