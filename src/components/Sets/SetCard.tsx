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

interface Set {
  setName: string;
  locationName: string;
  charactersLength: number;
  scenesQuantity: number;
  protectionQuantity: number;
  pagesSum: number;
  estimatedTimeSum: number;
  episodesQuantity: number;
  participation: number;
}

interface SetCardProps {
  set: Set;
  searchText: string;
}

const SetCard: React.FC<SetCardProps> = ({ set, searchText }) => (
  <IonCard mode="md">
    <IonCardHeader>
      <IonCardTitle>
        <HighlightedText text={set.setName} searchTerm={searchText} />
      </IonCardTitle>
      <IonCardSubtitle>
        {set.locationName ? set.locationName.toUpperCase() : 'NO LOCATION'}
      </IonCardSubtitle>
    </IonCardHeader>
    <IonCardContent>
      <p>
        <strong>Characters Length:</strong>
        {' '}
        {set.charactersLength}
      </p>
      <p>
        <strong>Scenes Quantity:</strong>
        {' '}
        {set.scenesQuantity}
      </p>
      <p>
        <strong>Protection Quantity:</strong>
        {' '}
        {set.protectionQuantity}
      </p>
      <p>
        <strong>Pages Sum:</strong>
        {' '}
        {floatToFraction(set.pagesSum)}
      </p>
      <p>
        <strong>Estimated Time Sum:</strong>
        {' '}
        {secondsToMinSec(set.estimatedTimeSum)}
      </p>
      <p>
        <strong>Episodes Quantity:</strong>
        {' '}
        {set.episodesQuantity}
      </p>
      <p>
        <strong>Participation:</strong>
        {' '}
        {set.participation}
        %
      </p>
    </IonCardContent>
  </IonCard>
);

export default SetCard;
