import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import {
  IonContent,
} from '@ionic/react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import SortPosibilityCheckbox from '../../components/SortScenes/SortPosibilityCheckbox';
import useHideTabs from '../../hooks/useHideTabs';
import './SortScenes.scss';
import ScenesContext, { defaultSortOptions } from '../../context/ScenesContext';
import OutlinePrimaryButton from '../../components/Shared/OutlinePrimaryButton/OutlinePrimaryButton';
import SecondaryPagesLayout from '../../Layouts/SecondaryPagesLayout/SecondaryPagesLayout';

const SortScenes = () => {
  const { selectedSortOptions, setSelectedSortOptions } = React.useContext<any>(ScenesContext);

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
    localStorage.removeItem('selectedSortOptions');
    localStorage.removeItem('sortPosibilitiesOrder');
    setSortPosibilities(defaultSortPosibilities);
    setSelectedSortOptions(defaultSortOptions);
  };

  const getCheckedSortOptions = () => sortPosibilities.filter((posibility) => {
    const sortOption = selectedSortOptions.find((option: any) => option[0] === posibility.optionKey);
    return sortOption;
  });

  const getNotCheckedSortOptions = () => sortPosibilities.filter((posibility) => {
    const sortOption = selectedSortOptions.find((option: any) => option[0] === posibility.optionKey);
    return !sortOption;
  });

  return (
    <SecondaryPagesLayout resetSelections={handleReset} pageTitle='SORT BY'>
      <IonContent color="tertiary" id="sort-scenes-page">
        <div className="sort-options-wrapper">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="sortPosibilities">
              {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}> { /* eslint-disable-line */}
                {getCheckedSortOptions().map((sortPosibility, index) => (
                  <SortPosibilityCheckbox
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
          <div className="sort-scenes-divider">
            {getNotCheckedSortOptions().map((sortPosibility, index) => (
              <SortPosibilityCheckbox
                key={sortPosibility.id}
                sortPosibility={sortPosibility}
                index={index + getCheckedSortOptions().length}
                setSortPosibilities={setSortPosibilities}
                sortPosibilities={sortPosibilities}
              />
            ))}
          </div>
        </div>
        <OutlinePrimaryButton buttonName="SORT SCENES" className="sort-scenes-button" onClick={handleBack} />
      </IonContent>
    </SecondaryPagesLayout>
  );
};

export default SortScenes;
