import React, { useContext, useRef } from 'react';
import {
  IonItemSliding,
  IonItemOptions,
  IonButton,
  IonItem,
  IonTitle,
  IonAlert,
} from '@ionic/react';
import { PiProhibitLight, PiTrashSimpleLight } from 'react-icons/pi';
import { CiEdit } from 'react-icons/ci';
import HighlightedText from '../Shared/HighlightedText/HighlightedText';
import './LocationSetCard.scss'; // Asegúrate de tener tu archivo SCSS
import floatToFraction from '../../utils/floatToFraction';
import secondsToMinSec from '../../utils/secondsToMinSec';
import { banOutline, pencilOutline } from 'ionicons/icons';
import useIsMobile from '../../hooks/Shared/useIsMobile';
import DropDownButton from '../Shared/DropDownButton/DropDownButton';
import EditionModal from '../Shared/EditionModal/EditionModal';
import DatabaseContext, { DatabaseContextProps } from '../../hooks/Shared/database';
import useErrorToast from '../../hooks/Shared/useErrorToast';
import useSuccessToast from '../../hooks/Shared/useSuccessToast';
import useWarningToast from '../../hooks/Shared/useWarningToast';
import InputAlert from '../../Layouts/InputAlert/InputAlert';

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
  validationFunction: (value: string, currentValue: string) => (any)
  setIsLoading?: (value: boolean) => void
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

