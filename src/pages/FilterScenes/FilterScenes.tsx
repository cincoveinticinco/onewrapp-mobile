import {
  IonButton, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonTitle, IonToolbar,
} from '@ionic/react';
import React from 'react';
import { chevronBack } from 'ionicons/icons';
import useIsMobile from '../../hooks/useIsMobile';
import './FilterScenes.scss';
import FilterButtonsSelect from '../../components/FilterScenes/FilterButtonsSelect';
import useHideTabs from '../../hooks/useHideTabs';
import ScenesFiltersContext from '../../context/scenesFiltersContext';
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

const FilterScenes = () => {
  const { filterOptions, setFilterOptions } = React.useContext<any>(ScenesFiltersContext);
  const { scenes } = scene_data; // eslint-disable-line
  const handleBack = useHandleBack();
  const isMobile = useIsMobile();
  useHideTabs();

  const handleOptionToggle = (category: string, optionValue: string) => {
    setFilterOptions((prevOptions: any) => {
      const updatedOptions = prevOptions[category] ? [...prevOptions[category]] : [];
      const valueIndex = updatedOptions.indexOf(optionValue);

      if (valueIndex > -1) {
        updatedOptions.splice(valueIndex, 1);
      } else {
        updatedOptions.push(optionValue);
      }

      if (updatedOptions.length === 0) {
        const { [category]: unused_, ...newOptions } = prevOptions;
        return newOptions;
      }

      return {
        ...prevOptions,
        [category]: updatedOptions,
      };
    });
  };

  const handleNestedOptionToggle = (category: string, nestedKey: string, optionValue: string) => {
    setFilterOptions((prevOptions: any) => {
      const updatedOptions = { ...prevOptions };

      // Create the category if it doesn't exist
      updatedOptions[category] = updatedOptions[category] || [];

      // Find the specific object for the nestedKey
      const nestedKeyObject = updatedOptions[category].find((opt: any) => opt[nestedKey]);

      // Create the object if it doesn't exist
      if (!nestedKeyObject) {
        updatedOptions[category].push({ [nestedKey]: [] });
      }

      // Find the specific array for the nestedKey
      const nestedKeyArray = updatedOptions[category].find((opt: any) => opt[nestedKey]);

      // Check if optionValue is already in the nestedKey array
      const valueIndex = nestedKeyArray[nestedKey].indexOf(optionValue);

      // Toggle the optionValue
      if (valueIndex > -1) {
        nestedKeyArray[nestedKey].splice(valueIndex, 1);
      } else {
        nestedKeyArray[nestedKey].push(optionValue);
      }

      // Remove the array if it's empty
      updatedOptions[category] = updatedOptions[category].filter(
        (opt: any) => opt[nestedKey].length > 0,
      );

      // Remove the category if there are no more categories in the object
      if (updatedOptions[category].length === 0) {
        delete updatedOptions[category];
      }

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
                  handleOption: () => handleOptionToggle('sceneType', 'scene'),
                  class: getFilterButtonClass('scene', 'sceneType'),
                },
                {
                  optionName: 'PROTECTION',
                  handleOption: () => handleOptionToggle('sceneType', 'protection'),
                  class: getFilterButtonClass('protection', 'sceneType'),
                },
              ]
            }
            groupName="STRIP TYPE"
          />

          <FilterSceneItem
            itemOption="PROTECTION TYPE"
            filterNames={['VOICE OFF', 'IMAGE', 'STOCK IMAGE', 'VIDEO', 'STOCK VIDEO', 'MULTIMEDIA', 'OTHER']}
            handleOptionToggle={handleOptionToggle}
            optionKey="protectionType"
          />

          {/* LIST */}

          <FilterSceneItem
            itemOption="EPISODES"
            filterNames={getUniqueValuesByKey(scenes, 'episodeNumber').map(String)}
            handleOptionToggle={handleOptionToggle}
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
                  handleOption: () => handleOptionToggle('dayOrNightOption', 'Day'),
                  class: getFilterButtonClass('Day', 'dayOrNightOption'),
                },
                {
                  optionName: 'NIGHT',
                  handleOption: () => handleOptionToggle('dayOrNightOption', 'Night'),
                  class: getFilterButtonClass('Night', 'dayOrNightOption'),
                },
                {
                  optionName: 'SUNRISE',
                  handleOption: () => handleOptionToggle('dayOrNightOption', 'Sunrise'),
                  class: getFilterButtonClass('Sunrise', 'dayOrNightOption'),
                },
                {
                  optionName: 'SUNSET',
                  handleOption: () => handleOptionToggle('dayOrNightOption', 'Sunset'),
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
                  handleOption: () => handleOptionToggle('intOrExtOption', 'Interior'),
                  class: getFilterButtonClass('Interior', 'intOrExtOption'),
                },
                {
                  optionName: 'EXTERIOR',
                  handleOption: () => handleOptionToggle('intOrExtOption', 'Exterior'),
                  class: getFilterButtonClass('Exterior', 'intOrExtOption'),
                },
              ]
            }
            groupName="INTERIOR OR EXTERIOR"
          />

          <FilterSceneItem
            itemOption="CHARACTERS"
            filterNames={getSortedCharacterNames}
            handleNestedOptionToggle={handleNestedOptionToggle}
            optionKey="characters"
            nestedKey="characterName"
          />

          <FilterSceneItem
            itemOption="EXTRAS"
            filterNames={getSortedExtraNames}
            handleNestedOptionToggle={handleNestedOptionToggle}
            optionKey="extras"
            nestedKey="extraName"
          />

          {/* ORDER BY NUMBER, ORDER ALPH, IF NUMBER 1. NAME, ELSE NAME */}

          <FilterSceneItem
            itemOption="LOCATIONS"
            filterNames={getSortedLocationNames}
            handleOptionToggle={handleOptionToggle}
            optionKey="locationName"
          />

          {/* LOCATION NAME */}

          <FilterSceneItem
            itemOption="SETS"
            filterNames={getSortedSetNames}
            handleOptionToggle={handleOptionToggle}
            optionKey="setName"
          />

          {/* SETS ARE PART FROM LOCATIONS, LOCATION NAME.  SET OR SET */}

          <FilterSceneItem
            itemOption="ELEMENT CATEGORY"
            filterNames={getSortedElementCategoryNames}
            handleNestedOptionToggle={handleNestedOptionToggle}
            optionKey="elements"
            nestedKey="categoryName"
          />

          {/* ELEMENT CATEGORY */}

          <FilterSceneItem
            itemOption="ELEMENTS"
            filterNames={getSortedElementNames}
            handleNestedOptionToggle={handleNestedOptionToggle}
            optionKey="elements"
            nestedKey="elementName"
          />

          {/* CategoryName, Element */}
          {/* <FilterButtonsSelect
            selectOptions={
              [
                {
                  optionName: 'UNIT 1',
                  handleOption: () => handleOptionToggle('units', 'unit1'),
                  class: getFilterButtonClass('unit1', 'units')
                },
                {
                  optionName: 'UNIT 2',
                  handleOption: () => handleOptionToggle('units', 'unit2'),
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
