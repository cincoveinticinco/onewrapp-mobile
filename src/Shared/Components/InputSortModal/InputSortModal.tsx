import {
  IonContent, IonHeader, IonModal,
} from '@ionic/react';
import React, { useEffect, useRef } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import useIsMobile from '../../hooks/useIsMobile';
import ModalToolbar from '../ModalToolbar/ModalToolbar';
import OutlineLightButton from '../OutlineLightButton/OutlineLightButton';
import OutlinePrimaryButton from '../OutlinePrimaryButton/OutlinePrimaryButton';
import SortPosibilityCheckbox from '../SortPosibilityCheckbox/SortPosibilityCheckbox';
import './InputSortModal.scss';

interface InputSortModalProps {
  pageName: string;
  modalTrigger: string;
  clearSelections: () => void;
  defaultSortOptions: any[];
  selectedSortOptions: any[];
  setSelectedSortOptions: (array: any[]) => void;
  sortPosibilities: any[];
  setSortPosibilities: (array: any[]) => void;
}

const InputSortModal: React.FC<InputSortModalProps> = ({
  pageName,
  modalTrigger,
  clearSelections,
  defaultSortOptions,
  selectedSortOptions,
  setSelectedSortOptions,
  sortPosibilities,
  setSortPosibilities,
}) => {
  const [showReset, setShowReset] = React.useState(false);
  const modalRef = useRef<HTMLIonModalElement>(null);

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(sortPosibilities);
    const [removed] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, removed);
    setSortPosibilities(items);
  };

  const getCheckedSortOptions = () => sortPosibilities.filter((posibility) => {
    const sortOption = selectedSortOptions.find((option: any) => option[0] === posibility.optionKey);
    return sortOption;
  });

  const getNotCheckedSortOptions = () => sortPosibilities.filter((posibility) => {
    const sortOption = selectedSortOptions.find((option: any) => option[0] === posibility.optionKey);
    return !sortOption;
  });

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.dismiss();
    }
  };

  useEffect(() => {
    if (JSON.stringify(selectedSortOptions) !== JSON.stringify(defaultSortOptions)) {
      setShowReset(true);
    } else {
      setShowReset(false);
    }
  }, [selectedSortOptions]);

  return (
    <IonModal
      ref={modalRef}
      trigger={modalTrigger}
      mode="ios"
      className="sort-modal"
    >
      <IonHeader>
        <ModalToolbar
          handleSave={closeModal}
          toolbarTitle={pageName}
          handleReset={clearSelections}
          handleBack={closeModal}
          showReset={showReset}
          handleSaveName='SORT'
        />
      </IonHeader>
      <IonContent color="tertiary">
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
                    selectedSortOptions={selectedSortOptions}
                    setSelectedSortOptions={setSelectedSortOptions}
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
                selectedSortOptions={selectedSortOptions}
                setSelectedSortOptions={setSelectedSortOptions}
              />
            ))}
          </div>
        </div>
        <OutlinePrimaryButton buttonName="SORT" className="sort-scenes-button" onClick={closeModal} color='success' style={{width: '150px'}}/>
        {useIsMobile()
          && (
          <OutlineLightButton
            buttonName={showReset ? 'RESET' : 'CANCEL'}
            onClick={showReset ? clearSelections : closeModal}
            className="cancel-filter-scenes-button cancel-button"
          />
          )}
      </IonContent>
    </IonModal>
  );
};

export default InputSortModal;
