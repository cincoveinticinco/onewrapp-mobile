import {
  IonButton, IonItem,
  IonItemOptions, IonItemSliding, IonReorder,
} from '@ionic/react';
import React from 'react';
import { IoIosRemoveCircleOutline } from 'react-icons/io';
import { LuGripHorizontal } from 'react-icons/lu';
import { ShootingBanner as ShootingBannerInterface } from '../../../interfaces/shooting.types';
import './ShootingBanner.scss';

interface ShootingBannerProps {
  banner: ShootingBannerInterface;
  shootingDeleteBanner: () => void;
}

const ShootingBanner: React.FC<ShootingBannerProps> = ({ banner, shootingDeleteBanner }) => {
  const getFontColor = (backgroundColor: string) => {
    if(!backgroundColor) return 'black';
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    console.log(banner);
    return (yiq >= 128) ? 'black' : 'white';
  };
  return (
    <IonItemSliding
      style={{
        '--background': banner.backgroundColor ?? '',
        backgroundColor: banner.backgroundColor ?? '',
        fontSize: `${banner.fontSize ?? 16}px`,
        padding: '0px',
      }}
      className="slide-container"
    >
      <IonItem style={{ '--background': banner.backgroundColor ?? '', color: 'var(--ion-color-light)', fontWeight: 'bold' }}>
        <IonReorder className="reorder-banner-container" slot="start">
          <LuGripHorizontal
            className="ion-no-padding ion-no-margin grip-sort-item-icon"
            style={
            {
              color: getFontColor(banner.backgroundColor ?? ''),
            }
          }
          />
        </IonReorder>
        <p
          style={{
            color: getFontColor(banner.backgroundColor ?? ''),
            fontSize: `${banner.fontSize ?? 16}px`,
          }}
        >
          {banner.description.toUpperCase()}
        </p>
      </IonItem>
      <IonItemOptions side="end" className="banner-card-options">
        <IonButton fill="clear" color="danger" size="large" onClick={() => shootingDeleteBanner()}>
          <IoIosRemoveCircleOutline className="button-icon trash" />
        </IonButton>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default ShootingBanner;
