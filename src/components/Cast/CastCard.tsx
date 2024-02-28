import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonCardTitle,
} from '@ionic/react';
import HighlightedText from '../../components/Shared/HighlightedText/HighlightedText';
import './CastCard.scss'
import secondsToMinSec from '../../utils/secondsToMinSec';
import floatToFraction from '../../utils/floatToFraction';

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

const InfoLabel: React.FC<{ label: string, value: string | number, symbol?: string}> = ({ label, value, symbol}) => (
  <p className='info-label'>
    <span className='value-part'>
      {value}
      <span className='symbol-part'>{symbol}</span>
    </span>
    <span className='label-part'>{label}</span>
  </p>
);

const CastCard: React.FC<CastCardProps> = ({ character, searchText }) => {
  const getCharacterNum = (character: Cast) => (character.characterNum ? `${character.characterNum}.` : '');

  const divideIntegerFromFraction = (value: string) => {
    const [integer, fraction] = value.split(' ')
    console.log('value', value)
    console.log('integer', integer)
    console.log('fraction', fraction)
    return {
      integer,
      fraction
    }
  }

  const fraction = floatToFraction(character.pagesSum);

  const fractionPart = divideIntegerFromFraction(fraction).fraction;
  const integerPart = divideIntegerFromFraction(fraction).integer;

  const divideMinutesFromSeconds = (value: string) => {
    //24:00
    const [minutes, seconds] = value.split(':');
    return {
      minutes,
      seconds
    }
  }

  const minutesSeconds = secondsToMinSec(character.estimatedTimeSum);

  const minutes = divideMinutesFromSeconds(minutesSeconds).minutes;
  const seconds = divideMinutesFromSeconds(minutesSeconds).seconds;

  return (
    <IonCard mode="md" className='cast-card'>
      <div className='cast-card-image'>
        {/* EMPTY TEMPORARY */}
      </div>
      <IonCardHeader color='dark' className='cast-card-header'>
        <IonCardTitle className='cast-card-header-title'>
          <HighlightedText
            text={`${getCharacterNum(character)} ${character.characterName}`}
            searchTerm={searchText}
          />
        </IonCardTitle>
        <p className='cast-card-header-subtitle'>
          TALENT NOT ASSIGNED
        </p>
      </IonCardHeader>
      <IonCardContent className='cast-card-content'>
        <InfoLabel label='PART' value={character.participation} symbol='%'/>
        <InfoLabel label='LOC.' value={character.locationsQuantity}/>
        <InfoLabel label='SETS' value={character.setsQuantity} />
        <InfoLabel label='EP.' value={character.episodesQuantity} />
        <InfoLabel label='SCN.' value={character.scenesQuantity} />
        <InfoLabel label='PROT.' value={character.protectionQuantity} />
        <InfoLabel label='PAGES' value={integerPart} symbol={fractionPart} />
        <InfoLabel label='TIME' value={minutes} symbol={':' + seconds} />
      </IonCardContent>
    </IonCard>
  );
};

export default CastCard;
