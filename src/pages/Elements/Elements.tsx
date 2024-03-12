import React, {
  useContext, useState, useMemo, useRef, useEffect,
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
import removeAccents from '../../utils/removeAccents';

const Elements: React.FC = () => {
  const { offlineScenes } = useContext(DatabaseContext);
  const [displayedElements, setDisplayedElements] = useState<any>({});
  const [displayedCategories, setDisplayedCategories] = useState<any[]>([]);
  const [filteredElements, setFilteredElements] = useState<any[]>([]);
  const [elements, setElements] = useState<any>({});
  const [filteredCategories, setFilteredCategories] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isDropDownOpen, setIsDropDownOpen] = useState<any>({});
  const [elementsCategoriesSelectedSortOptions, setElementsCategoriesSelectedSortOptions] = useState<any[]>([]);
  const [dataIsLoading, setDataIsLoading] = useState<boolean>(true)

  const {
    elementsSelectedSortOptions, setElementsSelectedSortOptions
  } = useContext(ScenesContext);

  const defaultElementsSortPosibilities = [
    {
      id: 'NAME', label: 'NAME', optionKey: ('elementName' || 'categoryName'), defaultIndex: 0,
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

  const [elementsSortPosibilities, setElementsSortPosibilities] = useState<any[]>(() => defaultElementsSortPosibilities);

  useEffect(() => {
    localStorage.setItem('elementsSortPosibilities', JSON.stringify(elementsSortPosibilities));
  }, [elementsSortPosibilities]);

  const clearSelectedElementsSortOptions = () => {
    localStorage.removeItem('elementsSelectedSortOptions');
    localStorage.removeItem('elementsSortPosibilities');
    setElementsSelectedSortOptions(elementsDefaultSortOptions);
    setElementsSortPosibilities(defaultElementsSortPosibilities);
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
    const categoriesSelectedSortOptions = () => {
      const elementNameIndex = elementsSelectedSortOptions.findIndex((option: any) => {
        return option.some((element: any) => element === 'elementName');
      })
      const categorySortOptions: any = []

      elementsSelectedSortOptions.forEach((option: any) => {
        let optionIndex = elementsSelectedSortOptions.indexOf(option);
        if(elementNameIndex !== optionIndex) {
          categorySortOptions.push(option);
        } else {
          const newCategoryOption = ['categoryName', elementsSelectedSortOptions[elementNameIndex][1], elementsSelectedSortOptions[elementNameIndex][2]];
          categorySortOptions.push(newCategoryOption);
        }
      })
      return categorySortOptions;
    }

    console.log(categoriesSelectedSortOptions())

    setElementsCategoriesSelectedSortOptions(categoriesSelectedSortOptions());
  },[elementsSelectedSortOptions]);

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
    setDataIsLoading(false);
  }, [categoriesData, elementsData]);

  useEffect(() => {
    if (searchText.length > 0) {
    const newFilteredCategories = () => {
      if (searchText.length > 0) {
        return categoriesData.filter((category: any) => {
          const normalizedCategoryName = removeAccents(category.categoryName).toLowerCase();
          const normalizedSearchText = removeAccents(searchText).toLowerCase();
          const elementsByCategory = elementsData.filter((element: any) => element.elementCategory.toLowerCase() === category.categoryName.toLowerCase());
          

          return normalizedCategoryName.includes(normalizedSearchText) || elementsByCategory.some((element: any) => {
            const normalizedElementName = removeAccents(element.elementName).toLowerCase();
            return normalizedElementName.includes(normalizedSearchText);
          })
        });
      }}

      setFilteredCategories(newFilteredCategories);

      const newFilteredElements = elementsData.filter((element: any) => element.elementName.toLowerCase().includes(searchText.toLowerCase()) || element.elementCategory.toLowerCase().includes(searchText.toLowerCase()))
      setFilteredElements(newFilteredElements);
    } else {
      setFilteredElements(elementsData);
    }
  }, [searchText]);

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
    if(categoriesData.length > 0  && filteredElements.length > 0) {
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

  const validateCategoryExists = (categoryName: string, currentCategory: string) => {
    const normalize = (text: string) => removeAccents(text).toLowerCase();
    const normalizedCategoryName = normalize(categoryName);
    const normalizedCurrentCategory = normalize(currentCategory);
    return categoriesData.some((categoryData: any) => normalize(categoryData.categoryName) === normalizedCategoryName && normalize(categoryData.categoryName) !== normalizedCurrentCategory) ? 'This category already exists' : true;
  }

  const validateElementExists = (elementName: string, currentElement: string) => {
    const normalize = (text: string) => removeAccents(text).toLowerCase();
    const normalizedElementName = normalize(elementName);
    const normalizedCurrentElement = normalize(currentElement);
    return elementsData.some((elementData: any) => normalize(elementData.elementName) === normalizedElementName && normalize(elementData.elementName) !== normalizedCurrentElement) ? 'This element already exists' : true;
  }

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
          {
            dataIsLoading && 
            <div>Loading...</div>
          }
          {
            !dataIsLoading &&
            <>
              <ScrollInfiniteContext setDisplayedData={setDisplayedCategories} filteredData={filteredCategories} batchSize={8}>
                {displayedCategories.map((category, index) => (
                  <div key={category + index}>
                    { elements[category.categoryName] &&
                      elements[category.categoryName].length > 0 &&
                      <ElementCard 
                        data={category} 
                        searchText={searchText} 
                        section="category"
                        isOpen={isDropDownOpen[category.categoryName]} onClick={() => setIsDropDownOpen({
                          ...isDropDownOpen,
                          [category.categoryName]: !isDropDownOpen[category.categoryName]
                        })}
                        elementsQuantity={elements[category.categoryName] ? elements[category.categoryName].length : 0}
                        validationFunction={validateCategoryExists}
                      />
                    }
                    <div className='ion-content-scroll-host elements-card-wrapper'>
                      {
                        isDropDownOpen[category.categoryName] &&
                        <ScrollInfiniteContext 
                          setDisplayedData={(newElements: any) => handleSetDisplayedElements(category.categoryName || [], newElements)} 
                          filteredData={elements[category.categoryName] || []}
                          batchSize={9}
                          >
                            {
                              displayedElements[category.categoryName] &&
                              displayedElements[category.categoryName].map((element: any, index: any) => (
                              <ElementCard 
                                key={index} 
                                data={element} 
                                searchText={searchText} 
                                section="element"
                                validationFunction={validateElementExists}
                              />
                            ))}
                        </ScrollInfiniteContext>
                      }
                    </div>
                  </div>    
                ))}
              </ScrollInfiniteContext>
            </>
          }
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
