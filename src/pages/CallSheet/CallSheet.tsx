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
import { CastCalls, CrewCall, ExtraCall, OtherCall, PictureCar, Shooting } from '../../interfaces/shootingTypes'
import ExtraView from '../../components/CallSheet/ExtraView/ExtraView'
import CrewView from '../../components/CallSheet/CrewView/CrewView'
import { VscEdit } from 'react-icons/vsc'
import PictureCars from '../../components/CallSheet/PictureCars/PictureCars'
import OtherCalls from '../../components/CallSheet/OtherCalls/OtherCalls'
import { ShootingStatusEnum } from '../../Ennums/ennums'
import timeToISOString from '../../utils/timeToIsoString'

type CallSheetView = 'cast' | 'extras' | 'pictureCars' | 'others' | 'crew';

const CallSheet: React.FC = () => {
  const tabsController = useHideTabs()
  const [view, setView] = useState<CallSheetView>('cast')
  const { id, shootingId } = useParams<{ id: string, shootingId: string }>()
  const { oneWrapDb } = React.useContext(DatabaseContext)
  const [castCalls, setCastCalls] = React.useState<any[]>([])
  const [extraCalls, setExtraCalls] = React.useState<ExtraCall[]>([])
  const [crewCalls, setCrewCalls] = React.useState<CrewCall[]>([])
  const [otherCalls, setOtherCalls] = React.useState<OtherCall[]>([])
  const [pictureCars, setPictureCars] = React.useState<PictureCar[]>([])
  const [addNewCastCallModalIsOpen, setAddNewCastCallModalIsOpen] = React.useState(false)
  const [addNewExtraCAllModalIsOpen, setAddNewExtraCAllModalIsOpen] = React.useState(false)
  const [addNewCrewCallModalIsOpen, setAddNewCrewCallModalIsOpen] = React.useState(false)
  const [addNewOtherCallModalIsOpen, setAddNewOtherCallModalIsOpen] = React.useState(false)
  const [addNewPictureCarModalIsOpen, setAddNewPictureCarModalIsOpen] = React.useState(false)
  const [editMode, setEditMode] = React.useState(false)
  const [thisShooting, setThisShooting] = React.useState<Shooting>()
  const [castOptions, setCastOptions] = React.useState<any>([])
  const [scenesInShoot, setScenesInShoot] = React.useState<any>([])

  const getTalentCastOptions = async () => {
    const talents = await oneWrapDb?.talents.find({}).exec() || [];
    const castOptions = talents.map((talent: any) => ({ value: talent._data, label: talent.castName })).sort((a, b) => a.label.localeCompare(b.label))
    setCastOptions(castOptions)
  }

  useEffect(() => {
    fetchCastCalls()
    getTalentCastOptions()
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

      setScenesInShoot(scenes);
      
      scenes.forEach((scene: { _data: Scene }) => {
        if (scene._data.characters) {
          scene._data.characters.forEach((character: Character) => {
            const key = character.characterName.toLowerCase();
            if (!uniqueCastCalls.has(key)) {
              const talentCallInfo = getCallInfo(character.characterName);
              const talent = castTalents.find((talent: any) => talent.castName.toLowerCase() === key);
              uniqueCastCalls.set(key, {
                cast: `${character.characterNum}. ${character.characterName}`,
                name: talent?.name,
                tScn: getNumberScenesByCast(character.characterName),
                pickUp: talentCallInfo?.pickup || '--',
                callTime: talentCallInfo?.callTime || '--',
                onMakeUp: talentCallInfo?.onMakeUp || '--',
                onWardrobe: talentCallInfo?.onWardrobe || '--',
                readyToShoot: talentCallInfo?.readyToShoot || '--',
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
        return <CastView 
                  castData={castCalls} 
                  addNewModalIsOpen={addNewCastCallModalIsOpen} 
                  setIsOpen={setAddNewCastCallModalIsOpen} 
                  editMode={editMode && view === 'cast'}
                  addNewCastCall={createNewCastCall}
                  castOptions={castOptions}
                />
      case 'extras':
        return <ExtraView 
                  extraViewData={extraCalls} 
                  editMode={editMode && view === 'extras'} 
                  addNewModalIsOpen={addNewExtraCAllModalIsOpen} 
                  setAddNewModalIsOpen={setAddNewExtraCAllModalIsOpen}
                  addNewExtraCall={createNewExtraCall}
                />
      case 'pictureCars':
        return <PictureCars 
                  pictureCars={pictureCars} 
                  isOpen={addNewPictureCarModalIsOpen} 
                  setIsOpen={setAddNewPictureCarModalIsOpen} 
                  addNewPictureCar={createNewPictureCar} 
                />
      case 'others':
        return <OtherCalls 
                  otherCalls={otherCalls} 
                  isOpen={addNewOtherCallModalIsOpen} 
                  setIsOpen={setAddNewOtherCallModalIsOpen}
                  addNewOtherCall={createNewOtherCall}
                />
      case 'crew':
        return <CrewView crewCalls={crewCalls} editMode={editMode && view === 'crew'} />
      default:
        return <ExploreContainer name="Default Content" />
    }
  }

  const toggleEditMode = () => {
    setEditMode(!editMode)
  }

  const createNewExtraCall = async (formData: any): Promise<void> => {
    try {
      const quantity = formData.quantity ? parseInt(formData.quantity.toString()) : 0
      const shootingIdInt = shootingId ? parseInt(shootingId) : 0
  
      const pickUp = formData.pickUp && timeToISOString({
        hours: formData.pickUp.split(':')[0],
        minutes: formData.pickUp.split(':')[1]
      }, thisShooting?.shootDate || '')
  
      const callTime = formData.callTime && timeToISOString({
        hours: formData.callTime.split(':')[0],
        minutes: formData.callTime.split(':')[1]
      }, thisShooting?.shootDate || '')
  
      const onMakeUp = formData.onMakeUp && timeToISOString({
        hours: formData.onMakeUp.split(':')[0],
        minutes: formData.onMakeUp.split(':')[1]
      }, thisShooting?.shootDate || '')
  
      const onWardrobe = formData.onWardrobe && timeToISOString({
        hours: formData.onWardrobe.split(':')[0],
        minutes: formData.onWardrobe.split(':')[1]
      }, thisShooting?.shootDate || '')
  
      const readyToShoot = formData.readyToShoot && timeToISOString({
        hours: formData.readyToShoot.split(':')[0],
        minutes: formData.readyToShoot.split(':')[1]
      }, thisShooting?.shootDate || '')
  
      const arrived = formData.arrived && timeToISOString({
        hours: formData.arrived.split(':')[0],
        minutes: formData.arrived.split(':')[1]
      }, thisShooting?.shootDate || '')
  
      const wrap = formData.wrap && timeToISOString({
        hours: formData.wrap.split(':')[0],
        minutes: formData.wrap.split(':')[1]
      }, thisShooting?.shootDate || '')
  
      const newExtraCall: any = {
        id: '',
        shootingId: shootingIdInt,
        projExtraId: 0,
        pickUp: pickUp || null,
        callTime: callTime || null,
        onMakeUp: onMakeUp || null,
        onWardrobe: onWardrobe || null,
        readyToShoot: readyToShoot || null,
        arrived: arrived || null,
        wrap: wrap || null,
        quantity: quantity,
        extraName: formData.extraName || '',
        talentAgency: formData.talentAgency || '',
        notes: formData.notes || ''
      }
  
      const shootingCopy = { ...thisShooting }
      shootingCopy.extraCalls = [...(shootingCopy.extraCalls || []), newExtraCall]
  
      setThisShooting(shootingCopy as Shooting)
  
      await oneWrapDb?.shootings.upsert(shootingCopy)
      setExtraCalls([...extraCalls, newExtraCall])
      console.log('Extra Call created:', newExtraCall)
    } catch (error) {
      console.error('Error al crear nuevo Extra Call:', error)
      throw error
    }
  }
  
  const createNewPictureCar = async (formData: any): Promise<void> => {
    try {
      const quantity = formData.quantity ? parseInt(formData.quantity.toString()) : 0
      const shootingIdInt = shootingId ? parseInt(shootingId) : 0
  
      const callTime = formData.callTime && timeToISOString({
        hours: formData.callTime.split(':')[0],
        minutes: formData.callTime.split(':')[1]
      }, thisShooting?.shootDate || '')
  
      const newPictureCar: PictureCar = {
        id: '',
        pictureCarId: 0,
        pictureCarName: formData.pictureCarName || '',
        quantity: quantity,
        callTime: callTime || '',
      }
  
      const shootingCopy = { ...thisShooting }
      shootingCopy.pictureCars = [...(shootingCopy.pictureCars || []), newPictureCar]
  
      setThisShooting(shootingCopy as Shooting)
  
      await oneWrapDb?.shootings.upsert(shootingCopy)
      setPictureCars([...pictureCars, newPictureCar])
      console.log('Picture Car created:', newPictureCar)
    } catch (error) {
      console.error('Error al crear nuevo Picture Car:', error)
      throw error
    }
  }
  
  const createNewOtherCall = async (formData: any): Promise<void> => {
    try {
      const quantity = formData.quantity ? parseInt(formData.quantity.toString()) : 0
      const shootingIdInt = shootingId ? parseInt(shootingId) : 0
  
      const callTime = formData.callTime && timeToISOString({
        hours: formData.callTime.split(':')[0],
        minutes: formData.callTime.split(':')[1]
      }, thisShooting?.shootDate || '')
  
      const newOtherCall: OtherCall = {
        id: '',
        otherCallId: 0,
        callTime: callTime || '',
        otherCallName: formData.otherCallName || '',
        quantity: quantity,
      }
  
      const shootingCopy = { ...thisShooting }
      shootingCopy.otherCalls = [...(shootingCopy.otherCalls || []), newOtherCall]
  
      setThisShooting(shootingCopy as Shooting)
  
      await oneWrapDb?.shootings.upsert(shootingCopy)
      setOtherCalls([...otherCalls, newOtherCall])
      console.log('Other Call created:', newOtherCall)
    } catch (error) {
      console.error('Error al crear nuevo Other Call:', error)
      throw error
    }
  }
  
  const createNewCastCall = async (formData: any): Promise<void> => {
    try {
      const shootingIdInt = shootingId ? parseInt(shootingId) : 0
  
      const callTime = formData.callTime && timeToISOString({
        hours: formData.callTime.split(':')[0],
        minutes: formData.callTime.split(':')[1]
      }, thisShooting?.shootDate || '')
  
      const arrived = formData.arrived && timeToISOString({
        hours: formData.arrived.split(':')[0],
        minutes: formData.arrived.split(':')[1]
      }, thisShooting?.shootDate || '')
  
      const onMakeUp = formData.onMakeUp && timeToISOString({
        hours: formData.onMakeUp.split(':')[0],
        minutes: formData.onMakeUp.split(':')[1]
      }, thisShooting?.shootDate || '')
  
      const onWardrobe = formData.onWardrobe && timeToISOString({
        hours: formData.onWardrobe.split(':')[0],
        minutes: formData.onWardrobe.split(':')[1]
      }, thisShooting?.shootDate || '')
  
      const readyToShoot = formData.readyToShoot && timeToISOString({
        hours: formData.readyToShoot.split(':')[0],
        minutes: formData.readyToShoot.split(':')[1]
      }, thisShooting?.shootDate || '')
  
      const wrap = formData.wrap && timeToISOString({
        hours: formData.wrap.split(':')[0],
        minutes: formData.wrap.split(':')[1]
      }, thisShooting?.shootDate || '')
  
      const pickUp = formData.pickUp && timeToISOString({
        hours: formData.pickUp.split(':')[0],
        minutes: formData.pickUp.split(':')[1]
      }, thisShooting?.shootDate || '')
  
      const dropOff = formData.dropOff && timeToISOString({
        hours: formData.dropOff.split(':')[0],
        minutes: formData.dropOff.split(':')[1]
      }, thisShooting?.shootDate || '')
  
      const mealIn = formData.mealIn && timeToISOString({
        hours: formData.mealIn.split(':')[0],
        minutes: formData.mealIn.split(':')[1]
      }, thisShooting?.shootDate || '')
  
      const mealOut = formData.mealOut && timeToISOString({
        hours: formData.mealOut.split(':')[0],
        minutes: formData.mealOut.split(':')[1]
      }, thisShooting?.shootDate || '')
  
      const mealExtraIn = formData.mealExtraIn && timeToISOString({
        hours: formData.mealExtraIn.split(':')[0],
        minutes: formData.mealExtraIn.split(':')[1]
      }, thisShooting?.shootDate || '')
  
      const mealExtraOut = formData.mealExtraOut && timeToISOString({
        hours: formData.mealExtraOut.split(':')[0],
        minutes: formData.mealExtraOut.split(':')[1]
      }, thisShooting?.shootDate || '')

      const cast: Talent = formData.cast

      const character: Character = scenesInShoot.flatMap((scene: any) => scene._data.characters).find((character: any) => normalizeString(character.characterName) === normalizeString(cast.castName))

      const characterNum = character?.characterNum
  
      const newCastCall: CastCalls = {
        id: '',
        castName: cast.castName || '',
        callTime: callTime || '',
        arrived: arrived || '',
        onMakeUp: onMakeUp || '',
        onWardrobe: onWardrobe || '',
        readyToShoot: readyToShoot || '',
        wrap: wrap || '',
        notes: formData.notes || '',
        pickUp: pickUp || '',
        castCategory: cast.castCategory || '',
        castCategoryId: cast.castCategoryId || 0,
        castNumber: characterNum || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dropOff: dropOff || '',
        mealExtraIn: mealExtraIn || '',
        mealExtraOut: mealExtraOut || '',
        mealIn: mealIn || '',
        mealOut: mealOut || '',
        projectCastId: 0,
        shootingId: shootingIdInt,
        startProcesses: formData.startProcesses || '',
        wrapSet: formData.wrapSet || ''
      }
  
      const shootingCopy = { ...thisShooting }
      shootingCopy.castCalls = [...(shootingCopy.castCalls || []), newCastCall]
  
      setThisShooting(shootingCopy as Shooting)
  
      await oneWrapDb?.shootings.upsert(shootingCopy)
      const formattedCastCall = {
        ...newCastCall,
        cast: `${cast.castName}`
      }

      setCastCalls([...castCalls, formattedCastCall].sort((a, b) => a.cast.localeCompare(b.cast)))
      console.log('Cast Call created:', newCastCall)
    } catch (error) {
      console.error('Error al crear nuevo Cast Call:', error)
      throw error
    }
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