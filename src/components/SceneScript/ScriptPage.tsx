import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { PiNotePencil } from 'react-icons/pi';
import { MdOutlineFaceUnlock } from 'react-icons/md';
import { FaClipboardList } from 'react-icons/fa';
import { HiMiniUsers } from 'react-icons/hi2';
import { IonButton } from '@ionic/react';
import {
  Character, Element, Extra, Note,
} from '../../interfaces/scenes.types';
import CharacterForm from './SceneParagraph/CharacterForm';
import ElementForm from './SceneParagraph/ElementForm';
import ExtraForm from './SceneParagraph/ExtraForm';
import NoteForm from './SceneParagraph/NoteForm';
import useIsMobile from '../../hooks/Shared/useIsMobile';
import useSuccessToast from '../../hooks/Shared/useSuccessToast';
import DatabaseContext, { DatabaseContextProps } from '../../context/Database.context';
import useTextSelection from '../../hooks/Shared/useSelectedText';
import useFormTypeLogic from '../../hooks/SceneScript/useFormTypeLogic';
import getUniqueValuesFromNestedArray from '../../utils/getUniqueValuesFromNestedArray';
import removeAccents from '../../utils/removeAccents';
import { SearchTerm } from '../Shared/HighlightedTextWithArray/HighlightedTextWithArray';
import SceneParagraph from './SceneParagraph/SceneParagraph';
import FiilledSuccessButton from '../Shared/FilledSuccessButton/FillSuccessButton';
import useLoader from '../../hooks/Shared/useLoader';
import InputModal from '../../Layouts/InputModal/InputModal';

interface ScriptPageProps {
  zoomLevel: number;
  edition: boolean;
  charactersArray: Character[];
  elementsArray: Element[];
  extrasArray: Extra[];
  notesArray: Note[];
  handleCreation: (type: ('element' | 'character' | 'extra' | 'note'), data: any) => void;
  paragraphsAreLoading: boolean;
  paragraphs: any[];
  selectedSceneId: string | null;
  setSelectedSceneId: (sceneId: string | null) => void;
}
const MemoizedCharacterForm = React.memo(CharacterForm);
const MemoizedElementForm = React.memo(ElementForm);
const MemoizedExtraForm = React.memo(ExtraForm);
const MemoizedNoteForm = React.memo(NoteForm);

