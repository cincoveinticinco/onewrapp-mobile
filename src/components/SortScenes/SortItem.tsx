import React, { useContext, useEffect } from 'react';
import './SortItem.scss';
import { Draggable } from 'react-beautiful-dnd';
import {
  IonButton, IonCheckbox, IonItem,
} from '@ionic/react';
import { LuGripHorizontal } from 'react-icons/lu';
import { PiSortAscending, PiSortDescending } from 'react-icons/pi';

import ScenesContext from '../../context/ScenesContext';

interface SortItemProps {
  sortPosibility: any;
  index: number;
  setSortPosibilities: (array: any[]) => any;
  sortPosibilities: any[];
}

const SortItem: React.FC<SortItemProps> = ({
  sortPosibility, index, setSortPosibilities, sortPosibilities,
}) => {
  const { sortOptions, setSortOptions } = useContext<any>(ScenesContext);
  const [sortOrder, setSortOrder] = React.useState<number>(0);
  const isChecked = sortOptions.some((option: any) => option[0] === sortPosibility.optionKey);

  const getInitialAscOrDesc = () => {
    const optionIndex = sortOptions.findIndex((option: any) => option[0] === sortPosibility.optionKey);

    if (optionIndex !== -1) {
      const [, ascOrDesc] = sortOptions[optionIndex];
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
      const findSortOptionIndex = () => sortOptions.findIndex((option: any) => option[0] === sortPosibility.optionKey);

      const updatedSortOptions = [...sortOptions];
      const updatedSortOptionIndex = findSortOptionIndex();

      if (updatedSortOptionIndex !== -1 && updatedSortOptions[updatedSortOptionIndex].length >= 3) {
        updatedSortOptions[updatedSortOptionIndex][2] = sortOrder || index;
        setSortOptions(updatedSortOptions);
      }
    };

    updateSortOptions();
  }, [sortOrder]);

  useEffect(() => {
    const updatedSortOptions = sortOptions.map((option: any) => {
      if (option[0] === sortPosibility.optionKey) {
        return [option[0], ascOrDesc, sortOrder];
      }
      return option;
    });
    setSortOptions(updatedSortOptions);
  }, [ascOrDesc, index]);

  const getSortOptionsLastIndex = () => sortOptions.length - 1;

  const interChangeSortOptions = (currentIndex: number, newIndex: number) => {
    const lastCheckedIndexOption = getSortOptionsLastIndex();
    const updatedSortPosibilities = [...sortPosibilities];

    updatedSortPosibilities.splice(newIndex, 0, updatedSortPosibilities.splice(currentIndex, 1)[0]);
    console.log(`currentIndex: ${currentIndex} newIndex: ${newIndex} lastCheckedIndexOption: ${lastCheckedIndexOption}`);
    setSortPosibilities(updatedSortPosibilities);
  };

  const handleCheck = (e: any) => {
    const isChecked = e.detail.checked;
    const { optionKey } = sortPosibility;

    if (isChecked) {
      interChangeSortOptions(index, getSortOptionsLastIndex() + 1);
      setSortOptions([...sortOptions, [optionKey, ascOrDesc, sortOrder]]);
    } else if (sortPosibility.defaultIndex > getSortOptionsLastIndex()) {
      const newSortOptions = sortOptions.filter((option: any) => option[0] !== optionKey);
      interChangeSortOptions(index, sortPosibility.defaultIndex);
      setSortOptions(newSortOptions);
    } else if (sortPosibility.defaultIndex <= getSortOptionsLastIndex()) {
      const newSortOptions = sortOptions.filter((option: any) => option[0] !== optionKey);
      interChangeSortOptions(index, getSortOptionsLastIndex());
      setSortOptions(newSortOptions);
    }

    console.log(sortPosibilities);
  };

  const filterIsChecked = (optionKey: string) => sortOptions.some((option: any) => option[0] === optionKey);

  const toggleAscOrDesc = () => {
    if (filterIsChecked(sortPosibility.optionKey)) {
      setAscOrDesc(ascOrDesc === 'desc' ? 'asc' : 'desc');
    }
  };

  const getAscOrDescClass = (orderOption: string) => {
    const optionIndex = sortOptions.findIndex((option: any) => option[0] === sortPosibility.optionKey);

    if (optionIndex !== -1) {
      const [, ascOrDesc] = sortOptions[optionIndex];
      return ascOrDesc === orderOption ? 'yellow' : 'light';
    }

    return 'light';
  };

  return (
    <Draggable draggableId={sortPosibility.id} index={index} isDragDisabled={!isChecked}>
      {(provided) => (
        <div
          className="checkbox-item-option"
          ref={provided.innerRef}
          {...provided.draggableProps} // eslint-disable-line
          {...provided.dragHandleProps} // eslint-disable-line
        >
          <IonItem color="tertiary">
            <IonButton fill="clear" slot="start" color="light" className="ion-no-margin ion-no-padding">
              <LuGripHorizontal className="ion-no-padding ion-no-margin grip-sort-item-icon " />
            </IonButton>
            <IonCheckbox
              slot="start"
              labelPlacement="end"
              checked={isChecked}
              onIonChange={(e) => handleCheck(e)}
            >
              <span className="sort-item-label">
                {sortPosibility.label}
              </span>
            </IonCheckbox>
            <IonButton
              fill="clear"
              slot="end"
              className={`${getAscOrDescClass('desc')} asc-or-desc-button`}
              onClick={toggleAscOrDesc}
            >
              <PiSortDescending className="asc-or-desc-icon" />
            </IonButton>
            <IonButton
              fill="clear"
              slot="end"
              className={`${getAscOrDescClass('asc')} asc-or-desc-button`}
              onClick={toggleAscOrDesc}
            >
              <PiSortAscending className="asc-or-desc-icon" />
            </IonButton>
          </IonItem>
        </div>
      )}
    </Draggable>
  );
};

export default SortItem;
