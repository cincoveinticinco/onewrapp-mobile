import {
  IonCol, IonContent, IonGrid, IonRow,
  useIonViewWillEnter, useIonViewWillLeave,
} from '@ionic/react';
import React, {
  useCallback, useContext, useEffect, useMemo,
} from 'react';
import { useHistory, useParams } from 'react-router';
import { ProtectionTypeEnumArray } from '../../Shared/ennums/ennums';
import SecondaryPagesLayout from '../../Layouts/SecondaryPagesLayout/SecondaryPagesLayout';
import FilterScenesButtonsSelect from './Components/FilterScenesButtonsSelect/FilterScenesButtonsSelect';
import FilterScenesModalSelect from './Components/FilterScenesModalSelect/FilterScenesModalSelect';
import OutlineLightButton from '../../Shared/Components/OutlineLightButton/OutlineLightButton';
import OutlinePrimaryButton from '../../Shared/Components/OutlinePrimaryButton/OutlinePrimaryButton';
import DatabaseContext from '../../context/Database/Database.context';
import ScenesContext, { SelectedFilterOptionsInterface } from '../../context/Scenes/Scenes.context';
import useHideTabs from '../../Shared/hooks/useHideTabs';
import useIsMobile from '../../Shared/hooks/useIsMobile';
import AppLoader from '../../Shared/hooks/AppLoader';
import toggleFilterOption from '../../Shared/Utils/FilterScenesUtils/toggleFIlterOption';
import toggleNestedFilterOption from '../../Shared/Utils/FilterScenesUtils/toggleNestedFilterOption';
import customArraySort from '../../Shared/Utils/customArraySort';
import getCharactersArray from '../../Shared/Utils/getCharactersArray';
import getOptionsArray from '../../Shared/Utils/getOptionsArray';
import getUniqueValuesByKey from '../../Shared/Utils/getUniqueValuesByKey';
import getUniqueValuesFromNestedArray from '../../Shared/Utils/getUniqueValuesFromNestedArray';
import sortArrayAlphabeticaly from '../../Shared/Utils/sortArrayAlphabeticaly';
import './FilterScenes.scss';

const FilterScenes = () => {
  const { selectedFilterOptions, setSelectedFilterOptions } = React.useContext<any>(ScenesContext);
  const { offlineScenes } = useContext(DatabaseContext);
  const [showReset, setShowReset] = React.useState(false);
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const handleBack = () => history.push(`/my/projects/${id}/strips`);
  const isMobile = useIsMobile();
  const { hideTabs, showTabs } = useHideTabs();
  const [dataIsLoading, setDataIsLoading] = React.useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setDataIsLoading(false);
    }, 500);
  }, [offlineScenes]);

  useIonViewWillEnter(() => {
    hideTabs();
  });

  useIonViewWillLeave(() => {
    showTabs();
  });

  // Main functions
  const handleSingleFilterOption = useCallback((category: string, optionValue: string) => {
    setSelectedFilterOptions((prevOptions: SelectedFilterOptionsInterface) => {
      const updatedOptions = toggleFilterOption(prevOptions, category, optionValue);
      return updatedOptions;
    });
  }, [setSelectedFilterOptions]);

  const handleNestedFilterOption = useCallback((category: string, nestedKey: string, optionValue: string) => {
    setSelectedFilterOptions((prevOptions: SelectedFilterOptionsInterface) => {
      const updatedOptions = toggleNestedFilterOption(prevOptions, category, nestedKey, optionValue);
      return updatedOptions;
    });
  }, [setSelectedFilterOptions]);

  const getFilterButtonClass = (optionValue: string, category: string) => {
    if (selectedFilterOptions[category] && selectedFilterOptions[category].includes(optionValue)) {
      return 'filled-primary-button';
    }
    return 'outline-light-button';
  };

  const resetFilters = () => {
    setSelectedFilterOptions({});
  };

  const handleCancel = () => {
    handleBack();
  };

  const uniqueCharacterValuesArray = getUniqueValuesFromNestedArray(offlineScenes, 'characters', 'characterName');
  const uniqueElementsValuesAarray = getUniqueValuesFromNestedArray(offlineScenes, 'elements', 'elementName');
  const uniqueExtrasValuesArray = getUniqueValuesFromNestedArray(offlineScenes, 'extras', 'extraName');
  const uniqueCategoryElementsValuesArray = getUniqueValuesFromNestedArray(offlineScenes, 'elements', 'categoryName');
  const getSortedCharacterNames = useMemo(() => customArraySort(getCharactersArray(uniqueCharacterValuesArray)), [uniqueCharacterValuesArray]);
  const getSortedExtraNames = useMemo(() => customArraySort(getOptionsArray('extraName', uniqueExtrasValuesArray)), [uniqueExtrasValuesArray]);
  const getSortedElementNames = useMemo(() => sortArrayAlphabeticaly(getOptionsArray('elementName', uniqueElementsValuesAarray)), [uniqueElementsValuesAarray]);
  const getSortedLocationNames = useMemo(() => sortArrayAlphabeticaly(getUniqueValuesByKey(offlineScenes, 'locationName')), [offlineScenes]);
  const getSortedSetNames = useMemo(() => sortArrayAlphabeticaly(getUniqueValuesByKey(offlineScenes, 'setName')), [offlineScenes]);
  const getSortedElementCategoryNames = useMemo(() => sortArrayAlphabeticaly(getOptionsArray('categoryName', uniqueCategoryElementsValuesArray)), [uniqueCategoryElementsValuesArray]);

  useEffect(() => {
    if (Object.entries(selectedFilterOptions).length > 0) {
      setShowReset(true);
    } else {
      setShowReset(false);
    }
  }, [selectedFilterOptions]);

  return (
    <SecondaryPagesLayout
      resetSelections={resetFilters}
      pageTitle="FILTERS"
      handleSave={handleBack}
      handleSaveName='FILTER'
      showReset={showReset}
      handleBack={handleBack}
    >
      <IonContent color="tertiary">
        {
          dataIsLoading
          && AppLoader()
        }
        {
          !dataIsLoading
          && (
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
                  className='filter-save-button'
                  color='success'
                />
              </IonCol>
            </IonRow>

            { isMobile
              && (
              <IonRow>
                <IonCol>
                  <OutlineLightButton
                    buttonName={showReset ? 'RESET' : 'CANCEL'}
                    onClick={showReset ? resetFilters : handleCancel}
                    className="cancel-filter-scenes-button cancel-button"
                  />
                </IonCol>
              </IonRow>
              )}
          </IonGrid>
          )
        }
      </IonContent>
    </SecondaryPagesLayout>
  );
};

export default FilterScenes;
