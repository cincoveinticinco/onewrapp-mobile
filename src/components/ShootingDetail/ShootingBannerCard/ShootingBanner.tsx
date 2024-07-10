import React from 'react';
import { ShootingBanner as ShootingBannerInterface } from '../../../interfaces/shootingTypes';
import { IonButton, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonReorder } from '@ionic/react';
import { IoIosRemoveCircleOutline } from 'react-icons/io';
import { LuGripHorizontal } from 'react-icons/lu';
import './ShootingBanner.scss';

interface ShootingBannerProps {
  banner: ShootingBannerInterface;
  shootingDeleteBanner: () => void;
}

const ShootingBanner: React.FC<ShootingBannerProps> = ({ banner, shootingDeleteBanner }) => {
  return (
    <IonItemSliding 
      style={{
        '--background': banner.backgroundColor ?? '',
        backgroundColor: banner.backgroundColor ?? '',
        fontSize: `${banner.fontSize ?? 16}px`,
        padding: '0px'
      }}
      className='slide-container'
    >
      <IonItem style={{'--background': banner.backgroundColor ?? '', color: 'var(--ion-color-light)', fontWeight: 'bold'}}>
        <IonReorder className='reorder-banner-container' slot='start'>
          <LuGripHorizontal className="ion-no-padding ion-no-margin grip-sort-item-icon" />
        </IonReorder>
        <p>{banner.description.toUpperCase()}</p>
      </IonItem>
      <IonItemOptions side="end" className="banner-card-options">
        <IonButton fill="clear" color='danger' size='large' onClick={() => shootingDeleteBanner()}>
          <IoIosRemoveCircleOutline className="button-icon trash" />
        </IonButton>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default ShootingBanner;