import React, {
  useContext, useState, useMemo, useCallback, useRef, useEffect,
} from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonCardTitle,
} from '@ionic/react';
import { useLocation } from 'react-router';
import DatabaseContext from '../../context/database';
import getUniqueValuesByKey from '../../utils/getUniqueValuesByKey';
import { SceneTypeEnum } from '../../Ennums/ennums';
import getUniqueValuesFromNestedArray from '../../utils/getUniqueValuesFromNestedArray';
import sortArrayAlphabeticaly from '../../utils/sortArrayAlphabeticaly';
import ScrollInfiniteContext from '../../context/ScrollInfiniteContext';
import useScrollToTop from '../../hooks/useScrollToTop';
import floatToFraction from '../../utils/floatToFraction';
import secondsToMinSec from '../../utils/secondsToMinSec';
import HighlightedText from '../../components/Shared/HighlightedText/HighlightedText';
import MainPagesLayout from '../../Layouts/MainPagesLayout/MainPagesLayout';
import InputSortModal from '../../components/Shared/InputSortModal/InputSortModal';
import ScenesContext, { elementsCategoriesDefaultSortOptions, elementsDefaultSortOptions } from '../../context/ScenesContext';
import sortByCriterias from '../../utils/SortScenesUtils/sortByCriterias';
import CategoryCard from '../../components/Elements/CategoryCard';
import ElementCard from '../../components/Elements/ElementCard';

