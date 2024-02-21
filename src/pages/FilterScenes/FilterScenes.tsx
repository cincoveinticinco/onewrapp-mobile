import {
  IonCol, IonContent, IonGrid, IonRow,
} from '@ionic/react';
import React, { useContext, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import useIsMobile from '../../hooks/useIsMobile';
import './FilterScenes.scss';
import FilterScenesButtonsSelect from '../../components/FilterScenes/FilterScenesButtonsSelect';
import useHideTabs from '../../hooks/useHideTabs';
import ScenesContext, { SelectedFilterOptionsInterface } from '../../context/ScenesContext';
import FilterScenesModalSelect from '../../components/FilterScenes/FilterScenesModalSelect';
import getUniqueValuesByKey from '../../utils/getUniqueValuesByKey';
import getUniqueValuesFromNestedArray from '../../utils/getUniqueValuesFromNestedArray';
import customArraySort from '../../utils/customArraySort';
import sortArrayAlphabeticaly from '../../utils/sortArrayAlphabeticaly';
import OutlineLightButton from '../../components/Shared/OutlineLightButton/OutlineLightButton';
import OutlinePrimaryButton from '../../components/Shared/OutlinePrimaryButton/OutlinePrimaryButton';
import toggleNestedFilterOption from '../../utils/FilterScenesUtils/toggleNestedFilterOption';
import toggleFilterOption from '../../utils/FilterScenesUtils/toggleFIlterOption';
import getCharactersArray from '../../utils/getCharactersArray';
import getOptionsArray from '../../utils/getOptionsArray';
import SecondaryPagesLayout from '../../Layouts/SecondaryPagesLayout/SecondaryPagesLayout';
import { ProtectionTypeEnumArray } from '../../Ennums/ennums';
import DatabaseContext from '../../context/database';
import useHandleBack from '../../hooks/useHandleBack';

const FilterScenes = () => {
  const { selectedFilterOptions, setSelectedFilterOptions } = React.useContext<any>(ScenesContext);
  const { offlineScenes } = useContext(DatabaseContext);
  const handleBack = useHandleBack();
  const isMobile = useIsMobile();
  useHideTabs();

  // Main functions
  const handleSingleFilterOption = (category: string, optionValue: string) => {
    setSelectedFilterOptions((prevOptions: SelectedFilterOptionsInterface) => {
      const updatedOptions = toggleFilterOption(prevOptions, category, optionValue);
      return updatedOptions;
    });
  };

  const handleNestedFilterOption = (category: string, nestedKey: string, optionValue: string) => {
    setSelectedFilterOptions((prevOptions: SelectedFilterOptionsInterface) => {
      const updatedOptions = toggleNestedFilterOption(prevOptions, category, nestedKey, optionValue);
      return updatedOptions;
    });
  };

  const getFilterButtonClass = (optionValue: string, category: string) => {
    if (selectedFilterOptions[category] && selectedFilterOptions[category].includes(optionValue)) {
      return 'filled-primary-button';
    }
    return 'outline-light-button';
  };

  const resetFilters = () => {
    setSelectedFilterOptions({});
    handleBack();
  };

  const handleCancel = () => {
    resetFilters();
    handleBack();
  };

  const uniqueCharacterValuesArray = getUniqueValuesFromNestedArray(offlineScenes, 'characters', 'characterName');
  const uniqueElementsValuesAarray = getUniqueValuesFromNestedArray(offlineScenes, 'elements', 'elementName');
  const uniqueExtrasValuesArray = getUniqueValuesFromNestedArray(offlineScenes, 'extras', 'extraName');
  const uniqueCategoryElementsValuesArray = getUniqueValuesFromNestedArray(offlineScenes, 'elements', 'categoryName');
  const getSortedCharacterNames = customArraySort(getCharactersArray(uniqueCharacterValuesArray));
  const getSortedExtraNames = customArraySort(getOptionsArray('extraName', uniqueExtrasValuesArray));
  const getSortedElementNames = sortArrayAlphabeticaly(getOptionsArray('elementName', uniqueElementsValuesAarray));
  const getSortedLocationNames = sortArrayAlphabeticaly(getUniqueValuesByKey(offlineScenes, 'locationName'));
  const getSortedSetNames = sortArrayAlphabeticaly(getUniqueValuesByKey(offlineScenes, 'setName'));
  const getSortedElementCategoryNames = sortArrayAlphabeticaly(getOptionsArray('categoryName', uniqueCategoryElementsValuesArray));

  return (
    <SecondaryPagesLayout
      resetSelections={resetFilters}
      pageTitle="FILTER"
      handleConfirm={handleBack}
    >
      <IonContent color="tertiary">
        <IonGrid className="ion-no-padding">
          <FilterScenesButtonsSelect
            selectOptions={
                [
                  {
                    filterName: 'SCENES',
                    handleOption: () => handleSingleFilterOption('sceneType', 'scene'),
                    class: getFilterButtonClass('scene', 'sceneType'),
                  },
                  {
                    filterName: 'PROTECTION',
                    handleOption: () => handleSingleFilterOption('sceneType', 'protection'),
                    class: getFilterButtonClass('protection', 'sceneType'),
                  },
                ]
              }
            groupName="STRIP TYPE"
          />

          <FilterScenesModalSelect
            filterName="PROTECTION TYPE"
            listOfFilters={ProtectionTypeEnumArray}
            handleSingleFilterOption={handleSingleFilterOption}
            optionKey="protectionType"
          />

          {/* LIST */}

          <FilterScenesModalSelect
            filterName="EPISODES"
            listOfFilters={getUniqueValuesByKey(offlineScenes, 'episodeNumber').map(String)}
            handleSingleFilterOption={handleSingleFilterOption}
            optionKey="episodeNumber"
          />

          {/* <FilterScenesModalSelect
              filterName='SCENE STATUS'
              listOfFilters={getUniqueValuesByKey(offlineScenes, 'characters')}
            /> */}

          <FilterScenesButtonsSelect
            selectOptions={
                [
                  {
                    filterName: 'DAY',
                    handleOption: () => handleSingleFilterOption('dayOrNightOption', 'Day'),
                    class: getFilterButtonClass('Day', 'dayOrNightOption'),
                  },
                  {
                    filterName: 'NIGHT',
                    handleOption: () => handleSingleFilterOption('dayOrNightOption', 'Night'),
                    class: getFilterButtonClass('Night', 'dayOrNightOption'),
                  },
                  {
                    filterName: 'SUNRISE',
                    handleOption: () => handleSingleFilterOption('dayOrNightOption', 'Sunrise'),
                    class: getFilterButtonClass('Sunrise', 'dayOrNightOption'),
                  },
                  {
                    filterName: 'SUNSET',
                    handleOption: () => handleSingleFilterOption('dayOrNightOption', 'Sunset'),
                    class: getFilterButtonClass('Sunset', 'dayOrNightOption'),
                  },
                ]
              }
            groupName="DAY OR NIGHT"
          />

          <FilterScenesButtonsSelect
            selectOptions={
                [
                  {
                    filterName: 'INTERIOR',
                    handleOption: () => handleSingleFilterOption('intOrExtOption', 'Interior'),
                    class: getFilterButtonClass('Interior', 'intOrExtOption'),
                  },
                  {
                    filterName: 'EXTERIOR',
                    handleOption: () => handleSingleFilterOption('intOrExtOption', 'Exterior'),
                    class: getFilterButtonClass('Exterior', 'intOrExtOption'),
                  },
                ]
              }
            groupName="INTERIOR OR EXTERIOR"
          />

          <FilterScenesModalSelect
            filterName="CHARACTERS"
            listOfFilters={getSortedCharacterNames}
            handleNestedFilterOption={handleNestedFilterOption}
            optionKey="characters"
            nestedKey="characterName"
          />

          <FilterScenesModalSelect
            filterName="EXTRAS"
            listOfFilters={getSortedExtraNames}
            handleNestedFilterOption={handleNestedFilterOption}
            optionKey="extras"
            nestedKey="extraName"
          />

          {/* ORDER BY NUMBER, ORDER ALPH, IF NUMBER 1. NAME, ELSE NAME */}

          <FilterScenesModalSelect
            filterName="LOCATIONS"
            listOfFilters={getSortedLocationNames}
            handleSingleFilterOption={handleSingleFilterOption}
            optionKey="locationName"
          />

          {/* LOCATION NAME */}

          <FilterScenesModalSelect
            filterName="SETS"
            listOfFilters={getSortedSetNames}
            handleSingleFilterOption={handleSingleFilterOption}
            optionKey="setName"
          />

          {/* SETS ARE PART FROM LOCATIONS, LOCATION NAME.  SET OR SET */}

          <FilterScenesModalSelect
            filterName="ELEMENT CATEGORY"
            listOfFilters={getSortedElementCategoryNames}
            handleNestedFilterOption={handleNestedFilterOption}
            optionKey="elements"
            nestedKey="categoryName"
          />

          {/* ELEMENT CATEGORY */}

          <FilterScenesModalSelect
            filterName="ELEMENTS"
            listOfFilters={getSortedElementNames}
            handleNestedFilterOption={handleNestedFilterOption}
            optionKey="elements"
            nestedKey="elementName"
          />

          {/* CategoryName, Element */}
          {/* <FilterScenesButtonsSelect
              selectOptions={
                [
                  {
                    filterName: 'UNIT 1',
                    handleOption: () => handleSingleFilterOption('units', 'unit1'),
                    class: getFilterButtonClass('unit1', 'units')
                  },
                  {
                    filterName: 'UNIT 2',
                    handleOption: () => handleSingleFilterOption('units', 'unit2'),
                    class: getFilterButtonClass('unit2', 'units')
                  }
                ]
              }
              groupName='UNITS'
            /> */}

          {/* <FilterScenesModalSelect
              filterName='DATE'
              listOfFilters={getUniqueValuesByKey(offlineScenes, 'date')}
            /> */}

          <IonRow class="ion-flex ion-justify-content-center filter-button-row">
            <IonCol size-xs="12" size-sm="4" size-md="4">
              <OutlinePrimaryButton
                buttonName="FILTER"
                onClick={handleBack}
              />
            </IonCol>
          </IonRow>

          { isMobile
            && (
            <IonRow>
              <IonCol>
                <OutlineLightButton
                  buttonName="CANCEL"
                  onClick={handleCancel}
                  className="cancel-filter-scenes-button cancel-button"
                />
              </IonCol>
            </IonRow>
            )}
        </IonGrid>
      </IonContent>
    </SecondaryPagesLayout>
  );
};

export default FilterScenes;
