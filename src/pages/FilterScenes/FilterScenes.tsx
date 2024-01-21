import { IonButton, IonCardSubtitle, IonCheckbox, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonList, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react'
import React, { useEffect } from 'react'
import { useHistory, useParams } from 'react-router';
import { useIsMobile } from '../../hooks/useIsMobile';
import { chevronBack } from 'ionicons/icons';
import './FilterScenes.scss';
import FilterButtonsSelect from '../../components/FilterScenes/FilterButtonsSelect';
import useHideTabs from '../../hooks/useHideTabs';
import ScenesFiltersContext from '../../context/scenesFiltersContext';



const FilterScenes = () => {

  const { id } = useParams<{ id: string }>();

  const { filterOptions, setFilterOptions } = React.useContext<any>(ScenesFiltersContext);

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

  const defineFilterButtonClass = (optionValue: string, category: string) => {

    if(filterOptions[category] && filterOptions[category].includes(optionValue)) {
      return 'filled-primary-button';
    } else {
      return 'outline-light-button';
    }
  }

  const resetFilters = () => {
    setFilterOptions({});
  };

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
        <IonGrid>
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

          <FilterButtonsSelect
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
          />

          <IonRow class='ion-flex ion-justify-content-center'>
            <IonCol size-sm='12' size-md='3'>
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