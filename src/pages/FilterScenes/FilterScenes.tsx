import {
  IonButton, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonTitle, IonToolbar,
} from '@ionic/react';
import React from 'react';
import { chevronBack } from 'ionicons/icons';
import useIsMobile from '../../hooks/useIsMobile';
import './FilterScenes.scss';
import FilterButtonsSelect from '../../components/FilterScenes/FilterButtonsSelect';
import useHideTabs from '../../hooks/useHideTabs';
import ScenesContext, { FilterOptionsInterface } from '../../context/ScenesContext';
import FilterSceneItem from '../../components/FilterScenes/FilterSceneItem';
import getUniqueValuesByKey from '../../utils/getUniqueValuesByKey';
import getUniqueValuesFromNestedArray from '../../utils/getUniqueValuesFromNestedArray';
  import scene_data from '../../data/scn_data.json'; // eslint-disable-line
import { Character } from '../../interfaces/scenesTypes';
import customArraySort from '../../utils/customArraySort';
import sortArrayAlphabeticaly from '../../utils/sortArrayAlphabeticaly';
import useHandleBack from '../../hooks/useHandleBack';
import OutlineLightButton from '../../components/Shared/OutlineLightButton/OutlineLightButton';
import OutlinePrimaryButton from '../../components/Shared/OutlinePrimaryButton/OutlinePrimaryButton';
import toggleNestedFilterOption from '../../utils/FilterScenesUtils/toggleNestedFilterOption';
import toggleFilterOption from '../../utils/FilterScenesUtils/toggleFIlterOption';
import ModalToolbar from '../../components/Shared/ModalToolbar/ModalToolbar';

const FilterScenes = () => {
  const { filterOptions, setFilterOptions } = React.useContext<any>(ScenesContext);
  const { scenes } = scene_data; // eslint-disable-line
  const handleBack = useHandleBack();
  const isMobile = useIsMobile();
  useHideTabs();

  // Main functions
  const handleSingleFilterOption = (category: string, optionValue: string) => {
    setFilterOptions((prevOptions: FilterOptionsInterface) => {
      const updatedOptions = toggleFilterOption(prevOptions, category, optionValue);
      return updatedOptions;
    });
  };

  const handleNestedFilterOption = (category: string, nestedKey: string, optionValue: string) => {
    setFilterOptions((prevOptions: FilterOptionsInterface) => {
      const updatedOptions = toggleNestedFilterOption(prevOptions, category, nestedKey, optionValue);
      return updatedOptions;
    });
  };

  const getFilterButtonClass = (optionValue: string, category: string) => {
    if (filterOptions[category] && filterOptions[category].includes(optionValue)) {
      return 'filled-primary-button';
    }
    return 'outline-light-button';
  };

  const resetFilters = () => {
    setFilterOptions({});
  };

  const handleCancel = () => {
    resetFilters();
    handleBack();
  };

  const defineCharactersArray = () => {
    const charactersArray: string[] = [];
    const uniqueValuesArray = getUniqueValuesFromNestedArray(scenes, 'characters', 'characterName');

    uniqueValuesArray.forEach((character: Character) => {
      const characterName = character.characterNum ? `${character.characterNum}. ${character.characterName}` : character.characterName;
      charactersArray.push(characterName);
    });

    return charactersArray;
  };

  const defineExtrasOrItemsArray = (key: string, nestedKey: string) => {
    const extrasOrItemsArray: string[] = [];
    const uniqueValuesArray = getUniqueValuesFromNestedArray(scenes, key, nestedKey);

    uniqueValuesArray.forEach((value: any) => {
      if (value[nestedKey].length > 1) {
        extrasOrItemsArray.push(value[nestedKey]);
      }
    });

    return extrasOrItemsArray;
  };

  const getSortedCharacterNames = customArraySort(defineCharactersArray());
  const getSortedExtraNames = customArraySort(defineExtrasOrItemsArray('extras', 'extraName'));
  const getSortedElementNames = sortArrayAlphabeticaly(defineExtrasOrItemsArray('elements', 'elementName'));
  const getSortedLocationNames: string[] = sortArrayAlphabeticaly(getUniqueValuesByKey(scenes, 'locationName'));
  const getSortedSetNames: string[] = sortArrayAlphabeticaly(getUniqueValuesByKey(scenes, 'setName'));
  const getSortedElementCategoryNames: string[] = sortArrayAlphabeticaly(defineExtrasOrItemsArray('elements', 'categoryName'));

  return (
    <IonPage color="tertiary">
      <IonHeader>
        <ModalToolbar toolbarTitle='Filter' clearOptions={resetFilters} handleBack={handleBack} />
      </IonHeader>
      <IonContent color="tertiary">
        <IonGrid className="ion-no-padding">
          <FilterButtonsSelect
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

          <FilterSceneItem
            filterName="PROTECTION TYPE"
            listOfFilters={['VOICE OFF', 'IMAGE', 'STOCK IMAGE', 'VIDEO', 'STOCK VIDEO', 'MULTIMEDIA', 'OTHER']}
            handleSingleFilterOption={handleSingleFilterOption}
            optionKey="protectionType"
          />

          {/* LIST */}

          <FilterSceneItem
            filterName="EPISODES"
            listOfFilters={getUniqueValuesByKey(scenes, 'episodeNumber').map(String)}
            handleSingleFilterOption={handleSingleFilterOption}
            optionKey="episodeNumber"
          />

          {/* <FilterSceneItem
              filterName='SCENE STATUS'
              listOfFilters={getUniqueValuesByKey(scenes, 'characters')}
            /> */}

          <FilterButtonsSelect
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

          <FilterButtonsSelect
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

          <FilterSceneItem
            filterName="CHARACTERS"
            listOfFilters={getSortedCharacterNames}
            handleNestedFilterOption={handleNestedFilterOption}
            optionKey="characters"
            nestedKey="characterName"
          />

          <FilterSceneItem
            filterName="EXTRAS"
            listOfFilters={getSortedExtraNames}
            handleNestedFilterOption={handleNestedFilterOption}
            optionKey="extras"
            nestedKey="extraName"
          />

          {/* ORDER BY NUMBER, ORDER ALPH, IF NUMBER 1. NAME, ELSE NAME */}

          <FilterSceneItem
            filterName="LOCATIONS"
            listOfFilters={getSortedLocationNames}
            handleSingleFilterOption={handleSingleFilterOption}
            optionKey="locationName"
          />

          {/* LOCATION NAME */}

          <FilterSceneItem
            filterName="SETS"
            listOfFilters={getSortedSetNames}
            handleSingleFilterOption={handleSingleFilterOption}
            optionKey="setName"
          />

          {/* SETS ARE PART FROM LOCATIONS, LOCATION NAME.  SET OR SET */}

          <FilterSceneItem
            filterName="ELEMENT CATEGORY"
            listOfFilters={getSortedElementCategoryNames}
            handleNestedFilterOption={handleNestedFilterOption}
            optionKey="elements"
            nestedKey="categoryName"
          />

          {/* ELEMENT CATEGORY */}

          <FilterSceneItem
            filterName="ELEMENTS"
            listOfFilters={getSortedElementNames}
            handleNestedFilterOption={handleNestedFilterOption}
            optionKey="elements"
            nestedKey="elementName"
          />

          {/* CategoryName, Element */}
          {/* <FilterButtonsSelect
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

          {/* <FilterSceneItem
              filterName='DATE'
              listOfFilters={getUniqueValuesByKey(scenes, 'date')}
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
                />
              </IonCol>
            </IonRow>
            )}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default FilterScenes;
