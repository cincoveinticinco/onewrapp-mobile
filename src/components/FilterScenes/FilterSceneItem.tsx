import { IonButton, IonCheckbox, IonCol, IonContent, IonHeader, IonIcon, IonItem, IonList, IonModal, IonRow, IonSearchbar, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { chevronBack, chevronForward, add, trash } from 'ionicons/icons';
import React, { useState } from 'react';
import './FilterSceneItem.scss';
import HighlightedFilterOption from './HighlightedFilterOptions';
import { useIsMobile } from '../../hooks/useIsMobile';

interface FilterSceneItemProps {
  itemOption: string;
  filterOptions: any[];
  handleOption?: (category: string, optionValue: string) => void;
  handleNestedOption?: (category: string, nestedKey: string, optionValue: string) => void;
  defineCheck: (category: string, optionValue: string, nestedKey?: string) => boolean;
  optionKey: string;
  nestedKey?: string;
}

const FilterSceneItem: React.FC<FilterSceneItemProps> = ({
  itemOption,
  filterOptions,
  handleOption,
  handleNestedOption,
  optionKey,
  defineCheck,
  nestedKey,
}) => {
  const modalRef = React.useRef<HTMLIonModalElement>(null);
  const [searchText, setSearchText] = useState('');

  const isMobile = useIsMobile();

  const handleBack = () => {
    if (modalRef.current) {
      modalRef.current.dismiss();
    }
  };

  const deleteNumberAndDot = (optionString: string) => {
    const numberAndDotPart = optionString.match(/^[0-9]+\./)?.[0] || '';
    const restPart = optionString.replace(numberAndDotPart, '');
    return numberAndDotPart ? restPart.trim() : optionString.trim();
  };

  const filteredOptions = filterOptions.filter((option) =>
    deleteNumberAndDot(option.toUpperCase()).includes(searchText.toUpperCase())
  );

  return (
    <IonRow className="ion-padding-start ion-padding-end filters-items-rows">
      <IonCol size-xs="10" size-sm="10" size-lg="11" size-xl="11" className="ion-flex ion-align-items-center ion-no-margin ion-no-padding">
        <p className="ion-flex ion-align-items-center ion-no-margin">{itemOption}</p>
      </IonCol>
      <IonCol size-xs="2" size-sm="2" size-lg="1" size-xl="1" className="ion-no-margin ion-no-padding ion-flex ion-justify-content-end">
        <IonButton id={`open-${itemOption.toLowerCase().split(' ').join('-')}-modal`} fill="clear" color="light" className="ion-no-margin ion-no-padding">
          View All
          <IonIcon icon={chevronForward} />
        </IonButton>
      </IonCol>
      <IonModal ref={modalRef} trigger={`open-${itemOption.toLowerCase().split(' ').join('-')}-modal`} className="filter-items-modal">
        <IonHeader>
          <IonToolbar color="tertiary" className="add-strip-toolbar ion-no-padding">
            {!isMobile && (
              <>
                <IonButton fill="clear" color="primary" slot="start" onClick={handleBack}>
                  BACK
                </IonButton>
                <IonButton fill="clear" color="primary" slot="end">
                  RESET
                </IonButton>
              </>
            )}

            {isMobile && (
              <IonButton fill="clear" color="primary" slot="start" onClick={handleBack}>
                <IonIcon icon={chevronBack} color="light" />
              </IonButton>
            )}
            <IonTitle className="add-strip-toolbar-title">{itemOption.toUpperCase()}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent color="tertiary">
          <IonToolbar color="tertiary">
            <IonSearchbar
              className="ion-margin-top filters-search-bar"
              value={searchText}
         
              onIonChange={(e) => setSearchText(e.detail.value!)}
              placeholder="SEARCH"
              showCancelButton='focus'
              cancelButtonIcon={trash}
            />
          </IonToolbar>
          <IonList color="tertiary" className="ion-no-padding ion-no-margin">
            {filteredOptions.length === 0 ? (
              <IonItem color="tertiary" className="ion-no-margin ion-no-padding">
                <IonText>No hay coincidencias. ¿Quieres crear uno nuevo?</IonText>
                <IonButton fill="clear" color="primary" slot="end">
                  <IonIcon icon={add} />
                  Nuevo
                </IonButton>
              </IonItem>
            ) : (
              filteredOptions.map((option, index) => (
                <IonItem color="tertiary" key={`filter-item-${index}`} className="sort-option-item filter-item ion-no-margin ion-no-padding">
                  <IonCheckbox
                    slot="start"
                    className="sort-option-checkbox ion-padding"
                    labelPlacement="end"
                    onClick={() => {
                      if (nestedKey && handleNestedOption) {
                        // Nested Options
                        handleNestedOption(optionKey, nestedKey, option);
                      } else if (handleOption) {
                        // Normal Options
                        handleOption(optionKey, option);
                      }
                    }}
                    checked={
                      !nestedKey
                        ? defineCheck(optionKey, option)
                        : defineCheck(optionKey, deleteNumberAndDot(option), nestedKey)
                    }
                  >
                    {<HighlightedFilterOption option={option.toUpperCase()} />}
                  </IonCheckbox>
                </IonItem>
              ))
            )}
          </IonList>
        </IonContent>
      </IonModal>
    </IonRow>
  );
};

export default FilterSceneItem;
