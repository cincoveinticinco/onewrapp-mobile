import React, { useContext, useEffect } from 'react';
import './SortPosibilityCheckbox.scss';
import { Draggable } from 'react-beautiful-dnd';
import {
  IonButton, IonCheckbox, IonItem,
} from '@ionic/react';
import { LuGripHorizontal } from 'react-icons/lu';
import { PiSortAscending, PiSortDescending } from 'react-icons/pi';

import ScenesContext from '../../../context/ScenesContext';

interface SortPosibilityCheckboxProps {
  sortPosibility: any;
  index: number;
  setSortPosibilities: (array: any[]) => any;
  sortPosibilities: any[];
  selectedSortOptions: any[];
  setSelectedSortOptions: (array: any[]) => any;
}

const SortPosibilityCheckbox: React.FC<SortPosibilityCheckboxProps> = ({
  sortPosibility, index, setSortPosibilities, sortPosibilities, selectedSortOptions, setSelectedSortOptions,
}) => {
  const [sortOrder, setSortOrder] = React.useState<number>(0);
  const isChecked = selectedSortOptions.some((option: any) => option[0] === sortPosibility.optionKey);

  const getInitialAscOrDesc = () => {
    const optionIndex = selectedSortOptions.findIndex((option: any) => option[0] === sortPosibility.optionKey);

    if (optionIndex !== -1) {
      const [, ascOrDesc] = selectedSortOptions[optionIndex];
      return ascOrDesc;
    }

    return 'asc';
  };

  const [ascOrDesc, setAscOrDesc] = React.useState<string>(getInitialAscOrDesc());

  useEffect(() => {
    setSortOrder(index);
  }, [index]);

  useEffect(() => {
    const updateSortOptions = () => {
      const findSortOptionIndex = () => selectedSortOptions.findIndex((option: any) => option[0] === sortPosibility.optionKey);

      const updatedSortOptions = [...selectedSortOptions];
      const updatedSortOptionIndex = findSortOptionIndex();

      if (updatedSortOptionIndex !== -1 && updatedSortOptions[updatedSortOptionIndex].length >= 3) {
        updatedSortOptions[updatedSortOptionIndex][2] = sortOrder || index;
        setSelectedSortOptions(updatedSortOptions);
      }
    };

    updateSortOptions();
  }, [sortOrder]);

  useEffect(() => {
    const updatedSortOptions = selectedSortOptions.map((option: any) => {
      if (option[0] === sortPosibility.optionKey) {
        return [option[0], ascOrDesc, sortOrder];
      }
      return option;
    });
    setSelectedSortOptions(updatedSortOptions);
  }, [ascOrDesc, index]);

  const getSortOptionsLastIndex = () => selectedSortOptions.length - 1;

  const interChangeSortOptions = (currentIndex: number, newIndex: number) => {
    const updatedSortPosibilities = [...sortPosibilities];

    updatedSortPosibilities.splice(newIndex, 0, updatedSortPosibilities.splice(currentIndex, 1)[0]);
    setSortPosibilities(updatedSortPosibilities);
  };

  const handleCheck = (e: any) => {
    const isChecked = e.detail.checked;
    const { optionKey } = sortPosibility;

    if (isChecked) {
      interChangeSortOptions(index, getSortOptionsLastIndex() + 1);
      setSelectedSortOptions([...selectedSortOptions, [optionKey, ascOrDesc, sortOrder]]);
    } else if (sortPosibility.defaultIndex > getSortOptionsLastIndex()) {
      const newSortOptions = selectedSortOptions.filter((option: any) => option[0] !== optionKey);
      interChangeSortOptions(index, sortPosibility.defaultIndex);
      setSelectedSortOptions(newSortOptions);
    } else if (sortPosibility.defaultIndex <= getSortOptionsLastIndex()) {
      const newSortOptions = selectedSortOptions.filter((option: any) => option[0] !== optionKey);
      interChangeSortOptions(index, getSortOptionsLastIndex());
      setSelectedSortOptions(newSortOptions);
    }
  };

  const filterIsChecked = (optionKey: string) => selectedSortOptions.some((option: any) => option[0] === optionKey);

  const toggleAscOrDesc = () => {
    if (filterIsChecked(sortPosibility.optionKey)) {
      setAscOrDesc(ascOrDesc === 'desc' ? 'asc' : 'desc');
    }
  };

  const getAscOrDescClass = (orderOption: string) => {
    const optionIndex = selectedSortOptions.findIndex((option: any) => option[0] === sortPosibility.optionKey);

    if (optionIndex !== -1) {
      const [, ascOrDesc] = selectedSortOptions[optionIndex];
      return ascOrDesc === orderOption ? 'yellow' : 'light';
    }

    return 'light';
  };

  return isChecked ? (
    <Draggable
      draggableId={sortPosibility.id}
      index={index}
    >
      {(provided) => (
        <div
          className="checkbox-item-option"
          ref={provided.innerRef}
          {...provided.draggableProps}  // eslint-disable-line
          {...provided.dragHandleProps} // eslint-disable-line
        >
          <IonItem color="tertiary">
            <IonButton fill="clear" slot="start" color="light" className="ion-no-margin ion-no-padding">
              <LuGripHorizontal className="ion-no-padding ion-no-margin grip-sort-item-icon" />
            </IonButton>
            <IonCheckbox
              slot="start"
              labelPlacement="end"
              checked={isChecked}
              onIonChange={(e) => handleCheck(e)}
            >
              <span className="sort-item-label">
                {sortPosibility.label.toUpperCase()}
              </span>
            </IonCheckbox>
            <IonButton
              fill="clear"
              slot="end"
              className={`${getAscOrDescClass('desc')} asc-or-desc-button ion-no-padding ion-no-margin`}
              onClick={toggleAscOrDesc}
            >
              <PiSortDescending className="asc-or-desc-icon" />
            </IonButton>
            <IonButton
              fill="clear"
              slot="end"
              className={`${getAscOrDescClass('asc')} asc-or-desc-button ion-no-padding ion-no-margin`}
              onClick={toggleAscOrDesc}
            >
              <PiSortAscending className="asc-or-desc-icon" />
            </IonButton>
          </IonItem>
        </div>
      )}
    </Draggable>
  ) : (
    <div className="checkbox-item-option">
      <IonItem color="tertiary">
        <IonButton fill="clear" slot="start" color="light" className="ion-no-margin ion-no-padding" disabled>
          <LuGripHorizontal className="ion-no-padding ion-no-margin grip-sort-item-icon " />
        </IonButton>
        <IonCheckbox
          slot="start"
          labelPlacement="end"
          checked={isChecked}
          onIonChange={(e) => handleCheck(e)}
        >
          <span className="sort-item-label">
            {sortPosibility.label.toUpperCase()}
          </span>
        </IonCheckbox>
      </IonItem>
    </div>
  );
};

export default SortPosibilityCheckbox;