const LocationSetCard: React.FC<LocationSetCardProps> = ({
  set, searchText, location, setsQuantity, onClick, isOpen, validationFunction, setIsLoading,
}) => {
  const isMobile = useIsMobile();
  const { oneWrapDb, projectId } = useContext<DatabaseContextProps>(DatabaseContext);
  const errorMessageToast = useErrorToast();
  const successMessageToast = useSuccessToast();
  const warningMessageToast = useWarningToast();
  const deleteSetAlert = useRef<HTMLIonAlertElement>(null);
  const deleteLocationAlert = useRef<HTMLIonAlertElement>(null);
  const modalRef = useRef<HTMLIonModalElement>(null);

  const openEditModal = () => {
    if (modalRef.current) {
      modalRef.current.present();
    }
  }

  const openAlert = () => {
    if (set && deleteSetAlert.current) {
      deleteSetAlert.current.present();
    } else if (location && deleteLocationAlert.current) {
      deleteLocationAlert.current.present();
    }
  };

  const locationInputs = [
    {
      label: 'Location Name',
      type: 'text',
      fieldName: 'locationName',
      placeholder: 'Location Name',
      required: true,
      inputName: `edit-${location?.locationName || ''}-location-input`,
    },
  ];

  const setInputs = [
    {
      label: 'Location Name',
      type: 'text',
      fieldName: 'locationName',
      placeholder: 'Location Name',
      required: true,
      inputName: `edit-${set?.locationName || ''}-location-input`,
    },
    {
      label: 'Set Name',
      type: 'text',
      fieldName: 'setName',
      placeholder: 'Set Name',
      required: true,
      inputName: `edit-${set?.setName || ''}-set-input`,
    },
  ];

  const defaultFormValuesForSets = {
    locationName: set?.locationName,
    setName: set?.setName,
  };

  const defaultFormValuesForLocations = {
    locationName: location?.locationName || null,
  };

  const scenesToEditWithLocation = () => oneWrapDb?.scenes.find({
    selector: {
      projectId,
      locationName: location?.locationName,
    },
  }).exec();

  const scenesToEditWithSet = () => oneWrapDb?.scenes.find({
    selector: {
      projectId,
      setName: set?.setName,
    },
  }).exec();

  const editLocation = async (newLocation: any) => {
    try {
      if (setIsLoading) {
        setIsLoading(true);
      }
      warningMessageToast('Please wait, location is being updated');
      const scenes = await scenesToEditWithLocation();
      const updatedScenes: any = [];

      scenes?.forEach((scene: any) => {
        const updatedScene = { ...scene._data };

        updatedScene.locationName = newLocation.locationName;
        updatedScenes.push(updatedScene);
      });

      const result = await oneWrapDb?.scenes.bulkUpsert(updatedScenes);

      if (setIsLoading) {
        setIsLoading(false);
      }

      console.log('result', result);
      setTimeout(() => {
        successMessageToast('Location updated successfully');
      }, 500);
    } catch (error) {
      errorMessageToast('Error updating location');
    }
  };

  const editSet = async (newSet: any) => {
    try {
      warningMessageToast('Please wait, set is being updated');
      if (setIsLoading) {
        setIsLoading(true);
      }
      const scenes = await scenesToEditWithSet();
      const updatedScenes: any = [];

      scenes?.forEach((scene: any) => {
        const updatedScene = { ...scene._data };

        updatedScene.locationName = newSet.locationName;
        updatedScene.setName = newSet.setName;
        updatedScenes.push(updatedScene);
      });

      const result = await oneWrapDb?.scenes.bulkUpsert(updatedScenes);

      if (setIsLoading) {
        setIsLoading(false);
      }

      console.log('result', result);
      setTimeout(() => {
        successMessageToast('Set updated successfully');
      }, 300);
    } catch (error) {
      errorMessageToast('Error updating set');
    }
  };

  const deleteLocation = async () => {
    try {
      if (setIsLoading) {
        setIsLoading(true);
      }
      warningMessageToast('Please wait, location is being deleted');
      const scenes = await scenesToEditWithLocation();
      const updatedScenes: any = [];

      scenes?.forEach((scene: any) => {
        const updatedScene = { ...scene._data };

        updatedScene.locationName = null;
        updatedScenes.push(updatedScene);
      });

      const result = await oneWrapDb?.scenes.bulkUpsert(updatedScenes);

      if (setIsLoading) {
        setIsLoading(false);
      }

      setTimeout(() => {
        successMessageToast('Location deleted successfully');
      }, 500);
    } catch (error) {
      errorMessageToast('Error deleting location');
    }
  };

  const deleteSet = async () => {
    try {
      if (setIsLoading) {
        setIsLoading(true);
      }
      warningMessageToast('Please wait, set is being deleted');
      const scenes = await scenesToEditWithSet();
      const updatedScenes: any = [];

      scenes?.forEach((scene: any) => {
        const updatedScene = { ...scene._data };

        updatedScene.setName = null;
        updatedScenes.push(updatedScene);
      });

      const result = await oneWrapDb?.scenes.bulkUpsert(updatedScenes);

      if (setIsLoading) {
        setIsLoading(false);
      }

      console.log('result', result);
      setTimeout(() => {
        successMessageToast('Set deleted successfully');
      }, 500);
    } catch (error) {
      errorMessageToast('Error deleting set');
    }
  };

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

    } else if (location && onClick) {
      return onClick();
    }
  };

  const validateSetExistence = (value: string) => {
    if (location && value !== location.locationName) {
      return validationFunction(value, location.locationName);
    }
  };

  const validateLocationExistence = (value: string) => {
    if (set && value !== set.locationName) {
      return validationFunction(value, set.locationName);
    }
  };

  return (
    <IonItemSliding onClick={() => getOnclick()}>
      <IonItem mode="md" className="location-set-card ion-no-margin ion-no-padding ion-nowrap" color="tertiary">
        <div className={set ? 'location-set-card-wrapper set' : 'location-set-card-wrapper location'}>
          <div className="location-set-card-header">
            <IonTitle className="location-set-card-header-title">
              <HighlightedText text={set ? set.setName : location ? (`${location?.locationName} (${setsQuantity})`) : 'NO LOCATION'} searchTerm={searchText} />
            </IonTitle>
            {
              location
              && isMobile
              && <DropDownButton open={isOpen || false} />
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
                <InfoLabel label="TIME" value={minutes} symbol={seconds} />
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
                    !isMobile
                    && <DropDownButton open={isOpen || false} />
                  }
                </>
              )
            )}
          </div>
        </div>
      </IonItem>
      <IonItemOptions className="location-set-card-item-options">
        <div className="buttons-wrapper">
          <IonButton fill="clear" onClick={() => openEditModal()}>
            <CiEdit className="button-icon view" />
          </IonButton>
          <IonButton fill="clear">
            <PiProhibitLight className="button-icon ban" />
          </IonButton>
          <IonButton fill="clear" onClick={() => openAlert()}>
            <PiTrashSimpleLight className="button-icon trash" />
          </IonButton>
        </div>
      </IonItemOptions>

      <EditionModal
        formInputs={location ? locationInputs : setInputs}
        handleEdition={location ? editLocation : editSet}
        title={location ? 'Edit Location' : 'Edit Set'}
        defaultFormValues={location ? defaultFormValuesForLocations : defaultFormValuesForSets}
        validate={location ? validateLocationExistence : validateSetExistence}
        modalRef={modalRef}
      />

      <InputAlert
        ref={location ? deleteLocationAlert : deleteSetAlert}
        handleOk={location ? deleteLocation : deleteSet}
        header={location ? 'Delete Location' : 'Delete Set'}
        message={location ? `Are you sure you want to delete the location ${location.locationName}?` : `Are you sure you want to delete the set ${set?.setName}?`}
        inputs={[]}
      />
    </IonItemSliding>
  );
};

export default LocationSetCard;
