import React, { useEffect, useState } from 'react';
import {
  IonCol, IonGrid, IonRow, IonInput, IonButton, IonIcon,
} from '@ionic/react';
import { VscEdit } from 'react-icons/vsc';
import { saveOutline } from 'ionicons/icons';
import { LocationInfo } from '../../../interfaces/shooting.types';
import './ShootingBasicInfo.scss';
import GoogleMapComponent from '../../Shared/GoogleMapComponent/GoogleMapComponent';

interface ShootingInfoLabelsProps {
  info: string;
  title: string;
  symbol?: string;
  onEdit?: () => void;
  isEditable?: boolean;
}

const ShootingInfoLabels: React.FC<ShootingInfoLabelsProps> = ({
  info, title, symbol, onEdit, isEditable,
}) => (
  <div
    className="ion-flex-column"
    style={{
      textAlign: 'center', height: '100%', justifyContent: 'center', position: 'relative',
    }}
  >
    <p
      className="ion-no-margin"
      style={{
        fontSize: '24px', display: 'flex', justifyContent: 'center', width: '100%',
      }}
    >
      <b>{info.toUpperCase()}</b>
      {symbol && <span className="symbol-part" style={{ fontSize: '14px', fontWeight: 'bold' }}>{symbol}</span>}
    </p>
    <p className="ion-no-margin" style={{ fontSize: '12px' }}>
      {title.toUpperCase()}
      {isEditable && (
        <VscEdit
          onClick={onEdit}
          style={{
            cursor: 'pointer', color: 'var(--ion-color-primary)', position: 'absolute', right: '12px', top: '0',
          }}
        />
      )}
    </p>
  </div>
);

interface ShootingBasicInfoProps {
  shootingInfo: {
    generalCall: string;
    onSet: string;
    estimatedWrap: string;
    wrap: string;
    lastOut: string;
    sets: number;
    scenes: number;
    pages: string;
    min: string;
    locations: LocationInfo[];
  };
  permissionType?: number | null;
  updateShootingTime: (field: 'generalCall' | 'onSet' | 'estimatedWrap' | 'wrap' | 'lastOut', time: { hours: string; minutes: string }) => void;
}

