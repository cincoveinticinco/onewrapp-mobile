import {
  IonButton, IonIcon, IonTitle, IonToolbar,
} from '@ionic/react';
import React from 'react';
import { chevronBack } from 'ionicons/icons';
import useIsMobile from '../../../hooks/useIsMobile';
import './ModalToolbar.scss';

interface ModalToolbarProps {
  clearOptions?: () => void
  handleConfirm: () => void
  toolbarTitle: string
  saveOptions?: () => void
}

const ModalToolbar: React.FC<ModalToolbarProps> = (
  {
    clearOptions,
    handleConfirm,
    toolbarTitle,
    saveOptions,
  },
) => {
  const isMobile = useIsMobile();

  return (
    <IonToolbar color="tertiary" id="modal-toolbar" className="ion-no-padding">
      <>
        <IonButton fill="clear" color="primary" slot="end" onClick={handleConfirm}>
          CONFIRM
        </IonButton>
      </>

      {
        isMobile
        && (
          <IonButton fill="clear" color="primary" slot="start" onClick={clearOptions}>
            <IonIcon icon={chevronBack} color="light" />
          </IonButton>
        )
      }
      <IonTitle className="modal-toolbar-title">
        {toolbarTitle.toUpperCase()}
      </IonTitle>

      {
        !isMobile
        && clearOptions
        && (
        <IonButton
          fill="clear"
          color="primary"
          slot={isMobile ? 'end' : 'start'}
          onClick={clearOptions}
          className="cancel-button"
        >
          CANCEL
        </IonButton>
        )
      }
      {
        saveOptions
        && (
        <IonButton fill="clear" color="primary" slot="end" onClick={saveOptions}>
          SAVE
        </IonButton>
        )
      }

    </IonToolbar>
  );
};

export default ModalToolbar;
