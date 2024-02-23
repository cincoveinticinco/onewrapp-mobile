import { IonHeader, IonPage } from '@ionic/react';
import React from 'react';
import ModalToolbar from '../../components/Shared/ModalToolbar/ModalToolbar';
import capitalizeString from '../../utils/capitalizeString';

interface SecondaryPagesLayoutProps {
  children: React.ReactNode
  resetSelections?: () => void
  pageTitle: string
  handleSave: any
  showReset?: boolean
  handleSaveName?: string
  handleBack: () => void
}

const SecondaryPagesLayout: React.FC<SecondaryPagesLayoutProps> = ({
  children, resetSelections, pageTitle, handleSave, showReset = false, handleSaveName, handleBack
}) => (
  <IonPage color="tertiary">
    <IonHeader>
      <ModalToolbar handleBack={ handleBack } toolbarTitle={capitalizeString(pageTitle)} handleReset={resetSelections} handleSave={handleSave} showReset={showReset} handleSaveName={handleSaveName} />
    </IonHeader>
    {children}
  </IonPage>
);

export default SecondaryPagesLayout;
