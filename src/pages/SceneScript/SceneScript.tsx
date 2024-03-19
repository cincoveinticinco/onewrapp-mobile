
import {
  IonContent, IonHeader, IonIcon, IonPage, IonTabBar, IonTabs, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter
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
import { Character, Scene } from '../../interfaces/scenesTypes';
import { RiEditFill, RiZoomInFill, RiZoomOutFill } from 'react-icons/ri';
import HighlightedFilterNames from '../../components/FilterScenes/HighlightedFilterNames';
import HighlightedTextWithArray from '../../components/Shared/HighlightedTextWithArray/HighlightedTextWithArray';
import removeAccents from '../../utils/removeAccents';

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
  searchTermsArray?: string[];
}

const SceneParagraph: React.FC<SceneParagraphProps> = ({ type, content, enableEdition, highlightColor, searchTermsArray}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const selectionRef = useRef<string | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLParagraphElement>) => {
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLParagraphElement>) => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    const thereIsaPopup = document.querySelector('.script-popup');
    const isScrollEvent = e.touches?.length > 1 || e.changedTouches?.length > 1;

    if (selectedText && !isScrollEvent && !thereIsaPopup && selectedText !== selectionRef.current) {
      setSelectedText(selectedText);
      setShowPopup(true);
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
      setSelectedText(selectedText);
      setShowPopup(true);
      selectionRef.current = selectedText;
    } else {
      setShowPopup(false);
    }
  }

  const handlePopupClose = () => {
    setShowPopup(false);
    setSelectedText('');
    clearSelection();
    selectionRef.current = null;
  };

  const clearSelection = () => {
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
  };

  useEffect(() => {
    return () => {
      clearSelection();
    };
  }, []);

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
        <HighlightedTextWithArray text={content} searchTerms={searchTermsArray || []} highlightColor={highlightColor} />

      </p>
      {showPopup && (
        <div className="script-popup-background" onClick={handlePopupClose}>
          <div className="script-popup" onClick={e => e.stopPropagation()}>
            <p style={{ color: 'black' }}>Texto seleccionado: {selectedText}</p>
            <button onClick={handlePopupClose}>Cerrar</button>
          </div>
        </div>
      )}
    </>
  );
};

interface ScriptPageProps {
  zoomLevel: number;
  edition: boolean;
  charactersArray: string[];
  elementsArray: string[];
  extrasArray: string[];
}


const ScriptPage: React.FC<ScriptPageProps> = ({ zoomLevel, edition, charactersArray, elementsArray, extrasArray }) => {

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

  const getHighlightColor = (text: string) => {
    const words = text.split(' ').map(normalizeWord)
    let color = '';
    const normalizeCharactersArray = charactersArray.map(normalizeWord);
    const normalizeElementsArray = elementsArray.map(normalizeWord);
    const normalizeExtrasArray = extrasArray.map(normalizeWord);
  
    words.forEach(word => {
      if (normalizeCharactersArray.includes(word)) {
        color = 'var(--ion-color-primary)';
      } else if (normalizeElementsArray.includes(word)) {
        color = 'yellow';
      } else if (normalizeExtrasArray.includes(word)) {
        color = 'green';
      }
    });
  
    return color;
  }

  const getSearchTermsArray = (text: string) => {
    const words = text.split(' ').map(normalizeWord);
    let searchTermsArray: string[] = [];
    const normalizeCharactersArray = charactersArray.map(normalizeWord);
    const normalizeElementsArray = elementsArray.map(normalizeWord);
    const normalizeExtrasArray = extrasArray.map(normalizeWord);

    words.forEach(word => {
      if (normalizeCharactersArray.includes(word)) {
        searchTermsArray.push(word);
      } else if (normalizeElementsArray.includes(word)) {
        searchTermsArray.push(word);
      } else if (normalizeExtrasArray.includes(word)) {
        searchTermsArray.push(word);
      }
    });
  
    return searchTermsArray;
  }
  
  return (
    <div
      className="script-page"
      style={{
        zoom: zoomLevel,
        transformOrigin: 'top left',
      }}
    >
      {paragraphs.map((paragraph, index) => (
        <SceneParagraph key={index} type={paragraph.type} content={paragraph.content} enableEdition={edition} highlightColor={getHighlightColor(paragraph.content)} searchTermsArray={getSearchTermsArray(paragraph.content)}/>
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
  const charactersArray = thisScene?.characters.map((character: Character) => character.characterName);
  const elementsArray = thisScene?.elements.map((element: any) => element.elementName);
  const extrasArray = thisScene?.extras.map((extra: any) => extra.extraName);

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
                height: '100%',
                display: 'flex',
                alignItems: 'center',
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
