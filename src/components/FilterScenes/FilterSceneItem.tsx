import React, { useState } from 'react';
import {
  IonButton, IonCheckbox, IonCol, IonContent, IonHeader, IonIcon, IonItem,
  IonList, IonModal, IonRow, IonSearchbar, IonTitle, IonToolbar,
} from '@ionic/react';
import { chevronBack, chevronForward, trash } from 'ionicons/icons';
import ScenesFiltersContext from '../../context/scenesFiltersContext';
import './FilterSceneItem.scss';
import useIsMobile from '../../hooks/useIsMobile';
import HighlightedFilterNames from './HighlightedFilterNames';
import OutlinePrimaryButton from '../Shared/OutlinePrimaryButton';
import OutlineLightButton from '../Shared/OutlineLightButton';

interface FilterSceneItemProps {
  itemOption: string;
  filterNames: string[];
  handleOptionToggle?: (category: string, optionValue: string) => void;
  handleNestedOptionToggle?: (category: string, nestedKey: string, optionValue: string) => void;
  optionKey: string;
  nestedKey?: string;
}

const FilterSceneItem: React.FC<FilterSceneItemProps> = ({
  itemOption,
  filterNames,
  handleOptionToggle = () => {},
  handleNestedOptionToggle = () => {},
  optionKey,
  nestedKey = null,
}) => {
  const modalRef = React.useRef<HTMLIonModalElement>(null);
  const isMobile = useIsMobile();
  const [searchText, setSearchText] = useState('');
  const { filterOptions, setFilterOptions } = React.useContext<any>(ScenesFiltersContext);

  const removeNumberAndDot = (selectedOption: string) => {
    const numberAndDotPart = selectedOption.match(/^[0-9]+\./)?.[0] || '';
    const restPart = selectedOption.replace(numberAndDotPart, '');
    return numberAndDotPart ? restPart.trim() : selectedOption.trim();
  };

  const getCheckedOptions = () => {
    const result = filterOptions[optionKey];

    if (result && !nestedKey) {
      return result;
    } if (Array.isArray(result) && result[0] && nestedKey) {
      return result[0][nestedKey];
    }

    return [];
  };

  const checkedOptions = getCheckedOptions() || [];

  const isFilterOptionChecked = (option: string) => checkedOptions.includes(removeNumberAndDot(option));

  const handleCheckboxToggle = (option: string) => {
    if (nestedKey && handleNestedOptionToggle) {
      handleNestedOptionToggle(optionKey, nestedKey, removeNumberAndDot(option));
    } else if (handleOptionToggle) {
      handleOptionToggle(optionKey, option);
    }
  };

  const clearFilterOptions = () => {
    setFilterOptions((prev: any) => {
      const { [optionKey]: unused_, ...newOptions } = prev;
      return newOptions;
    });
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

  const filteredItemsOptions = filterNames.filter((option) => removeNumberAndDot(option.toUpperCase()).includes(searchText.toUpperCase()));

  return (
    <IonRow className="ion-padding-start ion-padding-end filters-items-rows">
      <IonCol size-xs="10" size-sm="10" size-lg="11" size-xl="11" className="ion-flex ion-align-items-center ion-no-margin ion-no-padding">
        <p className="ion-flex ion-align-items-center ion-no-margin">
          {itemOption}
        </p>
      </IonCol>
      <IonCol size-xs="2" size-sm="2" size-lg="1" size-xl="1" className="ion-no-margin ion-no-padding ion-flex ion-justify-content-end">
        <IonButton
          id={`open-${itemOption.toLowerCase().split(' ').join('-')}-modal`}
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
        trigger={`open-${itemOption.toLowerCase().split(' ').join('-')}-modal`}
        className="filter-items-modal"
      >
        <IonHeader>
          <IonToolbar color="tertiary" className="add-strip-toolbar ion-no-padding">
            {
              !isMobile
              && (
                <>
                  <IonButton fill="clear" color="primary" slot="start" onClick={handleBack}>
                    BACK
                  </IonButton>
                  <IonButton
                    fill="clear"
                    color="primary"
                    slot="end"
                    onClick={clearFilterOptions}
                  >
                    RESET
                  </IonButton>
                </>
              )
            }

            {
              isMobile
              && (
                <IonButton fill="clear" color="primary" slot="start" onClick={handleBack}>
                  <IonIcon icon={chevronBack} color="light" />
                </IonButton>
              )
            }
            <IonTitle className="add-strip-toolbar-title">
              {itemOption.toUpperCase()}
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent color="tertiary">
          <IonToolbar color="tertiary">
            <IonSearchbar
              className="ion-margin-top filters-search-bar"
              value={searchText}
              onIonChange={(e) => setSearchText(e.detail.value!)}
              placeholder="SEARCH"
              showCancelButton="focus"
              cancelButtonIcon={trash}
            />
          </IonToolbar>
          <IonList color="tertiary" className="ion-no-padding ion-margin filters-options-list">
            {filteredItemsOptions.length === 0
              ? (
                <IonItem color="tertiary">
                  {`There are no coincidences with "${searchText}". Do you want to create a `}
                  <a style={{ marginLeft: '6px' }} href="/">NEW ITEM</a>
                </IonItem>
              ) : (
                filteredItemsOptions.map((option, i) => (
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
                      <HighlightedFilterNames
                        option={option.toUpperCase()}
                        checked={() => isFilterOptionChecked(option)}
                      />
                    </IonCheckbox>
                  </IonItem>
                ))
              )}
          </IonList>
          <OutlinePrimaryButton buttonName="CONFIRM" onClick={handleBack} className="ion-margin" />
          {
            isMobile
            && <OutlineLightButton buttonName="CANCEL" onClick={handleBack} className="ion-margin" />
          }
        </IonContent>
      </IonModal>
    </IonRow>
  );
};

export default FilterSceneItem;
