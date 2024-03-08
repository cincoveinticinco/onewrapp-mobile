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
import HighlightedText from '../../components/Shared/HighlightedText/HighlightedText';
import './CastCard.scss';
import secondsToMinSec from '../../utils/secondsToMinSec';
import floatToFraction from '../../utils/floatToFraction';
import { FiTrash } from 'react-icons/fi';
import { banOutline, checkmarkCircle, pencilOutline } from 'ionicons/icons';
import EditionModal from '../Shared/EditionModal/EditionModal';
import DatabaseContext from '../../context/database';
import InputAlert from '../Shared/InputAlert/InputAlert';

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

const InfoLabel: React.FC<{ label: string, value: string | number, symbol?: string}> = ({ label, value, symbol }) => (
  <p className="info-label">
    <span className="value-part">
      {value}
      <span className="symbol-part">{symbol}</span>
    </span>
    <span className="label-part">{label}</span>
  </p>
);

const CastCard: React.FC<CastCardProps> = ({ character, searchText, validationFunction }) => {
  const { oneWrapDb } = useContext<any>(DatabaseContext);
  const getCharacterNum = (character: Cast) => (character.characterNum ? `${character.characterNum}.` : '');

  const divideIntegerFromFraction = (value: string) => {
    const [integer, fraction] = value.split(' ');
    return {
      integer,
      fraction,
    };
  };

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
      label: 'Character Name',
      type: 'text',
      fieldName: 'characterName',
      placeholder: 'INSERT',
      required: true,
      inputName: 'add-character-name-input',
    },
  ]

  const defaultValues = {
    characterNum: character.characterNum,
    characterName: character.characterName,
  }

  const scenesToEdit = () => oneWrapDb.scenes.find({
    selector: {
      'characters.characterName': character.characterName,
    }
  }).exec();

  const deleteCharacter = async () => {
    try {
      const scenes = await scenesToEdit();
      const updatedScenes: any = [];
  
      scenes.forEach((scene: any) => {
        const updatedScene = { ...scene._data };
  
        updatedScene.characters = updatedScene.characters.filter((char: any) => char.characterName !== character.characterName);
        
        console.log('Updated Scene:', updatedScene);
        
        updatedScenes.push(updatedScene);
      });

      const result = await oneWrapDb.scenes.bulkUpsert(updatedScenes);
  
      console.log('Bulk update result:', result);
  
      console.log('Character deleted');

      successMessageSceneToast(`${character.characterName ? character.characterName.toUpperCase() : 'NO NAME'} was successfully deleted from all scenes!`);
    } catch (error) {
      console.error(error);
    }
  };

  const editCharacter = async (newCharacter: any) => {
    try {
      const scenes = await scenesToEdit();
      const updatedScenes: any = [];
  
      scenes.forEach((scene: any) => {
        const updatedScene = { ...scene._data };

        newCharacter.categoryName = character.categoryName;
  
        updatedScene.characters = updatedScene.characters.filter((char: any) => char.characterName !== character.characterName).concat(newCharacter);
        
        updatedScenes.push(updatedScene);
      });

      const result = await oneWrapDb.scenes.bulkUpsert(updatedScenes);
  
      console.log('Bulk update result:', result);
  
      console.log('Character deleted');

      successMessageSceneToast(`${character.characterName ? character.characterName.toUpperCase() : 'NO NAME'} was successfully updated!`);

    } catch (error) {
      console.error(error);
    }
  }

  const validateExistence = (value: string) => {
    return validationFunction(value, character.characterName);
  }

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
          <IonButton fill="clear" id={`edit-cast-${character.characterName}`}>
            <IonIcon icon={pencilOutline} className="button-icon view" />
          </IonButton>
          <IonButton fill="clear" onClick={() => scenesToEdit().then((values: any) => console.log(values))}>
            <IonIcon icon={banOutline} className="button-icon ban" />
          </IonButton>
          <IonButton fill="clear" id={`delete-cast-${character.characterName}`}>
            <FiTrash className="button-icon trash" />
          </IonButton>
        </div>
      </IonItemOptions>

      <EditionModal
        formInputs={formInputs}
        handleEdition={editCharacter}
        modalTrigger={`edit-cast-${character.characterName}`}
        title='Edit Character'
        defaultFormValues={defaultValues}
        validate={validateExistence}
      />

      <InputAlert
        header="Delete Scene"
        message={`Are you sure you want to delete ${character.characterName ? character.characterName.toUpperCase() : 'NO NAME'} character from all the scenes?`}
        handleOk={() => deleteCharacter()}
        inputs={[]}
        trigger={`delete-cast-${character.characterName}`}
      />

    </IonItemSliding>
  );
};

export default CastCard;
