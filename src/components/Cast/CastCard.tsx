import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonCardTitle,
  IonItemSliding,
  IonItemOptions,
  IonButton,
  IonIcon,
  IonItem,
  IonTitle,
} from '@ionic/react';
import HighlightedText from '../../components/Shared/HighlightedText/HighlightedText';
import './CastCard.scss'
import secondsToMinSec from '../../utils/secondsToMinSec';
import floatToFraction from '../../utils/floatToFraction';
import { FiTrash } from 'react-icons/fi';
import { banOutline, pencilOutline } from 'ionicons/icons';

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
    <IonItemSliding>
      <IonItem mode="md" className='cast-card ion-no-margin ion-no-padding ion-nowrap' color='dark'>
        <div className='cast-card-image'>
          {/* EMPTY TEMPORARY */}
        </div>
        <div color='dark' className='cast-card-header'>
          <IonTitle className='cast-card-header-title'>
            <HighlightedText
              text={`${getCharacterNum(character)} ${character.characterName}`}
              searchTerm={searchText}
            />
          </IonTitle>
          <p className='cast-card-header-subtitle'>
            TALENT NOT ASSIGNED
          </p>
        </div>
        <div className='cast-card-content'>
          <InfoLabel label='PART' value={character.participation} symbol='%'/>
          <InfoLabel label='LOC.' value={character.locationsQuantity}/>
          <InfoLabel label='SETS' value={character.setsQuantity} />
          <InfoLabel label='EP.' value={character.episodesQuantity} />
          <InfoLabel label='SCN.' value={character.scenesQuantity} />
          <InfoLabel label='PROT.' value={character.protectionQuantity} />
          <InfoLabel label='PAGES' value={integerPart} symbol={fractionPart} />
          <InfoLabel label='TIME' value={minutes} symbol={':' + seconds} />
        </div>
      </IonItem>
      <IonItemOptions className='cast-card-item-options'>
        <div className="buttons-wrapper">
            <IonButton fill="clear">
              <IonIcon icon={pencilOutline} className="button-icon view" />
            </IonButton>
            <IonButton fill="clear">
              <IonIcon icon={banOutline} className="button-icon ban" />
            </IonButton>
            <IonButton fill="clear">
              <FiTrash className="button-icon trash" />
            </IonButton>
          </div>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default CastCard;
