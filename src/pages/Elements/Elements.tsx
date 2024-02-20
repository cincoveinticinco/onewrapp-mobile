import React, { useContext, useState, useMemo, useCallback } from 'react';
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
  IonCardTitle,
  IonCardContent,
} from '@ionic/react';
import DatabaseContext from '../../context/database';
import getUniqueValuesByKey from '../../utils/getUniqueValuesByKey';
import { SceneTypeEnum } from '../../Ennums/ennums';
import getUniqueValuesFromNestedArray from '../../utils/getUniqueValuesFromNestedArray';

const Elements: React.FC = () => {
  const { offlineScenes } = useContext(DatabaseContext);
  const [activeSection, setActiveSection] = useState<string>('category');

  const categoriesData = useMemo(() => {
    const uniqueCategories = getUniqueValuesFromNestedArray(offlineScenes, 'elements', 'categoryName');
    const uniqueCategoriesStrings = uniqueCategories.map((element: any) => element.categoryName);

    return uniqueCategoriesStrings.map((categoryName: string) => {
      const categoryScenes = offlineScenes.filter((scene: any) => scene._data.categoryName === categoryName);
      return {
        categoryName,
        elementsQuantity: getUniqueValuesByKey(categoryScenes, '_data.elementName').length,
        scenesQuantity: categoryScenes.length,
        protectionQuantity: categoryScenes.filter((scene: any) => scene._data.sceneType === SceneTypeEnum.PROTECTION).length,
        pagesSum: categoryScenes.reduce((acc: number, scene: any) => acc + (scene._data.pages || 0), 0),
        estimatedTimeSum: categoryScenes.reduce((acc: number, scene: any) => acc + (scene._data.estimatedSeconds || 0), 0),
        episodesQuantity: getUniqueValuesByKey(categoryScenes, 'episodeNumber').length,
      };
    });
  }, [offlineScenes]);

  const elementsData = useMemo(() => {
    const uniqueElements = getUniqueValuesFromNestedArray(offlineScenes,'elements', 'elementName');
    const uniqueElementsStrings = uniqueElements.map((element: any) => element.elementName);

    return uniqueElementsStrings.map((elementName: string) => {
      const elementScenes = offlineScenes.filter((scene: any) => scene._data.elementName === elementName);
      return {
        elementName,
        scenesQuantity: elementScenes.length,
        protectionQuantity: elementScenes.filter((scene: any) => scene._data.sceneType === SceneTypeEnum.PROTECTION).length,
        pagesSum: elementScenes.reduce((acc: number, scene: any) => acc + (scene._data.pages || 0), 0),
        estimatedTimeSum: elementScenes.reduce((acc: number, scene: any) => acc + (scene._data.estimatedSeconds || 0), 0),
        episodesQuantity: getUniqueValuesByKey(elementScenes, 'episodeNumber').length,
      };
    });
  }, [offlineScenes]);

  const handleIonChange = useCallback((e: any) => {
    setActiveSection(e.detail.value!);
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="tertiary">
          <IonTitle>ELEMENTS</IonTitle>
        </IonToolbar>
        <IonToolbar color='tertiary'>
          <IonSegment value={activeSection} onIonChange={handleIonChange}>
            <IonSegmentButton value="category" color='primary'>
              <IonLabel>By Category</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="element" color='primary'>
              <IonLabel>By Element Name</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      <IonContent color="tertiary" fullscreen>
        {activeSection === 'category' && (
          <>
            {categoriesData.map((category, index) => (
              <IonCard key={index}>
                <IonCardHeader>
                  <IonCardSubtitle>{category.categoryName}</IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Elements Quantity: {category.elementsQuantity}</p>
                  <p>Scenes Quantity: {category.scenesQuantity}</p>
                  <p>Protection Quantity: {category.protectionQuantity}</p>
                  <p>Pages Sum: {category.pagesSum}</p>
                  <p>Estimated Time Sum: {category.estimatedTimeSum}</p>
                  <p>Episodes Quantity: {category.episodesQuantity}</p>
                </IonCardContent>
              </IonCard>
            ))}
          </>
        )}
        {activeSection === 'element' && (
          <>
            {elementsData.map((element, index) => (
              <IonCard key={index}>
                <IonCardHeader>
                  <IonCardSubtitle>{element.elementName}</IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Scenes Quantity: {element.scenesQuantity}</p>
                  <p>Protection Quantity: {element.protectionQuantity}</p>
                  <p>Pages Sum: {element.pagesSum}</p>
                  <p>Estimated Time Sum: {element.estimatedTimeSum}</p>
                  <p>Episodes Quantity: {element.episodesQuantity}</p>
                </IonCardContent>
              </IonCard>
            ))}
          </>
        )}
      </IonContent>
    </IonPage>
  );
}

export default Elements;
