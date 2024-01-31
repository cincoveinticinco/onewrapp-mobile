import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import {
  IonButton, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar,
} from '@ionic/react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { chevronBack } from 'ionicons/icons';
import useIsMobile from '../../hooks/useIsMobile';
import SortItem from '../../components/SortScenes/SortItem';
import useHideTabs from '../../hooks/useHideTabs';
import './SortScenes.scss';
import ScenesContext, { defaultSortOptions } from '../../context/ScenesContext';
import OutlinePrimaryButton from '../../components/Shared/OutlinePrimaryButton';

const SortScenes = () => {
  const { setSortOptions } = React.useContext<any>(ScenesContext);

  const defaultSortPosibilities = [
    {
      id: 'EPISODE_NUMBER', label: 'EP NUMBER', optionKey: 'episodeNumber', defaultIndex: 0,
    },
    {
      id: 'SCENE_NUMBER', label: 'SCENE NUMBER', optionKey: 'sceneNumber', defaultIndex: 1,
    },
    {
      id: 'DAY_OR_NIGHT', label: 'DAY OR NIGHT', optionKey: 'dayOrNightOption', defaultIndex: 2,
    },
    {
      id: 'INT_OR_EXT', label: 'INT OR EXT', optionKey: 'intOrExtOption', defaultIndex: 3,
    },
    {
      id: 'LOCATION_NAME', label: 'LOCATION NAME', optionKey: 'locationName', defaultIndex: 4,
    },
    {
      id: 'SET_NAME', label: 'SET NAME', optionKey: 'setName', defaultIndex: 5,
    },
    {
      id: 'SCRIPT_DAY', label: 'SCRIPT DAY', optionKey: 'scriptDay', defaultIndex: 6,
    },
  ];

  const [sortPosibilities, setSortPosibilities] = React.useState<any[]>(() => {
    const savedOrder = localStorage.getItem('sortPosibilitiesOrder');
    if (savedOrder) {
      return JSON.parse(savedOrder);
    }
    return defaultSortPosibilities;
  });

  useEffect(() => {
    localStorage.setItem('sortPosibilitiesOrder', JSON.stringify(sortPosibilities));
  }, [sortPosibilities]);

  const history = useHistory();
  const isMobile = useIsMobile();
  useHideTabs();

  const handleBack = () => {
    history.goBack();
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(sortPosibilities);
    const [removed] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, removed);
    setSortPosibilities(items);
  };

  const handleReset = () => {
    localStorage.removeItem('sortOptions');
    localStorage.removeItem('sortPosibilitiesOrder');
    setSortPosibilities(defaultSortPosibilities);
    setSortOptions(defaultSortOptions);
  };

  return (
    <IonPage color="tertiary">
      <IonHeader>
        <IonToolbar color="tertiary" className="add-strip-toolbar">
          {!isMobile && (
            <>
              <IonButton fill="clear" color="primary" slot="start" onClick={handleBack}>
                BACK
              </IonButton>
              <IonButton fill="clear" color="primary" slot="end" onClick={handleReset}>
                RESET
              </IonButton>
            </>
          )}
          {isMobile && (
            <IonButton fill="clear" color="primary" slot="start" onClick={handleBack}>
              <IonIcon icon={chevronBack} color="light" />
            </IonButton>
          )}
          <IonTitle className="add-strip-toolbar-title">Sort By</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color="tertiary" id="sort-scenes-page">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="sortPosibilities">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}> { /* eslint-disable-line */}
                {sortPosibilities.map((sortPosibility, index) => (
                  <SortItem
                    key={sortPosibility.id}
                    sortPosibility={sortPosibility}
                    index={index}
                    setSortPosibilities={setSortPosibilities}
                    sortPosibilities={sortPosibilities}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <OutlinePrimaryButton buttonName="SORT SCENES" onClick={handleBack} />
      </IonContent>
    </IonPage>
  );
};

export default SortScenes;
