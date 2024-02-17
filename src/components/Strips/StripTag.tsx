import React, { useContext } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { close } from 'ionicons/icons';
import ScenesContext from '../../context/ScenesContext';
import './StripTag.scss';

interface StripTagProps {
  tagKey: string;
  filterOption: string;
}

const StripTag: React.FC<StripTagProps> = ({ tagKey, filterOption }) => {
  const { selectedFilterOptions, setSelectedFilterOptions } = useContext(ScenesContext);

  // Function to find key by value
  const findKeyByValue = (obj: any, value: any) => {
    return Object.keys(obj).find(key => obj[key].includes(value));
  };

  // Function to clear option
  const clearOption = (filterTag: string, filterOptions: any) => {
    Object.entries(filterOptions).forEach(([key, value]: any[]) => {
      if (value.every((val: any[]) => typeof val === 'string')) {
        handleStringOptions(key, value, filterTag, filterOptions);
      } else if (value.every((val: any) => typeof val === 'object')) {
        handleObjectOptions(key, value, filterTag, filterOptions);
      }
    });
  };

  // Function to handle clearing string options
  const handleStringOptions = (key: string, value: any[], filterTag: string, filterOptions: any) => {
    if (value.length <= 1) {
      const newFilterOptions = { ...filterOptions };
      const optionKey: any = findKeyByValue(filterOptions, filterTag);
      delete newFilterOptions[optionKey];
      setSelectedFilterOptions({ ...newFilterOptions });
    } else {
      const filteredOptionArray = value.filter((option: any) => option !== filterTag);
      setSelectedFilterOptions({ ...filterOptions, [key]: filteredOptionArray });
    }
  };

  // Function to handle clearing object options
  const handleObjectOptions = (key: string, value: any[], filterTag: string, filterOptions: any) => {
    value.forEach((val: any) => {
      const newSubArray = value.filter((option: any) => option !== val);
      Object.entries(val).forEach(([subKey, subValue]: any[]) => {
        if (subValue.length <= 1 && newSubArray.length <= 1) {
          const newFilterOptions = { ...filterOptions };
          delete newFilterOptions[key];
          setSelectedFilterOptions({ ...newFilterOptions });
        } else {
          const newSubArray = subValue.filter((option: string) => option !== filterTag);
          const subValueIndex = value.findIndex(({ unused_, array }: any) => array === subValue);
          value[subValueIndex] = newSubArray;
          const newFilterOptions = { ...filterOptions };
          const objectIndex = newFilterOptions[key].findIndex((option: any) => option === val);
          newFilterOptions[key][objectIndex][subKey] = newSubArray;
          setSelectedFilterOptions(newFilterOptions);
        }
      });
    });
  };

  return (
    <div key={tagKey} className="filter-tag-container">
      <p className='ion-no-padding ion-no-margin'>{filterOption.toUpperCase()}</p>
      <IonButton onClick={() => clearOption(filterOption, selectedFilterOptions)} fill='clear' color='danger' className='ion-no-padding'>
        <IonIcon icon={close} />
      </IonButton>
    </div>
  );
};

export default StripTag;
