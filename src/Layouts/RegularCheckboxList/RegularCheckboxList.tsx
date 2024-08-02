import React from 'react';
import { IonCheckbox, IonList } from '@ionic/react';
import useIsMobile from '../../hooks/Shared/useIsMobile';
import truncateString from '../../utils/truncateString';
import HighlightedText from '../../components/Shared/HighlightedText/HighlightedText';
import './RegularCheckboxList.scss';
import removeNumberAndDot from '../../utils/removeNumberAndDot';
import { SelectOptionsInterface } from '../../components/Shared/EditionModal/EditionModal';

interface RegularListProps {
  listOfOptions: string[];
  selectedOptions: string[];
  handleCheckboxToggle: (option: string) => void;
  isOptionChecked: (option: string) => boolean;
  multipleSelections: boolean;
  searchText: string;
  uncheckedFilteredOptions: string[];
  checkedSelectedOptions: string[];
  optionsWithStyles?: SelectOptionsInterface[];
}

const RegularList: React.FC<RegularListProps> = ({
  listOfOptions,
  handleCheckboxToggle,
  isOptionChecked,
  multipleSelections,
  searchText,
  uncheckedFilteredOptions,
  checkedSelectedOptions,
  optionsWithStyles,
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

  const handleItemStyles = (label: string) => {
    if (optionsWithStyles) {
      console.log(optionsWithStyles)
      const optionStyle = optionsWithStyles.find((optionStyle: SelectOptionsInterface) => optionStyle.label === label);
      console.log(optionStyle)
      if (optionStyle) {
        console.log(optionStyle.style);
        return optionStyle.style;
      }
    }
  }

  return (
    <IonList color="tertiary" className="ion-no-padding ion-margin options-list" style={getListStyles()}>
      {checkedSelectedOptions.map((option: string, i: number) => (
        <div
          color="tertiary"
          key={`filter-item-${i}`}
          className="checkbox-item-option filter-item ion-no-margin ion-no-padding"
          onClick={() => handleCheckboxToggle(option)}
          style={handleItemStyles(option)}
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
          style={handleItemStyles(option)}
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
