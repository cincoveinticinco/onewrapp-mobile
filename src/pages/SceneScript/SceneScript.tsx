import {
  IonButton,
  IonContent, IonHeader, IonPage,
  useIonViewDidEnter,
  useIonViewWillEnter,
} from '@ionic/react';
import React, {
  useContext, useEffect,
  useState,
} from 'react';
import { FaClipboardList } from 'react-icons/fa';
import { HiMiniUsers } from 'react-icons/hi2';
import { MdOutlineFaceUnlock } from 'react-icons/md';
import { PiNotePencil, PiProhibitLight, PiTrashSimpleLight } from 'react-icons/pi';
import { RiEditFill, RiZoomInFill, RiZoomOutFill } from 'react-icons/ri';
import { useHistory, useParams } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import ScriptPage from './Components/ScriptPage';
import Toolbar from '../../Shared/Components/navigation/Toolbar/Toolbar';
import DatabaseContext from '../../context/Database/Database.context';
import ScenesContext from '../../context/Scenes/Scenes.context';
import {
  EmptyEnum, ShootingSceneStatusEnum,
} from '../../Shared/enums/ennums';
import useHideTabs from '../../hooks/utils/useHideTabs/useHideTabs';
import {
  Character, Element, Extra, Note, SceneDocType,
} from '../../Shared/types/scenes.types';
import { ShootingDocType, ShootingScene } from '../../Shared/types/shooting.types';
import applyFilters from '../../Shared/Utils/applyFilters';
import SceneHeader from '../SceneDetails/Components/SceneHeader/SceneHeader';
import './SceneScript.scss';
import { DatabaseContextProps } from '../../context/Database/types/Database.types';
import UnassignSceneAlert from '../../Shared/Components/modals/UnassignSceneAlert/UnassignSceneAlert';
import useAlertToast from '../../hooks/utils/useToastAlert/useToastAlert';
import DeleteSceneAlert from '../../Shared/Components/modals/DeleteSceneAlert/DeleteSceneAlert';
import SceneDetailsTabs from '../../Shared/Components/navigation/SeceneDetailsTabs/SceneDetailsTabs';
import { useDataInSceneDetail } from '../../hooks/database/useDataInSceneDetail/useDataInSceneDetail';
import useSceneDetailNavigation from '../../hooks/database/useSceneDetailNavigation/useSceneDetailNavigation';

export type SceneItemType = 'elements' | 'characters' | 'extras' | 'notes';

