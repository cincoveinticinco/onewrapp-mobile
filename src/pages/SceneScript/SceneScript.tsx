
import {
  IonContent, IonHeader, IonIcon, IonPage, IonTabBar, IonTabs, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter
} from '@ionic/react';
import useHideTabs from '../../hooks/useHideTabs';
import { useHistory, useParams } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import Toolbar from '../../components/Shared/Toolbar/Toolbar';
import SceneDetailsTabs from '../../components/Shared/SeceneDetailsTabs/SceneDetailsTabs';
import { chevronBack, chevronForward } from 'ionicons/icons';
import DatabaseContext from '../../context/database';
import './SceneScript.scss'

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


const SceneParagraph: React.FC<SceneParagraphProps> = ({ type, content }) => {
  let className = '';

  switch (type) {
    case 'scene':
      className = 'scene-paragraph';
      break;
    case 'description':
      className = 'description-paragraph';
      break;
    case 'character':
      className = 'character-paragraph'; // New class for character names
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

  return <p className={className + ' script-paragraph'}>{content}</p>;
};

const ScriptPage = () => {
  return (
    <div
    className="script-page"
  >
      {paragraphs.map((paragraph, index) => (
        <SceneParagraph key={index} type={paragraph.type} content={paragraph.content} />
      ))}
    </div>
  );

}

const SceneScript: React.FC = () => {
  const {hideTabs, showTabs} = useHideTabs()
  const { sceneId } = useParams<{ sceneId: string }>()
  const [thisScene, setThisScene] = useState<any>(null)
  const { oneWrapDb, offlineScenes } = useContext(DatabaseContext)
  const history = useHistory()

  const getCurrentScene = async () => {
    const scene = await oneWrapDb?.scenes.findOne({ selector: { id: sceneId } }).exec()
    return scene._data ? scene._data : null
  }


  const handleBack = () => {
    history.push('/my/projects/163/strips')
  }

  const fetchScene = async () => {
    if (sceneId) {
      const scene = await getCurrentScene()
      setThisScene(scene)
    }
  }

  useIonViewWillEnter(() => {
    fetchScene()
  })

  useEffect(() => {
    fetchScene()
  }, [offlineScenes])

  useIonViewDidLeave(() => {
    setThisScene(null)
  })

  const sceneHeader = thisScene ? `${parseInt(thisScene.episodeNumber) > 0 ? (thisScene.episodeNumber + '.') : ''}${thisScene.sceneNumber}` : ''

  useEffect(() => {
    hideTabs()
    return () => {
      showTabs()
    }
  }, [])

  useIonViewDidEnter(() => {
    hideTabs()
   });

  return (
    <IonPage>
      <IonHeader>
        <Toolbar name='' backString prohibited deleteButton edit editRoute={`/my/projects/163/editscene/${sceneId}/details`} handleBack={handleBack} deleteTrigger={`open-delete-scene-alert-${sceneId}-details`} />
        <IonToolbar color="success"  mode='ios'>
          <IonIcon icon={chevronBack} slot='start' size='large' />
          <IonTitle style={{fontWeight: 'light'}}>{`${sceneHeader} NOT ASSIGNED`}</IonTitle>
          <IonIcon icon={chevronForward} slot='end' size='large' />
        </IonToolbar>
      </IonHeader>
      <IonContent color="tertiary" fullscreen>
        <ScriptPage />
      </IonContent>
      <IonTabBar
       style={{
        border: 'none',
        padding: '0px',
        margin: '0 auto',
        backgroundColor: 'var(--ion-color-light)',
       }}
       className='script-page-bottom-bar'
      >

      </IonTabBar>
      <SceneDetailsTabs sceneId={sceneId} />
    </IonPage>
  )
};

export default SceneScript;
