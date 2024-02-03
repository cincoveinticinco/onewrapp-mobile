import { IonHeader, IonPage } from '@ionic/react';
import React from 'react';
import ModalToolbar from '../../components/Shared/ModalToolbar/ModalToolbar';
import useHandleBack from '../../hooks/useHandleBack';

interface SecondaryPagesLayoutProps {
  children: React.ReactNode
  resetSelections?: () => void
  saveOptions?: () => void
}

const SecondaryPagesLayout: React.FC<SecondaryPagesLayoutProps> = ({ children, resetSelections, saveOptions }) => {
  const handleBack = useHandleBack();

  return (
    <IonPage color="tertiary">
      <IonHeader>
        <ModalToolbar toolbarTitle="Filter" clearOptions={resetSelections} handleBack={handleBack} saveOptions={saveOptions} />
      </IonHeader>
      {children}
    </IonPage>
  );
};

export default SecondaryPagesLayout;