const ScriptPage: React.FC<ScriptPageProps> = ({
  zoomLevel, charactersArray, elementsArray, extrasArray, handleCreation, notesArray, paragraphs, paragraphsAreLoading, selectedSceneId, setSelectedSceneId,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const handlePopupOpen = (selectedText: string, x: number, y: number) => {
    setSelectedText(selectedText);
    setPopupPosition({ x, y });
    setShowPopup(true);
  };
  const isMobile = useIsMobile();

  const successToast = useSuccessToast();
  const { offlineScenes, oneWrapDb } = useContext<DatabaseContextProps>(DatabaseContext);
  const selectionRef = useRef<string | null>(null);
  const { selectedText, setSelectedText } = useTextSelection(handlePopupOpen);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [scenesList, setScenesList] = useState<any[]>([]);

  const getScenesArray = () => {
    const scenesList = offlineScenes.map((scene: any) => {
      const sceneId = scene.id;
      const sceneHeader = `${parseInt(scene.episodeNumber) > 0 ? (`${scene.episodeNumber}.`) : ''}${scene.sceneNumber} ${scene.intOrExtOption ? (`${scene.intOrExtOption}.`) : ''} ${scene.locationName ? (`${scene.locationName}.`) : ''} ${scene.setName}-${scene.dayOrNightOption}${scene.scriptDay} ${scene.year ? `(${scene.year})` : ''}`;
      return {
        sceneId,
        sceneHeader,
      };
    });
    return scenesList;
  };

  useEffect(() => {
    setScenesList(getScenesArray());
  }, [offlineScenes, oneWrapDb]);

  const viewportHeight = window.innerHeight;
  const selectionPercentage = (popupPosition.y + 50) / viewportHeight;
  const selectionPercentageX = popupPosition.x / window.innerWidth;

  let topPosition;
  if (selectionPercentage > 0.55) {
    topPosition = popupPosition.y - 350;
  } else {
    topPosition = popupPosition.y + 50;
  }

  let leftPosition;

  if (selectionPercentageX > 0.6) {
    leftPosition = isMobile ? 6 : popupPosition.x - 100;
  } else {
    leftPosition = isMobile ? 6 : popupPosition.x + 100;
  }

  let maxWidth = 'none';

  if (isMobile) {
    maxWidth = '90%';
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
    popupMessage,
  } = useFormTypeLogic(offlineScenes, selectedText);

  useEffect(() => {
    setNote((prevNote: any) => ({ ...prevNote, note: selectedText }));
    setCharacter((prevCharacter: any) => ({ ...prevCharacter, characterName: selectedText }));
    setElement((prevElement: any) => ({ ...prevElement, elementName: selectedText }));
    setExtra((prevExtra: any) => ({ ...prevExtra, extraName: selectedText }));
  }, [selectedText]);

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
  };

  const normalizeWord = (word: (string | null)) => {
    if (word) {
      const normalizedWord = removeAccents(word).toLowerCase().trim();
      const symbolsRegex = /[^\w\sñ]/g;
      return normalizedWord.replace(symbolsRegex, '');
    }

    return '';
  };

  const getSearchTermsArray = (text: string) => {
    const words = text.split(' ');
    const searchTermsArray: SearchTerm[] = [];
    const normalizeCharactersArray = charactersArray.map((character: Character) => normalizeWord(character.characterName));
    const normalizeElementsArray = elementsArray.map((element: Element) => normalizeWord(element.elementName));
    const normalizeExtrasArray = extrasArray.map((extra: Extra) => normalizeWord(extra.extraName));
    const normalizeNotesArray = notesArray.map((note: Note) => normalizeWord(note.note));

    words.forEach((word) => {
      const normalizedWord = normalizeWord(word);
      if (normalizeCharactersArray.includes(normalizedWord)) {
        const searchTerm = {
          searchTerm: normalizeWord(word),
          categoryName: charactersArray.find((character: Character) => normalizeWord(character.characterName) === normalizeWord(word))?.categoryName || null,
          type: 'character',
          highlightColor: 'var(--ion-color-primary)',
        };
        searchTermsArray.push(searchTerm);
      } else if (normalizeElementsArray.includes(normalizeWord(word))) {
        const searchTerm = {
          searchTerm: normalizeWord(word),
          categoryName: elementsArray.find((element: Element) => normalizeWord(element.elementName) === normalizeWord(word))?.categoryName || null,
          type: 'element',
          highlightColor: 'var(--ion-color-yellow)',
        };
        searchTermsArray.push(searchTerm);
      } else if (normalizeExtrasArray.includes(normalizedWord)) {
        const searchTerm = {
          searchTerm: normalizeWord(word),
          categoryName: extrasArray.find((extra: Extra) => normalizeWord(extra.extraName) === normalizeWord(word))?.categoryName || null,
          type: 'extra',
          highlightColor: 'var(--ion-color-success)',
        };
        searchTermsArray.push(searchTerm);
      } else if (normalizeNotesArray.includes(normalizedWord)) {
        const searchTerm = {
          searchTerm: normalizeWord(word),
          categoryName: null,
          type: 'note',
          highlightColor: 'transparent',
        };
        searchTermsArray.push(searchTerm);
      }
    });

    return searchTermsArray;
  };

  const [searchTerms, setSearchTerms] = useState<SearchTerm[]>([]);

  useEffect(() => {
    const newSearchTermsArray: SearchTerm[] = [];
    paragraphs.forEach((paragraph) => {
      if (paragraph.type) {
        const newSearchTerms = getSearchTermsArray(paragraph.content);
        newSearchTermsArray.push(...newSearchTerms);
      }
    });
    setSearchTerms(newSearchTermsArray);
  }, [charactersArray, elementsArray, extrasArray, notesArray, paragraphs]);

  if (paragraphsAreLoading) {
    return (
      <div
        className="script-page"
        style={{
          zoom: zoomLevel,
        }}
      >
        {useLoader()}
      </div>
    );
  }

  const handleCheckboxToggle = (sceneHeader: string) => {
    const sceneId = scenesList.find((scene) => scene.sceneHeader.toLowerCase() === sceneHeader.toLowerCase())?.sceneId;
    setSelectedSceneId(sceneId);
    console.log('SETTING NEW SCENE ID', sceneId);
  };

  if (paragraphs.length === 0) {
    return (
      <div
        className="script-page"
        style={{
          zoom: zoomLevel,
        }}
      >
        <FiilledSuccessButton
          buttonName="IMPORT SCENE"
          onClick={() => {}}
          className="import-scene-button"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100px',
            '--color': 'var(--ion-color-light)',
            fontWeight: 'bold',
          }}
          id="import-scene-button"
        />
        <InputModal
          modalTrigger="import-scene-button"
          multipleSelections={false}
          listOfOptions={scenesList.map((scene) => scene.sceneHeader)}
          clearSelections={() => setSelectedSceneId(null)}
          canCreateNew={false}
          handleCheckboxToggle={handleCheckboxToggle}
          selectedOptions={selectedSceneId ? [scenesList.find((scene) => scene.sceneId === selectedSceneId)?.sceneHeader] : []}
          optionName="IMPORT SCENE"
        />
      </div>
    );
  }

  return (
    <>
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
            paragraphsLoading={paragraphsAreLoading}
          />
        ))}
      </div>
      {
        showPopup
        && (
          <div className="script-popup-background">
            <div
              className="script-popup"
              style={isMobile
                ? {
                  position: 'fixed',
                  top: 'calc(50% - 150px)',
                  backgroundColor: 'var(--ion-color-tertiary)',
                  maxWidth,
                  left: 'calc(50% - 150px)',
                }
                : {
                  position: 'fixed',
                  top: topPosition,
                  left: leftPosition,
                  backgroundColor: 'var(--ion-color-tertiary)',
                  maxWidth,
                }}
            >
              {
                popupMessage !== ''
                && (
                <p
                  style={{
                    color: 'var(--ion-color-success)',
                    marginLeft: '16px',
                    textTransform: 'uppercase',
                    fontSize: '10px',
                  }}
                >
                  {popupMessage}
                </p>
                )
              }
              <div
                className="form-type-selector"
              >
                <button
                  className={`form-type-button ${formType === 'note' ? 'selected' : ''}`}
                  onClick={() => handleFormTypeChange('note')}
                >
                  <PiNotePencil className={`form-type-icon${formType === 'note' ? ' active' : ''}`} />
                </button>
                <button
                  className={`form-type-button ${formType === 'character' ? 'selected' : ''}`}
                  onClick={() => handleFormTypeChange('character')}
                >
                  <MdOutlineFaceUnlock className={`form-type-icon${formType === 'character' ? ' active' : ''}`} />
                </button>
                <button
                  className={`form-type-button ${formType === 'element' ? 'selected' : ''}`}
                  onClick={() => handleFormTypeChange('element')}
                >
                  <FaClipboardList className={`form-type-icon${formType === 'element' ? ' active' : ''}`} />
                </button>
                <button
                  className={`form-type-button ${formType === 'extra' ? 'selected' : ''}`}
                  onClick={() => handleFormTypeChange('extra')}
                >
                  <HiMiniUsers className={`form-type-icon${formType === 'extra' ? ' active' : ''}`} />
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
                    margin: '16px 12px 6px 12px',
                    marginTop: '10%',
                    fontSize: '10px',
                    width: 'calc(100% - 24px)',
                    minHeight: '30px',
                  }}
                />
                <IonButton
                  onClick={handlePopupClose}
                  className="cancel-button"
                  fill="outline"
                  color="danger"
                  style={{
                    margin: '6px 12px 16px 12px',
                    fontSize: '10px',
                    minHeight: '30px',
                  }}
                >
                  CANCEL
                </IonButton>
              </>
            </div>
          </div>
        )
        }
    </>
  );
};

export default ScriptPage;
