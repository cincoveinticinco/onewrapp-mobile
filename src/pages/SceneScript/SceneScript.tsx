import {
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
import { PiNotePencil } from 'react-icons/pi';
import { RiEditFill, RiZoomInFill, RiZoomOutFill } from 'react-icons/ri';
import { useHistory, useParams } from 'react-router';
import ScriptPage from '../../components/SceneScript/ScriptPage';
import SceneDetailsTabs from '../../components/Shared/SeceneDetailsTabs/SceneDetailsTabs';
import Toolbar from '../../components/Shared/Toolbar/Toolbar';
import DatabaseContext, { DatabaseContextProps } from '../../context/Database.context';
import ScenesContext from '../../context/Scenes.context';
import {
  DayOrNightOptionEnum, IntOrExtOptionEnum, SceneTypeEnum, ShootingSceneStatusEnum,
} from '../../Ennums/ennums';
import useErrorToast from '../../hooks/Shared/useErrorToast';
import useHideTabs from '../../hooks/Shared/useHideTabs';
import {
  Character, Element, Extra, Note, Scene,
} from '../../interfaces/scenes.types';
import { ShootingScene } from '../../interfaces/shooting.types';
import applyFilters from '../../utils/applyFilters';
import SceneHeader from '../SceneDetails/SceneHeader';
import './SceneScript.scss';

// BLUE CHARACTER
// YELLOW ELEMENT
// GREEN EXTRA

const SceneScript: React.FC<{
  isShooting?: boolean;
}> = ({ isShooting = false }) => {
  const { hideTabs, showTabs } = useHideTabs();
  const { sceneId, id, shootingId: urlShootingId } = useParams<{ sceneId: string; id: string; shootingId?: string }>();
  const [thisScene, setThisScene] = useState<Scene | null>(null);
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
  const [filteredScenes, setFilteredScenes] = useState<Scene[]>([]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(-1);
  const [previousScene, setPreviousScene] = useState<Scene | null>(null);
  const [nextScene, setNextScene] = useState<Scene | null>(null);
  const [sceneIsLoading, setSceneIsLoading] = useState<boolean>(true);
  const errorToast = useErrorToast();

  useEffect(() => {
    if (urlShootingId) {
      setShootingId(urlShootingId);
    }
  }, [urlShootingId]);

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
      setSceneIsLoading(true);
      let filtered: Scene[];
      if (!isShooting) {
        filtered = selectedFilterOptions ? applyFilters(offlineScenes, selectedFilterOptions) : offlineScenes;
      } else {
        const scenesInShooting = await getScenesInShooting();
        filtered = [];
        for (const id of scenesInShooting) {
          const scene = offlineScenes.find((scene: any) => parseInt(scene.sceneId) === id);
          if (scene) {
            filtered.push(scene);
          }
        }
      }
      setFilteredScenes(filtered);
      setSceneIsLoading(false);
    };

    filterScenes();
  }, [isShooting, offlineScenes, selectedFilterOptions, shootingId, oneWrapDb]);

  useEffect(() => {
    const printParagraphs = async () => {
      const paragraphs = await oneWrapDb?.paragraphs.find({
        selector: {
          sceneId: selectedSceneId || sceneId,
        },
      }).exec();
      paragraphs && setParagraphs(paragraphs);
      setParagraphsAreLoading(false);
    };
    oneWrapDb && printParagraphs();
  }, [oneWrapDb]);

  const createNewElement = async (element: Element) => {
    try {
      const sceneElements = new Set(await thisScene?.elements);
      sceneElements.add(element);
      const newScene = { ...thisScene, elements: Array.from(sceneElements) };
      await oneWrapDb?.scenes.upsert(newScene);
    } catch (error) {
      errorToast('Error creating element');
    }
  };

  const createNewCharacter = async (character: Character) => {
    try {
      const sceneCharacters = new Set(await thisScene?.characters);
      sceneCharacters.add(character);
      const newScene = { ...thisScene, characters: Array.from(sceneCharacters) };
      await oneWrapDb?.scenes.upsert(newScene);
    } catch (error) {
      errorToast('Error creating character');
    }
  };

  const createNewExtra = async (extra: Extra) => {
    try {
      const sceneExtras = new Set(await thisScene?.extras);
      sceneExtras.add(extra);
      const newScene = { ...thisScene, extras: Array.from(sceneExtras) };
      await oneWrapDb?.scenes.upsert(newScene);
    } catch (error) {
      errorToast('Error creating extra');
    }
  };

  const createNewNote = async (note: Note) => {
    try {
      const sceneNotes = new Set(await thisScene?.notes);
      sceneNotes.add(note);
      const newScene = { ...thisScene, notes: Array.from(sceneNotes) };
      await oneWrapDb?.scenes.upsert(newScene);
    } catch (error) {
      errorToast('Error creating note');
    }
  };

  const handleCreation = (type: ('element' | 'character' | 'extra' | 'note'), data: any) => {
    if (type === 'element') {
      createNewElement(data);
    } else if (type === 'character') {
      createNewCharacter(data);
    } else if (type === 'extra') {
      createNewExtra(data);
    } else if (type === 'note') {
      createNewNote(data);
    }
  };

  const getCurrentScene = async () => {
    const scene = await oneWrapDb?.scenes.findOne({ selector: { sceneId: parseInt(sceneId) } }).exec();
    if (scene._data) {
      return scene._data;
    }
  };

  const fetchScene = async () => {
    if (sceneId && oneWrapDb) {
      const scene = await getCurrentScene();
      setThisScene(scene);
      setCharactersArray(scene?.characters);
      setElementsArray(scene?.elements);
      setExtrasArray(scene?.extras);
      setNotesArray(scene?.notes);
    }
  };

  useIonViewWillEnter(() => {
    fetchScene();
  });

  useEffect(() => {
    fetchScene();
  }, [offlineScenes]);

  const sceneHeader = thisScene ? `${parseInt(thisScene.episodeNumber ?? '') > 0 ? (`${thisScene.episodeNumber}.`) : ''}${thisScene.sceneNumber}` : '';

  useIonViewDidEnter(() => {
    hideTabs();
  });

  useIonViewWillEnter(() => {
    hideTabs();
  });

  useEffect(() => {
    if (filteredScenes.length > 0 && thisScene) {
      const index = filteredScenes.findIndex((scene: any) => (isShooting ? parseInt(scene.sceneId) === thisScene.sceneId : scene.id === thisScene.id));
      setCurrentSceneIndex(index);
    }
  }, [filteredScenes, thisScene, isShooting]);

  useEffect(() => {
    if (currentSceneIndex >= 0) {
      setPreviousScene(filteredScenes[currentSceneIndex - 1] || null);
      setNextScene(filteredScenes[currentSceneIndex + 1] || null);
    }
  }, [currentSceneIndex, filteredScenes]);

  useEffect(() => {
    const fetchSceneShooting = async () => {
      if (shootingId && oneWrapDb && thisScene) {
        const shooting = await oneWrapDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
        const sceneShooting = shooting?._data?.scenes.find(
          (sceneInShooting: any) => parseInt(sceneInShooting.sceneId) === thisScene.sceneId,
        );
        setThisSceneShooting(sceneShooting || null);
      }
    };

    fetchSceneShooting();
  }, [shootingId, oneWrapDb, thisScene]);

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
          character.categoryName ? list.add(character.categoryName) : list.add('No Category');
        });
      }
      if (type === 'elements') {
        thisScene?.elements?.forEach((element: Element) => {
          element.categoryName ? list.add(element.categoryName) : list.add('No Category');
        });
      }
      if (type === 'extras') {
        thisScene?.extras?.forEach((extra: Extra) => {
          extra.categoryName ? list.add(extra.categoryName) : list.add('No Category');
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
          list.add(element.elementName);
        });
      }
      if (type === 'extras') {
        thisScene?.extras?.forEach((extra: Extra) => {
          list.add(extra.extraName);
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

  const changeToNextScene = () => {
    if (nextScene) {
      const route = `${rootRouteScript}/${nextScene.sceneId}${isShooting ? '?isShooting=true' : ''}`;
      history.push(route);
      localStorage.setItem('editionBackRoute', route);
    }
  };

  const getSceneStatus = (scene: ShootingScene) => {
    switch (scene.status) {
      case ShootingSceneStatusEnum.Assigned: return 'ASSIGNED';
      case ShootingSceneStatusEnum.NotShoot: return 'NOT SHOOT';
      case ShootingSceneStatusEnum.Shoot: return 'SHOOT';
      default: return 'NOT ASSIGNED';
    }
  };

  const changeToPreviousScene = () => {
    if (previousScene) {
      const route = `${rootRouteScript}/${previousScene.sceneId}${isShooting ? '?isShooting=true' : ''}`;
      history.push(route);
      localStorage.setItem('editionBackRoute', route);
    }
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
  };

  const [sceneColor, setSceneColor] = useState<string>('light');

  useEffect(() => {
    if (thisScene) {
      getSceneColor(thisScene).then(setSceneColor);
    }
  }, [thisScene, isShooting]);

  const getSceneColor = async (scene: Scene) => {
    if (isShooting) {
      const shooting = await oneWrapDb?.shootings.find({ selector: { id: shootingId } }).exec();
      const sceneInShooting = shooting?.[0]?.scenes.find(
        (sceneInShooting: any) => parseInt(sceneInShooting.sceneId) === thisScene?.sceneId,
      );

      const sceneStatus = sceneInShooting?.status;
      switch (sceneStatus) {
        case ShootingSceneStatusEnum.Assigned: return 'light';
        case ShootingSceneStatusEnum.NotShoot: return 'danger';
        case ShootingSceneStatusEnum.Shoot: return 'success';
        default: return 'light';
      }
    } else {
      const intOrExt = [IntOrExtOptionEnum.EXT, IntOrExtOptionEnum.INT_EXT, IntOrExtOptionEnum.EXT_INT];

      if (scene.sceneType === SceneTypeEnum.PROTECTION) {
        return 'rose';
      }
      if (scene.sceneType === SceneTypeEnum.SCENE) {
        if (!scene.intOrExtOption || !scene.dayOrNightOption) {
          return 'dark';
        }
        if (scene.intOrExtOption === IntOrExtOptionEnum.INT && scene.dayOrNightOption === DayOrNightOptionEnum.DAY) {
          return 'light';
        }
        if (scene.intOrExtOption === IntOrExtOptionEnum.INT && scene.dayOrNightOption === DayOrNightOptionEnum.NIGHT) {
          return 'success';
        }
        if (intOrExt.includes(scene.intOrExtOption?.toUpperCase() as any) && scene.dayOrNightOption === DayOrNightOptionEnum.DAY) {
          return 'yellow';
        }
        if (intOrExt.includes(scene.intOrExtOption?.toUpperCase() as any) && scene.dayOrNightOption === DayOrNightOptionEnum.NIGHT) {
          return 'primary';
        }
      }
      return 'light';
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
                  <div key={i} className="total-popup-item ion-padding-start">{item && item.toUpperCase()}</div>
                ))
              )}
            </div>
            )
}
          {
            popupType && popupType !== 'notes' && showTotalsPopup && (
            <div className="script-total-popup-background" style={{ top: getPopupPositionTop() }} onClick={() => getPopupList(popupType)}>
              { getPopupCategories(popupType).length === 0 ? (
                <div className="total-popup-item ion-padding-start">
                  NO
                  {popupType.toUpperCase()}
                  {' '}
                  ADDED
                </div>
              )
                : getPopupCategories(popupType).map((category: string) => (
                  <div className="popup-category-container">
                    <p
                      key={category + popupType}
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
                        getPopupListByCategory(popupType, (category === 'No category' ? null : category)).map((item: string) => (
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
          <Toolbar name="" backString prohibited deleteButton edit editRoute={`/my/projects/${id}/editscene/${sceneId}/details`} handleBack={handleBack} deleteTrigger={`open-delete-scene-alert-${sceneId}-details`} />
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
      </IonPage>
    </>
  );
};

export default SceneScript;
