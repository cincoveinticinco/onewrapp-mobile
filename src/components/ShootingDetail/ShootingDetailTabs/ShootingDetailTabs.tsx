import { IonIcon, IonLabel, IonTabBar, IonTabButton } from '@ionic/react'
import { documentTextOutline, informationCircleOutline, serverOutline } from 'ionicons/icons';
import React from 'react'
import { ShootingViews } from '../../../pages/ShootingDetail/ShootingDetail';
import './ShootingDetailTabs.css'

interface ShootingDetailTabsProps {
  setView: (view: ShootingViews) => void;
  view: ShootingViews;
}

const ShootingDetailTabs: React.FC<ShootingDetailTabsProps> = ({ setView, view  }) => {
  return (
    <IonTabBar slot="bottom" color="dark" mode="md">
      <IonTabButton
        tab="shootingScenes"
        className="tab-bar-buttons"
        onClick={() => setView('scenes')}
      >
        <IonIcon icon={serverOutline} color={view === 'scenes' ? 'primary' : 'light'}  />
        <IonLabel style={
          {
            color: view === 'scenes' ? 'var(--ion-color-primary)' : 'var(--ion-color-light)',
          }
        }>SCENES</IonLabel>
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
        }>DAY INFO</IonLabel>
      </IonTabButton>
    </IonTabBar>
  )
}

export default ShootingDetailTabs