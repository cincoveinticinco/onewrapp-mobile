import {
  IonButton,
  IonCol,
  IonGrid, IonItem, IonItemOptions,
  IonItemSliding,
  IonReorder,
  IonRow,
  useIonToast,
} from '@ionic/react';
import { checkmarkCircle } from 'ionicons/icons';
import React, { useContext } from 'react';
import { CiEdit } from 'react-icons/ci';
import { IoIosRemoveCircleOutline } from 'react-icons/io';
import { LuGripHorizontal } from 'react-icons/lu';
import { PiProhibitLight, PiTrashSimpleLight } from 'react-icons/pi';
import { useHistory, useParams, useRouteMatch } from 'react-router';
import {
  DayOrNightOptionEnum, IntOrExtOptionEnum, SceneTypeEnum,
  ShootingSceneStatusEnum,
} from '../../../../Shared/ennums/ennums';
import InputAlert from '../../../../Layouts/InputAlert/InputAlert';
import DatabaseContext from '../../../../context/Database/Database.context';
import { SceneDocType } from '../../../../Shared/types/scenes.types';
import HighlightedText from '../../../../Shared/Components/HighlightedText/HighlightedText';
import floatToFraction from '../../../../Shared/Utils/floatToFraction';
import { DatabaseContextProps } from '../../../../context/Database/types/Database.types';
import getSceneHeader from '../../../../Shared/Utils/getSceneHeader';
import secondsToMinSec from '../../../../Shared/Utils/secondsToMinSec';
import './SceneCard.scss';

interface SceneCardProps {
  scene: SceneDocType & { frontId: string };
  searchText?: string;
  isShooting?: boolean;
  isProduced?: ShootingSceneStatusEnum;
  shootingDeleteScene?: () => void;
  permissionType?: number | null;
}

