import { IonIcon, IonLabel, IonTabBar, IonTabButton } from '@ionic/react'
import { documentTextOutline, serverOutline } from 'ionicons/icons';
import React from 'react'

interface ShootingDetailTabsProps {
  shootingId: string;
}

const ShootingDetailTabs: React.FC<ShootingDetailTabsProps> = ({ shootingId }) => {
  return (
    <IonTabBar slot="bottom" className="scene-details-tabs-container" color="dark" mode="md">
      <IonTabButton
        tab="shootingScenes"
        href={`/my/projects/163/shooting/${shootingId}`}
      >
        <IonIcon icon={serverOutline} className="tab-bar-icons" />
        <IonLabel>SCENE DETAILS</IonLabel>
      </IonTabButton>
      <IonTabButton
        tab="shootingInfo"
        className="tab-bar-buttons"
      >
        <IonIcon icon={documentTextOutline} className="tab-bar-icons" />
        <IonLabel>SCENE SCRIPT</IonLabel>
      </IonTabButton>
    </IonTabBar>
  )
}

export default ShootingDetailTabs