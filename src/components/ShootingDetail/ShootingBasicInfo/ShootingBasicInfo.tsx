import React, { useEffect, useState, useRef } from 'react';
import {
  IonCol, IonGrid, IonRow,
} from '@ionic/react';
import { VscEdit } from 'react-icons/vsc';
import { LocationInfo } from '../../../interfaces/shooting.types';
import './ShootingBasicInfo.scss';
import GoogleMapComponent from '../../Shared/GoogleMapComponent/GoogleMapComponent';
import EditionModal from '../../Shared/EditionModal/EditionModal';
import getHourMinutesFomISO, { getAmOrPm } from '../../../utils/getHoursMinutesFromISO';
import separateTimeOrPages from '../../../utils/SeparateTimeOrPages';
import useIsMobile from '../../../hooks/Shared/useIsMobile';

interface ShootingInfoLabelsProps {
  info: string;
  title: string;
  symbol?: string;
  onEdit?: () => void;
  isEditable?: boolean;
}

export const ShootingInfoLabels: React.FC<ShootingInfoLabelsProps> = ({
  info, title, symbol, onEdit, isEditable,
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="shooting-label-grid">
      <p className="ion-no-margin ion-flex label-info">
        <b>{info.toUpperCase()}</b>
        {symbol && <span className="symbol-part">{symbol}</span>}
      </p>
      {isEditable && (
        <VscEdit onClick={onEdit} className='label-button' />
      )}
      <p className="ion-no-margin labels-title">
        {title.toUpperCase()}
      </p>
    </div>
  );
}

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
    protectedScenes: number;
  };
  permissionType?: number | null;
  updateShootingTime: (field: 'generalCall' | 'onSet' | 'estimatedWrap' | 'wrap' | 'lastOut', time: string) => void;
}

const ShootingBasicInfo: React.FC<ShootingBasicInfoProps> = ({ shootingInfo, updateShootingTime, permissionType }) => {
  const [editingField, setEditingField] = useState<'generalCall' | 'onSet' | 'estimatedWrap' | 'wrap' | 'lastOut' | null>(null);
  const [firstLocationLat, setFirstLocationLat] = useState<number | undefined>(undefined);
  const [firstLocationLng, setFirstLocationLng] = useState<number | undefined>(undefined);
  const editionModalRef = useRef<HTMLIonModalElement>(null);

  useEffect(() => {
    if (shootingInfo.locations.length > 0) {
      setFirstLocationLat(parseFloat(shootingInfo.locations[0].lat));
      setFirstLocationLng(parseFloat(shootingInfo.locations[0].lng));
    }
  }, [shootingInfo.locations]);

  const handleEdit = (field: 'generalCall' | 'onSet' | 'estimatedWrap' | 'wrap' | 'lastOut') => {
    setEditingField(field);
    if (editionModalRef.current) {
      editionModalRef.current.present();
    }
  };

  const handleEdition = (formData: { time: string }) => {
    if (editingField) {
      console.log('formData', formData);
      updateShootingTime(editingField, formData.time);
    }
    setEditingField(null);
  };

  const editionInputs = [
    {
      fieldKeyName: 'time',
      label: 'Time',
      placeholder: 'Enter time',
      type: 'time',
      required: true,
      offset: '3'
    },
  ];

  const renderEditableField = (field: 'generalCall' | 'onSet' | 'estimatedWrap' | 'wrap' | 'lastOut', value: string, title: string, withSymbol: boolean) => {
    const { main, symbol } = separateTimeOrPages(value);

    return (
      <ShootingInfoLabels
        info={withSymbol ? main : value}
        symbol={withSymbol ? symbol : ''}
        title={title}
        onEdit={() => handleEdit(field)}
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
              {renderEditableField('generalCall', getHourMinutesFomISO(shootingInfo.generalCall, true), 'General Call', false)}
            </IonCol>
            <IonCol size="12" className="ion-padding">
              {renderEditableField('onSet', getHourMinutesFomISO(shootingInfo.onSet, true), 'Ready to Shoot', false)}
            </IonCol>
            <IonCol size="12" className="ion-padding">
              {renderEditableField('estimatedWrap', (getHourMinutesFomISO(shootingInfo.estimatedWrap, true)), 'Estimated Wrap', false)}
            </IonCol>
          </IonRow>
          <IonRow className='weather-container'>
            <IonCol size="12" className="ion-padding">
              <p className="bold">NO WEATHER AVAILABLE</p>
            </IonCol>
          </IonRow>
        </IonCol>
        <IonCol size="12">
          <IonRow class="ion-justify-content-between">
            <IonCol size="auto">
              <ShootingInfoLabels info={shootingInfo.scenes.toString()} title="Scenes" />
            </IonCol>
            <IonCol size="auto">
              <ShootingInfoLabels info={shootingInfo.protectedScenes.toString()} title="Protections" />
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
      <EditionModal
        modalRef={editionModalRef}
        modalTrigger={`open-edit-time-modal-${editingField}`}
        title={`Edit ${editingField}`}
        formInputs={editionInputs}
        handleEdition={handleEdition}
        defaultFormValues={{
          time: editingField ? getHourMinutesFomISO(shootingInfo[editingField as 'generalCall' | 'onSet' | 'estimatedWrap' | 'wrap' | 'lastOut']): '',
        }}
        modalId={`edit-time-modal-${editingField}`}
      />
    </IonGrid>
  );
};

export default ShootingBasicInfo;