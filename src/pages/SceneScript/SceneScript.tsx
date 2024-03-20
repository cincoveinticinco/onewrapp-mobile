
import {
  IonContent, IonHeader, IonInput, IonItem, IonPage, IonTabBar,  useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter
} from '@ionic/react';
import useHideTabs from '../../hooks/useHideTabs';
import { useHistory, useParams } from 'react-router';
import { useContext, useEffect, useRef, useState } from 'react';
import Toolbar from '../../components/Shared/Toolbar/Toolbar';
import SceneDetailsTabs from '../../components/Shared/SeceneDetailsTabs/SceneDetailsTabs';
import DatabaseContext from '../../context/database';
import './SceneScript.scss'
import SceneHeader from '../SceneDetails/SceneHeader';
import ScenesContext from '../../context/ScenesContext';
import applyFilters from '../../utils/applyFilters';
import { DayOrNightOptionEnum, IntOrExtOptionEnum, SceneTypeEnum } from '../../Ennums/ennums';
import { Character, Element, Extra, Scene } from '../../interfaces/scenesTypes';
import { RiEditFill, RiZoomInFill, RiZoomOutFill } from 'react-icons/ri';
import HighlightedTextWithArray, { SearchTerm } from '../../components/Shared/HighlightedTextWithArray/HighlightedTextWithArray';
import removeAccents from '../../utils/removeAccents';
import FiilledSuccessButton from '../../components/Shared/FilledSuccessButton/FillSuccessButton';
import getUniqueValuesFromNestedArray from '../../utils/getUniqueValuesFromNestedArray';
import useSuccessToast from '../../hooks/useSuccessToast';

// BLUE CHARACTER
// YELLOW ELEMENT
// GREEN EXTRA

const paragraphs = [
    {
      "type": "scene",
      "content": "1_1 INT. DF, DEPTO JUAN Y MARÍA. SALA/COMEDOR - DAY 01"
    },
    {
      "type": "description",
      "content": "Una pequeña y cálida sala de un departamento en la colonia Roma. Destacan varias maquetas arquitectónicas que compiten por espacio con muchas plantas, GOS restiradores, un mueble con TVy Betamax, un par de sofás de la época y un estéreo con tornamesa, discos de acetato y reproductor de cassettes. Es un espacio mitad casa, mitad despacho de arquitectos."
    },
    {
      "type": "description",
      "content": " En temprano por la mañana. El reloj marca las 7:00 am."
    },
    {
      "type": "description",
      "content": "Juan (32), un hombre de apariencia gentil y MARÍA (30), una mujer de presencia fuerte e innegable belleza, estan a la mitad de una fuerte pelea."
    },
    {
      "type": "character",
      "content": "JUAN"
    },
    {
      "type": "dialog",
      "content": "Es una oportunidad para los dos, Maria. No puedo decir que no."
    },
    {
      "type": "character",
      "content": "MARÍA"
    },
    {
      "type": "dialog",
      "content": "Soy rata de ciudad, Juan. ¿Qué voy a hacer viviendo meses en la sierra?"
    },
    {
      "type": "character",
      "content": "JUAN"
    },
    {
      "type": "dialog",
      "content": "Trabajar juntos. Divertirnos. Hacer el amor. No estaría mal, ¿no?"
    },
    {
      "type": "action",
      "content": "María se siente picada por el comentario."
    },
    {
      "type": "character",
      "content": "MARÍA"
    },
    {
      "type": "dialog",
      "content": "Vete tú. Ni te obligo a quedarte, ni me obligues a hacer cosas que no quiero."
    },
    {
      "type": "action",
      "content": "Juan se queda descolocado. Descubrimos que María tiene una maleta a su lado. Ella se levanta y la toma"
    },
    {
      "type": "character",
      "content": "JUAN"
    },
    {
      "type": "dialog",
      "content": "Prefieres dejarnos? ¿En serio, te vas? ¿Y Pablo?"
    },
    {
      "type": "character",
      "content": "MARÍA"
    },
    {
      "type": "dialog",
      "content": "Sin chantajes, Juan. Te hago la misma pregunta. ¿Y Pablo? Lejos de sus amigos, de su escuela, de su mundo. Lejos de mi."
    },
    {
      "type": "character",
      "content": "JUAN"
    },
    {
      "type": "dialog",
      "content": "Solo no puedo."
    },
    {
      "type": "action",
      "content": "Se miran, con dolor."
    },
    {
      "type": "character",
      "content": "MARÍA"
    },
    {
      "type": "dialog",
      "content": "Quieres que meta mis sueños en una maleta y te siga al fin del mundo sin importarte lo que necesito."
    },
    {
      "type": "character",
      "content": "JUAN"
    },
    {
      "type": "dialog",
      "content": "Si me importa. Es sólo un tiempo."
    },
    {
      "type": "character",
      "content": "MARÍA"
    },
    {
      "type": "dialog",
      "content": "No me dejes, Juan. Vámonos juntos a California."
    },
    {
      "type": "character",
      "content": "JUAN"
    },
    {
      "type": "dialog",
      "content": "¡Qué carajos! ¡Nacimos allá!"
    },
    {
      "type": "action",
      "content": "María toma su maleta y va hacia la puerta. Juan le cierra el paso. Forcejean. La pelea se torna casi violenta."
    },
    {
      "type": "character",
      "content": "JUAN"
    },
    {
      "type": "dialog",
      "content": "¡No, no te van a ningún lado!"
    },
    {
      "type": "action",
      "content": "Se dan cuenta que PABLO NING (6), un niño con gran parecido a Juan vestido con su uniforme de la escuela, los mira asustado."
    },
]


