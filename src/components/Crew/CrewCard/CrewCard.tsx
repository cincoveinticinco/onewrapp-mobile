// CrewCard.tsx
import React from 'react';
import {
  IonItemSliding,
  IonItemOptions,
  IonButton,
  IonItem,
  IonLabel,
  IonTitle,
} from '@ionic/react';
import { Crew } from '../../../interfaces/crew.types';
import { CiEdit } from 'react-icons/ci';
import { PiProhibitLight, PiTrashSimpleLight } from 'react-icons/pi';
import './CrewCard.scss';

interface CrewCardProps {
  crew: Crew;
  onEdit: (id: string) => void;
  onDelete: () => void;
}

const CrewCard: React.FC<CrewCardProps> = ({ crew, onEdit, onDelete }) => {
  return (
    <IonItemSliding>
      <IonItem mode="md" className="crew-card ion-no-margin ion-no-padding ion-nowrap" color="tertiary">
        <div className="crew-card-wrapper">
          <div className="crew-card-header">
            <IonTitle className="crew-card-header-title">
              {crew.fullName}
            </IonTitle>
            <p className="crew-card-header-subtitle">
              {crew.positionEsp || 'Sin posición'}
            </p>
          </div>
          <div className="crew-card-content">
            <IonLabel>
              <p>Email: {crew.email || 'N/A'}</p>
              <p>Teléfono: {crew.phone || 'N/A'}</p>
            </IonLabel>
          </div>
        </div>
      </IonItem>
      <IonItemOptions className="crew-card-item-options">
        <div className="buttons-wrapper">
          <IonButton fill="clear" onClick={() => onEdit(crew.id)}>
            <CiEdit className="button-icon edit" />
          </IonButton>
          <IonButton fill="clear" onClick={onDelete}>
            <PiTrashSimpleLight className="button-icon trash" />
          </IonButton>
        </div>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default CrewCard;
