// CrewCard.tsx
import {
  IonButton,
  IonItem,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonTitle,
} from '@ionic/react';
import React from 'react';
import { CiEdit } from 'react-icons/ci';
import { PiTrashSimpleLight } from 'react-icons/pi';
import { CrewDocType } from '../../../../Shared/types/crew.types';
import './CrewCard.scss';

interface CrewCardProps {
  crew: CrewDocType;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  permissionType?: number | null;
}

const CrewCard: React.FC<CrewCardProps> = ({
  crew, onEdit, onDelete, permissionType,
}) => {
  const disableEditions = permissionType !== 1;
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
              <p>
                Email:
                {crew.email || 'N/A'}
              </p>
              <p>
                Teléfono:
                {crew.phone || 'N/A'}
              </p>
            </IonLabel>
          </div>
        </div>
      </IonItem>
      <IonItemOptions className="crew-card-item-options">
        <div className="buttons-wrapper">
          <IonButton fill="clear" onClick={() => onEdit(crew.id || '')} disabled={disableEditions}>
            <CiEdit className="button-icon edit" />
          </IonButton>
          <IonButton fill="clear" onClick={() => onDelete(crew.id || '')} disabled={disableEditions}>
            <PiTrashSimpleLight className="button-icon trash" />
          </IonButton>
        </div>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default CrewCard;
