
import {
  IonButton,
  IonContent, IonHeader, IonInput, IonItem, IonPage, IonTabBar,  IonTextarea,  useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter
} from '@ionic/react';
import useHideTabs from '../../hooks/useHideTabs';
import { useHistory, useParams } from 'react-router';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Toolbar from '../../components/Shared/Toolbar/Toolbar';
import SceneDetailsTabs from '../../components/Shared/SeceneDetailsTabs/SceneDetailsTabs';
import DatabaseContext from '../../context/database';
import './SceneScript.scss'
import SceneHeader from '../SceneDetails/SceneHeader';
import ScenesContext from '../../context/ScenesContext';
import applyFilters from '../../utils/applyFilters';
import { DayOrNightOptionEnum, IntOrExtOptionEnum, SceneTypeEnum } from '../../Ennums/ennums';
import { Character, Element, Extra, Note, Scene } from '../../interfaces/scenesTypes';
import { RiEditFill, RiZoomInFill, RiZoomOutFill } from 'react-icons/ri';
import HighlightedTextWithArray, { SearchTerm } from '../../components/Shared/HighlightedTextWithArray/HighlightedTextWithArray';
import removeAccents from '../../utils/removeAccents';
import { paragraphs } from '../../data';
import SceneParagraph from '../../components/SceneParagraph/SceneParagraph';
import getUniqueValuesFromNestedArray from '../../utils/getUniqueValuesFromNestedArray';
import useFormTypeLogic from '../../hooks/useFormTypeLogic';
import useTextSelection from '../../hooks/useSelectedText';
import useSuccessToast from '../../hooks/useSuccessToast';
import FiilledSuccessButton from '../../components/Shared/FilledSuccessButton/FillSuccessButton';
import CharacterForm from '../../components/SceneParagraph/CharacterForm';
import ElementForm from '../../components/SceneParagraph/ElementForm';
import ExtraForm from '../../components/SceneParagraph/ExtraForm';
import NoteForm from '../../components/SceneParagraph/NoteForm';
import { PiNotePencil } from 'react-icons/pi';
import { MdOutlineFaceUnlock } from "react-icons/md";
import { HiMiniUsers } from "react-icons/hi2";
import { FaClipboardList } from "react-icons/fa";
import useIsMobile from '../../hooks/useIsMobile';

// BLUE CHARACTER
// YELLOW ELEMENT
// GREEN EXTRA

interface ScriptPageProps {
  zoomLevel: number;
  edition: boolean;
  charactersArray: Character[];
  elementsArray: Element[];
  extrasArray: Extra[];
  notesArray: Note[];
  handleCreation: (type: ('element' | 'character' | 'extra' | 'note'), data: any) => void;
}
const MemoizedCharacterForm = React.memo(CharacterForm);
const MemoizedElementForm = React.memo(ElementForm);
const MemoizedExtraForm = React.memo(ExtraForm);
const MemoizedNoteForm = React.memo(NoteForm);

