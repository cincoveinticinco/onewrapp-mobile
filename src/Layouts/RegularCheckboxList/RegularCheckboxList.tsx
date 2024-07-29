import React from 'react';
import { IonCheckbox, IonList } from '@ionic/react';
import useIsMobile from '../../hooks/Shared/useIsMobile';
import truncateString from '../../utils/truncateString';
import HighlightedText from '../../components/Shared/HighlightedText/HighlightedText';
import './RegularCheckboxList.scss';
import removeNumberAndDot from '../../utils/removeNumberAndDot';

interface RegularListProps {
  listOfOptions: string[];
  selectedOptions: string[];
  handleCheckboxToggle: (option: string) => void;
  isOptionChecked: (option: string) => boolean;
  multipleSelections: boolean;
  searchText: string;
  uncheckedFilteredOptions: string[];
  checkedSelectedOptions: string[];
}

const RegularList: React.FC<RegularListProps> = ({
  listOfOptions,
  handleCheckboxToggle,
  isOptionChecked,
  multipleSelections,
  searchText,
  uncheckedFilteredOptions,
  checkedSelectedOptions,
}) => {
  const isMobile = useIsMobile();

  const getListStyles = () => {
    if (uncheckedFilteredOptions.length === 0 && listOfOptions.length > 10) {
      return { border: 'none', outline: 'none', marginTop: '100px' };
    }

    if (listOfOptions.length > 10) {
      return { marginTop: '100px' };
    }

    if (uncheckedFilteredOptions.length === 0 && listOfOptions.length <= 10) {
      return {};
    }

    return {};
  };

  return (
    <IonList color="tertiary" className="ion-no-padding ion-margin options-list" style={getListStyles()}>
      {checkedSelectedOptions.map((option: string, i: number) => (
        <div
          color="tertiary"
          key={`filter-item-${i}`}
          className="checkbox-item-option filter-item ion-no-margin ion-no-padding"
          onClick={() => handleCheckboxToggle(option)}
        >
          <IonCheckbox
            slot="start"
            className="ion-no-margin ion-no-padding checkbox-option"
            labelPlacement="end"
            checked={isOptionChecked(option)}
          >
            <HighlightedText text={truncateString(option.toUpperCase(), (isMobile ? 30 : 140))} searchTerm={searchText} />
          </IonCheckbox>
        </div>
      ))}
      {uncheckedFilteredOptions.map((option: string, i: number) => (
        <div
          color="tertiary"
          key={`filter-item-${i}`}
          className="checkbox-item-option filter-item ion-no-margin ion-no-padding"
          onClick={() => handleCheckboxToggle(option)}
        >
          <IonCheckbox
            slot="start"
            className="ion-no-margin ion-no-padding checkbox-option"
            labelPlacement="end"
            checked={isOptionChecked(option)}
            disabled={!multipleSelections && checkedSelectedOptions.length > 0}
          >
            <HighlightedText text={truncateString(option.toUpperCase(), 30)} searchTerm={searchText} />
          </IonCheckbox>
        </div>
      ))}
    </IonList>
  );
};

export default RegularList;
