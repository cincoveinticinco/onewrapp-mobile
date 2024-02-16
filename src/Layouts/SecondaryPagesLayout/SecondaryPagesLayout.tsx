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
  handleConfirm: () => void
}

const SecondaryPagesLayout: React.FC<SecondaryPagesLayoutProps> = ({
  children, resetSelections, saveOptions, pageTitle, handleConfirm
}) => {

  return (
    <IonPage color="tertiary">
      <IonHeader>
        <ModalToolbar toolbarTitle={capitalizeString(pageTitle)} clearOptions={resetSelections} handleConfirm={handleConfirm}/>
      </IonHeader>
      {children}
    </IonPage>
  );
};

export default SecondaryPagesLayout;
