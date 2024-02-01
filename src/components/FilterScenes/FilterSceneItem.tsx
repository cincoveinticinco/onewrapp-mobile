import React, { useState } from 'react';
import {
  IonButton, IonCheckbox, IonCol, IonContent, IonHeader, IonIcon, IonItem,
  IonList, IonModal, IonRow, IonSearchbar, IonTitle, IonToolbar,
} from '@ionic/react';
import { chevronBack, chevronForward, trash } from 'ionicons/icons';
import ScenesContext from '../../context/ScenesContext';
import './FilterSceneItem.scss';
import useIsMobile from '../../hooks/useIsMobile';
import OutlinePrimaryButton from '../Shared/OutlinePrimaryButton/OutlinePrimaryButton';
import OutlineLightButton from '../Shared/OutlineLightButton/OutlineLightButton';
import ModalSearchBar from '../Shared/ModalSearchBar/ModalSearchBar';
import ModalToolbar from '../Shared/ModalToolbar/ModalToolbar';

interface FilterSceneItemProps {
  filterName: string;
  listOfFilters: string[];
  handleSingleFilterOption?: (category: string, optionValue: string) => void;
  handleNestedFilterOption?: (category: string, nestedKey: string, optionValue: string) => void;
  optionKey: string;
  nestedKey?: string;
}

