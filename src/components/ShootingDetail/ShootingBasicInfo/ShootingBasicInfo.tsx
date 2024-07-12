import React from 'react';
import { IonCol, IonGrid, IonRow } from '@ionic/react';

interface ShootingInfoLabelsProps {
  info: string;
  title: string;
  symbol?: string;
}

const ShootingInfoLabels: React.FC<ShootingInfoLabelsProps> = ({ info, title, symbol }) => (
  <div className="ion-flex-column" style={{ textAlign: 'center', height: '100%', justifyContent: 'space-around' }}>
    <p className="ion-no-margin" style={{ fontSize: '16px' }}>
      <b>{info.toUpperCase()}</b>
      {symbol && <span className="symbol-part" style={{ fontSize: '14px', position: 'absolute', fontWeight: 'bold' }}>{symbol}</span>}
    </p>
    <p className="ion-no-margin" style={{ fontSize: '12px', margin: '6px' }}>{title.toUpperCase()}</p>
  </div>
);

interface ShootingBasicInfoProps {
  shootingInfo: {
    generalCall: string;
    readyToShoot: string;
    estimatedWrap: string;
    wrap: string;
    lastOut: string;
    sets: number;
    scenes: number;
    pages: string;
    min: string;
  };
}

const ShootingBasicInfo: React.FC<ShootingBasicInfoProps> = ({ shootingInfo }) => {
  const separateTimeOrPages = (value: string): { main: string; symbol: string } => {
    const [main, symbol] = value.split(/[:.\/]/);
    return { main: main || '--', symbol: symbol ? (value.includes(':') ? `:${symbol}` : `/${symbol}`) : '' };
  };

  return (
    <IonGrid fixed style={{ width: '100%' }}>
      <IonRow>
        <IonCol size="6" size-sm="3">
          <ShootingInfoLabels 
            info={separateTimeOrPages(shootingInfo.generalCall).main} 
            symbol={separateTimeOrPages(shootingInfo.generalCall).symbol}
            title="General Call" 
          />
        </IonCol>
        <IonCol size="6" size-sm="3">
          <ShootingInfoLabels 
            info={separateTimeOrPages(shootingInfo.readyToShoot).main} 
            symbol={separateTimeOrPages(shootingInfo.readyToShoot).symbol}
            title="Ready to Shoot" 
          />
        </IonCol>
        <IonCol size="6" size-sm="3">
          <ShootingInfoLabels 
            info={separateTimeOrPages(shootingInfo.estimatedWrap).main} 
            symbol={separateTimeOrPages(shootingInfo.estimatedWrap).symbol}
            title="Estimated Wrap" 
          />
        </IonCol>
        <IonCol size="6" size-sm="3">
          <ShootingInfoLabels 
            info={separateTimeOrPages(shootingInfo.wrap).main} 
            symbol={separateTimeOrPages(shootingInfo.wrap).symbol}
            title="Wrap" 
          />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size="6" size-sm="3">
          <ShootingInfoLabels 
            info={separateTimeOrPages(shootingInfo.lastOut).main} 
            symbol={separateTimeOrPages(shootingInfo.lastOut).symbol}
            title="Last Out" 
          />
        </IonCol>
        <IonCol size="6" size-sm="3">
          <ShootingInfoLabels info={shootingInfo.sets.toString()} title="Sets" />
        </IonCol>
        <IonCol size="6" size-sm="3">
          <ShootingInfoLabels info={shootingInfo.scenes.toString()} title="Scenes" />
        </IonCol>
        <IonCol size="6" size-sm="3">
          <ShootingInfoLabels 
            info={separateTimeOrPages(shootingInfo.pages).main} 
            symbol={separateTimeOrPages(shootingInfo.pages).symbol}
            title="Pages" 
          />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size="12">
          <ShootingInfoLabels 
            info={separateTimeOrPages(shootingInfo.min).main} 
            symbol={separateTimeOrPages(shootingInfo.min).symbol}
            title="Min" 
          />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default ShootingBasicInfo;