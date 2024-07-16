import React, { useState } from 'react';
import { IonCol, IonGrid, IonRow, IonInput, IonButton, IonIcon } from '@ionic/react';
import { VscEdit } from 'react-icons/vsc';
import { saveOutline } from 'ionicons/icons';

interface ShootingInfoLabelsProps {
  info: string;
  title: string;
  symbol?: string;
  onEdit?: () => void;
  isEditable?: boolean;
}

const ShootingInfoLabels: React.FC<ShootingInfoLabelsProps> = ({ info, title, symbol, onEdit, isEditable }) => (
  <div className="ion-flex-column" style={{ textAlign: 'center', height: '100%', justifyContent: 'center', position: 'relative' }}>
    <p className="ion-no-margin" style={{ fontSize: '16px', display: 'flex', justifyContent: 'center', width: '100%' }}>
      <b>{info.toUpperCase()}</b>
      {symbol && <span className="symbol-part" style={{ fontSize: '14px', fontWeight: 'bold' }}>{symbol}</span>}
    </p>
    <p className="ion-no-margin" style={{ fontSize: '12px'}}>
      {title.toUpperCase()}
      {isEditable && (
        <VscEdit 
          onClick={onEdit} 
          style={{ cursor: 'pointer', color: 'var(--ion-color-primary)', position: 'absolute', right: '12px', top: '0' }} 
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
  };
  updateShootingTime: (field: 'generalCall' | 'onSet' | 'estimatedWrap' | 'wrap' | 'lastOut', time: { hours: string; minutes: string }) => void;
}

const ShootingBasicInfo: React.FC<ShootingBasicInfoProps> = ({ shootingInfo, updateShootingTime }) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [time, setTime] = useState('');

  const separateTimeOrPages = (value: string): { main: string; symbol: string } => {
    const [main, symbol] = value.split(/[:.\/]/);
    return { main: main || '--', symbol: symbol ? (value.includes(':') ? `:${symbol}` : `/${symbol}`) : '' };
  };

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
      minutes: minutes.padStart(2, '0')
    });
    setEditingField(null);
  }
};

  const renderEditableField = (field: 'generalCall' | 'onSet' | 'estimatedWrap' | 'wrap' | 'lastOut', value: string, title: string) => {
    const { main, symbol } = separateTimeOrPages(value);
    
    if (editingField === field) {
      return (
        <div className='editable-form-wrapper'>
          <div className='inputs-wrapper'>
            <IonInput
              type="time"
              value={time}
              onIonChange={handleTimeChange}
              style={{ display: 'inline-block', width: '80%' }}
              autoFocus
            />
            <IonButton fill='clear' onClick={handleSave} size="small">
              <IonIcon icon={saveOutline} />
            </IonButton>
          </div>
        </div>
      );
    }

    return (
      <ShootingInfoLabels 
        info={main} 
        symbol={symbol}
        title={title} 
        onEdit={() => handleEdit(field as any, value)}
        isEditable={true}
      />
    );
  };

  return (
    <IonGrid fixed style={{ width: '100%' }}>
      <IonRow>
        <IonCol size="6" size-sm="3">
          {renderEditableField('generalCall', shootingInfo.generalCall, 'General Call')}
        </IonCol>
        <IonCol size="6" size-sm="3">
          {renderEditableField('onSet', shootingInfo.onSet, 'Ready to Shoot')}
        </IonCol>
        <IonCol size="6" size-sm="3">
          {renderEditableField('estimatedWrap', shootingInfo.estimatedWrap, 'Estimated Wrap')}
        </IonCol>
        <IonCol size="6" size-sm="3">
          {renderEditableField('wrap', shootingInfo.wrap, 'Wrap')}
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size="6" size-sm="3">
          {renderEditableField('lastOut', shootingInfo.lastOut, 'Last Out')}
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