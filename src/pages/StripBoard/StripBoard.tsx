import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
} from '@ionic/react';
import { useHistory, useParams, useRouteMatch } from 'react-router';
import AppLoader from '../../Shared/Components/loaders/AppLoader/AppLoader';
import GeneralTable from '../../Shared/Components/tables/GeneralTable/GeneralTable';
import React, { useEffect } from 'react';
import './StripBoard.scss';
import { StripboardProvider } from './context/StripboardContext/StripboardContext';
import TableColumns from './tables/StripboardTable';
import useStripboards from '../../hooks/database/useStripboards/useStripboards';
import { CombinedStripboardType } from '../../Shared/types/stripboard.types';

const StripBoardContent: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const { stripboards, isFetching } = useStripboards({ projectId: projectId });
  const history = useHistory();
  const routeMatch = useRouteMatch()

  useEffect(() => {
    console.log(stripboards);
  }, [stripboards])

  const openDetail = (stripboard: CombinedStripboardType) => {
    history.push(`${routeMatch.url}/${stripboard.id}`);
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