import React, {
  useContext, useEffect, useState, useMemo, useRef,
} from 'react';
import {
  IonContent,
} from '@ionic/react';
import { useLocation } from 'react-router';
import DatabaseContext from '../../context/database';
import getUniqueValuesByKey from '../../utils/getUniqueValuesByKey';
import getUniqueValuesFromNestedArray from '../../utils/getUniqueValuesFromNestedArray';
import { SceneTypeEnum } from '../../Ennums/ennums';
import MainPagesLayout from '../../Layouts/MainPagesLayout/MainPagesLayout';
import useHandleBack from '../../hooks/useHandleBack';
import ScrollInfiniteContext from '../../context/ScrollInfiniteContext';
import useScrollToTop from '../../hooks/useScrollToTop';
import sortByCriterias from '../../utils/SortScenesUtils/sortByCriterias';
import InputSortModal from '../../components/Shared/InputSortModal/InputSortModal';
import ScenesContext, { castDefaultSortOptions } from '../../context/ScenesContext';
import CastCard from '../../components/Cast/CastCard';
import DropDownButton from '../../components/Shared/DropDownButton/DropDownButton';
import './Cast.scss';

const Cast: React.FC = () => {
  const { offlineScenes } = useContext(DatabaseContext);
  const [cast, setCast] = useState<any[]>([]);
  const [filteredCast, setFilteredCast] = useState<any>({});
  const [castSearchText, setCastSearchText] = useState('');
  const [displayedCast, setDisplayedCast] = useState<any>({});
  const thisPath = useLocation();
  const contentRef = useRef<HTMLIonContentElement>(null);
  useScrollToTop(contentRef, thisPath);
  const { castSelectedSortOptions, setCastSelectedSortOptions } = useContext(ScenesContext);
  const [dropDownIsOpen, setDropDownIsOpen] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  /// REMOVE SYMBOLS
  /// LOCATION AND ELEMENTS CATEGORY
  /// CREATE NEW CHARACTERS

  const handleBack = useHandleBack();

  // REMOVE NULL CHARACTERS
  const processedCast = useMemo(() => {
    const processCharacter = (character: any) => {
      const scenes: any[] = offlineScenes.reduce((acc: any[], scene: any) => {
        const hasCharacter = scene._data.characters.some(
          (sceneCharacter: any) => sceneCharacter.characterName === character.characterName,
        );
        if (hasCharacter) {
          acc.push(scene._data);
        }
        return acc;
      }, []);

      const setsQuantity: number = getUniqueValuesByKey(scenes, 'setName').length;
      const locationsQuantity: number = getUniqueValuesByKey(scenes, 'locationName').length;
      const pagesSum: number = scenes.reduce((acc, scene) => acc + (scene.pages || 0), 0);
      const estimatedTimeSum: number = scenes.reduce((acc, scene) => acc + (scene.estimatedSeconds || 0), 0);
      const episodesQuantity: number = getUniqueValuesByKey(scenes, 'episodeNumber').length;
      const scenesQuantity: number = scenes.filter((scene) => scene.sceneType === SceneTypeEnum.SCENE).length;
      const protectionQuantity: number = scenes.filter((scene) => scene.sceneType === SceneTypeEnum.PROTECTION).length;
      const participation: string = ((scenesQuantity / offlineScenes.length) * 100).toFixed(0);

      return {
        characterNum: character.characterNum,
        characterName: character.characterName,
        categoryName: character.categoryName || 'NO CATEGORY',
        setsQuantity,
        locationsQuantity,
        pagesSum,
        estimatedTimeSum,
        episodesQuantity,
        scenesQuantity,
        protectionQuantity,
        participation,
      };
    };

    const uniqueCharacters: any[] = getUniqueValuesFromNestedArray(offlineScenes, 'characters', 'characterName');
    return sortByCriterias(uniqueCharacters.map(processCharacter), castSelectedSortOptions);
  }, [offlineScenes, castSelectedSortOptions]);

  useEffect(() => {
    if(processedCast.length > 0) {
      setIsLoading(false);
    }
  }, [isLoading, processedCast]);

  useEffect(() => {
    const filteredCast = castSearchText.length > 0 ? processedCast.filter((character: any) => {
      const characterHeader = `${character.characterNum}. ${character.characterName}`;
      return characterHeader.toLowerCase().includes(castSearchText.toLowerCase());
    }) : processedCast;
    setCast(filteredCast);
  }, [processedCast, castSearchText]);

  const getCharacterNum = (character: any) => {
    const characterNum = character.characterNum ? `${character.characterNum}.` : '';
    return characterNum;
  };

  const defaultSortPosibilitiesOrder = [
    {
      id: 'CHARACTER_NUM', label: 'CHARACTER NUM', optionKey: 'characterNum', defaultIndex: 0,
    },
    {
      id: 'CHARACTER_NAME', label: 'CHARACTER NAME', optionKey: 'characterName', defaultIndex: 1,
    },
    {
      id: 'SETS_QUANTITY', label: 'SETS QUANTITY', optionKey: 'setsQuantity', defaultIndex: 2,
    },
    {
      id: 'LOCATIONS_QUANTITY', label: 'LOCATIONS QUANTITY', optionKey: 'locationsQuantity', defaultIndex: 3,
    },
    {
      id: 'PAGES_SUM', label: 'PAGES SUM', optionKey: 'pagesSum', defaultIndex: 4,
    },
    {
      id: 'ESTIMATED_TIME_SUM', label: 'ESTIMATED TIME SUM', optionKey: 'estimatedTimeSum', defaultIndex: 5,
    },
    {
      id: 'EPISODES_QUANTITY', label: 'EPISODES QUANTITY', optionKey: 'episodesQuantity', defaultIndex: 6,
    },
    {
      id: 'SCENES_QUANTITY', label: 'SCENES QUANTITY', optionKey: 'scenesQuantity', defaultIndex: 7,
    },
    {
      id: 'PROTECTION_QUANTITY', label: 'PROTECTION QUANTITY', optionKey: 'protectionQuantity', defaultIndex: 8,
    },
    {
      id: 'PARTICIPATION', label: 'PARTICIPATION', optionKey: 'participation', defaultIndex: 9,
    },
  ];

  const clearSortSelections = () => {
    localStorage.removeItem('castSelectedSortOptions');
    localStorage.removeItem('castSortPosibilitiesOrder');
    setCastSelectedSortOptions(castDefaultSortOptions);
    setCastSortPosibilities(defaultSortPosibilitiesOrder);
  };

  const [castSortPosibilities, setCastSortPosibilities] = React.useState<any[]>(() => {
    const savedOrder = localStorage.getItem('castSortPosibilitiesOrder');
    if (savedOrder) {
      return JSON.parse(savedOrder);
    }
    return defaultSortPosibilitiesOrder;
  });

  useEffect(() => {
    localStorage.setItem('castSortPosibilitiesOrder', JSON.stringify(castSortPosibilities));
  }, [castSortPosibilities]);

  const characterCategoriesArray: any[] = getUniqueValuesByKey(cast, 'categoryName');

  const filterCastByCategory = (category: string) => {
    return cast.filter((character: any) => character.categoryName === category);
  }

  useEffect(() => {
    characterCategoriesArray.forEach((category: string) => {
      setDropDownIsOpen((prev: any) => ({ ...prev, [category]: true}));
    })
  }, [cast])

  const handleDropDown = (category: string) => { 
    setDropDownIsOpen((prev: any) => ({ ...prev, [category]: !prev[category]}));
  }

  function removeDuplicatesFromArray(array: any[]) {
    const uniqueSet = new Set(array);
    const uniqueArray = [...uniqueSet];
    return uniqueArray;
  }

  useEffect(() => {
    if(isLoading) {
      return;
    }
    characterCategoriesArray.forEach((category: string) => {
      setDisplayedCast((prev: any) => ({ ...prev, [category]: filterCastByCategory(category).slice(0, 5)}));
    })
  }, [cast])

  const handleSetDisplayedCast = (category: string, newElements: any[]) => {
    
   return setDisplayedCast((prev: any) => ({ ...prev, [category]: removeDuplicatesFromArray([...prev[category], ...newElements])}));
  }

  useEffect(() => {
    characterCategoriesArray.forEach((category: string) => {
      setFilteredCast((prev: any) => ({ ...prev, [category]: filterCastByCategory(category)}));
    })
  }, [cast])

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
      <IonContent color="tertiary" fullscreen ref={contentRef} className='cast-page-content'>
        {characterCategoriesArray.map((category: string, index: number) => (
          <div key={`cast-dropdown-${category}-${index}`}>
            <div className="cast-dropdown category-item-title ion-flex ion-justify-content-between ion-padding-start" onClick={() => handleDropDown(category)}>
              <p className="ion-flex ion-align-items-center">
                {category + ' (' + filterCastByCategory(category).length + ')'}
              </p>
              <div className="categories-card-buttons-wrapper ion-flex ion-align-items-center">
                <DropDownButton open={dropDownIsOpen[category]} />
              </div>
            </div>
            {dropDownIsOpen[category] && (
              <div style={{ margin: '0px 0px' }} className='cast-cards-wrapper ion-content-scroll-host'>
                <ScrollInfiniteContext
                  filteredData={filteredCast[category]}
                  setDisplayedData={(newElements: any[]) => handleSetDisplayedCast(category, newElements)}
                  batchSize={5}
                >
                  { 
                    displayedCast[category] &&
                    displayedCast[category].map((character: any, index: number) => (
                      <CastCard key={`${category}-${index}`} character={character} searchText={castSearchText} />
                    ))
                  }
                </ScrollInfiniteContext>
              </div>
            )}
          </div>
        ))}
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
