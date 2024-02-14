import { IonHeader, IonPage } from '@ionic/react';
import React from 'react';
import ModalToolbar from '../../components/Shared/ModalToolbar/ModalToolbar';
import useHandleBack from '../../hooks/useHandleBack';
import capitalizeString from '../../utils/capitalizeString';
import { useParams } from 'react-router';

interface SecondaryPagesLayoutProps {
  children: React.ReactNode
  resetSelections?: () => void
  saveOptions?: () => void
  pageTitle: string
  handleBack: () => void
}

const SecondaryPagesLayout: React.FC<SecondaryPagesLayoutProps> = ({
  children, resetSelections, saveOptions, pageTitle, handleBack
}) => {

  return (
    <IonPage color="tertiary">
      <IonHeader>
        <ModalToolbar toolbarTitle={capitalizeString(pageTitle)} clearOptions={resetSelections} handleBack={handleBack} saveOptions={saveOptions} />
      </IonHeader>
      {children}
    </IonPage>
  );
};

export default SecondaryPagesLayout;
