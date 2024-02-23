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
} from '@ionic/react';
import DatabaseContext from '../../context/database';
import getUniqueValuesByKey from '../../utils/getUniqueValuesByKey';
import { SceneTypeEnum } from '../../Ennums/ennums';
import getUniqueValuesFromNestedArray from '../../utils/getUniqueValuesFromNestedArray';
import sortArrayAlphabeticaly from '../../utils/sortArrayAlphabeticaly';
import ScrollInfiniteContext from '../../context/ScrollInfiniteContext';
import { useLocation } from 'react-router';
import useScrollToTop from '../../hooks/useScrollToTop';
import floatToFraction from '../../utils/floatToFraction';
import secondsToMinSec from '../../utils/secondsToMinSec';
import HighlightedText from '../../components/Shared/HighlightedText/HighlightedText';
import MainPagesLayout from '../../Layouts/MainPagesLayout/MainPagesLayout';
import { search } from 'ionicons/icons';
import { filter } from 'lodash';

const Elements: React.FC = () => {
  const { offlineScenes } = useContext(DatabaseContext);
  const [activeSection, setActiveSection] = useState<string>('category');
  const [displayedElements, setDisplayedElements] = useState<any[]>([]);
  const [displayedCategories, setDisplayedCategories] = useState<any[]>([]);
  const [filteredElements, setFilteredElements] = useState<any[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');

  const thisPath = useLocation();
  const contentRef = useRef<HTMLIonContentElement>(null);
  useScrollToTop(contentRef, thisPath);

  const categoriesData = useMemo(() => {
    const uniqueCategories = getUniqueValuesFromNestedArray(offlineScenes, 'elements', 'categoryName');
    const uniqueCategoriesStrings = sortArrayAlphabeticaly(uniqueCategories.map((element: any) => element.categoryName));
    const uniqueElements = getUniqueValuesFromNestedArray(offlineScenes, 'elements', 'elementName');

    return uniqueCategoriesStrings.map((categoryName: string) => {
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
  }, [offlineScenes]);

  const elementsData = useMemo(() => {
    const uniqueElements = getUniqueValuesFromNestedArray(offlineScenes, 'elements', 'elementName');
    const uniqueElementsStrings = sortArrayAlphabeticaly(uniqueElements.map((element: any) => element.elementName));

    return uniqueElementsStrings.map((elementName: string) => {
      const elementScenes = offlineScenes.filter((scene: any) => scene._data.elements.some((element: any) => element.elementName === elementName));
      return {
        elementName,
        scenesQuantity: elementScenes.length,
        protectionQuantity: elementScenes.filter((scene: any) => scene._data.sceneType === SceneTypeEnum.PROTECTION).length,
        pagesSum: elementScenes.reduce((acc: number, scene: any) => acc + (scene._data.pages || 0), 0),
        estimatedTimeSum: elementScenes.reduce((acc: number, scene: any) => acc + (scene._data.estimatedSeconds || 0), 0),
        episodesQuantity: getUniqueValuesByKey(elementScenes, 'episodeNumber').length,
        participation: ((elementScenes.length / offlineScenes.length) * 100).toFixed(2),
      };
    });
  }, [offlineScenes]);

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
    if(searchText.length > 0 && activeSection === 'category') {
      const newFilteredCategories = categoriesData.filter((category: any) => category.categoryName.toLowerCase().includes(searchText.toLowerCase()));
      setFilteredCategories(newFilteredCategories);
    } else if (searchText.length > 0 && activeSection === 'element') {
      const newFilteredElements = elementsData.filter((element: any) => element.elementName.toLowerCase().includes(searchText.toLowerCase()));
      setFilteredElements(newFilteredElements);
    }
  }, [searchText]);


  return (
    <MainPagesLayout search sort searchText={searchText} setSearchText={setSearchText} title="ELEMENTS">
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
                <IonCard key={index}>
                  <IonCardHeader>
                    <IonCardSubtitle>
                      <HighlightedText text={category.categoryName || ''} searchTerm={searchText} />
                    </IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p>
                      <strong>Elements Quantity:</strong> {category.elementsQuantity}
                    </p>
                    <p>
                      <strong>Scenes Quantity:</strong> {category.scenesQuantity}
                    </p>
                    <p>
                      <strong>Protection Quantity:</strong> {category.protectionQuantity}
                    </p>
                    <p>
                      <strong>Pages Sum:</strong> {floatToFraction(category.pagesSum)}
                    </p>
                    <p>
                      <strong>Estimated Time Sum:</strong> {secondsToMinSec(category.estimatedTimeSum)}
                    </p>
                    <p>
                      <strong>Episodes Quantity:</strong> {category.episodesQuantity}
                    </p>
                    <p>
                      <strong>Participation:</strong> {category.participation}%
                    </p>
                  </IonCardContent>
                </IonCard>
              ))}
            </ScrollInfiniteContext>
          </>
        )}
        {activeSection === 'element' && (
          <>
            <ScrollInfiniteContext setDisplayedData={setDisplayedElements} filteredData={filteredElements}>
              {displayedElements.map((element, index) => (
                <IonCard key={index}>
                  <IonCardHeader>
                    <IonCardSubtitle>
                      <HighlightedText text={element.elementName || ''} searchTerm={searchText} />
                    </IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p>
                      <strong>Scenes Quantity:</strong> {element.scenesQuantity}
                    </p>
                    <p>
                      <strong>Protection Quantity:</strong> {element.protectionQuantity}
                    </p>
                    <p>
                      <strong>Pages Sum:</strong> {floatToFraction(element.pagesSum)}
                    </p>
                    <p>
                      <strong>Estimated Time Sum:</strong> {secondsToMinSec(element.estimatedTimeSum)}
                    </p>
                    <p>
                      <strong>Episodes Quantity:</strong> {element.episodesQuantity}
                    </p>
                    <p>
                      <strong>Participation:</strong> {element.participation}%
                    </p>
                  </IonCardContent>
                </IonCard>
              ))}
            </ScrollInfiniteContext>
          </>
        )}
      </IonContent>
    </MainPagesLayout>
  );
};

export default Elements;
