import React, { useEffect, useState } from 'react'
import { 
  IonButton,
  IonContent, 
  IonHeader, 
  IonIcon, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  useIonViewDidEnter 
} from '@ionic/react'
import ExploreContainer from '../../components/Shared/ExploreContainer/ExploreContainer'
import useHideTabs from '../../hooks/Shared/useHideTabs'
import './CallSheet.css'
import CallSheetTabs from '../../components/CallSheet/CallSheetTabs/CallSheetTabs'
import CastView from '../../components/CallSheet/CastView/CastView/CastView'
import { chevronBackOutline } from 'ionicons/icons'
import { useParams } from 'react-router'
import DatabaseContext from '../../hooks/Shared/database'
import { Character, Scene } from '../../interfaces/scenesTypes'
import { Talent } from '../../RXdatabase/schemas/talents'
import { normalizeString } from 'rxdb'
import AddButton from '../../components/Shared/AddButton/AddButton'
import { CrewCall, ExtraCall, Shooting } from '../../interfaces/shootingTypes'
import ExtraView from '../../components/CallSheet/ExtraView/ExtraView'
import CrewView from '../../components/CallSheet/CrewView/CrewView'
import { VscEdit } from 'react-icons/vsc'
import PictureCars from '../../components/CallSheet/PictureCars/PictureCars'
import OtherCalls from '../../components/CallSheet/OtherCalls/OtherCalls'
import { ShootingStatusEnum } from '../../Ennums/ennums'

type CallSheetView = 'cast' | 'extras' | 'pictureCars' | 'others' | 'crew';

