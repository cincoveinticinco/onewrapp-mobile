import React from 'react';
import {
  IonItemSliding,
  IonItemOptions,
  IonButton,
  IonIcon,
  IonItem,
  IonTitle,
} from '@ionic/react';
import HighlightedText from '../../components/Shared/HighlightedText/HighlightedText';
import './ElementCard.scss';
import secondsToMinSec from '../../utils/secondsToMinSec';
import floatToFraction from '../../utils/floatToFraction';
import { FiTrash } from 'react-icons/fi';
import { banOutline, pencilOutline } from 'ionicons/icons';
import DropDownButton from '../Shared/DropDownButton/DropDownButton';
import useIsMobile from '../../hooks/useIsMobile';

interface Element {
  elementName: string;
  elementsQuantity: number;
  scenesQuantity: number;
  protectionQuantity: number;
  pagesSum: number;
  estimatedTimeSum: number;
  episodesQuantity: number;
  participation: string;
  category: string;
  categoryName: string;
}

interface ElementCardProps {
  data: Element;
  searchText: string;
  section: 'category' | 'element';
  isOpen?: boolean;
  onClick?: () => void;
  elementsQuantity?: number;
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

const ElementCard: React.FC<ElementCardProps> = ({ data, searchText, section, isOpen = false, onClick, elementsQuantity }) => {
  const isMobile = useIsMobile();
  
  const divideIntegerFromFraction = (value: string) => {
    const [integer, fraction] = value.split(' ');
    return {
      integer,
      fraction,
    };
  };

  const fraction = floatToFraction(data.pagesSum);

  const fractionPart = divideIntegerFromFraction(fraction).fraction;
  const integerPart = divideIntegerFromFraction(fraction).integer;

  const divideMinutesFromSeconds = (value: string) => {
    const [minutes, seconds] = value.split(':');
    return {
      minutes,
      seconds,
    };
  };

  const minutesSeconds = secondsToMinSec(data.estimatedTimeSum);

  const { minutes } = divideMinutesFromSeconds(minutesSeconds);
  const { seconds } = divideMinutesFromSeconds(minutesSeconds);

  const elementName = () => {
    if(data.elementName) {
      if(data.elementName.length > 2) {
        return data.elementName
      }

      return 'N/A'
    }
  }

  return (
    <IonItemSliding onClick={onClick}>
      <IonItem mode="md" className="element-card ion-no-margin ion-no-padding ion-nowrap" color="tertiary">
        <div className={"element-card-wrapper" + ' ' + section}>
          <div color="dark" className="element-card-header">
            <IonTitle className="element-card-header-title">
              <HighlightedText
                text={elementName() || (data.categoryName + ' (' + elementsQuantity + ')') || ''}
                searchTerm={searchText}
              />
            </IonTitle>
            {
              section === 'category' &&
              isMobile &&
              <DropDownButton open={isOpen} />
            }
            {/* {section === 'element' && (
              <p className="element-card-header-subtitle">
                {data.category ? data.category.toUpperCase() : 'NO CATEGORY'}
              </p>
            )} */}
          </div>
          <div className="element-card-content">
            <InfoLabel label='SCN.' value={data.scenesQuantity} />
            <InfoLabel label='PROT.' value={data.protectionQuantity} />
            <InfoLabel label="PAGES" value={integerPart} symbol={fractionPart} />
            <InfoLabel label="TIME" value={minutes} symbol={`:${seconds}`} />
            <InfoLabel label="EP" value={data.episodesQuantity} />
            <InfoLabel label="PART." value={`${data.participation}%`} />
            {
              section === 'category' && 
              !isMobile &&
              <DropDownButton open={isOpen} />
            }
          </div>
        </div>
      </IonItem>
      <IonItemOptions className="element-card-item-options">
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

export default ElementCard;