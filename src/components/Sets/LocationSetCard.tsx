import React, { useContext } from 'react';
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
import useIsMobile from '../../hooks/useIsMobile';
import DropDownButton from '../Shared/DropDownButton/DropDownButton';
import EditionModal from '../Shared/EditionModal/EditionModal';
import DatabaseContext from '../../context/database';
import useErrorToast from '../../hooks/useErrorToast';
import useSuccessToast from '../../hooks/useSuccessToast';

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
  setsQuantity?: number;
  onClick?: () => void;
  isOpen?: boolean;
  validationFunction: (value: string, currentValue: string) => (boolean | string)
}

// EP, ....
// REMOVE CHARACTER LENGTH

// LOCATION || SET
// HEADER
// CONTENT
// CHAR SORT, CATEGORY

const InfoLabel: React.FC<{ label: string, value: string | number, symbol?: string}> = ({ label, value, symbol }) => (
  <p className="info-label">
    <span className="value-part">
      {value}
      <span className="symbol-part">{symbol}</span>
    </span>
    <span className="label-part">{label}</span>
  </p>
);

const LocationSetCard: React.FC<LocationSetCardProps> = ({ set, searchText, location, setsQuantity, onClick, isOpen, validationFunction}) => {
  const isMobile = useIsMobile();
  const { oneWrapDb } = useContext<any>(DatabaseContext)
  const errorMessageToast = useErrorToast()
  const successMessageToast = useSuccessToast()

  const locationInputs = [
    {
      label: 'Location Name',
      type: 'text',
      fieldName: 'locationName',
      placeholder: 'Location Name',
      required: true,
      inputName: `edit-${location?.locationName || ''}-location-input`
    }
  ]

  const setInputs = [
    {
      label: 'Set Name',
      type: 'text',
      fieldName: 'setName',
      placeholder: 'Set Name',
      required: true,
      inputName: `edit-${set?.setName || ''}-set-input`
    }
  ]

  const defaultFormValuesForSets = {
    setName: set?.setName,
  }

  const defaultFormValuesForLocations = {
    locationName: location?.locationName || null,
  }

  const scenesToEditWithLocation = () => oneWrapDb.scenes.find({
    selector: {
      locationName: location?.locationName
    }
  }).exec()

  const scenesToEditWithSet = () => oneWrapDb.scenes.find({
    selector: {
      setName: set?.setName
    }
  }).exec()

  const editLocation = async (newLocation: any) => {
    try {
      const scenes = await scenesToEditWithLocation()
      const updatedScenes: any = []

      scenes.forEach((scene: any) => {
        const updatedScene = {...scene._data}

        updatedScene.locationName = newLocation.locationName
        updatedScenes.push(updatedScene)
      })

      const result = await oneWrapDb.scenes.bulkUpsert(updatedScenes)

      console.log('result', result)
      successMessageToast('Location updated successfully')
    } catch (error) {
      errorMessageToast('Error updating location')
    }
  }

  const editSet = async (newSet: any) => {
    try {
      const scenes = await scenesToEditWithSet()
      const updatedScenes: any = []

      scenes.forEach((scene: any) => {
        const updatedScene = {...scene._data}

        updatedScene.setName = newSet.setName
        updatedScenes.push(updatedScene)
      })

      const result = await oneWrapDb.scenes.bulkUpsert(updatedScenes)

      console.log('result', result)
      successMessageToast('Set updated successfully')
    } catch (error) {
      errorMessageToast('Error updating set')
    }
  }

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

  const getOnclick = () => {
    if (set) {
      return
    } else if (location && onClick) {
      return onClick()
    }
  }

  const validateExistence = (value: string) => {
    if(location) {
      return validationFunction(value, location.locationName)
    }

    return validationFunction(value, set?.setName || '')
  }
  return (
    <IonItemSliding onClick={() => getOnclick()}>
      <IonItem mode="md" className="location-set-card ion-no-margin ion-no-padding ion-nowrap" color="tertiary">
        <div className={set ? "location-set-card-wrapper set" : "location-set-card-wrapper location"}>
          <div className="location-set-card-header">
            <IonTitle className="location-set-card-header-title">
              <HighlightedText text={set ? set.setName : location ? (location?.locationName + ' (' + setsQuantity + ')') : 'NO LOCATION'} searchTerm={searchText} />
            </IonTitle>
            {
              location &&
              isMobile &&
              <DropDownButton open={isOpen || false} />
            }
            {/* {set && (
              <IonTitle className="location-set-card-header-subtitle">
                {set.locationName ? set.locationName.toUpperCase() : 'NO LOCATION'}
              </IonTitle>
            )} */}
          </div>
          <div className="location-set-card-content">
            {set ? (
              <>
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
                  {
                    !isMobile && 
                    <DropDownButton open={isOpen || false} />
                  }
                </>
              )
            )}
          </div>
        </div>
      </IonItem>
      <IonItemOptions className="location-set-card-item-options">
        <div className="buttons-wrapper">
          <IonButton fill="clear" id={set ? `edit-set-${set.setName}` : `edit-location-${location?.locationName || ''}`}>
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

      <EditionModal
        formInputs={location ? locationInputs : setInputs}
        handleEdition={location ? editLocation : editSet}
        title={location ? 'Edit Location' : 'Edit Set'}
        modalTrigger={set ? `edit-set-${set.setName}` : `edit-location-${location?.locationName || ''}`}
        defaultFormValues={location ? defaultFormValuesForLocations : defaultFormValuesForSets}
        validate={validateExistence}
      />
    </IonItemSliding>
  );
};

export default LocationSetCard;