const SceneCard: React.FC<SceneCardProps> = ({
  scene, searchText = '', isShooting = false, isProduced = false, shootingDeleteScene, permissionType,
}) => {
  const { oneWrapDb } = useContext<DatabaseContextProps>(DatabaseContext);

  const disableEditions = permissionType !== 1;

  const history = useHistory();
  const routeMatch = useRouteMatch();
  const detailsRoute = `${routeMatch.url}/details/scene/${scene.sceneId}`;
  const alertRef = React.useRef<HTMLIonAlertElement>(null);
  const alertShooSceneRef = React.useRef<HTMLIonAlertElement>(null);

  const openDeleteAlert = async () => {
    if (alertRef.current) {
      await alertRef.current.present();
    }
  };

  const openUnassignAlert = async () => {
    if (alertShooSceneRef.current) {
      await alertShooSceneRef.current.present();
    }
  };

  const [presentToast] = useIonToast();
  const { id } = useParams<{ id: string }>();

  const successMessageSceneToast = (message: string) => {
    presentToast({
      message,
      duration: 2000,
      icon: checkmarkCircle,
      position: 'top',
      cssClass: 'success-toast',
    });
  };

  const interior = IntOrExtOptionEnum.INT;
  const exterior = IntOrExtOptionEnum.EXT;
  const intExt = IntOrExtOptionEnum.INT_EXT;
  const extInt = IntOrExtOptionEnum.EXT_INT;
  const protectionType = SceneTypeEnum.PROTECTION;
  const sceneType = SceneTypeEnum.SCENE;
  const day = DayOrNightOptionEnum.DAY;
  const night = DayOrNightOptionEnum.NIGHT;

  const getCharacters = (scene: SceneDocType) => {
    const { characters } = scene;
    let charactersString = '';

    if (characters) {
      characters.forEach((character) => {
        if (character.characterName) {
          charactersString += `${character.characterName.toUpperCase()}, `;
        }
      });

      return charactersString;
    }

    return '';
  };

  const defineSceneColor = (scene: SceneDocType) => {
    const intOrExt: any = [exterior, intExt, extInt];

    if (scene.sceneType === protectionType) {
      return 'rose';
    } if (scene.sceneType === sceneType) {
      if (scene.intOrExtOption === null || scene.dayOrNightOption === null) {
        return 'dark';
      } if (scene.intOrExtOption === interior && scene.dayOrNightOption === day) {
        return 'light';
      } if (scene.intOrExtOption === interior && scene.dayOrNightOption === night) {
        return 'success';
      } if (intOrExt.includes((scene.intOrExtOption)?.toUpperCase()) && scene.dayOrNightOption === day) {
        return 'yellow';
      } if (intOrExt.includes((scene.intOrExtOption)?.toUpperCase()) && scene.dayOrNightOption === night) {
        return 'primary';
      }
    }

    return 'light';
  };

  const defineHighlightColor = (scene: SceneDocType) => {
    const sceneColor = defineSceneColor(scene);

    if (sceneColor === 'success' || sceneColor === 'primary') {
      return 'white';
    }
  };

  const getExtras = (scene: SceneDocType) => {
    const { extras } = scene;
    let extrasString = '';

    if (extras && extras.length > 0) {
      extras.forEach((extra) => {
        if (extra.extraName) {
          extrasString += `${extra.extraName.toUpperCase()}, `;
        }
      });

      return extrasString;
    }

    return 'NO EXTRAS PLAYING';
  };

  const getPageNumber = (scene: SceneDocType) => {
    const pageFloat = scene.pages;
    let pageFraction;

    if (pageFloat) {
      pageFraction = floatToFraction(pageFloat);
    }

    return pageFraction;
  };

  const deleteScene = async () => {
    try {
      // Find scene by project id, episode number and scene number
      const sceneToDelete = await oneWrapDb?.scenes.findOne(
        { selector: 
          { 
            episodeNumber: scene.episodeNumber, 
            sceneNumber: scene.sceneNumber, 
            projectId: scene.projectId
          } 
        }).exec();
      await sceneToDelete?.remove();
      successMessageSceneToast('SceneDocType deleted successfully');
    } catch (error) {
      throw error;
    }
  };

  const goToSceneDetails = (editMode: boolean = false) => {
    let route = isShooting ? `${detailsRoute}?isShooting=true` : detailsRoute;
    if (editMode) {
      route += '?edit=true';
    }
    history.push(route);
    localStorage.setItem('editionBackRoute', route);
  };

  const shootingCardSceneClass = (isShooting && (isProduced === ShootingSceneStatusEnum.Assigned ? 'background-light' : isProduced === ShootingSceneStatusEnum.Shoot ? 'background-success' : 'background-danger'));

  const cardContent = (
    <IonRow className="scene-card-row" color="tertiary">
      <IonItemSliding className="ion-no-margin ion-no-padding">
        <IonItem className="ion-no-margin ion-no-padding scene-card-item" color={defineSceneColor(scene)}>
          {
              isShooting && (
                <IonReorder className={`reorder-container scene-card`}>
                  <LuGripHorizontal className="ion-no-padding ion-no-margin grip-sort-item-icon" />
                </IonReorder>
              )
            }
          <IonGrid className="ion-no-margin ion-no-padding" >
            <IonRow className={`scene-card`} onClick={() => goToSceneDetails()}>
              <IonCol className="scene-card-col-1">
                <h3 className="scene-card-header">
                  <HighlightedText text={getSceneHeader(scene)} searchTerm={searchText} highlightColor={defineHighlightColor(scene)} />
                </h3>
                <p className="scene-card-synopsis">
                  <HighlightedText text={scene.synopsis || ''} searchTerm={searchText} highlightColor={defineHighlightColor(scene)} />
                </p>
                <p className="scene-card-characters">
                  <strong>CHARACTERS:</strong>
                  {' '}
                  <HighlightedText text={getCharacters(scene) !== '' ? getCharacters(scene) : 'NO CHARACTERS'} searchTerm={searchText} highlightColor={defineHighlightColor(scene)} />
                  <br />
                  <strong>EXTRAS: </strong>
                  {' '}
                  <HighlightedText text={getExtras(scene)} searchTerm={searchText} highlightColor={defineHighlightColor(scene)} />
                </p>
              </IonCol>
              <IonCol className="scene-card-col-2">
                <p className="ion-no-margin">
                  <strong>P: </strong>
                  {' '}
                  <HighlightedText text={getPageNumber(scene) || 'N/A'} searchTerm={searchText} highlightColor={defineHighlightColor(scene)} />
                </p>
                <p className="ion-no-margin">
                  <strong>M: </strong>
                  {' '}
                  <HighlightedText text={scene.estimatedSeconds ? secondsToMinSec(scene.estimatedSeconds) : 'N/A'} searchTerm={searchText} highlightColor={defineHighlightColor(scene)} />
                </p>
              </IonCol>
              <IonCol className={`scene-card-col-3 center-flex-row ${shootingCardSceneClass}`}>
                {
                    !isShooting ? (
                      <p className="assignament-date"></p>
                    ) : (
                      <p className={isProduced ? 'produced assignament-date' : 'not-produced assignament-date'}> </p>
                    )
                  }
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonItem>
        <IonItemOptions class="scene-card-options">
          <div className="buttons-wrapper">
            <IonButton
              fill="clear"
              onClick={() => goToSceneDetails(true)}
              disabled={disableEditions}
            >
              <CiEdit className="button-icon view" />
            </IonButton>
            {
                !isShooting
                && (
                <>
                  <IonButton fill="clear" disabled={disableEditions} onClick={() => console.log(scene)}>
                    <PiProhibitLight className="button-icon ban" />
                  </IonButton>
                  <IonButton fill="clear" onClick={openDeleteAlert} disabled={disableEditions}>
                    <PiTrashSimpleLight className="button-icon trash" />
                  </IonButton>
                </>
                )
              }
            {
                isShooting && shootingDeleteScene
                && (
                <IonButton fill="clear" onClick={() => openUnassignAlert()} disabled={disableEditions}>
                  <IoIosRemoveCircleOutline className="button-icon ban" />
                </IonButton>
                )
              }
          </div>
        </IonItemOptions>
      </IonItemSliding>
      <InputAlert
        header="Delete SceneDocType"
        message={`Are you sure you want to delete scene ${getSceneHeader(scene)}?`}
        handleOk={() => deleteScene()}
        inputs={[]}
        ref={alertRef}
      />
      {
        shootingDeleteScene && (
          <InputAlert
            header="Unassign SceneDocType"
            message={`Are you sure you want to unassign scene ${getSceneHeader(scene)}?`}
            handleOk={() => shootingDeleteScene()}
            inputs={[]}
            ref={alertShooSceneRef}
          />
        )
      }

    </IonRow>
  );

  return cardContent;
};

export default SceneCard;
