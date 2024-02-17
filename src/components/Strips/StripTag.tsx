import { IonButton, IonIcon } from '@ionic/react';
import React, { useContext } from 'react';
import './StripTag.scss';
import { close } from 'ionicons/icons';
import ScenesContext from '../../context/ScenesContext';

interface StripTagProps {
  tagKey: string;
  filterOption: string;
}

const StripTag: React.FC<StripTagProps> = ({ tagKey, filterOption }) => {
  const { selectedFilterOptions, setSelectedFilterOptions } = useContext(ScenesContext);

  const clearOption = (filterTag: string, filterOptions: any) => {
    const newFilterOptions = { ...filterOptions };

    Object.keys(filterOptions).forEach((key) => {
      const value = filterOptions[key];

      if (Array.isArray(value)) {
        const index = value.indexOf(filterTag);
        if (index !== -1) {
          const newArray = [...value.slice(0, index), ...value.slice(index + 1)];
          if (newArray.length === 0) {
            delete newFilterOptions[key];
          } else {
            newFilterOptions[key] = newArray;
          }
        }
      } else if (typeof value === 'object') {
        Object.keys(value).forEach((subKey) => {
          const subValue = value[subKey];
          if (Array.isArray(subValue) && subValue.includes(filterTag)) {
            const subArray = subValue.filter((option: string) => option !== filterTag);
            if (subArray.length === 0) {
              delete value[subKey];
            } else {
              value[subKey] = subArray;
            }
          }
        });
        if (Object.keys(value).length === 0) {
          delete newFilterOptions[key];
        }
      }
    });

    setSelectedFilterOptions({ ...newFilterOptions });
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
