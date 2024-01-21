import { IonButton, IonCol, IonRow } from '@ionic/react'
import React from 'react'

type SelectOptions = {
  optionName: string,
  handleOption: () => void,
  class: string
}

interface FilterButtonsSelectProps {
  selectOptions: SelectOptions[],
  groupName: string,
}

const FilterButtonsSelect: React.FC<FilterButtonsSelectProps> = ({ selectOptions, groupName }) => {
  return (
    <IonRow className='filter-item-container ion-margin-top'>
      <IonCol size='12' className='ion-flex ion-justify-content-start'>
        <h6 className='ion-text-start'>
          { groupName }
        </h6>
      </IonCol>
      {
        selectOptions.map((option, index) => {
          return (
            <IonCol key={`filter-button-select-${index}`}>
              <IonCol>
                <IonButton
                  expand='block' 
                  className={option.class}
                  onClick={() => option.handleOption()} 
                >
                  {option.optionName}
                </IonButton>
              </IonCol>
            </IonCol>
          );
        })
      }
    </IonRow>
  )
}

export default FilterButtonsSelect