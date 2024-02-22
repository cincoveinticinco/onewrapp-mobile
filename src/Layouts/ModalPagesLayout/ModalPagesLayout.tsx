import { IonHeader, IonModal } from '@ionic/react';
import React, { useRef } from 'react';
import ModalToolbar from '../../components/Shared/ModalToolbar/ModalToolbar';

interface ModalPagesLayoutProps {
  children: React.ReactNode
  modalId: string
  modalTrigger: string
  clearModalSelections: () => void
  modalTitle: string
}

const ModalPagesLayout: React.FC<ModalPagesLayoutProps> = ({
  children, modalId, modalTrigger, clearModalSelections, modalTitle,
}) => {
  const modalRef = useRef<HTMLIonModalElement>(null);

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.dismiss();
    }
  };

  return (
    <IonModal
      ref={modalRef}
      trigger={modalTrigger}
      id={modalId}
    >
      <IonHeader>
        <ModalToolbar
          handleConfirm={closeModal}
          toolbarTitle={modalTitle}
          handleReset={clearModalSelections}
        />
      </IonHeader>
      {children}
    </IonModal>
  );
};

export default ModalPagesLayout;
