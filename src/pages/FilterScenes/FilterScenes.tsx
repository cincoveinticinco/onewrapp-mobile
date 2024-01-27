import {
  IonButton, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonTitle, IonToolbar,
} from '@ionic/react';
import React from 'react';
import { chevronBack } from 'ionicons/icons';
import useIsMobile from '../../hooks/useIsMobile';
import './FilterScenes.scss';
import FilterButtonsSelect from '../../components/FilterScenes/FilterButtonsSelect';
import useHideTabs from '../../hooks/useHideTabs';
import ScenesFiltersContext, { FilterOptionsInterface } from '../../context/scenesFiltersContext';
import FilterSceneItem from '../../components/FilterScenes/FilterSceneItem';
import getUniqueValuesByKey from '../../utils/getUniqueValuesByKey';
import getUniqueValuesFromNestedArray from '../../utils/getUniqueValuesFromNestedArray';
  import scene_data from '../../data/scn_data.json'; // eslint-disable-line
import { Character } from '../../interfaces/scenesTypes';
import customArraySort from '../../utils/customArraySort';
import sortArrayAlphabeticaly from '../../utils/sortArrayAlphabeticaly';
import useHandleBack from '../../hooks/useHandleBack';
import OutlineLightButton from '../../components/Shared/OutlineLightButton';
import OutlinePrimaryButton from '../../components/Shared/OutlinePrimaryButton';
import toggleNestedFilterOption from '../../utils/FilterScenesUtils/toggleNestedFilterOption';
import toggleFilterOption from '../../utils/FilterScenesUtils/toggleFIlterOption';

const FilterScenes = () => {
  const { filterOptions, setFilterOptions } = React.useContext<any>(ScenesFiltersContext);
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
        <IonToolbar color="tertiary" className="add-strip-toolbar">
          {
            !isMobile
            && (
            <>
              <IonButton
                fill="clear"
                color="primary"
                slot="start"
                onClick={handleBack}
              >
                BACK
              </IonButton>
              <IonButton
                fill="clear"
                color="primary"
                slot="end"
                onClick={resetFilters}
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
            Filter
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color="tertiary">
        <IonGrid className="ion-no-padding">
          <FilterButtonsSelect
            selectOptions={
                [
                  {
                    optionName: 'SCENES',
                    handleOption: () => handleSingleFilterOption('sceneType', 'scene'),
                    class: getFilterButtonClass('scene', 'sceneType'),
                  },
                  {
                    optionName: 'PROTECTION',
                    handleOption: () => handleSingleFilterOption('sceneType', 'protection'),
                    class: getFilterButtonClass('protection', 'sceneType'),
                  },
                ]
              }
            groupName="STRIP TYPE"
          />

          <FilterSceneItem
            itemOption="PROTECTION TYPE"
            filterNames={['VOICE OFF', 'IMAGE', 'STOCK IMAGE', 'VIDEO', 'STOCK VIDEO', 'MULTIMEDIA', 'OTHER']}
            handleSingleFilterOption={handleSingleFilterOption}
            optionKey="protectionType"
          />

          {/* LIST */}

          <FilterSceneItem
            itemOption="EPISODES"
            filterNames={getUniqueValuesByKey(scenes, 'episodeNumber').map(String)}
            handleSingleFilterOption={handleSingleFilterOption}
            optionKey="episodeNumber"
          />

          {/* <FilterSceneItem
              itemOption='SCENE STATUS'
              filterNames={getUniqueValuesByKey(scenes, 'characters')}
            /> */}

          <FilterButtonsSelect
            selectOptions={
                [
                  {
                    optionName: 'DAY',
                    handleOption: () => handleSingleFilterOption('dayOrNightOption', 'Day'),
                    class: getFilterButtonClass('Day', 'dayOrNightOption'),
                  },
                  {
                    optionName: 'NIGHT',
                    handleOption: () => handleSingleFilterOption('dayOrNightOption', 'Night'),
                    class: getFilterButtonClass('Night', 'dayOrNightOption'),
                  },
                  {
                    optionName: 'SUNRISE',
                    handleOption: () => handleSingleFilterOption('dayOrNightOption', 'Sunrise'),
                    class: getFilterButtonClass('Sunrise', 'dayOrNightOption'),
                  },
                  {
                    optionName: 'SUNSET',
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
                    optionName: 'INTERIOR',
                    handleOption: () => handleSingleFilterOption('intOrExtOption', 'Interior'),
                    class: getFilterButtonClass('Interior', 'intOrExtOption'),
                  },
                  {
                    optionName: 'EXTERIOR',
                    handleOption: () => handleSingleFilterOption('intOrExtOption', 'Exterior'),
                    class: getFilterButtonClass('Exterior', 'intOrExtOption'),
                  },
                ]
              }
            groupName="INTERIOR OR EXTERIOR"
          />

          <FilterSceneItem
            itemOption="CHARACTERS"
            filterNames={getSortedCharacterNames}
            handleNestedFilterOption={handleNestedFilterOption}
            optionKey="characters"
            nestedKey="characterName"
          />

          <FilterSceneItem
            itemOption="EXTRAS"
            filterNames={getSortedExtraNames}
            handleNestedFilterOption={handleNestedFilterOption}
            optionKey="extras"
            nestedKey="extraName"
          />

          {/* ORDER BY NUMBER, ORDER ALPH, IF NUMBER 1. NAME, ELSE NAME */}

          <FilterSceneItem
            itemOption="LOCATIONS"
            filterNames={getSortedLocationNames}
            handleSingleFilterOption={handleSingleFilterOption}
            optionKey="locationName"
          />

          {/* LOCATION NAME */}

          <FilterSceneItem
            itemOption="SETS"
            filterNames={getSortedSetNames}
            handleSingleFilterOption={handleSingleFilterOption}
            optionKey="setName"
          />

          {/* SETS ARE PART FROM LOCATIONS, LOCATION NAME.  SET OR SET */}

          <FilterSceneItem
            itemOption="ELEMENT CATEGORY"
            filterNames={getSortedElementCategoryNames}
            handleNestedFilterOption={handleNestedFilterOption}
            optionKey="elements"
            nestedKey="categoryName"
          />

          {/* ELEMENT CATEGORY */}

          <FilterSceneItem
            itemOption="ELEMENTS"
            filterNames={getSortedElementNames}
            handleNestedFilterOption={handleNestedFilterOption}
            optionKey="elements"
            nestedKey="elementName"
          />

          {/* CategoryName, Element */}
          {/* <FilterButtonsSelect
              selectOptions={
                [
                  {
                    optionName: 'UNIT 1',
                    handleOption: () => handleSingleFilterOption('units', 'unit1'),
                    class: getFilterButtonClass('unit1', 'units')
                  },
                  {
                    optionName: 'UNIT 2',
                    handleOption: () => handleSingleFilterOption('units', 'unit2'),
                    class: getFilterButtonClass('unit2', 'units')
                  }
                ]
              }
              groupName='UNITS'
            /> */}

          {/* <FilterSceneItem
              itemOption='DATE'
              filterNames={getUniqueValuesByKey(scenes, 'date')}
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
