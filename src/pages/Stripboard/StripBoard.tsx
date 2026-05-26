import {
  IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar,
} from '@ionic/react';
import { useHistory, useParams, useRouteMatch } from 'react-router';
import AppLoader from '../../Shared/Components/loaders/AppLoader/AppLoader';
import GeneralTable from '../../Shared/Components/tables/GeneralTable/GeneralTable';
import React, { useEffect } from 'react';
import './StripBoard.scss';
import { StripboardProvider } from './Context/StripboardContext/StripboardContext';
import TableColumns from './tables/StripboardTable';
import useStripboards from '../../hooks/database/useStripboards/useStripboards';
import { CombinedStripboardType } from '../../Shared/types/stripboard.types';
import Toolbar from '../../Shared/Components/navigation/Toolbar/Toolbar';
import ToolbarButton from '../../Shared/Components/buttons/ToolbarButton/ToolbarButton';
import { addOutline } from 'ionicons/icons';
import CreateStripboardModal from './Components/CreateStripboardModal.tsx/CreateStripbordModal';

const StripboardContent: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const { stripboards, isFetching } = useStripboards({ projectId: projectId });
  const history = useHistory();
  const routeMatch = useRouteMatch()

  const [ openCreateStripboardModal, setOpenCreateStripboardModal ] = React.useState(false);

  useEffect(() => {
    console.log(stripboards);
  }, [stripboards])

  const openDetail = (stripboard: CombinedStripboardType) => {
    history.push(`${routeMatch.url}/${stripboard.id}`);
  };

  const addStripboardButton = () => {
    return (
      <ToolbarButton click={() => { setOpenCreateStripboardModal(true)}}>
        <IonIcon icon={addOutline} />
      </ToolbarButton>
    )
  }

  return (
    <IonPage color='tertiary'>
      <IonHeader>
        <Toolbar
          name='Stripboard'
          color='tertiary'
          back={true}
          customButtons={[addStripboardButton]}
        ></Toolbar>
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
        <CreateStripboardModal 
          openModal={openCreateStripboardModal}
          setOpenModal={setOpenCreateStripboardModal}
        />
      </IonContent>
    </IonPage>
  );
};

// Componente principal que envuelve todo con el Provider
const Stripboard: React.FC = () => {
  return (
    <StripboardProvider>
      <StripboardContent />
    </StripboardProvider>
  );
};

export default Stripboard;