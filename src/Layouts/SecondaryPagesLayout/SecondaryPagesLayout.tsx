import { IonHeader, IonPage } from '@ionic/react';
import React from 'react';
import ModalToolbar from '../../components/Shared/ModalToolbar/ModalToolbar';
import capitalizeString from '../../utils/capitalizeString';

interface SecondaryPagesLayoutProps {
  children: React.ReactNode
  resetSelections?: () => void
  saveOptions?: () => void
  pageTitle: string
  handleConfirm: any
}

const SecondaryPagesLayout: React.FC<SecondaryPagesLayoutProps> = ({
  children, resetSelections, saveOptions, pageTitle, handleConfirm,
}) => (
  <IonPage color="tertiary">
    <IonHeader>
      <ModalToolbar toolbarTitle={capitalizeString(pageTitle)} clearOptions={resetSelections} handleConfirm={handleConfirm} />
    </IonHeader>
    {children}
  </IonPage>
);

export default SecondaryPagesLayout;