const FilterSceneItem: React.FC<FilterSceneItemProps> = ({
  filterName,
  listOfFilters,
  handleSingleFilterOption = () => {},
  handleNestedFilterOption = () => {},
  optionKey,
  nestedKey = null,
}) => {
  const modalRef = React.useRef<HTMLIonModalElement>(null);
  const isMobile = useIsMobile();
  const [searchText, setSearchText] = useState('');
  const { filterOptions, setFilterOptions } = React.useContext<any>(ScenesContext);

  const removeNumberAndDot = (selectedOption: string) => {
    const numberAndDotPart = selectedOption.match(/^[0-9]+\./)?.[0] || '';
    const restPart = selectedOption.replace(numberAndDotPart, '');
    return numberAndDotPart ? restPart.trim() : selectedOption.trim();
  };

  const getCheckedOptions = () => {
    const result = filterOptions[optionKey];

    if (result && !nestedKey) {
      return result;
    } if (Array.isArray(result) && result && nestedKey) {
      const nestedResult = result.find((item: any) => item[nestedKey]);
      return nestedResult && nestedResult[nestedKey];
    }

    return [];
  };

  const checkedOptions = getCheckedOptions() || [];

  const isFilterOptionChecked = (option: string) => checkedOptions.includes(removeNumberAndDot(option));

  const handleCheckboxToggle = (option: string) => {
    if (nestedKey && handleNestedFilterOption) {
      handleNestedFilterOption(optionKey, nestedKey, removeNumberAndDot(option));
    } else if (handleSingleFilterOption) {
      handleSingleFilterOption(optionKey, option);
    }
  };

  const clearFilterOptions = () => {
    setFilterOptions((prev: any) => { 
        const newFilterOptions = {
          ...prev,
          [optionKey]: [],
        };

        delete newFilterOptions[optionKey];

        return newFilterOptions;
    })
  };

  const capitalizeString = (str: string): string => {
    const words = str.split(' ') || [];
    const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    return capitalizedWords.join(' ');
  };

  const handleBack = () => {
    if (modalRef.current) {
      modalRef.current.dismiss();
    }
  };

  const filteredFiltersOptions = listOfFilters.filter((option) => removeNumberAndDot(option.toUpperCase()).includes(searchText.toUpperCase()));
  const uncheckedfilteredFiltersOptions = filteredFiltersOptions.filter((option) => !isFilterOptionChecked(option));
  const checkedFiltersOptions = listOfFilters.filter((option) => isFilterOptionChecked(option));

  return (
    <IonRow className="ion-padding-start ion-padding-end filters-items-rows">
      <IonCol size-xs="10" size-sm="10" size-lg="11" size-xl="11" className="ion-flex ion-align-items-center ion-no-margin ion-no-padding">
        <p className="ion-flex ion-align-items-center ion-no-margin filter-scene-item-title">
          {filterName}
        </p>
      </IonCol>
      <IonCol size-xs="2" size-sm="2" size-lg="1" size-xl="1" className="ion-no-margin ion-no-padding ion-flex ion-justify-content-end">
        <IonButton
          id={`open-${filterName.toLowerCase().split(' ').join('-')}-modal`}
          fill="clear"
          color="light"
          className="ion-no-margin ion-no-padding"
        >
          {
            checkedOptions.length === 0 ? (
              <p className="ion-no-margin ion-no-padding">View All</p>
            ) : (
              <p
                className="ion-no-margin ion-no-padding"
                style={{ color: 'var(--ion-color-primary)' }}
              >
                {checkedOptions.map((option: string, i: number) => (
                  <span key={`checked-option-${i}`}>
                    {i > 0 && ', '}
                    {capitalizeString(option)}
                  </span>
                ))}
              </p>
            )
          }
          <IonIcon color={checkedOptions.length > 0 ? 'primary' : 'light'} icon={chevronForward} />
        </IonButton>
      </IonCol>
      <IonModal
        ref={modalRef}
        trigger={`open-${filterName.toLowerCase().split(' ').join('-')}-modal`}
        className="filter-items-modal"
      >
        <IonHeader>
          <ModalToolbar handleBack={handleBack} toolbarTitle={filterName} clearOptions={clearFilterOptions} />
        </IonHeader>
        <IonContent color="tertiary">
          <ModalSearchBar searchText={searchText} setSearchText={setSearchText} />
          {uncheckedfilteredFiltersOptions.length === 0 ? (
            <p className="no-items-message">
              {`There are no coincidences with "${searchText}". Do you want to create a `}
              <a style={{ marginLeft: '6px' }} href="/">New One</a>
              {' '}
              ?
              CONFIRM
              CANCEL
            </p>
          ) : (
            <>
              <IonList color="tertiary" className="ion-no-padding ion-margin filters-options-list">
              {checkedOptions && checkedFiltersOptions.map((option: string, i: number) => (
                  <IonItem
                    color="tertiary"
                    key={`filter-item-${i}`}
                    className="checkbox-item-option filter-item ion-no-margin ion-no-padding"
                  >
                    <IonCheckbox
                      slot="start"
                      className="ion-no-margin ion-no-padding"
                      labelPlacement="end"
                      onClick={() => handleCheckboxToggle(option)}
                      checked={isFilterOptionChecked(option)}
                    >
                      {option.toUpperCase()}
                    </IonCheckbox>
                  </IonItem>
                ))}
                {uncheckedfilteredFiltersOptions.map((option: string, i: number) => (
                  <IonItem
                    color="tertiary"
                    key={`filter-item-${i}`}
                    className="checkbox-item-option filter-item ion-no-margin ion-no-padding"
                  >
                    <IonCheckbox
                      slot="start"
                      className="ion-no-margin ion-no-padding"
                      labelPlacement="end"
                      onClick={() => handleCheckboxToggle(option)}
                      checked={isFilterOptionChecked(option)}
                    >
                      {option.toUpperCase()}
                    </IonCheckbox>
                  </IonItem>
                ))}
              </IonList>
              <OutlinePrimaryButton 
                buttonName="CONFIRM" 
                onClick={handleBack} 
                className="ion-margin"
                style={isMobile ? {margin: '16px'} : {margin: '20% auto auto auto'}}
              />
              {isMobile && <OutlineLightButton buttonName="CANCEL" onClick={handleBack} className="ion-margin" />}
            </>
          )}
        </IonContent>
      </IonModal>
    </IonRow>
  );
};

export default FilterSceneItem;
