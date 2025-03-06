import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
} from '@ionic/react';
import { useParams } from 'react-router';
import useStripboards, { CombinedStripboardType } from '../../hooks/database/useStripboards/useStripboards';
import AppLoader from '../../Shared/Components/loaders/AppLoader/AppLoader';
import GeneralTable, { Column } from '../../Shared/Components/tables/GeneralTable/GeneralTable';
import React, { useContext } from 'react';
import './StripBoard.scss';
import StripboardModal from './components/StripboardModal/StripboardModal';
import { StripboardContext, StripboardProvider } from './context/StripboardContext/StripboardContext';
import DisplayOptionsModal from './components/DisplayOptionsModal/DisplayOptionsModal';
import TableColumns from './tables/StripboardTable';

const StripBoardContent: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const { stripboards, isFetching } = useStripboards({ projectId: projectId });
  
  const { 
    setDetailIsOpen, 
    setSelectedStripboard,
    selectedStripboard 
  } = useContext(StripboardContext);

  const openDetail = (stripboard: CombinedStripboardType) => {
    setSelectedStripboard(stripboard);
    setDetailIsOpen(true);
  };
  
  return (
    <IonPage color='tertiary'>
      <IonHeader>
        <IonToolbar color="tertiary">
          <IonTitle>STRIPBOARD</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color="tertiary" fullscreen>
        { isFetching ? (
          <AppLoader />
        ) : (
          <GeneralTable
            data={stripboards.sort((a, b) => (a.startDate ?? '').localeCompare(b.startDate ?? ''))}
            columns={TableColumns}
            rowClick={openDetail}
          />
        )}
      </IonContent>
      {selectedStripboard && (
        <StripboardModal 
          scenes={structuredClone(selectedStripboard.scenes) || []} 
          scenesNotIncluded={selectedStripboard.scenesNotIncluded || []}
        />
      )}
      <DisplayOptionsModal />
    </IonPage>
  );
};

// Componente principal que envuelve todo con el Provider
const StripBoard: React.FC = () => {
  return (
    <StripboardProvider>
      <StripBoardContent />
    </StripboardProvider>
  );
};

export default StripBoard;