import { IonButton, IonCol, IonRow } from '@ionic/react';
import React from 'react';
import useIsMobile from '../../hooks/useIsMobile';

import './FilterButtonSelect.scss';

type SelectOptions = {
  filterName: string,
  handleOption: () => void,
  class: string
}

interface FilterButtonsSelectProps {
  selectOptions: SelectOptions[],
  groupName: string,
}

const FilterButtonsSelect: React.FC<FilterButtonsSelectProps> = ({ selectOptions, groupName }) => {
  const isMobile = useIsMobile();

  return (
    <IonRow className={`filter-item-container ion-padding${isMobile ? ' ion-margin-top' : ''}`}>
      <IonCol size="12" className="ion-flex ion-justify-content-start filter-button-select-column">
        <p className="ion-text-start ion-no-margin ion-padding-top filter-button-select-title">
          { groupName }
        </p>
      </IonCol>
      {
        selectOptions.map(({ filterName, handleOption, class: optionClass }) => (
          <IonCol key={`filter-button-select-${filterName}`}>
            <IonButton
              expand="block"
              className={`${optionClass} filter-button-select`}
              onClick={handleOption}
            >
              {filterName}
            </IonButton>
          </IonCol>
        ))
      }
    </IonRow>
  );
};

export default FilterButtonsSelect;