const CallSheet: React.FC = () => {
  const tabsController = useHideTabs()
  const [view, setView] = useState<CallSheetView>('cast')
  const { id, shootingId } = useParams<{ id: string, shootingId: string }>()
  const { oneWrapDb } = React.useContext(DatabaseContext)
  const [castCalls, setCastCalls] = React.useState([])
  const [extraCalls, setExtraCalls] = React.useState<ExtraCall[]>([])
  const [crewCalls, setCrewCalls] = React.useState<CrewCall[]>([])
  const [otherCalls, setOtherCalls] = React.useState([])
  const [pictureCars, setPictureCars] = React.useState([])
  const [addNewCastCallModalIsOpen, setAddNewCastCallModalIsOpen] = React.useState(false)
  const [addNewExtraCAllModalIsOpen, setAddNewExtraCAllModalIsOpen] = React.useState(false)
  const [addNewCrewCallModalIsOpen, setAddNewCrewCallModalIsOpen] = React.useState(false)
  const [addNewOtherCallModalIsOpen, setAddNewOtherCallModalIsOpen] = React.useState(false)
  const [addNewPictureCarModalIsOpen, setAddNewPictureCarModalIsOpen] = React.useState(false)
  const [editMode, setEditMode] = React.useState(false)
  const [thisShooting, setThisShooting] = React.useState<Shooting>()

  useEffect(() => {
    fetchCastCalls()
  }, [oneWrapDb])

  const openAddNewModal = () => {
    if(view === 'cast') {
      setAddNewCastCallModalIsOpen(true)
    } else if(view === 'extras') {
      setAddNewExtraCAllModalIsOpen(true)
    } else if(view === 'crew') {
      setAddNewCrewCallModalIsOpen(true)
    } else if(view === 'others') {
      setAddNewOtherCallModalIsOpen(true)
    } else if(view === 'pictureCars') {
      setAddNewPictureCarModalIsOpen(true)
    }
  }

  const fetchCastCalls = async () => {
    try {
      const shootings: any = await oneWrapDb?.shootings.find({ selector: { id: shootingId } }).exec();
      setThisShooting(shootings[0]._data);
      const scenesInShoot = shootings[0]._data.scenes;
      const scenesIds = scenesInShoot.map((scene: any) => parseInt(scene.sceneId));
      const scenes = await oneWrapDb?.scenes.find({ selector: { sceneId: { $in: scenesIds } } }).exec() || [];

      const getNumberScenesByCast = (castName: string) => {
        return scenes.filter((scene: any) => {
          const characters = scene._data.characters || [];
          return characters.some((character: any) => normalizeString(character.characterName) === normalizeString(castName));
        }).length.toString() || '--';
      }
  
      const characterNames = [...new Set(scenes.flatMap((scene: { _data: Scene; }) =>
        (scene._data.characters || []).map((character: Character) => normalizeString(character.characterName.toLowerCase()))
      ))];
      
      
      const talents = await oneWrapDb?.talents.find({}).exec() || [];
      const castTalents = talents.filter((talent: Talent) => characterNames.includes(normalizeString(talent.castName)));
  
      const getCallInfo = (castName: string) => {
        const shootingCalls = shootings[0]._data.castCalls;
        const callInfo = shootingCalls.find((call: any) => normalizeString(call.castName) === normalizeString(castName));
        return callInfo;
      }
  
      const uniqueCastCalls = new Map();

      scenes.forEach((scene: { _data: Scene }) => {
        if (scene._data.characters) {
          scene._data.characters.forEach((character: Character) => {
            const key = character.characterName.toLowerCase();
            if (!uniqueCastCalls.has(key)) {
              const talentCallInfo = getCallInfo(character.characterName);
              const talent = castTalents.find((talent: any) => talent.castName.toLowerCase() === key);
              uniqueCastCalls.set(key, {
                cast: `${character.characterNum}. ${character.characterName}`,
                talent: talent?.name,
                tScn: getNumberScenesByCast(character.characterName),
                pickup: talentCallInfo?.pickup || '--',
                call: talentCallInfo?.callTime || '--',
                makeup: talentCallInfo?.onMakeUp || '--',
                wardrobe: talentCallInfo?.onWardrobe || '--',
                ready: talentCallInfo?.readyToShoot || '--',
                notes: talentCallInfo?.notes || '',
              });
            }
          });
        }
      });
  
      setCastCalls(Array.from(uniqueCastCalls.values()) as any);

      const extraCalls: ExtraCall[] = shootings[0]._data.extraCalls;
      setExtraCalls(extraCalls);
      
      const crewCalls: CrewCall[] = shootings[0]._data.crewCalls;
      setCrewCalls(crewCalls);

      const otherCalls = shootings[0]._data.otherCalls;
      setOtherCalls(otherCalls);

      const pictureCars = shootings[0]._data.pictureCars;
      setPictureCars(pictureCars);
    } catch(err) {
      console.error(err)
    }
  }

  useIonViewDidEnter(() => {
    setTimeout(() => {
      tabsController.hideTabs()
    }, 500)
  })

  const renderContent = () => {
    switch(view) {
      case 'cast':
        return <CastView castData={castCalls} addNewModalIsOpen={addNewCastCallModalIsOpen} setIsOpen={setAddNewCastCallModalIsOpen} editMode={editMode && view === 'cast'} />
      case 'extras':
        return <ExtraView extraViewData={extraCalls} editMode={editMode && view === 'extras'} addNewModalIsOpen={addNewExtraCAllModalIsOpen} setAddNewModalIsOpen={setAddNewExtraCAllModalIsOpen}/>
      case 'pictureCars':
        return <PictureCars pictureCars={pictureCars} isOpen={addNewPictureCarModalIsOpen} setIsOpen={setAddNewPictureCarModalIsOpen} />
      case 'others':
        return <OtherCalls otherCalls={otherCalls} isOpen={addNewOtherCallModalIsOpen} setIsOpen={setAddNewOtherCallModalIsOpen} />
      case 'crew':
        return <CrewView crewCalls={crewCalls} editMode={editMode && view === 'crew'} />
      default:
        return <ExploreContainer name="Default Content" />
    }
  }

  const toggleEditMode = () => {
    setEditMode(!editMode)
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="tertiary">
          <IonButton 
            routerLink={`/my/projects/${id}/shooting/${shootingId}`} 
            color="light" 
            slot="start" 
            fill='clear'
          >
          <IonIcon slot="icon-only" icon={chevronBackOutline} />
          </IonButton>
          <IonTitle>CALL TIME</IonTitle>
          {
            thisShooting &&
            thisShooting.status !== ShootingStatusEnum.Closed && (
              <div slot='end'>
                <IonButton fill='clear' color={!editMode ? 'light' : 'success'} onClick={() => toggleEditMode()}>
                  <VscEdit />
                </IonButton>
                <AddButton onClick={() => openAddNewModal()}/>
              </div> 
            )
          }
        </IonToolbar>
      </IonHeader>
      <IonContent color="tertiary" fullscreen>
        {renderContent()}
      </IonContent>
      <CallSheetTabs view={view} setView={setView} />
    </IonPage>
  )
}

export default CallSheet