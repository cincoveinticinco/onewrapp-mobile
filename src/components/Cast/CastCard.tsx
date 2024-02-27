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

interface Cast {
  characterNum: string;
  characterName: string;
  setsQuantity: number;
  locationsQuantity: number;
  pagesSum: number;
  estimatedTimeSum: number;
  episodesQuantity: number;
  scenesQuantity: number;
  protectionQuantity: number;
  participation: string;
  categoryName?: string;
}

interface CastCardProps {
  character: Cast;
  searchText: string;
}

const CastCard: React.FC<CastCardProps> = ({ character, searchText }) => {
  const getCharacterNum = (character: Cast) => (character.characterNum ? `${character.characterNum}.` : '');

  return (
    <IonCard mode="md">
      <IonCardHeader>
        <IonCardTitle>
          <HighlightedText
            text={`${getCharacterNum(character)} ${character.characterName}`}
            searchTerm={searchText}
          />
        </IonCardTitle>
        <IonCardSubtitle>
          {character.categoryName ? character.categoryName.toUpperCase() : 'NO CATEGORY'}
        </IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <p>
          <strong>Sets Quantity:</strong>
          {' '}
          {character.setsQuantity}
        </p>
        <p>
          <strong>Locations Quantity:</strong>
          {' '}
          {character.locationsQuantity}
        </p>
        <p>
          <strong>Pages Sum:</strong>
          {' '}
          {floatToFraction(character.pagesSum)}
        </p>
        <p>
          <strong>Estimated Time Sum:</strong>
          {' '}
          {secondsToMinSec(character.estimatedTimeSum)}
        </p>
        <p>
          <strong>Episodes Quantity:</strong>
          {' '}
          {character.episodesQuantity}
        </p>
        <p>
          <strong>Scenes Quantity:</strong>
          {' '}
          {character.scenesQuantity}
        </p>
        <p>
          <strong>Protection Quantity:</strong>
          {' '}
          {character.protectionQuantity}
        </p>
        <p>
          <strong>Participation:</strong>
          {' '}
          {character.participation}
          %
        </p>
      </IonCardContent>
    </IonCard>
  );
};

export default CastCard;
