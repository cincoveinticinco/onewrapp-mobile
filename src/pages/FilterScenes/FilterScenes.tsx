import { IonButton, IonCardSubtitle, IonCheckbox, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonList, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router';
import { useIsMobile } from '../../hooks/useIsMobile';
import { appsSharp, chevronBack } from 'ionicons/icons';
import './FilterScenes.scss';
import FilterButtonsSelect from '../../components/FilterScenes/FilterButtonsSelect';
import useHideTabs from '../../hooks/useHideTabs';



const FilterScenes = () => {

  const [filterOptions, setFilterOptions]: any[] = React.useState(
    {
      stripType: {
        scenes: false,
        protection: false
      },
      dayOrNight: {
        day: false,
        night: false,
        sunrise: false,
        sunset: false
      },
      interiorOrExterior: {
        interior: false,
        exterior: false
      },
      units: {
        unit1: false,
        unit2: false,
      }
    }
  )

  const history = useHistory();
  const isMobile = useIsMobile();
  useHideTabs();

  const handleBack = () => {
    history.goBack();
  };

  const handleFilterOption = ( option: boolean, parentKey: string, subKey: string) => {

    setFilterOptions({
      ...filterOptions,
      [parentKey]: {
        ...filterOptions[parentKey],
        [subKey]: option
      }
    })
  }

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
              slot='end'>
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
                  handleOption: () => handleFilterOption(!filterOptions.stripType.scenes, 'stripType', 'scenes'),
                  class: filterOptions.stripType.scenes ? 'filled-primary-button' : 'outline-light-button'
                },
                {
                  optionName: 'PROTECTION',
                  handleOption: () => handleFilterOption(!filterOptions.stripType.protection, 'stripType', 'protection'),
                  class: filterOptions.stripType.protection ? 'filled-primary-button' : 'outline-light-button'
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
                  handleOption: () => handleFilterOption(!filterOptions.dayOrNight.day, 'dayOrNight', 'day'),
                  class: filterOptions.dayOrNight.day ? 'filled-primary-button' : 'outline-light-button'
                },
                {
                  optionName: 'NIGHT',
                  handleOption: () => handleFilterOption(!filterOptions.dayOrNight.night, 'dayOrNight', 'night'),
                  class: filterOptions.dayOrNight.night ? 'filled-primary-button' : 'outline-light-button'
                },
                {
                  optionName: 'SUNRISE',
                  handleOption: () => handleFilterOption(!filterOptions.dayOrNight.sunrise, 'dayOrNight', 'sunrise'),
                  class: filterOptions.dayOrNight.sunrise ? 'filled-primary-button' : 'outline-light-button'
                },
                {
                  optionName: 'SUNSET',
                  handleOption: () => handleFilterOption(!filterOptions.dayOrNight.sunset, 'dayOrNight', 'sunset'),
                  class: filterOptions.dayOrNight.sunset ? 'filled-primary-button' : 'outline-light-button'
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
                  handleOption: () => handleFilterOption(!filterOptions.interiorOrExterior.interior, 'interiorOrExterior', 'interior'),
                  class: filterOptions.interiorOrExterior.interior ? 'filled-primary-button' : 'outline-light-button'
                },
                {
                  optionName: 'EXTERIOR',
                  handleOption: () => handleFilterOption(!filterOptions.interiorOrExterior.exterior, 'interiorOrExterior', 'exterior'),
                  class: filterOptions.interiorOrExterior.exterior ? 'filled-primary-button' : 'outline-light-button'
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
                  handleOption: () => handleFilterOption(!filterOptions.units.unit1, 'units', 'unit1'),
                  class: filterOptions.units.unit1 ? 'filled-primary-button' : 'outline-light-button'
                },
                {
                  optionName: 'UNIT 2',
                  handleOption: () => handleFilterOption(!filterOptions.units.unit2, 'units', 'unit2'),
                  class: filterOptions.units.unit2 ? 'filled-primary-button' : 'outline-light-button'
                }
              ]
            }
            groupName='UNITS'
          />
        </IonGrid>
      </IonContent>
    </IonPage>
  )
}

export default FilterScenes