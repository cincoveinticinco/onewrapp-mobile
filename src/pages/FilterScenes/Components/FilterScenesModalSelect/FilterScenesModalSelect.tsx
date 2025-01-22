import React, { useEffect, useState } from 'react';
import {
  IonButton, IonCheckbox, IonCol, IonContent, IonHeader, IonIcon, IonItem,
  IonList, IonModal, IonRow, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter,
} from '@ionic/react';
import { chevronForward, search } from 'ionicons/icons';
import ScenesContext from '../../../../context/Scenes/Scenes.context';
import './FilterScenesModalSelect.scss';
import useIsMobile from '../../../../Shared/hooks/useIsMobile';
import OutlinePrimaryButton from '../../../../Shared/Components/OutlinePrimaryButton/OutlinePrimaryButton';
import OutlineLightButton from '../../../../Shared/Components/OutlineLightButton/OutlineLightButton';
import ModalSearchBar from '../../../../Shared/Components/ModalSearchBar/ModalSearchBar';
import ModalToolbar from '../../../../Shared/Components/ModalToolbar/ModalToolbar';
import capitalizeString from '../../../../Shared/Utils/capitalizeString';
import removeNumberAndDot from '../../../../Shared/Utils/removeNumberAndDot';
import truncateString from '../../../../Shared/Utils/truncateString';
import HighlightedText from '../../../../Shared/Components/HighlightedText/HighlightedText';
import AppLoader from '../../../../Shared/hooks/AppLoader';
import RegularList from '../../../../Layouts/RegularCheckboxList/RegularCheckboxList';

interface FilterScenesModalSelectProps {
  filterName: string;
  listOfFilters: string[];
  handleSingleFilterOption?: (category: string, optionValue: string) => void;
  handleNestedFilterOption?: (category: string, nestedKey: string, optionValue: string) => void;
  optionKey: string;
  nestedKey?: string;
}

const FilterScenesModalSelect: React.FC<FilterScenesModalSelectProps> = ({
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
  const { selectedFilterOptions, setSelectedFilterOptions } = React.useContext<any>(ScenesContext);
  const [uncheckedOptions, setUncheckedOptions] = useState<string[]>([]);
  const [dataIsLoading, setDataIsLoading] = useState(true);

  const getCheckedOptions = () => {
    const result = selectedFilterOptions[optionKey];

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
    setSelectedFilterOptions((prev: any) => {
      const newFilterOptions = {
        ...prev,
        [optionKey]: [],
      };

      delete newFilterOptions[optionKey];

      return newFilterOptions;
    });
  };

  const cancelInputModal = () => {
    if (modalRef.current) {
      modalRef.current.dismiss();
    }
  };

  const handleSave = () => {
    if (modalRef.current) {
      modalRef.current.dismiss();
    }
  };

  const filteredFiltersOptions = listOfFilters.filter((option) => {
    const upperCaseOption = removeNumberAndDot(option.toUpperCase());
    return upperCaseOption.includes(searchText.toUpperCase());
  });

  const uncheckedfilteredFiltersOptions = filteredFiltersOptions.filter((option) => !isFilterOptionChecked(option));
  const checkedFiltersOptions = listOfFilters.filter((option) => isFilterOptionChecked(option));

  useIonViewWillEnter(() => {
    setDataIsLoading(true);
  });

  useIonViewDidEnter(() => {
    setUncheckedOptions(uncheckedfilteredFiltersOptions);
    setTimeout(() => {
      setDataIsLoading(false);
    }, 1000);
  });

  useEffect(() => {
    setUncheckedOptions(uncheckedfilteredFiltersOptions);
    setDataIsLoading(false);
  }, []);

  useEffect(() => {
    setUncheckedOptions(uncheckedfilteredFiltersOptions);
  }, [selectedFilterOptions]);

  useEffect(() => {
    setUncheckedOptions(uncheckedfilteredFiltersOptions);
  }, [searchText]);

  const getListStyles = () => {
    if (uncheckedfilteredFiltersOptions.length === 0 && listOfFilters.length > 10) {
      return { border: 'none', outline: 'none', marginTop: '100px' };
    }

    if (listOfFilters.length > 10) {
      return { marginTop: '100px' };
    }

    if (uncheckedfilteredFiltersOptions.length === 0 && listOfFilters.length <= 10) {
      return {};
    }

    return {};
  };

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
          <ModalToolbar
            handleBack={cancelInputModal}
            handleSave={handleSave}
            toolbarTitle={filterName}
            handleReset={clearFilterOptions}
            showReset={Object.entries(selectedFilterOptions).length > 0}
          />
        </IonHeader>
        <IonContent color="tertiary">
          <ModalSearchBar searchText={searchText} setSearchText={setSearchText} showSearchBar={listOfFilters.length > 10} />
          {
            dataIsLoading && (
              AppLoader()
            )
          }
          {
            !dataIsLoading && (
              <>
                <RegularList
                  checkedSelectedOptions={checkedFiltersOptions}
                  uncheckedFilteredOptions={uncheckedfilteredFiltersOptions}
                  handleCheckboxToggle={handleCheckboxToggle}
                  listOfOptions={listOfFilters}
                  multipleSelections
                  searchText={searchText}
                  isOptionChecked={isFilterOptionChecked}
                  selectedOptions={selectedFilterOptions}
                />
                {
                  uncheckedfilteredFiltersOptions.length === 0
                  && (
                  <p className="no-items-message">
                    There are no coincidences. Do you want to
                    <span onClick={() => setSearchText('')} style={{ color: 'var(--ion-color-primary)' }}> reset search </span>
                    ?
                  </p>
                  )
                }
                <OutlinePrimaryButton
                  buttonName="FILTER"
                  onClick={handleSave}
                  className="ion-margin"
                  style={isMobile ? { margin: '5% 16px 16px 16px' } : { margin: '20% auto auto auto' }}
                />
                {isMobile && <OutlineLightButton buttonName="CANCEL" onClick={handleSave} className="ion-margin cancel-filter-scenes-modal cancel-button" />}
              </>
            )
          }
        </IonContent>
      </IonModal>
    </IonRow>
  );
};

export default FilterScenesModalSelect;
