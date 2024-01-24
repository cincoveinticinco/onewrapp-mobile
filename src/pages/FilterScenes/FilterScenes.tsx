import { IonButton, IonCardSubtitle, IonCheckbox, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonList, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react'
import React, { useEffect } from 'react'
import { useHistory, useParams } from 'react-router';
import { useIsMobile } from '../../hooks/useIsMobile';
import { chevronBack } from 'ionicons/icons';
import './FilterScenes.scss';
import FilterButtonsSelect from '../../components/FilterScenes/FilterButtonsSelect';
import useHideTabs from '../../hooks/useHideTabs';
import ScenesFiltersContext from '../../context/scenesFiltersContext';
import FilterSceneItem from '../../components/FilterScenes/FilterSceneItem';
import { getUniqueValuesByKey } from '../../utils/getUniqueValuesByKey';
import { getUniqueValuesFromNestedArray } from '../../utils/getUniqueValuesFromNestedArray';
import scene_data from '../../data/scn_data.json';
import { Character, Scene } from '../../interfaces/scenesTypes';
import { customArraySort } from '../../utils/customArraySort';
import { sortArrayAlphabeticaly } from '../../utils/sortArrayAlphabeticaly';


const FilterScenes = () => {

  const { id } = useParams<{ id: string }>();

  const { filterOptions, setFilterOptions } = React.useContext<any>(ScenesFiltersContext);
  const scenes = scene_data.scenes;
  const history = useHistory();
  const isMobile = useIsMobile();
  useHideTabs();

  const handleBack = () => {
    history.goBack();
  };

  const handleFilterOption = (category: string, optionValue: string) => {
    
    setFilterOptions((prevOptions: any) => {
      const updatedOptions = prevOptions[category] ? [...prevOptions[category]] : [];
      const valueIndex = updatedOptions.indexOf(optionValue);

      if (valueIndex > -1) {
        updatedOptions.splice(valueIndex, 1);
      } else {
        updatedOptions.push(optionValue);
      }

      if (updatedOptions.length === 0) {
        const {[category]: _, ...newOptions} = prevOptions;
        return newOptions;
      }

      return {
        ...prevOptions,
        [category]: updatedOptions
      };
    });
  };

const handleNestedFilterOption = (category: string, nestedKey: string, optionValue: string) => {
  setFilterOptions((prevOptions: any) => {
    const updatedOptions = { ...prevOptions };

    // If the category doesn't exist, create it
    if (!updatedOptions[category]) {
      updatedOptions[category] = [];
    }

    const categoryOptions = updatedOptions[category];

    // Check if the nestedKey exists in the categoryOptions
    const nestedOptions = categoryOptions.find((opt: any) => opt[nestedKey]);

    // If the nestedKey doesn't exist, create it
    if (!nestedOptions) {
      updatedOptions[category].push({ [nestedKey]: [] });
    }

    // Find the specific nestedKey array
    const nestedKeyArray = updatedOptions[category].find((opt: any) => opt[nestedKey]);

    // Check if the optionValue is already in the nestedKey array
    const valueIndex = nestedKeyArray[nestedKey].indexOf(optionValue);

    // Toggle the optionValue
    if (valueIndex > -1) {
      nestedKeyArray[nestedKey].splice(valueIndex, 1);
    } else {
      nestedKeyArray[nestedKey].push(optionValue);
    }

    // If the nestedKey array is empty, remove it
    if (nestedKeyArray[nestedKey].length === 0) {
      updatedOptions[category] = categoryOptions.filter((opt: any) => opt[nestedKey].length > 0);
    }

    return updatedOptions;
  });
};

  const defineFilterButtonClass = (optionValue: string, category: string) => {

    if(filterOptions[category] && filterOptions[category].includes(optionValue)) {
      return 'filled-primary-button';
    } else {
      return 'outline-light-button';
    }
  }

  const defineCheckedFilterOption = (category: string, optionValue: string, nestedKey?: string) => {
    if (nestedKey && filterOptions[category]) {
      // Check if the nestedKey exists in the category options
      const nestedOptions = filterOptions[category].find((opt: any) => opt[nestedKey]);
  
      // Check if the optionValue is present in the nestedKey array
      return nestedOptions && nestedOptions[nestedKey].includes(optionValue);
    }
  
    // If no nestedKey, check for direct inclusion of optionValue in the category options
    return filterOptions[category] && filterOptions[category].includes(optionValue);
  };

  const resetFilters = () => {
    setFilterOptions({});
  };

  const defineCharactersArray = () => {
    let charactersArray: string[] = [];
    const uniqueValuesArray = getUniqueValuesFromNestedArray(scenes, 'characters', 'characterName')

    uniqueValuesArray.forEach((character: Character) => {
      let characterName = character.characterNum ? `${character.characterNum}. ${character.characterName}` : character.characterName;
      charactersArray.push(characterName)
    })

    return charactersArray;
  }


  const defineExtrasOrItemsArray = (key: string, nestedKey: string) => {
    let extrasOrItemsArray: string[] = [];
    const uniqueValuesArray = getUniqueValuesFromNestedArray(scenes, key, nestedKey)

    uniqueValuesArray.forEach((value: any) => {
      if(value[nestedKey].length > 1) {
        extrasOrItemsArray.push(value[nestedKey])
      }
    })

    return extrasOrItemsArray;
  }

  const sortedCharactersArray = customArraySort(defineCharactersArray());
  const sortedExtrasArray = customArraySort(defineExtrasOrItemsArray('extras', 'extraName'));
  const sortedElementsArray = sortArrayAlphabeticaly(defineExtrasOrItemsArray('elements', 'elementName'));
  const sortedLocationsArray: string[] = sortArrayAlphabeticaly(getUniqueValuesByKey(scenes, 'locationName'));
  const sortedSetsArray: string[] = sortArrayAlphabeticaly(getUniqueValuesByKey(scenes, 'setName'));
  const sortedElementsCategoryNames: string[] = sortArrayAlphabeticaly(defineExtrasOrItemsArray('elements', 'categoryName'))

  return (
    <IonPage color='tertiary'>
      <IonHeader>
      <IonToolbar color='tertiary' className='add-strip-toolbar'>
          {
          !isMobile &&
          <>
            <IonButton 
              fill='clear' 
              color='primary' 
              slot='start' onClick={handleBack}>
              BACK
            </IonButton>
            <IonButton 
              fill='clear' 
              color='primary'
              slot='end' 
              onClick={resetFilters}
            >
              RESET
            </IonButton>
          </>
          }
          {
            isMobile && 
            <IonButton fill='clear' color="primary" slot='start' onClick={handleBack}>
              <IonIcon  icon={chevronBack} color='light'  />
            </IonButton>
          }
          <IonTitle className='add-strip-toolbar-title'> 
            Filter
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color='tertiary'>
        <IonGrid className="ion-no-padding">
          <FilterButtonsSelect
            selectOptions={
              [
                {
                  optionName: 'SCENES',
                  handleOption: () => handleFilterOption('sceneType', 'scene'),
                  class: defineFilterButtonClass('scene', 'sceneType')
                },
                {
                  optionName: 'PROTECTION',
                  handleOption: () => handleFilterOption('sceneType', 'protection'),
                  class: defineFilterButtonClass('protection', 'sceneType')
                }
              ]
            }
            groupName='STRIP TYPE'
          />

          <FilterSceneItem 
            itemOption='PROTECTION TYPE' 
            filterOptions={["VOICE OFF", "IMAGE", "STOCK IMAGE", "VIDEO", "STOCK VIDEO", "MULTIMEDIA", "OTHER"]}
            handleOption={handleFilterOption}
            optionKey='protectionType'
            defineCheck={defineCheckedFilterOption}
          />

          {/* LIST */}

          <FilterSceneItem 
            itemOption='EPISODES' 
            filterOptions={getUniqueValuesByKey(scenes, 'episodeNumber')}
            handleOption={handleFilterOption}
            optionKey='episodeNumber'
            defineCheck={defineCheckedFilterOption}
          />

          {/* <FilterSceneItem 
            itemOption='SCENE STATUS' 
            filterOptions={getUniqueValuesByKey(scenes, 'characters')}
          /> */}

          <FilterButtonsSelect
            selectOptions={
              [
                {
                  optionName: 'DAY',
                  handleOption: () => handleFilterOption('dayOrNightOption', 'Day'),
                  class: defineFilterButtonClass('Day', 'dayOrNightOption')
                },
                {
                  optionName: 'NIGHT',
                  handleOption: () => handleFilterOption('dayOrNightOption', 'Night'),
                  class: defineFilterButtonClass('Night', 'dayOrNightOption')
                },
                {
                  optionName: 'SUNRISE',
                  handleOption: () => handleFilterOption('dayOrNightOption', 'Sunrise'),
                  class: defineFilterButtonClass('Sunrise', 'dayOrNightOption')
                },
                {
                  optionName: 'SUNSET',
                  handleOption: () => handleFilterOption('dayOrNightOption', 'Sunset'),
                  class: defineFilterButtonClass('Sunset', 'dayOrNightOption')
                }
              ]
            }
            groupName='DAY OR NIGHT'
          />

          <FilterButtonsSelect
            selectOptions={
              [
                {
                  optionName: 'INTERIOR',
                  handleOption: () => handleFilterOption('intOrExtOption', 'Interior'),
                  class: defineFilterButtonClass('Interior', 'intOrExtOption')
                },
               {
                  optionName: 'EXTERIOR',
                  handleOption: () => handleFilterOption('intOrExtOption', 'Exterior'),
                  class: defineFilterButtonClass('Exterior', 'intOrExtOption')
                }
              ]
            }
            groupName='INTERIOR OR EXTERIOR'
          />

          <FilterSceneItem
            itemOption='CHARACTERS'
            filterOptions={sortedCharactersArray}
            handleNestedOption={handleNestedFilterOption}
            optionKey='characters'
            defineCheck={defineCheckedFilterOption}
            nestedKey='characterName'
          />

          <FilterSceneItem
            itemOption='EXTRAS'
            filterOptions={sortedExtrasArray}
            handleNestedOption={handleNestedFilterOption}
            optionKey='extras'
            defineCheck={defineCheckedFilterOption}
            nestedKey='extraName'
          />

          {/* ORDER BY NUMBER, ORDER ALPH, IF NUMBER 1. NAME, ELSE NAME*/}

          <FilterSceneItem 
            itemOption='LOCATIONS'
            filterOptions={sortedLocationsArray}
            handleOption={handleFilterOption}
            optionKey='locationName'
            defineCheck={defineCheckedFilterOption}
          />

          {/* LOCATION NAME */}
          
          <FilterSceneItem 
            itemOption='SETS' 
            filterOptions={sortedSetsArray}
            handleOption={handleFilterOption}
            optionKey='setName'
            defineCheck={defineCheckedFilterOption}
          />

          {/* SETS ARE PART FROM LOCATIONS, LOCATION NAME.  SET OR SET */}

          <FilterSceneItem 
            itemOption='ELEMENT CATEGORY'
            filterOptions={sortedElementsCategoryNames}
            handleNestedOption={handleNestedFilterOption}
            optionKey='elements'
            defineCheck={defineCheckedFilterOption}
            nestedKey='categoryName'
          />


          {/* ELEMENT CATEGORY */}

          <FilterSceneItem 
            itemOption='ELEMENTS'
            filterOptions={sortedElementsArray}
            handleNestedOption={handleNestedFilterOption}
            optionKey='elements'
            defineCheck={defineCheckedFilterOption}
            nestedKey='elementName'
          /> 
            
          {/* CategoryName, Element */}
          {/* <FilterButtonsSelect
            selectOptions={
              [
                {
                  optionName: 'UNIT 1',
                  handleOption: () => handleFilterOption('units', 'unit1'),
                  class: defineFilterButtonClass('unit1', 'units')
                },
                {
                  optionName: 'UNIT 2',
                  handleOption: () => handleFilterOption('units', 'unit2'),
                  class: defineFilterButtonClass('unit2', 'units')
                }
              ]
            }
            groupName='UNITS'
          /> */}

          {/* <FilterSceneItem 
            itemOption='DATE'
            filterOptions={getUniqueValuesByKey(scenes, 'date')}
          /> */}

          <IonRow class='ion-flex ion-justify-content-center filter-button-row'>
            <IonCol size-xs='12' size-sm='4' size-md='4'>
              <IonButton 
                expand='block' 
                onClick={handleBack}
                className='outline-primary-button'
              >
                FILTER
              </IonButton>
            </IonCol>
          </IonRow>

          { isMobile && 
          <IonRow>
            <IonCol>
              <IonButton 
                expand='block' 
                onClick={handleBack}
                className='outline-light-button'
              >
                CANCEL
              </IonButton>
            </IonCol>
          </IonRow>
          }
        </IonGrid>
      </IonContent>
    </IonPage>
  )
}

export default FilterScenes