import React from 'react';
import {
  IonItemSliding,
  IonItemOptions,
  IonButton,
  IonIcon,
  IonItem,
  IonTitle,
} from '@ionic/react';
import HighlightedText from '../Shared/HighlightedText/HighlightedText';
import './LocationSetCard.scss'; // Asegúrate de tener tu archivo SCSS
import floatToFraction from '../../utils/floatToFraction';
import secondsToMinSec from '../../utils/secondsToMinSec';
import { banOutline, pencilOutline } from 'ionicons/icons';
import { FiTrash } from 'react-icons/fi';

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

interface Location {
  locationName: string;
  scenesQuantity: number;
  protectionQuantity: number;
  pagesSum: number;
  estimatedTimeSum: number;
  episodesQuantity: number;
  participation: number;
}

interface LocationSetCardProps {
  set?: Set;
  searchText: string;
  location?: Location;
}

const InfoLabel: React.FC<{ label: string, value: string | number, symbol?: string}> = ({ label, value, symbol }) => (
  <p className="info-label">
    <span className="value-part">
      {value}
      <span className="symbol-part">{symbol}</span>
    </span>
    <span className="label-part">{label}</span>
  </p>
);

const LocationSetCard: React.FC<LocationSetCardProps> = ({ set, searchText, location }) => {
  const divideIntegerFromFraction = (value: string) => {
    const [integer, fraction] = value.split(' ');
    return {
      integer,
      fraction,
    };
  };

  const divideMinutesFromSeconds = (value: string) => {
    const [minutes, seconds] = value.split(':');
    return {
      minutes,
      seconds,
    };
  };

  const integerPart = divideIntegerFromFraction(floatToFraction(set ? set.pagesSum : location ? location.pagesSum : 0)).integer;
  const fractionPart = divideIntegerFromFraction(floatToFraction(set ? set.pagesSum : location ? location.pagesSum : 0)).fraction;

  const { minutes, seconds } = divideMinutesFromSeconds(secondsToMinSec(set ? set.estimatedTimeSum : location ? location.estimatedTimeSum : 0));

  return (
    <IonItemSliding>
      <IonItem mode="md" className="location-set-card ion-no-margin ion-no-padding ion-nowrap" color="tertiary">
        <div className={set ? "location-set-card-wrapper set" : "location-set-card-wrapper location"}>
          <div className="location-set-card-header">
            <IonTitle className="location-set-card-header-title">
              <HighlightedText text={set ? set.setName : location ? location?.locationName : 'NO LOCATION'} searchTerm={searchText} />
            </IonTitle>
            {set && (
              <IonTitle className="location-set-card-header-subtitle">
                {set.locationName ? set.locationName.toUpperCase() : 'NO LOCATION'}
              </IonTitle>
            )}
          </div>
          <div className="location-set-card-content">
            {set ? (
              <>
                <InfoLabel label="CHAR." value={set.charactersLength} />
                <InfoLabel label="SCN." value={set.scenesQuantity} />
                <InfoLabel label="PROT." value={set.protectionQuantity} />
                <InfoLabel label="PAGES" value={integerPart} symbol={fractionPart} />
                <InfoLabel label="TIME" value={minutes} symbol={seconds}/>
                <InfoLabel label="EP." value={set.episodesQuantity} />
                <InfoLabel label="PART." value={`${set.participation}%`} />
              </>
            ) : (
              location && (
                <>
                  <InfoLabel label="SCN." value={location.scenesQuantity} />
                  <InfoLabel label="PROT." value={location.protectionQuantity} />
                  <InfoLabel label="PAGES" value={integerPart} symbol={fractionPart} />
                  <InfoLabel label="TIME" value={minutes} symbol={seconds} />
                  <InfoLabel label="EP." value={location.episodesQuantity} />
                  <InfoLabel label="PART." value={`${location.participation}%`} />
                </>
              )
            )}
          </div>
        </div>
      </IonItem>
      <IonItemOptions className="location-set-card-item-options">
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

export default LocationSetCard;