const Elements: React.FC = () => {
  const { offlineScenes } = useContext(DatabaseContext);
  const [activeSection, setActiveSection] = useState<string>('category');
  const [displayedElements, setDisplayedElements] = useState<any[]>([]);
  const [displayedCategories, setDisplayedCategories] = useState<any[]>([]);
  const [filteredElements, setFilteredElements] = useState<any[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const {
    elementsSelectedSortOptions, setElementsSelectedSortOptions, elementsCategoriesSelectedSortOptions, setElementsCategoriesSelectedSortOptions,
  } = useContext(ScenesContext);

  const defaultElementsSortPosibilities = [
    {
      id: 'ELEMENT_NAME', label: 'ELEMENT NAME', optionKey: 'elementName', defaultIndex: 0,
    },
    {
      id: 'SCENES_QUANTITY', label: 'SCENES QUANTITY', optionKey: 'scenesQuantity', defaultIndex: 1,
    },
    {
      id: 'PROTECTION_QUANTITY', label: 'PROTECTION QUANTITY', optionKey: 'protectionQuantity', defaultIndex: 2,
    },
    {
      id: 'PAGES_SUM', label: 'PAGES SUM', optionKey: 'pagesSum', defaultIndex: 3,
    },
    {
      id: 'ESTIMATED_TIME_SUM', label: 'ESTIMATED TIME SUM', optionKey: 'estimatedTimeSum', defaultIndex: 4,
    },
    {
      id: 'EPISODES_QUANTITY', label: 'EPISODES QUANTITY', optionKey: 'episodesQuantity', defaultIndex: 5,
    },
    {
      id: 'PARTICIPATION', label: 'PARTICIPATION', optionKey: 'participation', defaultIndex: 6,
    },
  ];

  const defaultElementsCategoriesSortPosibilities = [
    {
      id: 'CATEGORY_NAME', label: 'CATEGORY NAME', optionKey: 'categoryName', defaultIndex: 0,
    },
    {
      id: 'ELEMENTS_QUANTITY', label: 'ELEMENTS QUANTITY', optionKey: 'elementsQuantity', defaultIndex: 1,
    },
    {
      id: 'SCENES_QUANTITY', label: 'SCENES QUANTITY', optionKey: 'scenesQuantity', defaultIndex: 2,
    },
    {
      id: 'PROTECTION_QUANTITY', label: 'PROTECTION QUANTITY', optionKey: 'protectionQuantity', defaultIndex: 3,
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
      id: 'PARTICIPATION', label: 'PARTICIPATION', optionKey: 'participation', defaultIndex: 7,
    },
  ];

  const [elementsSortPosibilities, setElementsSortPosibilities] = useState<any[]>(() => defaultElementsSortPosibilities);

  const [elementsCategoriesSortPosibilities, setElementsCategoriesSortPosibilities] = useState<any[]>(() => {
    const savedSortOptions = localStorage.getItem('categoriesSortPosibilities');
    if (savedSortOptions) {
      return JSON.parse(savedSortOptions);
    }
    return defaultElementsCategoriesSortPosibilities;
  });

  useEffect(() => {
    localStorage.setItem('elementsSortPosibilities', JSON.stringify(elementsSortPosibilities));
  }, [elementsSortPosibilities]);

  useEffect(() => {
    localStorage.setItem('elementsCategoriesSortPosibilities', JSON.stringify(elementsCategoriesSortPosibilities));
  }, [elementsCategoriesSortPosibilities]);

  const clearSelectedElementsSortOptions = () => {
    localStorage.removeItem('elementsSelectedSortOptions');
    localStorage.removeItem('elementsSortPosibilities');
    setElementsSelectedSortOptions(elementsDefaultSortOptions);
    setElementsSortPosibilities(defaultElementsSortPosibilities);
  };

  const clearSelectedCategoriesSortOptions = () => {
    localStorage.removeItem('elementsCategoriesSelectedSortOptions');
    localStorage.removeItem('elementsCategoriesSortPosibilities');
    setElementsCategoriesSelectedSortOptions(elementsCategoriesDefaultSortOptions);
    setElementsCategoriesSortPosibilities(defaultElementsCategoriesSortPosibilities);
  };

  const thisPath = useLocation();
  const contentRef = useRef<HTMLIonContentElement>(null);
  useScrollToTop(contentRef, thisPath);

  const categoriesData = useMemo(() => {
    const uniqueCategories = getUniqueValuesFromNestedArray(offlineScenes, 'elements', 'categoryName');
    const uniqueCategoriesStrings = sortArrayAlphabeticaly(uniqueCategories.map((element: any) => element.categoryName));
    const uniqueElements = getUniqueValuesFromNestedArray(offlineScenes, 'elements', 'elementName');

    const newCategoriesData = uniqueCategoriesStrings.map((categoryName: string) => {
      const categoryScenes = offlineScenes.filter((scene: any) => scene._data.elements.some((element: any) => element.categoryName === categoryName));
      return {
        categoryName,
        elementsQuantity: uniqueElements.filter((element: any) => element.categoryName === categoryName).length,
        scenesQuantity: categoryScenes.length,
        protectionQuantity: categoryScenes.filter((scene: any) => scene._data.sceneType === SceneTypeEnum.PROTECTION).length,
        pagesSum: categoryScenes.reduce((acc: number, scene: any) => acc + (scene._data.pages || 0), 0),
        estimatedTimeSum: categoryScenes.reduce((acc: number, scene: any) => acc + (scene._data.estimatedSeconds || 0), 0),
        episodesQuantity: getUniqueValuesByKey(categoryScenes, 'episodeNumber').length,
        participation: ((categoryScenes.length / offlineScenes.length) * 100).toFixed(2),
      };
    });

    return sortByCriterias(newCategoriesData, elementsCategoriesSelectedSortOptions);
  }, [offlineScenes, elementsCategoriesSelectedSortOptions]);

  const elementsData = useMemo(() => {
    const uniqueElements = getUniqueValuesFromNestedArray(offlineScenes, 'elements', 'elementName');
    const uniqueElementsStrings = sortArrayAlphabeticaly(uniqueElements.map((element: any) => element.elementName));

    const newElementsData = uniqueElementsStrings.map((elementName: string) => {
      const elementCategory = uniqueElements.find((element: any) => element.elementName === elementName)?.categoryName;
      const elementScenes = offlineScenes.filter((scene: any) => scene._data.elements.some((element: any) => element.elementName === elementName));
      return {
        elementName,
        elementCategory,
        scenesQuantity: elementScenes.length,
        protectionQuantity: elementScenes.filter((scene: any) => scene._data.sceneType === SceneTypeEnum.PROTECTION).length,
        pagesSum: elementScenes.reduce((acc: number, scene: any) => acc + (scene._data.pages || 0), 0),
        estimatedTimeSum: elementScenes.reduce((acc: number, scene: any) => acc + (scene._data.estimatedSeconds || 0), 0),
        episodesQuantity: getUniqueValuesByKey(elementScenes, 'episodeNumber').length,
        participation: ((elementScenes.length / offlineScenes.length) * 100).toFixed(2),
      };
    });

    return sortByCriterias(newElementsData, elementsSelectedSortOptions);
  }, [offlineScenes, elementsSelectedSortOptions]);

  const handleIonChange = useCallback((e: any) => {
    setActiveSection(e.detail.value!);
  }, []);

  useEffect(() => {
    setFilteredCategories(categoriesData);
    setFilteredElements(elementsData);
  }, [
    categoriesData,
    elementsData,
  ]);

  useEffect(() => {
    if (searchText.length > 0 && activeSection === 'category') {
      const newFilteredCategories = categoriesData.filter((category: any) => category.categoryName.toLowerCase().includes(searchText.toLowerCase()));
      setFilteredCategories(newFilteredCategories);
    } else if (searchText.length > 0 && activeSection === 'element') {
      const newFilteredElements = elementsData.filter((element: any) => element.elementName.toLowerCase().includes(searchText.toLowerCase()));
      setFilteredElements(newFilteredElements);
    }
  }, [searchText]);

  return (
    <>
      <MainPagesLayout
        search
        sort
        searchText={searchText}
        setSearchText={setSearchText}
        title="ELEMENTS"
        sortTrigger={activeSection === 'category' ? 'elements-categories-sort-options' : 'elements-sort-options'}
      >
        <IonHeader>
          <IonToolbar color="tertiary">
            <IonSegment value={activeSection} onIonChange={handleIonChange} mode="md">
              <IonSegmentButton value="category" color="primary">
                <IonLabel>{`By Category (${categoriesData.length})`}</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="element" color="primary">
                <IonLabel>{`By Element (${elementsData.length})`}</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </IonToolbar>
        </IonHeader>
        <IonContent color="tertiary" fullscreen>
          {activeSection === 'category' && (
            <>
              <ScrollInfiniteContext setDisplayedData={setDisplayedCategories} filteredData={filteredCategories}>
                {displayedCategories.map((category, index) => (
                  <ElementCard key={index} data={category} searchText={searchText} section="category" />
                ))}
              </ScrollInfiniteContext>
            </>
          )}
          {activeSection === 'element' && (
          <>
            <ScrollInfiniteContext setDisplayedData={setDisplayedElements} filteredData={filteredElements}>
              {displayedElements.map((element, index) => (
                <ElementCard key={index} data={element} searchText={searchText} section="element" />
              ))}
            </ScrollInfiniteContext>
          </>
          )}
        </IonContent>
      </MainPagesLayout>
      <InputSortModal
        clearSelections={activeSection === 'category' ? clearSelectedCategoriesSortOptions : clearSelectedElementsSortOptions}
        defaultSortOptions={activeSection === 'category' ? elementsCategoriesDefaultSortOptions : elementsDefaultSortOptions}
        modalTrigger={activeSection === 'category' ? 'elements-categories-sort-options' : 'elements-sort-options'}
        pageName={activeSection === 'category' ? 'Sort Categories' : 'Sort Elements'}
        sortPosibilities={activeSection === 'category' ? elementsCategoriesSortPosibilities : elementsSortPosibilities}
        setSortPosibilities={activeSection === 'category' ? setElementsCategoriesSortPosibilities : setElementsSortPosibilities}
        selectedSortOptions={activeSection === 'category' ? elementsCategoriesSelectedSortOptions : elementsSelectedSortOptions}
        setSelectedSortOptions={activeSection === 'category' ? setElementsCategoriesSelectedSortOptions : setElementsSelectedSortOptions}
      />
    </>
  );
};

export default Elements;