const SceneScript: React.FC<{
  isShooting?: boolean;
}> = ({ isShooting = false }) => {

  const { hideTabs } = useHideTabs();
  const { sceneId, id, shootingId: urlShootingId } = useParams<{ sceneId: string; id: string; shootingId?: string }>();
  const [thisSceneShooting, setThisSceneShooting] = useState<ShootingScene | null>(null);
  const { oneWrapDb, offlineScenes } = useContext<DatabaseContextProps>(DatabaseContext);
  const history = useHistory();
  const { selectedFilterOptions } = useContext(ScenesContext);
  const [zoomLevel, setZoomLevel] = useState(() => {
    const storedZoomLevel = localStorage.getItem('zoomLevel');
    return storedZoomLevel ? parseFloat(storedZoomLevel) : 1;
  });
  const [edition, setEdition] = useState(false);
  const [charactersArray, setCharactersArray] = useState<Character[]>([]);
  const [elementsArray, setElementsArray] = useState<Element[]>([]);
  const [extrasArray, setExtrasArray] = useState<Extra[]>([]);
  const [notesArray, setNotesArray] = useState<Note[]>([]);
  const [showTotalsPopup, setShowTotalsPopup] = useState(false);
  const [popupType, setPopupType] = useState<'notes' | 'characters' | 'elements' | 'extras' | null>(null);
  const [paragraphs, setParagraphs] = useState<any[]>([]);
  const [paragraphsAreLoading, setParagraphsAreLoading] = useState(true);
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [shootingId, setShootingId] = useState<string | undefined>(urlShootingId);
  const [filteredScenes, setFilteredScenes] = useState<SceneDocType[]>([]);
  const [openDeleteSceneAlert, setOpenDeleteSceneAlert] = useState<boolean>(false);
  const [openUnassignAlert, setOpenUnassignAlert] = useState<boolean>(false);
  const [thisShooting, setThisShooting] = useState<ShootingDocType | null>(null);
  const { errorToast } = useAlertToast();



  const {
    thisScene,
    sceneColor,
    setThisScene
  } = useDataInSceneDetail(sceneId, id);


  useEffect(() => {
    if (urlShootingId) {
      setShootingId(urlShootingId);
    }
  }, [urlShootingId]);

  useEffect(() => {
    if (thisScene) {
      setCharactersArray(thisScene?.characters || []);
      setElementsArray(thisScene?.elements || []);
      setExtrasArray(thisScene?.extras || []);
      setNotesArray(thisScene?.notes || []);
    }
  }, [thisScene]);

  const {
    previousScene,
    nextScene,
    changeToNextScene,
    changeToPreviousScene
  } = useSceneDetailNavigation(filteredScenes, sceneId, isShooting, id, urlShootingId, true);


  const rootRoute = isShooting ? `/my/projects/${id}/shooting/${shootingId}/details/scene` : `/my/projects/${id}/strips/details/scene`;
  const rootRouteScript = isShooting ? `/my/projects/${id}/shooting/${shootingId}/details/script` : `/my/projects/${id}/strips/details/script`;

  const getScenesInShooting = async () => {
    const shootingDoc = await oneWrapDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
    if (!shootingDoc || !shootingDoc._data || !shootingDoc._data.scenes) {
      return [];
    }
    const orderedScenes = [...shootingDoc._data.scenes].sort((a, b) => a.position - b.position);
    return orderedScenes.map((scene: any) => parseInt(scene.sceneId));
  };

  useEffect(() => {
    const filterScenes = async () => {
      let filtered: SceneDocType[];

      if (!isShooting) {
        filtered = selectedFilterOptions ? applyFilters(offlineScenes, selectedFilterOptions) : offlineScenes;
      } else {
        const scenesInShooting = await getScenesInShooting();

        filtered = offlineScenes.filter((scene: any) => scenesInShooting.includes(parseInt(scene.sceneId, 10)));
      }

      setFilteredScenes(filtered);
    };

    filterScenes();
  }, [isShooting, offlineScenes, selectedFilterOptions]);

  useEffect(() => {
    const printParagraphs = async () => {
      const frontScene = await oneWrapDb?.scenes.findOne({ selector: { sceneId: parseInt(sceneId) } }).exec();
      const paragraphs = await oneWrapDb?.paragraphs.find({
        selector: {
          sceneId: frontScene?._data?.id,
        },
      }).exec();
      paragraphs && setParagraphs(paragraphs);
      setParagraphsAreLoading(false);
    };
    oneWrapDb && printParagraphs();
  }, [oneWrapDb]);

const createNewSceneItem = async <T extends unknown>(
  thisScene: SceneDocType | null,
  oneWrapDb: DatabaseContextProps['oneWrapDb'],
  itemType: SceneItemType,
  newItem: T,
  errorMessage: string
): Promise<SceneDocType | null> => {
  try {
    if (!thisScene) {
      errorToast('No scene selected');
      return null;
    }

    // Ensure the scene item array exists, default to empty array if undefined
    const currentItems = (thisScene[itemType] as T[]) || [];
    
    // Create a Set to ensure unique items
    const sceneItems = new Set(currentItems);
    sceneItems.add(newItem);

    // Create new scene with updated items
    const newScene = { 
      ...thisScene, 
      [itemType]: Array.from(sceneItems) 
    };

    // Upsert the scene
    await oneWrapDb?.scenes?.upsert(newScene);
    return newScene;
  } catch (error) {
    errorToast?.(errorMessage);
    console.error(`Error in createNewSceneItem for ${itemType}:`, error);
    return null;
  }
};

  const handleCreation = async (type: ('element' | 'character' | 'extra' | 'note'), data: any) => {
    let newScene: SceneDocType | null = null;

    const typeToItemMap: Record<'element' | 'character' | 'extra' | 'note', { type: SceneItemType; errorMessage: string }> = {
      'element': { type: 'elements', errorMessage: 'Error creating element' },
      'character': { type: 'characters', errorMessage: 'Error creating character' },
      'extra': { type: 'extras', errorMessage: 'Error creating extra' },
      'note': { type: 'notes', errorMessage: 'Error creating note' }
    };

    const itemConfig = typeToItemMap[type];

    if (itemConfig) {
      newScene = await createNewSceneItem(
        thisScene, 
        oneWrapDb, 
        itemConfig.type, 
        data, 
        itemConfig.errorMessage
      );
    }

    if (newScene) {
      setThisScene(newScene);
    }
  };

  const sceneHeader = thisScene ? `${parseInt(thisScene.episodeNumber ?? '') > 0 ? (`${thisScene.episodeNumber}.`) : ''}${thisScene.sceneNumber}` : '';

  useIonViewDidEnter(() => {
    hideTabs();
  });

  useIonViewWillEnter(() => {
    hideTabs();
  });

  useEffect(() => {
    fetchSceneShooting();
  }, [shootingId, oneWrapDb, thisScene]);


  const fetchSceneShooting = async () => {
    if (shootingId && oneWrapDb && thisScene) {
      const shooting = await oneWrapDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
      const sceneShooting = shooting?._data?.scenes.find((sceneInShooting: any) => parseInt(sceneInShooting.sceneId) === parseInt(thisScene?.sceneId?.toString() || ''));
      setThisSceneShooting(sceneShooting || null);
      setThisShooting(shooting?._data || null);
    }

    if (!shootingId && thisScene?.sceneId) {
      const shooting = await oneWrapDb?.shootings.findOne({
        selector: {
          scenes: {
            $elemMatch: {
              sceneId: thisScene.sceneId.toString()
            }
          }
        }
      }).exec();

      if (shooting) {
        const sceneShooting = shooting._data?.scenes.find(
          (sceneInShooting: any) => parseInt(sceneInShooting.sceneId) === parseInt(thisScene.sceneId?.toString() || '')
        );
        setThisSceneShooting(sceneShooting || null);
        setThisShooting(shooting._data || null);
      }
    }
  };

  const getPopupList = (type: 'notes' | 'characters' | 'elements' | 'extras') => {
    let list: any = [];
    if (thisScene) {
      if (type === 'notes') {
        list = thisScene?.notes?.map((note: Note) => note.note);
        list = list.filter((note: string) => note !== null);
      }
      if (type === 'characters') {
        list = thisScene?.characters?.map((character: Character) => `${character.characterNum ? `${character.characterNum}. ` : ''}${character.characterName}`);
      }
      if (type === 'elements') {
        list = thisScene?.elements?.map((element: Element) => element.elementName);
      }
      if (type === 'extras') {
        list = thisScene?.extras?.map((extra: Extra) => extra.extraName);
      }
    }

    return list;
  };

  const getPopupCategories = (type: 'characters' | 'elements' | 'extras') => {
    const list = new Set<string>();
    if (thisScene) {
      if (type === 'characters') {
        thisScene?.characters?.forEach((character: Character) => {
          character.categoryName ? list.add(character.categoryName) : list.add(EmptyEnum.NoCategory);
        });
      }
      if (type === 'elements') {
        thisScene?.elements?.forEach((element: Element) => {
          element.categoryName ? list.add(element.categoryName) : list.add(EmptyEnum.NoCategory);
        });
      }
      if (type === 'extras') {
        thisScene?.extras?.forEach((extra: Extra) => {
          extra.categoryName ? list.add(extra.categoryName) : list.add(EmptyEnum.NoCategory);
        });
      }
    }

    return Array.from(list);
  };

  const getPopupListByCategory = (type: 'characters' | 'elements' | 'extras', category: string | null) => {
    const list = new Set<string>();
    if (thisScene) {
      if (type === 'characters') {
        thisScene?.characters?.filter((character: Character) => character.categoryName === category).forEach((character: Character) => {
          const characterString = `${character.characterNum ? `${character.characterNum}. ` : ''}${character.characterName}`;
          list.add(characterString);
        });
      }
      if (type === 'elements') {
        thisScene?.elements?.filter((element: Element) => element.categoryName === category).forEach((element: Element) => {
          if (element.elementName) {
            list.add(element.elementName);
          }
        });
      }
      if (type === 'extras') {
        thisScene?.extras?.forEach((extra: Extra) => {
          if (extra.extraName) {
            list.add(extra.extraName);
          }
        });
      }
    }

    return Array.from(list);
  };

  const handleOpenTotalsPopup = (type: 'notes' | 'characters' | 'elements' | 'extras') => {
    if (popupType === type) {
      setShowTotalsPopup(false);
      setPopupType(null);
      return;
    }
    setPopupType(type);
    setShowTotalsPopup(true);
  };

  const handleBack = () => {
    const backRoute = isShooting ? `/my/projects/${id}/shooting/${shootingId}` : `/my/projects/${id}/strips`;
    history.push(backRoute);
  };

  const getPopupPositionTop = () => {
    if (popupType === 'notes') {
      return '16px';
    }
    if (popupType === 'characters') {
      return '50px';
    }
    if (popupType === 'elements') {
      return '100px';
    }
    if (popupType === 'extras') {
      return '150px';
    }

    return '16px';
  };

  const getSceneStatus = (scene: ShootingScene) => {
    switch (scene.status) {
      case ShootingSceneStatusEnum.Assigned: return 'ASSIGNED';
      case ShootingSceneStatusEnum.NotShoot: return 'NOT SHOOT';
      case ShootingSceneStatusEnum.Shoot: return 'SHOOT';
      default: return 'NOT ASSIGNED';
    }
  };

  const handleZoomIn = () => {
    const newZoomLevel = zoomLevel < 1.5 ? zoomLevel + 0.1 : zoomLevel;
    setZoomLevel(newZoomLevel);
    localStorage.setItem('zoomLevel', newZoomLevel.toString());
  };

  const handleZoomOut = () => {
    const newZoomLevel = zoomLevel > 1 ? zoomLevel - 0.1 : zoomLevel;
    setZoomLevel(newZoomLevel);
    localStorage.setItem('zoomLevel', newZoomLevel.toString());
  };

  const handleEdition = () => {
    setEdition(!edition);
  };

  const toolbarButtons = () => {
    return (
      <>
        {
          thisSceneShooting &&
          <IonButton fill="clear" slot="end" color="light" className="ion-no-padding toolbar-button" onClick={() => setOpenUnassignAlert(true)}>
            <PiProhibitLight className="toolbar-icon prohibit-icon" />
          </IonButton>
        }
        <IonButton fill="clear" slot="end" color="light" className="ion-no-padding toolbar-button" onClick={() => setOpenDeleteSceneAlert(true)}>
          <PiTrashSimpleLight className="toolbar-icon trash-icon" />
        </IonButton>
      </>
    )
  }

  return (
    <>
      <IonPage>
        <div className="script-buttons-container">
          <RiZoomInFill
            className="script-button-icon"
            onClick={handleZoomIn}
            style={
              zoomLevel > 1 ? { color: 'var(--ion-color-success)' } : {}
            }
          />
          <RiZoomOutFill className="script-button-icon" onClick={handleZoomOut} />
          <RiEditFill
            className="script-button-icon"
            onClick={handleEdition}
            style={
              edition ? { color: 'var(--ion-color-success)' } : {}
            }
          />
        </div>
        <div className="script-total-buttons-container">
          <div className="total-buttons-wrapper" onClick={() => handleOpenTotalsPopup('notes')}>
            <PiNotePencil className="script-button-icon" style={popupType === 'notes' ? { color: 'var(--ion-color-primary)' } : {}} />
            <span className="total-length notes">{getPopupList('notes').length}</span>
          </div>
          <div className="total-buttons-wrapper" onClick={() => handleOpenTotalsPopup('characters')}>
            <MdOutlineFaceUnlock className="script-button-icon" style={popupType === 'characters' ? { color: 'var(--ion-color-primary)' } : {}} />
            <span className="total-length characters">{getPopupList('characters').length}</span>
          </div>
          <div className="total-buttons-wrapper" onClick={() => handleOpenTotalsPopup('elements')}>
            <FaClipboardList className="script-button-icon" style={popupType === 'elements' ? { color: 'var(--ion-color-primary)' } : {}} />
            <span className="total-length elements">{getPopupList('elements').length}</span>
          </div>
          <div className="total-buttons-wrapper" onClick={() => handleOpenTotalsPopup('extras')}>
            <HiMiniUsers className="script-button-icon" style={popupType === 'extras' ? { color: 'var(--ion-color-primary)' } : {}} />
            <span className="total-length extras">{getPopupList('extras').length}</span>
          </div>
          {
            popupType && popupType === 'notes' && showTotalsPopup && (
              <div className="script-total-popup-background" style={{ top: getPopupPositionTop() }} onClick={() => getPopupList(popupType)}>
                {getPopupList(popupType)?.length === 0 ? (
                  <div className="total-popup-item ion-padding-start">
                    NO
                    {popupType.toUpperCase()}
                    {' '}
                    ADDED
                  </div>
                ) : (
                  getPopupList(popupType)?.map((item: string, i: number) => (
                    <div key={`popup-list-${item}`} className="total-popup-item ion-padding-start">{item && item.toUpperCase()}</div>
                  ))
                )}
              </div>
            )
          }
          {
            popupType && popupType !== 'notes' && showTotalsPopup && (
              <div className="script-total-popup-background" style={{ top: getPopupPositionTop() }} onClick={() => getPopupList(popupType)}>
                {getPopupCategories(popupType).length === 0 ? (
                  <div className="total-popup-item ion-padding-start">
                    NO
                    {popupType.toUpperCase()}
                    {' '}
                    ADDED
                  </div>
                )
                  : getPopupCategories(popupType).map((category: string) => (
                    <div className="popup-category-container" key={`scene-script-${category || '' }`}>
                      <p
    
                        className="popup-category ion-no-margin ion-padding"
                        style={{
                          backgroundColor: 'var(--ion-color-tertiary-shade)',
                          border: '1px solid var(--ion-color-primary)',
                        }}
                      >
                        {category && category.toUpperCase()}
                      </p>
                      <div className="popup-list-container">
                        {
                          getPopupListByCategory(popupType, (category === EmptyEnum.NoCategory ? null : category)).map((item: string) => (
                            <p className="total-popup-item ion-no-margin ion-padding-start" key={item + popupType + category}>{item && item.toUpperCase()}</p>
                          ))
                        }
                      </div>
                    </div>
                  ))}
              </div>
            )
          }
        </div>
        <IonHeader>
          <Toolbar back handleBack={handleBack} name='Scene Script' customButtons={[toolbarButtons]} />
          <SceneHeader
            sceneColor={sceneColor}
            sceneHeader={sceneHeader}
            previousScene={previousScene}
            nextScene={nextScene}
            changeToPreviousScene={changeToPreviousScene}
            changeToNextScene={changeToNextScene}
            status={thisSceneShooting ? getSceneStatus(thisSceneShooting) : 'Not Assigned'}
          />
        </IonHeader>
        <IonContent
          color="tertiary"
          fullscreen
          scrollEvents={false}
          onClick={() => setShowTotalsPopup(false)}
        >
          <ScriptPage
            zoomLevel={zoomLevel}
            edition={edition}
            charactersArray={charactersArray || []}
            elementsArray={elementsArray || []}
            extrasArray={extrasArray || []}
            notesArray={notesArray || []}
            handleCreation={handleCreation}
            selectedSceneId={sceneId}
            setSelectedSceneId={setSelectedSceneId}
            paragraphs={paragraphs}
            paragraphsAreLoading={paragraphsAreLoading}
          />
        </IonContent>
        {
          !paragraphsAreLoading
          && paragraphs.length > 10
          && (
            <div
              className="script-page-top-bar"
              style={{
                transform: `scale(${zoomLevel})`,
              }}
            >
              {edition && (
                <p
                  style={{
                    color: 'var(--ion-color-success)',
                    position: 'absolute',
                    right: '40%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'flex-start',
                  }}
                >
                  Edition Enabled
                </p>
              )}
            </div>
          )
        }
        <SceneDetailsTabs
          routeDetails={`${rootRoute}/${sceneId}${isShooting ? '?isShooting=true' : ''}`}
          routeScript={`${rootRouteScript}/${sceneId}${isShooting ? '?isShooting=true' : ''}`}
          currentRoute="scenescript"
        />
        <DeleteSceneAlert
          alertIsOpen={openDeleteSceneAlert}
          setAlertIsOpen={setOpenDeleteSceneAlert}
          sceneId={sceneId}
          projectId={id}
          sceneHeader={sceneHeader}
          onSuccess={() => handleBack()}
        />
        {
          thisShooting?.id &&
          <UnassignSceneAlert
            alertIsOpen={openUnassignAlert}
            setAlertIsOpen={setOpenUnassignAlert}
            sceneId={sceneId}
            shootingId={thisShooting.id}
            sceneHeader={sceneHeader}
            onSuccess={fetchSceneShooting}
          />
        }
      </IonPage>
    </>
  );
};

export default SceneScript;
