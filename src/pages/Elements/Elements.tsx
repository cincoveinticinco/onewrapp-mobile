import React, {
  useContext, useState, useMemo, useCallback, useRef, useEffect,
} from 'react';
import {
  IonContent,
} from '@ionic/react';
import { useLocation } from 'react-router';
import DatabaseContext from '../../context/database';
import getUniqueValuesByKey from '../../utils/getUniqueValuesByKey';
import { SceneTypeEnum } from '../../Ennums/ennums';
import getUniqueValuesFromNestedArray from '../../utils/getUniqueValuesFromNestedArray';
import sortArrayAlphabeticaly from '../../utils/sortArrayAlphabeticaly';
import ScrollInfiniteContext from '../../context/ScrollInfiniteContext';
import useScrollToTop from '../../hooks/useScrollToTop';
import MainPagesLayout from '../../Layouts/MainPagesLayout/MainPagesLayout';
import InputSortModal from '../../components/Shared/InputSortModal/InputSortModal';
import ScenesContext, { elementsCategoriesDefaultSortOptions, elementsDefaultSortOptions } from '../../context/ScenesContext';
import sortByCriterias from '../../utils/SortScenesUtils/sortByCriterias';
import ElementCard from '../../components/Elements/ElementCard';
import './Elements.scss'

const Elements: React.FC = () => {
  const { offlineScenes } = useContext(DatabaseContext);
  const [displayedElements, setDisplayedElements] = useState<any>({});
  const [displayedCategories, setDisplayedCategories] = useState<any[]>([]);
  const [filteredElements, setFilteredElements] = useState<any[]>([]);
  const [elements, setElements] = useState<any>({});
  const [filteredCategories, setFilteredCategories] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isDropDownOpen, setIsDropDownOpen] = useState<any>({});

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
        categoryName: categoryName || 'NO CATEGORY',
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
        elementCategory: elementCategory || 'NO CATEGORY',
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

  useEffect(() => {
    setFilteredCategories(categoriesData);
  }, [
    categoriesData,
  ]);

  useEffect(() => {
    setFilteredElements(elementsData);
  }, [
    elementsData,
  ]);

  useEffect(() => {
    if (searchText.length > 0) {
      // const newFilteredCategories = categoriesData.filter((category: any) => category.categoryName.toLowerCase().includes(searchText.toLowerCase()));
      // setFilteredCategories(newFilteredCategories);
      const newFilteredElements = elementsData.filter((element: any) => element.elementName.toLowerCase().includes(searchText.toLowerCase()));
      setFilteredElements(newFilteredElements);
      if(categoriesData.length > 0) {
        const updatedElements: any = {};
        categoriesData.forEach((category: any) => {
          const newElements = newFilteredElements.filter((element: any) => element.elementCategory.toLowerCase() === category.categoryName.toLowerCase());
          updatedElements[category.categoryName] = newElements;
        });
        setElements(updatedElements);
      }
    }
  }, [searchText]);

  useEffect(() => {
    console.log('EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', elements)
  }, [elements])

  const filterElementsByCategory = (elements: any[], categoryName: string) => {
    return elements.filter((element: any) => element.categoryName === categoryName);
  }

  useEffect(() => {
    categoriesData.forEach((category: any) => {
      category.categoryName = category.categoryName || 'NO CATEGORY';
      setDisplayedElements({
        ...displayedElements,
        [category.categoryName]: []
      })
    })
  }, [categoriesData])

  useEffect(() => {
    categoriesData.forEach((category: any) => {
      category.categoryName = category.categoryName || 'NO CATEGORY';
      setIsDropDownOpen((prev: any) => ({ ...prev, [category.categoryName]: true }));
    })
  }, [categoriesData])

  useEffect(() => {
    if(categoriesData.length > 0 && filteredElements.length > 0) {
      const updatedElements: any = {};
  
      categoriesData.forEach((category: any) => {
        category.categoryName = category.categoryName || 'NO CATEGORY';
        const newElements = filteredElements.filter((element: any) => element.elementCategory.toLowerCase() === category.categoryName.toLowerCase());
        updatedElements[category.categoryName] = newElements
      });
  
      setElements(updatedElements);
    }
  }, [categoriesData, filteredElements]);

  const removeDuplicatesFromArray = (array: any[]) => {
    if(array) {
      const uniqueSet = new Set(array);
      const uniqueArray = [...uniqueSet];
      return uniqueArray;
    }
  }

  const handleSetDisplayedElements= (category: string, newElements: any[]) => setDisplayedElements((prev: any) => ({ ...prev, [category]: removeDuplicatesFromArray([...newElements]) }));


  return (
    <>
      <MainPagesLayout
        search
        sort
        searchText={searchText}
        setSearchText={setSearchText}
        title="ELEMENTS"
        sortTrigger={'elements-sort-options'}
      >
        <IonContent color="tertiary" fullscreen>
          <>
            <ScrollInfiniteContext setDisplayedData={setDisplayedCategories} filteredData={filteredCategories} batchSize={8}>
              {displayedCategories.map((category, index) => (
                <div key={category + index}>
                  <ElementCard 
                  data={category} 
                  searchText={searchText} 
                  section="category"
                  isOpen={isDropDownOpen[category.categoryName]} onClick={() => setIsDropDownOpen({
                    ...isDropDownOpen,
                    [category.categoryName]: !isDropDownOpen[category.categoryName]
                  })}
                  elementsQuantity={elements[category.categoryName] ? elements[category.categoryName].length : 0}
                  />
                  <div className='ion-content-scroll-host elements-card-wrapper'>
                    {
                      isDropDownOpen[category.categoryName] &&
                      <ScrollInfiniteContext 
                        setDisplayedData={(newElements: any) => handleSetDisplayedElements(category.categoryName, newElements)} 
                        filteredData={elements[category.categoryName]}
                        batchSize={9}
                        >
                          {
                            displayedElements[category.categoryName] &&
                            displayedElements[category.categoryName].map((element: any, index: any) => (
                            <ElementCard key={index} data={element} searchText={searchText} section="element" />
                          ))}
                      </ScrollInfiniteContext>
                    }
                  </div>
                </div>    
              ))}
            </ScrollInfiniteContext>
          </>
        </IonContent>
      </MainPagesLayout>
      <InputSortModal
        clearSelections={clearSelectedElementsSortOptions}
        defaultSortOptions={elementsDefaultSortOptions}
        modalTrigger={'elements-sort-options'}
        pageName={'Sort Elements'}
        sortPosibilities={ elementsSortPosibilities}
        setSortPosibilities={setElementsSortPosibilities}
        selectedSortOptions={ elementsSelectedSortOptions}
        setSelectedSortOptions={setElementsSelectedSortOptions}
      />
    </>
  );
};

export default Elements;
