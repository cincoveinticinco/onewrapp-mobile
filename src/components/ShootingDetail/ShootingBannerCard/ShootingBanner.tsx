import React from 'react';
import { ShootingBanner as ShootingBannerInterface } from '../../../interfaces/shootingTypes';
import { IonReorder } from '@ionic/react';

interface ShootingBannerProps {
  banner: ShootingBannerInterface;
}

const ShootingBanner: React.FC<ShootingBannerProps> = ({ banner }) => {
  
  return (
    <IonReorder>
      <div style={{
        backgroundColor: banner.backgroundColor ?? '',
        fontSize: banner.fontSize ?? 16,
        padding: '10px',
      }}>
        {banner.description.toUpperCase()}
      </div>
    </IonReorder>
  );
};

export default ShootingBanner;