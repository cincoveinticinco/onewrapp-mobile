import React, { useContext } from 'react';
import {
  IonItemSliding,
  IonItemOptions,
  IonButton,
  IonIcon,
  IonItem,
  IonTitle,
  useIonToast,
} from '@ionic/react';
import { PiProhibitLight, PiTrashSimpleLight } from 'react-icons/pi';
import { CiEdit } from 'react-icons/ci';
import HighlightedText from '../../components/Shared/HighlightedText/HighlightedText';
import './CastCard.scss';
import secondsToMinSec from '../../utils/secondsToMinSec';
import floatToFraction from '../../utils/floatToFraction';
import { banOutline, checkmarkCircle, pencilOutline } from 'ionicons/icons';
import EditionModal from '../Shared/EditionModal/EditionModal';
import DatabaseContext, { DatabaseContextProps } from '../../hooks/Shared/database';
import InputAlert from '../../Layouts/InputAlert/InputAlert';
import InfoLabel from '../Shared/InfoLabel/InfoLabel';
import useWarningToast from '../../hooks/Shared/useWarningToast';

interface Cast {
  characterNum: string;
  extraName: string;
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
  validationFunction: (value: string, currentValue: string) => (boolean | string)
}

const CastCard: React.FC<CastCardProps> = ({ character, searchText, validationFunction }) => {
  const { oneWrapDb, projectId } = useContext<DatabaseContextProps>(DatabaseContext);
  const getCharacterNum = (character: Cast) => (character.characterNum ? `${character.characterNum}.` : '');

  const divideIntegerFromFraction = (value: string) => {
    const [integer, fraction] = value.split(' ');
    return {
      integer,
      fraction,
    };
  };

  const modalRef = React.useRef<HTMLIonModalElement>(null);
  const openModalEdition = () => modalRef.current?.present();

  const fraction = floatToFraction(character.pagesSum);

  const fractionPart = divideIntegerFromFraction(fraction).fraction;
  const integerPart = divideIntegerFromFraction(fraction).integer;

  const divideMinutesFromSeconds = (value: string) => {
    // 24:00
    const [minutes, seconds] = value.split(':');
    return {
      minutes,
      seconds,
    };
  };

  const minutesSeconds = secondsToMinSec(character.estimatedTimeSum);

  const { minutes } = divideMinutesFromSeconds(minutesSeconds);
  const { seconds } = divideMinutesFromSeconds(minutesSeconds);

  const [presentToast] = useIonToast();

  const successMessageSceneToast = (message: string) => {
    presentToast({
      message,
      duration: 2000,
      icon: checkmarkCircle,
      position: 'top',
      cssClass: 'success-toast',
    });
  };

  const warningMessageToast = useWarningToast();

  const formInputs = [
    {
      label: 'Character Number',
      type: 'text',
      fieldName: 'characterNum',
      placeholder: 'INSERT',
      required: true,
      inputName: 'add-character-number-input',
    },
    {
      label: 'Category Name',
      type: 'text',
      fieldName: 'categoryName',
      placeholder: 'INSERT',
      required: false,
      inputName: 'add-category-name-input',
    },
    {
      label: 'Character Name',
      type: 'text',
      fieldName: 'characterName',
      placeholder: 'INSERT',
      required: true,
      inputName: 'add-character-name-input',
    },
  ];

  const extraFormInputs = [
    {
      label: 'Extra Name',
      type: 'text',
      fieldName: 'extraName',
      placeholder: 'INSERT',
      required: true,
      inputName: 'add-extra-name-input',
    },
  ];

  const defaultValues = {
    categoryName: character.categoryName === 'NO CATEGORY' ? '' : character.categoryName,
    characterNum: character.characterNum,
    characterName: character.characterName,
  };

  const extraDefaultValues = {
    extraName: character.extraName,
  };

  const scenesToEdit = () => oneWrapDb?.scenes.find({
    selector: {
      projectId,
      'characters.characterName': character.characterName,
    },
  }).exec();

  const scenesToEditWithExtra = () => oneWrapDb?.scenes.find({
    selector: {
      projectId,
      'extras.extraName': character.extraName,
    },
  }).exec();

  const deleteCharacter = async () => {
    try {
      warningMessageToast('Please wait...');
      const scenes = await scenesToEdit();
      const updatedScenes: any = [];

      scenes?.forEach((scene: any) => {
        const updatedScene = { ...scene._data };

        updatedScene.characters = updatedScene.characters.filter((char: any) => char.characterName !== character.characterName);

        console.log('Updated Scene:', updatedScene);

        updatedScenes.push(updatedScene);
      });

      const result = await oneWrapDb?.scenes.bulkUpsert(updatedScenes);

      console.log('Bulk update result:', result);

      console.log('Character deleted');

      successMessageSceneToast(`${!character.extraName ? character.characterName.toUpperCase() : 'NO NAME'} was successfully deleted from all scenes!`);
    } catch (error) {
      console.error(error);
    }
  };

  const editCharacter = async (newCharacter: any) => {
    try {
      warningMessageToast('Please wait...');
      const scenes = await scenesToEdit();
      const updatedScenes: any = [];

      scenes?.forEach((scene: any) => {
        const updatedScene = { ...scene._data };

        updatedScene.characters = updatedScene.characters.filter((char: any) => char.characterName !== character.characterName).concat(newCharacter);

        updatedScenes.push(updatedScene);
      });

      const result = await oneWrapDb?.scenes.bulkUpsert(updatedScenes);

      console.log('Bulk update result:', result);

      console.log('Character deleted');

      successMessageSceneToast(`${!character.extraName ? character.characterName.toUpperCase() : 'NO NAME'} was successfully updated!`);
    } catch (error) {
      console.error(error);
    }
  };

  /// 1056 * 816 carta

  const editExtra = async (newExtra: any) => {
    try {
      const scenes = await scenesToEditWithExtra();
      const updatedScenes: any = [];

      scenes?.forEach((scene: any) => {
        const updatedScene = { ...scene._data };

        const oldExtra = updatedScene.extras.find((extra: any) => extra.extraName === character.extraName);

        updatedScene.extras = updatedScene.extras.filter((extra: any) => extra.extraName !== character.extraName).concat({
          ...oldExtra,
          ...newExtra,
        });

        updatedScenes.push(updatedScene);
      });

      const result = await oneWrapDb?.scenes.bulkUpsert(updatedScenes);

      console.log('Bulk update result:', result);

      console.log('Extra deleted');

      successMessageSceneToast(`${character.extraName ? character.extraName.toUpperCase() : 'NO NAME'} was successfully updated!`);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteExtra = async () => {
    try {
      const scenes = await scenesToEditWithExtra();
      const updatedScenes: any = [];

      scenes?.forEach((scene: any) => {
        const updatedScene = { ...scene._data };

        updatedScene.extras = updatedScene.extras.filter((extra: any) => extra.extraName !== character.extraName);

        updatedScenes.push(updatedScene);
      });

      const result = await oneWrapDb?.scenes.bulkUpsert(updatedScenes);

      console.log('Bulk update result:', result);

      console.log('Extra deleted');

      successMessageSceneToast(`${character.extraName ? character.extraName.toUpperCase() : 'NO NAME'} was successfully deleted from all scenes!`);
    } catch (error) {
      console.error(error);
    }
  };

  const validateExistence = (value: string) => validationFunction(value, character.characterName);

  return (
    <IonItemSliding>
      <IonItem mode="md" className="cast-card ion-no-margin ion-no-padding ion-nowrap" color="tertiary">
        <div className="cast-card-wrapper">
          <div className="cast-card-image">
            {/* EMPTY TEMPORARY */}
          </div>
          <div color="dark" className="cast-card-header">
            <IonTitle className="cast-card-header-title">
              <HighlightedText
                text={`${getCharacterNum(character)} ${character.characterName || character.extraName}`}
                searchTerm={searchText}
              />
            </IonTitle>
            <p className="cast-card-header-subtitle">
              TALENT NOT ASSIGNED
            </p>
          </div>
          <div className="cast-card-content">
            <InfoLabel label="PART." value={character.participation} symbol="%" />
            <InfoLabel label="LOC." value={character.locationsQuantity} />
            <InfoLabel label="SETS" value={character.setsQuantity} />
            <InfoLabel label="EP." value={character.episodesQuantity} />
            <InfoLabel label="SCN." value={character.scenesQuantity} />
            <InfoLabel label="PAGES" value={integerPart} symbol={fractionPart} />
            <InfoLabel label="PROT." value={character.protectionQuantity} />
            <InfoLabel label="TIME" value={minutes} symbol={`:${seconds}`} />
          </div>
        </div>
      </IonItem>
      <IonItemOptions className="cast-card-item-options">
        <div className="buttons-wrapper">
          <IonButton fill="clear" onClick={openModalEdition}>
            <CiEdit className="button-icon view" />
          </IonButton>
          <IonButton fill="clear" onClick={() => scenesToEdit()?.then((values: any) => console.log(values))}>
            <PiProhibitLight className="button-icon ban" />
          </IonButton>
          <IonButton fill="clear" id={!character.extraName ? `delete-cast-${character.characterName}` : `delete-extra-${character.extraName}`}>
            <PiTrashSimpleLight className="button-icon trash" />
          </IonButton>
        </div>
      </IonItemOptions>

      <EditionModal
        formInputs={!character.extraName ? formInputs : extraFormInputs}
        handleEdition={!character.extraName ? editCharacter : editExtra}
        title="Edit Cast"
        defaultFormValues={!character.extraName ? defaultValues : extraDefaultValues}
        validate={validateExistence}
        modalRef={modalRef}
      />

      <InputAlert
        header="Delete Scene"
        message={`Are you sure you want to delete ${!character.extraName ? character.characterName.toUpperCase() : character.extraName.toUpperCase() ? character.extraName : 'NO NAME'} character from all the scenes?`}
        handleOk={() => (!character.extraName ? deleteCharacter() : deleteExtra())}
        inputs={[]}
        trigger={!character.extraName ? `delete-cast-${character.characterName}` : `delete-extra-${character.extraName}`}
      />

    </IonItemSliding>
  );
};

export default CastCard;