const ScriptPage: React.FC<ScriptPageProps> = ({ zoomLevel, edition, charactersArray, elementsArray, extrasArray, handleCreation, notesArray }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupsCounter, setPopupsCounter] = useState(0);
  const handlePopupOpen = (selectedText: string, x: number, y: number) => {
    setSelectedText(selectedText);
    setPopupPosition({ x, y });
    setShowPopup(true);
    setPopupsCounter((prevCounter) => prevCounter + 1)
  };
  const isMobile = useIsMobile()

  const successToast = useSuccessToast();
  const { offlineScenes } = useContext(DatabaseContext);
  const selectionRef = useRef<string | null>(null);
  const { selectedText, setSelectedText } = useTextSelection(handlePopupOpen)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  const viewportHeight = window.innerHeight;
  const selectionPercentage = (popupPosition.y + 50) / viewportHeight;
  const selectionPercentageX = popupPosition.x / window.innerWidth;

  let topPosition;
  if (selectionPercentage > 0.5) {
    topPosition = popupPosition.y - 400;
  } else {
    topPosition = popupPosition.y + 50;
  }

  let leftPosition;

  if (selectionPercentageX > 0.6) {
    leftPosition = isMobile ? 6 : popupPosition.x - 200;
  } else {
    leftPosition = isMobile ? 6 : popupPosition.x + 100;
  }

  let maxWidth = 'none';

  if(isMobile) {
    maxWidth = '90%'
  }
  
  const {
    formType,
    extra,
    setExtra,
    element,
    setElement,
    character,
    setCharacter,
    note,
    setNote,
    setFormType,
    popupMessage
  } = useFormTypeLogic(offlineScenes, selectedText);

  useEffect(() => {
    setNote((prevNote: any) => ({ ...prevNote, note: selectedText }));
    setCharacter((prevCharacter: any) => ({ ...prevCharacter, characterName: selectedText }));
    setElement((prevElement: any) => ({ ...prevElement, elementName: selectedText }));
    setExtra((prevExtra: any) => ({ ...prevExtra, extraName: selectedText }));
  }, [selectedText])

  const elementsUniqueCategories = getUniqueValuesFromNestedArray(offlineScenes, 'elements', 'categoryName').map((category: Element) => category.categoryName);
  const charactersUniqueCategories = getUniqueValuesFromNestedArray(offlineScenes, 'characters', 'categoryName').map((category: Character) => category.categoryName);

  const handleFormTypeChange = (newFormType: 'character' | 'element' | 'extra' | 'note') => {
    setFormType(newFormType);
  };


  const handlePopupClose = () => {
    setShowPopup(false);
    setSelectedText('');
    selectionRef.current = null;
    setFormType('character');
    setPopupsCounter(0);
  };

  const handleFormSubmit = () => {
    if (formType === 'character') {
      handleCreation('character', character);
      successToast('Character created successfully');
    } else if (formType === 'element') {
      handleCreation('element', element);
      successToast('Element created successfully');
    } else if (formType === 'extra') {
      handleCreation('extra', extra);
      successToast('Extra created successfully');
    } else if (formType === 'note') {
      setNote((prevNote: any) => ({ ...prevNote, createdAt: new Date().toISOString() }));
      handleCreation('note', note);
      successToast('Note created successfully');
    }
    handlePopupClose();
  }
  
  const normalizeWord = (word: (string | null)) => {
    if (word) {
      const normalizedWord = removeAccents(word).toLowerCase().trim();
      const symbolsRegex = /[^\w\s]/g;
      return normalizedWord.replace(symbolsRegex, '');
    }

    return '';
  }

  const getSearchTermsArray = (text: string) => {
    const words = text.split(' ');
    console.log('TEXT VS WORDS', text, words)

    let searchTermsArray: SearchTerm[] = [];
    const normalizeCharactersArray = charactersArray.map((character: Character) => normalizeWord(character.characterName));
    const normalizeElementsArray = elementsArray.map((element: Element) => normalizeWord(element.elementName));

    console.log(normalizeElementsArray)
    const normalizeExtrasArray = extrasArray.map((extra: Extra) => normalizeWord(extra.extraName))
    const normalizeNotesArray = notesArray.map((note: Note) => normalizeWord(note.note))

    words.forEach(word => {
      const normalizedWord = normalizeWord(word);
      if (normalizeCharactersArray.includes(normalizedWord)) {
        const searchTerm = {
          searchTerm: normalizeWord(word),
          categoryName: charactersArray.find((character: Character) => normalizeWord(character.characterName) === normalizeWord(word))?.categoryName || null,
          type: 'character',
          highlightColor: 'var(--ion-color-primary)',
        }
        searchTermsArray.push(searchTerm);
      } else if(normalizeElementsArray.includes(normalizeWord(word))) {
        console.log('IM HEREEEE', normalizeWord(word))
        const searchTerm = {
          searchTerm: normalizeWord(word),
          categoryName: elementsArray.find((element: Element) => normalizeWord(element.elementName) === normalizeWord(word))?.categoryName || null,
          type: 'element',
          highlightColor: 'var(--ion-color-yellow)',
        }
        searchTermsArray.push(searchTerm);
      } else if (normalizeExtrasArray.includes(normalizedWord)) {
        const searchTerm = {
          searchTerm: normalizeWord(word),
          categoryName: extrasArray.find((extra: Extra) => normalizeWord(extra.extraName) === normalizeWord(word))?.categoryName || null,
          type: 'extra',
          highlightColor: 'var(--ion-color-success)',
        }
        searchTermsArray.push(searchTerm);
      } else if (normalizeNotesArray.includes(normalizedWord)) {
        const searchTerm = {
          searchTerm: normalizeWord(word),
          categoryName: null,
          type: 'note',
          highlightColor: 'transparent',
        }
        searchTermsArray.push(searchTerm);
      }
    });
  
    return searchTermsArray;
  }

  const [searchTerms, setSearchTerms] = useState<SearchTerm[]>([]);

  useEffect(() => {
    const newSearchTermsArray: SearchTerm[] = [];
    paragraphs.forEach(paragraph => {
      if (paragraph.type) {
        const newSearchTerms = getSearchTermsArray(paragraph.content);
        newSearchTermsArray.push(...newSearchTerms);
      }
    });
    setSearchTerms(newSearchTermsArray);
  }, [charactersArray, elementsArray, extrasArray]);
  
  return (
    <div
      className="script-page"
      style={{
        zoom: zoomLevel,
        transformOrigin: 'top left',
      }}
    >
      {paragraphs.map((paragraph, index) => (
        <SceneParagraph 
          key={index} 
          type={paragraph.type} 
          content={paragraph.content} 
          searchTermsArray={searchTerms} 
        />
      ))}
      {   
      showPopup &&
      (
        <div className="script-popup-background">
          <div className="script-popup" style={isMobile ?
          { 
            position: 'fixed',
            top: 'calc(50% - 150px)',
            backgroundColor: 'var(--ion-color-tertiary)',
            maxWidth: maxWidth,
            left: 'calc(50% - 45vw)'
          } :
          {
            top: topPosition,
            backgroundColor: 'var(--ion-color-tertiary)',
            maxWidth: maxWidth
          }
          }>
            {
              popupMessage !== '' &&
              <p 
                style={{
                  color: 'var(--ion-color-success)',
                  marginLeft: '16px',
                  textTransform: 'uppercase',
                  fontSize: '10px'
                }}
              > 
                {popupMessage}
              </p>
            }
            <div 
              className="form-type-selector"
            >
              <button
                className={`form-type-button ${formType === 'note' ? 'selected' : ''}`}
                onClick={() => handleFormTypeChange('note')}
              >
                <PiNotePencil className={'form-type-icon' + (formType === 'note' ? ' active' : '')}/>
              </button>
              <button
                className={`form-type-button ${formType === 'character' ? 'selected' : ''}`}
                onClick={() => handleFormTypeChange('character')}
              >
                <MdOutlineFaceUnlock className={'form-type-icon' + (formType === 'character' ? ' active' : '')}/>
              </button>
              <button
                className={`form-type-button ${formType === 'element' ? 'selected' : ''}`}
                onClick={() => handleFormTypeChange('element')}
              >
                <FaClipboardList className={'form-type-icon' + (formType === 'element' ? ' active' : '')}/>
              </button>
              <button
                className={`form-type-button ${formType === 'extra' ? 'selected' : ''}`}
                onClick={() => handleFormTypeChange('extra')}
              >
                <HiMiniUsers className={'form-type-icon' + (formType === 'extra' ? ' active' : '')}/>
              </button>
            </div>
            {formType === 'character' && <MemoizedCharacterForm character={character} setCharacter={setCharacter} characterCategories={charactersUniqueCategories} />}
            {formType === 'element' && <MemoizedElementForm element={element} setElement={setElement} elementCategories={elementsUniqueCategories} />}
            {formType === 'extra' && <MemoizedExtraForm extra={extra} setExtra={setExtra} />}
            {formType === 'note' && <MemoizedNoteForm note={note} setNote={setNote} />}
            <>
              <FiilledSuccessButton
                buttonName="SAVE"
                onClick={() => handleFormSubmit()}
                style={{
                  margion: '0px 12px',
                  marginTop: '10%',
                }}
              />
              <IonButton
                onClick={handlePopupClose}
                className='cancel-button'
                fill='outline'
                color='danger'
                style={{
                  margin: '6px 16px 16px 16px'
                }}
              >CANCEL</IonButton>
            </>
          </div>
        </div>
      )}
    </div>
  );
}