interface SceneParagraphProps {
  type: string;
  content: string;
}

interface SceneParagraphProps {
  type: string;
  content: string;
  enableEdition: boolean;
  highlightColor?: string;
  searchTermsArray?: SearchTerm[];
  handleCreation: (type: ('element' | 'character' | 'extra'), data: any) => void;
}

const SceneParagraph: React.FC<SceneParagraphProps> = ({
  type,
  content,
  enableEdition,
  searchTermsArray,
  handleCreation,
}) => {
  const successToast = useSuccessToast();
  const { offlineScenes } = useContext(DatabaseContext);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const selectionRef = useRef<string | null>(null);
  const [formType, setFormType] = useState<'character' | 'element' | 'extra' | null>(null);
  const [extra, setExtra] = useState<Extra>({
    categoryName: null,
    extraName: '',
  });
  const [element, setElement] = useState<Element>({
    categoryName: null,
    elementName: '',
  });
  const [character, setCharacter] = useState<Character>({
    categoryName: '',
    characterName: '',
    characterNum: null,
  });

  useEffect(() => {
    const normalizedSelectedText = removeAccents(selectedText).toLowerCase().trim();
    const uniqueCharacters = getUniqueValuesFromNestedArray(offlineScenes, 'characters', 'characterName');
    const uniqueExtras = getUniqueValuesFromNestedArray(offlineScenes, 'extras', 'extraName');
    const uniqueElements = getUniqueValuesFromNestedArray(offlineScenes, 'elements', 'elementName');

    const foundCharacter = uniqueCharacters.find((character: Character) =>
      removeAccents(character.characterName).toLowerCase().trim() === normalizedSelectedText
    );
    const foundElement = uniqueElements.find((element: Element) =>
      removeAccents(element.elementName).toLowerCase().trim() === normalizedSelectedText
    );
    const foundExtra = uniqueExtras.find((extra: Extra) =>
      removeAccents(extra.extraName).toLowerCase().trim() === normalizedSelectedText
    );

    if (foundCharacter) {
      setFormType('character');
      setCharacter({
        ...foundCharacter,
        characterNum: foundCharacter.characterNum || '',
      });
    } else if (foundElement) {
      setFormType('element');
      setElement(foundElement);
    } else if (foundExtra) {
      setFormType('extra');
      setExtra(foundExtra);
    } else {
      setFormType('character');
    }
  }, [offlineScenes, selectedText]);


  useEffect(() => {
    setCharacter((prevCharacter: any) => ({ ...prevCharacter, characterName: selectedText }));
    setElement((prevElement: any) => ({ ...prevElement, elementName: selectedText }));
    setExtra((prevExtra: any) => ({ ...prevExtra, extraName: selectedText }));
  }, [selectedText])

  let className = '';

  switch (type) {
    case 'scene':
      className = 'scene-paragraph';
      break;
    case 'description':
      className = 'description-paragraph';
      break;
    case 'character':
      className = 'character-paragraph';
      break;
    case 'dialog':
      className = 'dialog-paragraph';
      break;
    case 'action':
      className = 'action-paragraph';
      break;
    default:
      className = 'default-paragraph';
  }

  useEffect(() => {
    const normalizedSelectedText = removeAccents(selectedText).toLowerCase().trim();
    const uniqueCharacters = getUniqueValuesFromNestedArray(offlineScenes, 'characters', 'characterName');
    const uniqueExtras = getUniqueValuesFromNestedArray(offlineScenes, 'extras', 'extraName');
    const uniqueElements = getUniqueValuesFromNestedArray(offlineScenes, 'elements', 'elementName');

    if (uniqueCharacters.some((character: Character) => removeAccents(character.characterName).toLowerCase().trim() === normalizedSelectedText)) {
      setFormType('character');
    } else if (uniqueElements.some((element: Element) => removeAccents(element.elementName).toLowerCase().trim() === normalizedSelectedText)) {
      setFormType('element');
    } else if (uniqueExtras.some((extra: Extra) => removeAccents(extra.extraName).toLowerCase().trim() === normalizedSelectedText)) {
      setFormType('extra');
    } else {
      setFormType('character');
    }
  }, [offlineScenes, selectedText]);

  const handleFormTypeChange = (newFormType: 'character' | 'element' | 'extra') => {
    setFormType(newFormType);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLParagraphElement>) => {
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLParagraphElement>) => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    const thereIsaPopup = document.querySelector('.script-popup');
    const isScrollEvent = e.touches?.length > 1 || e.changedTouches?.length > 1;

    if (selectedText && !isScrollEvent && !thereIsaPopup && selectedText !== selectionRef.current) {
      handlePopupOpen(selectedText);
      selectionRef.current = selectedText;
    } else {
      setShowPopup(false);
    }
  };

  const handleMouseUp = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    const thereIsaPopup = document.querySelector('.script-popup');

    if (selectedText && !thereIsaPopup && selectedText !== selectionRef.current) {
      handlePopupOpen(selectedText);
      selectionRef.current = selectedText;
    } else {
      setShowPopup(false);
    }
  };

  const handlePopupOpen = (selectedText: string) => {
    setSelectedText(selectedText);
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setSelectedText('');
    clearSelection();
    selectionRef.current = null;
    setFormType(null);
  };

  const clearSelection = () => {
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
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
    }
    handlePopupClose();
  }


  const CharacterForm = () => (
    <>
      <IonItem>
        <IonInput
          className="script-popup-input"
          value={character && character.characterNum}
          color="tertiary"
          labelPlacement="stacked"
          label="Character Number"
          placeholder="INSERT CHARACTER NUMBER"
          onIonChange={(e) => setCharacter((prevCharacter: any) => ({ ...prevCharacter, characterNum: e.detail.value || '' }))}
        />
        <IonInput
          className="script-popup-input"
          value={character && character.categoryName}
          color="tertiary"
          labelPlacement="stacked"
          label="Character Category"
          placeholder="INSERT CHARACTER CATEGORY"
          onIonChange={(e) => setCharacter((prevCharacter: any) => ({ ...prevCharacter, categoryName: e.detail.value || '' }))}
        />
      </IonItem>
      <IonItem>
        <IonInput
          className="script-popup-input"
          value={character && character.characterName}
          color="tertiary"
          labelPlacement="stacked"
          label="Character Name *"
          placeholder="INSERT CHARACTER NAME"
          onIonChange={(e) => setCharacter((prevCharacter: any) => ({ ...prevCharacter, characterName: e.detail.value || '' }))}
        />
      </IonItem>
    </>
  );

  const ElementForm = () => (
    <>
      <IonItem>
        <IonInput
          className="script-popup-input"
          value={element && element.categoryName}
          color="tertiary"
          labelPlacement="stacked"
          label="Element Category"
          placeholder="INSERT ELEMENT CATEGORY"
          onIonChange={(e) => setElement((prevElement: any) => ({ ...prevElement, categoryName: e.detail.value || '' }))}
        />
      </IonItem>
      <IonItem>
        <IonInput
          className="script-popup-input"
          value={selectedText}
          color="tertiary"
          labelPlacement="stacked"
          label="Element Name *"
          placeholder="INSERT ELEMENT NAME"
          onIonChange={(e) => setElement((prevElement: any) => ({ ...prevElement, elementName: e.detail.value || '' }))}
        />
      </IonItem>
    </>
  );

  const ExtraForm = () => (
    <>
      <IonItem>
        <IonInput
          className="script-popup-input"
          value={selectedText}
          color="tertiary"
          labelPlacement="stacked"
          label="Extra Name *"
          placeholder="INSERT EXTRA NAME"
        />
      </IonItem>
    </>
  );

  return (
    <>
      <p
        className={`${className} script-paragraph`}
        onTouchStartCapture={handleTouchStart}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleTouchEnd}
        contentEditable={enableEdition}
        suppressContentEditableWarning
      >
        {searchTermsArray && <HighlightedTextWithArray text={content} searchTerms={searchTermsArray} />}
      </p>
      {showPopup && (
        <div className="script-popup-background" onClick={handlePopupClose}>
          <div className="script-popup" onClick={e => e.stopPropagation()}>
            <div className="form-type-selector">
              <button
                className={`form-type-button ${formType === 'character' ? 'selected' : ''}`}
                onClick={() => handleFormTypeChange('character')}
              >
                Character
              </button>
              <button
                className={`form-type-button ${formType === 'element' ? 'selected' : ''}`}
                onClick={() => handleFormTypeChange('element')}
              >
                Element
              </button>
              <button
                className={`form-type-button ${formType === 'extra' ? 'selected' : ''}`}
                onClick={() => handleFormTypeChange('extra')}
              >
                Extra
              </button>
            </div>
            {formType === 'character' && <CharacterForm />}
            {formType === 'element' && <ElementForm />}
            {formType === 'extra' && <ExtraForm />}
            <FiilledSuccessButton
              buttonName="Save"
              onClick={() => handleFormSubmit()}
              style={{
                marginTop: '10%',
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

interface ScriptPageProps {
  zoomLevel: number;
  edition: boolean;
  charactersArray: Character[];
  elementsArray: Element[];
  extrasArray: Extra[];
  handleCreation: (type: ('element' | 'character' | 'extra'), data: any) => void;
}

const ScriptPage: React.FC<ScriptPageProps> = ({ zoomLevel, edition, charactersArray, elementsArray, extrasArray, handleCreation }) => {

  useEffect(() => {
    console.log('charactersArray', charactersArray);
    console.log('elementsArray', elementsArray);
    console.log('extrasArray', extrasArray);
  }, [charactersArray, elementsArray, extrasArray]);

  const normalizeWord = (word: string) => {
    const normalizedWord = removeAccents(word).toLowerCase().trim();
    const symbolsRegex = /[^\w\s]/g;
    return normalizedWord.replace(symbolsRegex, '');
  }

  const getSearchTermsArray = (text: string) => {
    const words = text.split(' ');

    let searchTermsArray: SearchTerm[] = [];
    const normalizeCharactersArray = charactersArray.map((character: Character) => normalizeWord(character.characterName));
    const normalizeElementsArray = elementsArray.map((element: Element) => normalizeWord(element.elementName));
    const normalizeExtrasArray = extrasArray.map((extra: Extra) => normalizeWord(extra.extraName));

    words.forEach(word => {
      const normalizedWord = normalizeWord(word);
      if (normalizeCharactersArray.includes(normalizedWord)) {
        const searchTerm = {
          searchTerm: word,
          categoryName: charactersArray.find((character: Character) => normalizeWord(character.characterName) === normalizeWord(word))?.categoryName || '',
          type: 'character',
          highlightColor: 'var(--ion-color-primary)',
        }
        searchTermsArray.push(searchTerm);
      } else if (normalizeElementsArray.includes(normalizedWord)) {
        const searchTerm = {
          searchTerm: word,
          categoryName: elementsArray.find((element: Element) => normalizeWord(element.elementName) === normalizeWord(word))?.categoryName || '',
          type: 'element',
          highlightColor: 'var(--ion-color-yellow)',
        }
        searchTermsArray.push(searchTerm);
      } else if (normalizeExtrasArray.includes(normalizedWord)) {
        const searchTerm = {
          searchTerm: word,
          categoryName: extrasArray.find((extra: Extra) => normalizeWord(extra.extraName) === normalizeWord(word))?.categoryName || '',
          type: 'extra',
          highlightColor: 'var(--ion-color-success)',
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
      if (paragraph.type === 'character' || paragraph.type === 'dialog') {
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
        <SceneParagraph key={index} type={paragraph.type} content={paragraph.content} enableEdition={edition} searchTermsArray={searchTerms} handleCreation={handleCreation}/>
      ))}
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

  const createNewElement = async (element: Element) => {
    try {
      const sceneElements = await thisScene?.elements;
      const sceneNewElements = [...sceneElements, element];
      const newScene = { ...thisScene, elements: sceneNewElements };
      await oneWrapDb?.scenes.upsert(newScene);
      console.log('newScene', newScene)
    } catch (error) {
      console.log(error)
    }
  }


  const createNewCharacter = async (character: Character) => {
    try {
      const sceneCharacters = await thisScene?.characters;
      const sceneNewCharacters = [...sceneCharacters, character];
      const newScene = { ...thisScene, characters: sceneNewCharacters };
      await oneWrapDb?.scenes.upsert(newScene);
      console.log('newScene', newScene)

    } catch (error) {
      console.log(error)
    }
  }

  const createNewExtra = async (extra: Extra) => {
    try {
      const sceneExtras = await thisScene?.extras;
      const sceneNewExtras = [...sceneExtras, extra];
      const newScene = { ...thisScene, extras: sceneNewExtras };
      await oneWrapDb?.scenes.upsert(newScene);
      console.log('newScene', newScene)

    } catch (error) {
      console.log(error)
    }
  }

  const handleCreation = (type: ('element' | 'character' | 'extra'), data: any) => {
    if(type === 'element') {
      createNewElement(data);
    } else if(type === 'character') {
      createNewCharacter(data);
    } else if(type === 'extra') {
      createNewExtra(data);
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

  const fetchScene = async () => {
    if (sceneId) {
      const scene = await getCurrentScene();
      setThisScene(scene);
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
  const charactersArray = thisScene?.characters;
  const elementsArray = thisScene?.elements;
  const extrasArray = thisScene?.extras;

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
