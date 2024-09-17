import { IonList } from '@ionic/react';
import { useContext } from 'react';
import ScenesContext from '../../context/Scenes.context';
import StripTag from './StripTag';
import './StripTagsToolbar.scss';

const StripTagsToolbar = () => {
  const { selectedFilterOptions } = useContext(ScenesContext);

  const depuredFilterOptions = () => {
    const newFilterOptions: any = {
      ...selectedFilterOptions,
    };

    if (newFilterOptions.$or) {
      delete newFilterOptions.$or;
    }

    return newFilterOptions;
  };

  // Get all selected filter options and flatten them
  const flattenedSelectedFilterOptions = Object.values(depuredFilterOptions()).flat();

  // Flatten the filter options that are objects
  const flattenedStrings = flattenedSelectedFilterOptions.map((item: any) => {
    if (typeof item === 'string') {
      return item;
    }

    if (typeof item === 'object') {
      return Object.values(item).flat();
    }
  });

  const filterOptionsStrings = flattenedStrings.flat();

  return (
    <>
      {filterOptionsStrings && filterOptionsStrings.length > 0 && (
        <IonList color="tertiary" className="list-of-tags-filters">
          {filterOptionsStrings.map((string: any) => (
            <StripTag key={`${Math.random()}`} tagKey={`${Math.random()}`} filterOption={string} />
          ))}
        </IonList>
      )}
    </>
  );
};

export default StripTagsToolbar;
