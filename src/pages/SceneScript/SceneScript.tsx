import {
  IonContent, IonHeader, IonPage, IonTabBar, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter,
} from '@ionic/react';
import { useHistory, useLocation, useParams } from 'react-router';
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { RiEditFill, RiZoomInFill, RiZoomOutFill } from 'react-icons/ri';
import { PiNotePencil } from 'react-icons/pi';
import { MdOutlineFaceUnlock } from 'react-icons/md';
import { HiMiniUsers } from 'react-icons/hi2';
import { FaClipboardList } from 'react-icons/fa';
import useHideTabs from '../../hooks/useHideTabs';
import Toolbar from '../../components/Shared/Toolbar/Toolbar';
import SceneDetailsTabs from '../../components/Shared/SeceneDetailsTabs/SceneDetailsTabs';
import DatabaseContext, { DatabaseContextProps } from '../../context/database';
import './SceneScript.scss';
import SceneHeader from '../SceneDetails/SceneHeader';
import ScenesContext from '../../context/ScenesContext';
import applyFilters from '../../utils/applyFilters';
import { DayOrNightOptionEnum, IntOrExtOptionEnum, SceneTypeEnum } from '../../Ennums/ennums';
import {
  Character, Element, Extra, Note, Scene,
} from '../../interfaces/scenesTypes';
import ScriptPage from '../../components/SceneScript/ScriptPage';

// BLUE CHARACTER
// YELLOW ELEMENT
// GREEN EXTRA

const SceneScript: React.FC = () => {
  const { hideTabs, showTabs } = useHideTabs();
  const { sceneId } = useParams<{ sceneId: string }>();
  const [thisScene, setThisScene] = useState<Scene | null>(null);
  const { oneWrapDb, offlineScenes,initializeParagraphReplication, projectId } = useContext<DatabaseContextProps>(DatabaseContext);
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
  
  useEffect(() => {
    const initializeReplication = async () => {
      try {
        setParagraphsAreLoading(true);
        await initializeParagraphReplication();
      } catch (error) {
        console.error('Error initializing scene replication:', error);
      } finally {
        setParagraphsAreLoading(false);
      }
    };
  
    initializeReplication();
  }, [projectId]);

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
      console.log(error);
    }
  };

  const createNewCharacter = async (character: Character) => {
    try {
      const sceneCharacters = new Set(await thisScene?.characters);
      sceneCharacters.add(character);
      const newScene = { ...thisScene, characters: Array.from(sceneCharacters) };
      await oneWrapDb?.scenes.upsert(newScene);
    } catch (error) {
      console.log(error);
    }
  };

  const createNewExtra = async (extra: Extra) => {
    try {
      const sceneExtras = new Set(await thisScene?.extras);
      sceneExtras.add(extra);
      const newScene = { ...thisScene, extras: Array.from(sceneExtras) };
      await oneWrapDb?.scenes.upsert(newScene);
    } catch (error) {
      console.log(error);
    }
  };

  const createNewNote = async (note: Note) => {
    try {
      const sceneNotes = new Set(await thisScene?.notes);
      sceneNotes.add(note);
      const newScene = { ...thisScene, notes: Array.from(sceneNotes) };
      await oneWrapDb?.scenes.upsert(newScene);
    } catch (error) {
      console.log(error);
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
    const scene = await oneWrapDb?.scenes.findOne({ selector: { id: sceneId } }).exec();
    if (scene._data) {
      return scene._data;
    }
  };

  const handleBack = () => {
    history.push('/my/projects/163/strips');
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
  })

  const filteredScenes = selectedFilterOptions && applyFilters(offlineScenes, selectedFilterOptions);
  const currentSceneIndex = filteredScenes.findIndex((scene: any) => scene.id === sceneId);
  const nextScene = filteredScenes[currentSceneIndex + 1];
  const previousScene = filteredScenes[currentSceneIndex - 1];

  const changeToNextScene = () => {
    if (nextScene) {
      history.push(`/my/projects/163/strips/details/script/${nextScene.id}`);
      localStorage.setItem('editionBackRoute', `/my/projects/163/strips/details/script/${nextScene.id}`);
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

  const changeToPreviousScene = () => {
    if (previousScene) {
      history.push(`/my/projects/163/strips/details/script/${previousScene.id}`);
      localStorage.setItem('editionBackRoute', `/my/projects/163/strips/details/script/${previousScene.id}`);
    }
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
      setSceneColor(getSceneColor(thisScene));
    }
  }, [thisScene]);

  const interior = IntOrExtOptionEnum.INT;
  const exterior = IntOrExtOptionEnum.EXT;
  const intExt = IntOrExtOptionEnum.INT_EXT;
  const extInt = IntOrExtOptionEnum.EXT_INT;
  const protectionType = SceneTypeEnum.PROTECTION;
  const sceneType = SceneTypeEnum.SCENE;
  const day = DayOrNightOptionEnum.DAY;
  const night = DayOrNightOptionEnum.NIGHT;

  const getSceneColor = (scene: Scene) => {
    const intOrExt: any = [exterior, intExt, extInt];

    if (scene) {
      if (scene.sceneType == protectionType) {
        return 'rose';
      } if (scene.sceneType == sceneType) {
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
    }

    return 'light';
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
          <Toolbar name="" backString prohibited deleteButton edit editRoute={`/my/projects/163/editscene/${sceneId}/details`} handleBack={handleBack} deleteTrigger={`open-delete-scene-alert-${sceneId}-details`} />
          <SceneHeader
            sceneColor={sceneColor}
            sceneHeader={sceneHeader}
            previousScene={previousScene}
            nextScene={nextScene}
            changeToPreviousScene={changeToPreviousScene}
            changeToNextScene={changeToNextScene}
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
        <SceneDetailsTabs sceneId={sceneId} />
      </IonPage>
    </>
  );
};

export default SceneScript;
