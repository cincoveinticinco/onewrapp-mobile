import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonCardTitle,
} from '@ionic/react';
import HighlightedText from '../../components/Shared/HighlightedText/HighlightedText';
import floatToFraction from '../../utils/floatToFraction';
import secondsToMinSec from '../../utils/secondsToMinSec';

interface ElementCardProps {
  data: any;
  searchText: string;
  section: 'category' | 'element';
}

const ElementCard: React.FC<ElementCardProps> = ({ data, searchText, section }) => (
  <IonCard mode="md">
    <IonCardHeader>
      <IonCardTitle>
        <HighlightedText
          text={section === 'category' ? (data.categoryName) : data.elementName.length > 1 ? data.elementName
            : 'N/A'}
          searchTerm={searchText}
        />
      </IonCardTitle>
      {section === 'element' && (
      <IonCardSubtitle>
        {data.elementCategory ? data.elementCategory.toUpperCase() : 'NO CATEGORY'}
      </IonCardSubtitle>
      )}
    </IonCardHeader>
    <IonCardContent>
      <p>
        <strong>
          {section === 'category' ? 'Elements Quantity' : 'Scenes Quantity'}
          :
        </strong>
        {' '}
        {section === 'category' ? data.elementsQuantity : data.scenesQuantity}
      </p>
      <p>
        <strong>Protection Quantity:</strong>
        {' '}
        {data.protectionQuantity}
      </p>
      <p>
        <strong>Pages Sum:</strong>
        {' '}
        {floatToFraction(data.pagesSum)}
      </p>
      <p>
        <strong>Estimated Time Sum:</strong>
        {' '}
        {secondsToMinSec(data.estimatedTimeSum)}
      </p>
      <p>
        <strong>Episodes Quantity:</strong>
        {' '}
        {data.episodesQuantity}
      </p>
      <p>
        <strong>Participation:</strong>
        {' '}
        {data.participation}
        %
      </p>
    </IonCardContent>
  </IonCard>
);

export default ElementCard;
