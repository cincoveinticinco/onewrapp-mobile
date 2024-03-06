// React and React-related imports
import React, {
  useContext, useEffect, useState, useMemo, useRef,
} from 'react';

// React component and utility imports
import { IonContent } from '@ionic/react';
import { useLocation } from 'react-router';
import MainPagesLayout from '../../Layouts/MainPagesLayout/MainPagesLayout';
import InputSortModal from '../../components/Shared/InputSortModal/InputSortModal';
import CastCard from '../../components/Cast/CastCard';
import DropDownCast from '../../components/Cast/DropDownCast';

// Custom contexts and hooks imports
import ScrollInfiniteContext from '../../context/ScrollInfiniteContext';
import ScenesContext, { castDefaultSortOptions } from '../../context/ScenesContext';
import useHandleBack from '../../hooks/useHandleBack';
import useScrollToTop from '../../hooks/useScrollToTop';
import useProcessedCast from '../../hooks/useProcessedCast';

// Utility and configuration imports
import getUniqueValuesByKey from '../../utils/getUniqueValuesByKey';
import defaultSortPosibilitiesOrder from '../../utils/Cast/SortOptions';
import { filter, set } from 'lodash';
import removeAccents from '../../utils/removeAccents';
import { search } from 'ionicons/icons';

const Cast: React.FC = () => {

  // Context

  const { castSelectedSortOptions, setCastSelectedSortOptions } = useContext(ScenesContext);

  // State

  const [cast, setCast] = useState<any[]>([]);
  const [extras, setExtras] = useState<any[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<any>([]);
  const [filteredCast, setFilteredCast] = useState<any>({});
  const [castSearchText, setCastSearchText] = useState('');
  const [displayedCast, setDisplayedCast] = useState<any>({});
  const [dropDownIsOpen, setDropDownIsOpen] = useState<any>({});

  const [castSortPosibilities, setCastSortPosibilities] = React.useState<any[]>(() => {
    const savedOrder = localStorage.getItem('castSortPosibilitiesOrder');
    if (savedOrder) {
      return JSON.parse(savedOrder);
    }
    return defaultSortPosibilitiesOrder;
  });

  //Refs

  const contentRef = useRef<HTMLIonContentElement>(null);

  // Hooks

  const thisPath = useLocation();
  useScrollToTop(contentRef, thisPath);
  const { processedCast, processedExtras, isLoading } = useProcessedCast();
  const handleBack = useHandleBack();

  // Utility Functions

  const clearSortSelections = () => {
    localStorage.removeItem('castSelectedSortOptions');
    localStorage.removeItem('castSortPosibilitiesOrder');
    setCastSelectedSortOptions(castDefaultSortOptions);
    setCastSortPosibilities(defaultSortPosibilitiesOrder);
  };

  const removeDuplicatesFromArray = (array: any[]) => {
    const uniqueSet = new Set(array);
    const uniqueArray = [...uniqueSet];
    return uniqueArray;
  }

  const characterCategoriesArray: any[] = getUniqueValuesByKey(cast, 'categoryName');

  const filterCastByCategory = (category: string) => cast.filter((character: any) => character.categoryName === category);

  // Function to filter categories with search text

  const filterCategories = (category: string) => {
    const searchText = removeAccents(castSearchText).toLowerCase();
    const lowerCategory = category.toLowerCase();

    // Check if the category name includes the search text
    const includesCategory = lowerCategory.includes(searchText);

    // Check if any character in the category matches the search text
    const includesCharacter = processedCast.some((character: any) => {
      return (
        character.categoryName.toLowerCase() === lowerCategory ||
        removeAccents(character.characterHeader).toLowerCase().includes(searchText)
      );
    });

    return includesCategory || includesCharacter;
  };

  // Efects

  useEffect(() => {
    setCast(processedCast);
  }, [processedCast]);

  useEffect(() => {
    if(castSearchText.length > 0) {
      const filteredCast = processedCast.filter((character: any) => {
        const characterHeader = removeAccents(character.characterHeader).toLowerCase();
        const searchText = removeAccents(castSearchText).toLowerCase();
        
        return characterHeader.includes(searchText) || character.categoryName.toLowerCase().includes(castSearchText.toLowerCase());
      });
  
      setCast(filteredCast);
    } else {
      setCast(processedCast);
    }

  }, [processedCast, castSearchText]); // Filter Cast by search text

  useEffect(() => {
    if(castSearchText.length > 0) {
      setFilteredCategories(filteredCategories.filter(filterCategories));
    } else {
      setFilteredCategories(characterCategoriesArray);
    }
  }, [castSearchText]); // Filter categories by search text

  useEffect(() => {
    const filteredExtras = castSearchText.length > 0 ? processedExtras.filter((extra: any) => {
      const extraHeader = removeAccents(extra.extraName).toLowerCase();
      const searchText = removeAccents(castSearchText).toLowerCase();
      const category = 'EXTRAS'
      return extraHeader.includes(searchText) || category.toLowerCase().includes(castSearchText.toLowerCase());

    }) : processedExtras;

    setExtras(filteredExtras);
  }, [processedExtras, castSearchText]); // Filter Extras by search text

  useEffect(() => {
    localStorage.setItem('castSortPosibilitiesOrder', JSON.stringify(castSortPosibilities));
  }, [castSortPosibilities]); // Store selected sort options on the local storage

  useEffect(() => {
    characterCategoriesArray.forEach((category: string) => {
      setDropDownIsOpen((prev: any) => ({ ...prev, [category]: true }));
    });

    if (extras.length > 0) {
      setDropDownIsOpen((prev: any) => ({ ...prev, EXTRAS: true }));
    }
  }, [cast, extras]);

  const handleDropDown = (category: string) => {
    setDropDownIsOpen((prev: any) => ({ ...prev, [category]: (prev[category] ? !prev[category] : true) }));
  };

  useEffect(() => {
    if (isLoading) {
      return;
    }

    characterCategoriesArray.forEach((category: string) => {
      setDisplayedCast((prev: any) => ({ ...prev, [category]: filterCastByCategory(category).slice(0, 5) }));
    });

    if (extras.length > 0) {
      setDisplayedCast((prev: any) => ({ ...prev, EXTRAS: extras.slice(0, 5) }));
    }
  }, [cast, extras, isLoading]);

  const handleSetDisplayedCast = (category: string, newElements: any[]) => setDisplayedCast((prev: any) => ({ ...prev, [category]: removeDuplicatesFromArray([...(prev[category] ? prev[category] : []), ...newElements]) }));

  useEffect(() => {
    characterCategoriesArray.forEach((category: string) => {
      setFilteredCast((prev: any) => ({ ...prev, [category]: filterCastByCategory(category) }));
    });

  }, [cast]);

  useEffect(() => {
    if (characterCategoriesArray && castSearchText.length === 0) {
      setFilteredCategories(characterCategoriesArray );
    }
  }, [cast]);
  
  // Render

  return (
    <>
      <MainPagesLayout
        searchText={castSearchText}
        setSearchText={setCastSearchText}
        handleBack={handleBack}
        title="CAST"
        search
        sort
        sortTrigger="sort-cast-modal-trigger"
      >
        <IonContent color="tertiary" fullscreen ref={contentRef} className="cast-page-content">
          {
            filteredCategories.map((category: string, index: number) => (
            <DropDownCast
              key={`cast-dropdown-${category}-${index}`}
              category={category}
              isOpen={dropDownIsOpen[category]}
              onToggle={() => handleDropDown(category)}
              count={filteredCast[category].length}
              searchTerm={castSearchText}
            >
              <ScrollInfiniteContext
                filteredData={filteredCast[category]}
                setDisplayedData={(newElements: any[]) => handleSetDisplayedCast(category, newElements)}
                batchSize={7}
              >
                {
                  displayedCast[category]
                  && displayedCast[category].map((character: any, index: number) => (
                    <CastCard key={`${category}-${index}`} character={character} searchText={castSearchText} />
                  ))
                }
              </ScrollInfiniteContext>
            </DropDownCast>
          ))}
          {extras.length > 0 && (
          <DropDownCast
            key="cast-dropdown-EXTRAS"
            category="EXTRAS"
            isOpen={dropDownIsOpen.EXTRAS}
            onToggle={() => handleDropDown('EXTRAS')}
            count={extras.length}
            searchTerm={castSearchText}
          >
            <ScrollInfiniteContext
              filteredData={extras}
              setDisplayedData={(newElements: any[]) => handleSetDisplayedCast('EXTRAS', newElements)}
              batchSize={7}
            >
              {
                dropDownIsOpen.EXTRAS
                && displayedCast.EXTRAS.map((extra: any, index: number) => (
                  <CastCard key={`EXTRAS-${index}`} character={extra} searchText={castSearchText} />
                ))
              }
            </ScrollInfiniteContext>
          </DropDownCast>
          )}
        </IonContent>
      </MainPagesLayout>
      <InputSortModal
        pageName="Sort Cast"
        modalTrigger="sort-cast-modal-trigger"
        defaultSortOptions={castDefaultSortOptions}
        setSelectedSortOptions={setCastSelectedSortOptions}
        selectedSortOptions={castSelectedSortOptions}
        clearSelections={clearSortSelections}
        setSortPosibilities={setCastSortPosibilities}
        sortPosibilities={castSortPosibilities}
      />
    </>
  );
};

export default Cast;