const SceneScript: React.FC = () => {
  const {hideTabs, showTabs} = useHideTabs();
  const { sceneId } = useParams<{ sceneId: string }>();
  const [thisScene, setThisScene] = useState<any>(null);
  const { oneWrapDb, offlineScenes } = useContext(DatabaseContext);
  const history = useHistory();
  const { selectedFilterOptions } = useContext(ScenesContext);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [edition, setEdition] = useState(false);
  const [charactersArray, setCharactersArray ] = useState<Character[]>([]);
  const [elementsArray, setElementsArray ] = useState<Element[]>([]);
  const [extrasArray, setExtrasArray ] = useState<Extra[]>([]);
  const [notesArray, setNotesArray ] = useState<Note[]>([]);

  const createNewElement = async (element: Element) => {
    try {
      const sceneElements = new Set(await thisScene?.elements);
      sceneElements.add(element);
      const newScene = { ...thisScene, elements: Array.from(sceneElements) };
      await oneWrapDb?.scenes.upsert(newScene);
    } catch (error) {
      console.log(error)
    }
  }


  const createNewCharacter = async (character: Character) => {
    try {
      const sceneCharacters = new Set(await thisScene?.characters);
      sceneCharacters.add(character);
      const newScene = { ...thisScene, characters: Array.from(sceneCharacters) };
      await oneWrapDb?.scenes.upsert(newScene);
    } catch (error) {
      console.log(error)
    }
  }

  const createNewExtra = async (extra: Extra) => {
    try {
      const sceneExtras = new Set(await thisScene?.extras);
      sceneExtras.add(extra);
      const newScene = { ...thisScene, extras: Array.from(sceneExtras) };
      await oneWrapDb?.scenes.upsert(newScene);
    } catch (error) {
      console.log(error)
    }
  }

  const createNewNote = async (note: Note) => {
    try {
      const sceneNotes = new Set(await thisScene?.notes);
      sceneNotes.add(note);
      const newScene = { ...thisScene, notes: Array.from(sceneNotes) };
      await oneWrapDb?.scenes.upsert(newScene);

    } catch (error) {
      console.log(error)
    }
  }

  const handleCreation = (type: ('element' | 'character' | 'extra' | 'note'), data: any) => {
    if(type === 'element') {
      createNewElement(data);
    } else if(type === 'character') {
      createNewCharacter(data);
    } else if(type === 'extra') {
      createNewExtra(data);
    } else if(type === 'note') {
      createNewNote(data);
    }
  }

  const getCurrentScene = async () => {
    const scene = await oneWrapDb?.scenes.findOne({ selector: { id: sceneId } }).exec();
    if(scene._data) {
      return scene._data;
    }
    return
  }

  const handleBack = () => {
    history.push('/my/projects/163/strips');
  }

  useEffect(() => {
    console.log('ELEMENTS', elementsArray)
  }, [elementsArray])

  const fetchScene = async () => {
    if (sceneId) {
      const scene = await getCurrentScene();
      setThisScene(scene);
      setCharactersArray(scene?.characters);
      setElementsArray(scene?.elements);
      setExtrasArray(scene?.extras);
      setNotesArray(scene?.notes);
    }
  }

  useIonViewWillEnter(() => {
    fetchScene();
  })

  useEffect(() => {
    fetchScene();
  }, [offlineScenes])

  useIonViewDidLeave(() => {
    setThisScene(null);
  })

  const sceneHeader = thisScene ? `${parseInt(thisScene.episodeNumber) > 0 ? (thisScene.episodeNumber + '.') : ''}${thisScene.sceneNumber}` : '';

  useEffect(() => {
    hideTabs();
    return () => {
      showTabs();
    }
  }, [])

  useIonViewDidEnter(() => {
    hideTabs();
  });

  const filteredScenes = selectedFilterOptions && applyFilters(offlineScenes, selectedFilterOptions);
  const currentSceneIndex = filteredScenes.findIndex((scene: any) => scene.id === sceneId);
  const nextScene = filteredScenes[currentSceneIndex + 1];
  const previousScene = filteredScenes[currentSceneIndex - 1];

  const changeToNextScene = () => {
    if(nextScene) {
      history.push(`/my/projects/163/strips/details/script/${nextScene.id}`);
    }
  }

  const changeToPreviousScene = () => {
    if(previousScene) {
      history.push(`/my/projects/163/strips/details/script/${previousScene.id}`);
    }
  }

  const [sceneColor, setSceneColor] = useState<string>('light');

  useEffect(() => {
    if(thisScene) {
      setSceneColor(getSceneColor(thisScene));
    }
  }, [thisScene])

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

    if(scene) {
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
    setZoomLevel((prevZoomLevel) => (prevZoomLevel < 1.5 ? prevZoomLevel + 0.1 : prevZoomLevel));
  };

  const handleZoomOut = () => {
    setZoomLevel((prevZoomLevel) => (prevZoomLevel > 1 ? prevZoomLevel - 0.1 : prevZoomLevel));
  };

  const handleEdition = () => {
    setEdition(!edition);
  }

  return (
    <>
      
      <IonPage>
        <div className='script-buttons-container'>
          <RiZoomInFill className='script-button-icon' onClick={handleZoomIn}/>
          <RiZoomOutFill className='script-button-icon' onClick={handleZoomOut} />
          <RiEditFill  className='script-button-icon' onClick={handleEdition} 
            style={
              edition ? {color: 'var(--ion-color-success)'} : {}
            }
          />
        </div>
        <IonHeader>
          <Toolbar name='' backString prohibited deleteButton edit editRoute={`/my/projects/163/editscene/${sceneId}/details`} handleBack={handleBack} deleteTrigger={`open-delete-scene-alert-${sceneId}-details`} />
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
          scrollEvents={true}
        >
          <ScriptPage 
            zoomLevel={zoomLevel} 
            edition={edition} 
            charactersArray={charactersArray || []}
            elementsArray={elementsArray || []}
            extrasArray={extrasArray || []}
            notesArray={notesArray || []}
            handleCreation={handleCreation}
          />
        </IonContent>
        <IonTabBar 
          className='script-page-bottom-bar'
          style={{
            zoom: `${zoomLevel}`,
          }}
      ></IonTabBar>
        <div
          className='script-page-top-bar'
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
        <SceneDetailsTabs sceneId={sceneId} />
      </IonPage>
    </>
  )
};

export default SceneScript;