const ShootingBasicInfo: React.FC<ShootingBasicInfoProps> = ({ shootingInfo, updateShootingTime, permissionType }) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [time, setTime] = useState('');

  const separateTimeOrPages = (value: string): { main: string; symbol: string } => {
    const [main, symbol] = value.split(/[:.\/]/);
    return { main: main || '--', symbol: symbol ? (value.includes(':') ? `:${symbol}` : `/${symbol}`) : '' };
  };

  const [firstLocationLat, setFirstLocationLat] = useState<number | undefined>(undefined);
  const [firstLocationLng, setFirstLocationLng] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (shootingInfo.locations.length > 0) {
      setFirstLocationLat(parseFloat(shootingInfo.locations[0].lat));
      setFirstLocationLng(parseFloat(shootingInfo.locations[0].lng));
      console.log(shootingInfo.locations[0]);
      console.log('firstLocationLat', firstLocationLat);
      console.log('firstLocationLng', firstLocationLng);
    }
  }, [shootingInfo.locations]);

  const validateTime = (value: string) => {
    const [hours, minutes] = value.split(':');
    const validatedHours = hours.padStart(2, '0');
    const validatedMinutes = minutes.padStart(2, '0');
    return `${validatedHours}:${validatedMinutes}`;
  };

  const handleTimeChange = (e: CustomEvent) => {
    const validatedTime = validateTime(e.detail.value!);
    setTime(validatedTime);
  };

  const handleEdit = (field: 'generalCall' | 'onSet' | 'estimatedWrap' | 'wrap' | 'lastOut', value: string) => {
    setEditingField(field);
    setTime(value);
  };

  const handleSave = () => {
    if (editingField) {
      const [hours, minutes] = time.split(':');
      updateShootingTime(editingField as any, {
        hours: hours.padStart(2, '0'),
        minutes: minutes.padStart(2, '0'),
      });
      setEditingField(null);
    }
  };

  const renderEditableField = (field: 'generalCall' | 'onSet' | 'estimatedWrap' | 'wrap' | 'lastOut', value: string, title: string, withSymbol: boolean) => {
    const { main, symbol } = separateTimeOrPages(value);

    if (editingField === field) {
      return (
        <div className="editable-form-wrapper">
          <div className="inputs-wrapper">
            <IonInput
              type="time"
              value={time}
              onIonChange={handleTimeChange}
              style={{ display: 'inline-block', width: '80%' }}
              autoFocus
            />
            <IonButton
              fill="clear"
              onClick={handleSave}
              size="small"
              disabled={permissionType !== 1}
              style={{
                position: 'absolute', right: '0', top: '50%', transform: 'translateY(-60%)',
              }}
            >
              <IonIcon icon={saveOutline} />
            </IonButton>
          </div>
        </div>
      );
    }

    return (
      <ShootingInfoLabels
        info={withSymbol ? main : value}
        symbol={withSymbol ? symbol : ''}
        title={title}
        onEdit={() => handleEdit(field as any, value)}
        isEditable={permissionType === 1}
      />
    );
  };

  return (
    <IonGrid fixed style={{ width: '100%' }}>
      <IonRow>
        <IonCol size="8">
          {
            shootingInfo.locations.length > 0 && firstLocationLat && firstLocationLng ? (
              <div>
                <GoogleMapComponent
                  lat={firstLocationLat}
                  lng={firstLocationLng}
                />
              </div>
            ) : (
              <div className="map-container ion-flex ion-justify-content-center ion-align-items-center">
                <p> PLEASE ADD LOCATION TO LOAD MAP</p>
              </div>
            )
          }
        </IonCol>
        <IonCol size="4">
          <IonRow>
            <IonCol size="12" className="ion-padding">
              {renderEditableField('generalCall', shootingInfo.generalCall, 'General Call', false)}
            </IonCol>
            <IonCol size="12" className="ion-padding">
              {renderEditableField('onSet', shootingInfo.onSet, 'Ready to Shoot', false)}
            </IonCol>
            <IonCol size="12" className="ion-padding">
              {renderEditableField('estimatedWrap', shootingInfo.estimatedWrap, 'Estimated Wrap', false)}
            </IonCol>
          </IonRow>
          <IonRow style={{ position: 'relative', textAlign: 'center', height: '50px' }}>
            <p className="bold center-absolute">NO WEATHER AVAILABLE</p>
          </IonRow>
        </IonCol>
        <IonCol size="12">
          <IonRow class="ion-justify-content-between">
            <IonCol size="auto">
              <ShootingInfoLabels info={shootingInfo.scenes.toString()} title="Scenes" />
            </IonCol>
            <IonCol size="auto">
              <ShootingInfoLabels info={shootingInfo.scenes.toString()} title="Protections" />
            </IonCol>
            <IonCol size="auto">
              <ShootingInfoLabels
                info={separateTimeOrPages(shootingInfo.pages).main}
                symbol={separateTimeOrPages(shootingInfo.pages).symbol}
                title="Pages"
              />
            </IonCol>
            <IonCol size="auto">
              <ShootingInfoLabels
                info={separateTimeOrPages(shootingInfo.min).main}
                symbol={separateTimeOrPages(shootingInfo.min).symbol}
                title="Minutes"
              />
            </IonCol>
            <IonCol size="auto">
              <ShootingInfoLabels info={shootingInfo.locations.length.toString()} title="Locations" />
            </IonCol>
            <IonCol size="auto">
              <ShootingInfoLabels info={shootingInfo.sets.toString()} title="Sets" />
            </IonCol>
            <IonCol size="auto">
              <ShootingInfoLabels info="0" title="Script Days" />
            </IonCol>
            <IonCol size="auto">
              <ShootingInfoLabels info="0" title="Extras" />
            </IonCol>
          </IonRow>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default ShootingBasicInfo;

// (<IonGrid fixed style={{ width: '100%', marginTop: '24px', marginBottom: '24px' }}>
//   <IonRow>
//     <IonCol size="6" size-sm="3">
//       {renderEditableField('generalCall', shootingInfo.generalCall, 'General Call')}
//     </IonCol>
//     <IonCol size="6" size-sm="3">
//       {renderEditableField('onSet', shootingInfo.onSet, 'Ready to Shoot')}
//     </IonCol>
//     <IonCol size="6" size-sm="3">
//       {renderEditableField('estimatedWrap', shootingInfo.estimatedWrap, 'Estimated Wrap')}
//     </IonCol>
//     <IonCol size="6" size-sm="3">
//       {renderEditableField('wrap', shootingInfo.wrap, 'Wrap')}
//     </IonCol>
//   </IonRow>
//   <IonRow>
//     <IonCol size="6" size-sm="3">
//       {renderEditableField('lastOut', shootingInfo.lastOut, 'Last Out')}
//     </IonCol>
// <IonCol size="6" size-sm="3">
//   <ShootingInfoLabels info={shootingInfo.sets.toString()} title="Sets" />
// </IonCol>
//     <IonCol size="6" size-sm="3">
//       <ShootingInfoLabels info={shootingInfo.scenes.toString()} title="Scenes" />
//     </IonCol>
//     <IonCol size="6" size-sm="3">
//       <ShootingInfoLabels
//         info={separateTimeOrPages(shootingInfo.pages).main}
//         symbol={separateTimeOrPages(shootingInfo.pages).symbol}
//         title="Pages"
//       />
//     </IonCol>
//   </IonRow>
//   <IonRow>
// <IonCol size="12">
//   <ShootingInfoLabels
//     info={separateTimeOrPages(shootingInfo.min).main}
//     symbol={separateTimeOrPages(shootingInfo.min).symbol}
//     title="Min"
//   />
// </IonCol>
//   </IonRow>
// </IonGrid>)
