import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { VscEdit } from 'react-icons/vsc';
import { useParams } from 'react-router';
import { normalizeString } from 'rxdb';
import CallSheetTabs from '../../components/CallSheet/CallSheetTabs/CallSheetTabs';
import CastView from '../../components/CallSheet/CastView/CastView/CastView';
import CrewView from '../../components/CallSheet/CrewView/CrewView';
import ExtraView from '../../components/CallSheet/ExtraView/ExtraView';
import OtherCalls from '../../components/CallSheet/OtherCalls/OtherCalls';
import PictureCars from '../../components/CallSheet/PictureCars/PictureCars';
import AddButton from '../../components/Shared/AddButton/AddButton';
import ExploreContainer from '../../components/Shared/ExploreContainer/ExploreContainer';
import DatabaseContext from '../../context/Database/Database.context';
import { ShootingStatusEnum } from '../../ennums/ennums';
import useHandleBack from '../../hooks/Shared/useHandleBack';
import useHideTabs from '../../hooks/Shared/useHideTabs';
import { Character, SceneDocType } from '../../interfaces/scenes.types';
import {
  CastCalls, CrewCall, ExtraCall, OtherCall, PictureCar, ShootingDocType
} from '../../interfaces/shooting.types';
import { Talent } from '../../RXdatabase/schemas/talents.schema';
import timeToISOString from '../../utils/timeToIsoString';

import { ShootingInfoLabels } from '../ShootingDetail/Components/ShootingBasicInfo/ShootingBasicInfo';
import useErrorToast from '../../hooks/Shared/useErrorToast';
import useSuccessToast from '../../hooks/Shared/useSuccessToast';
import getHourMinutesFomISO from '../../utils/getHoursMinutesFromISO';
import './CallSheet.css';
import useIsMobile from '../../hooks/Shared/useIsMobile';
import Toolbar from '../../components/Shared/Toolbar/Toolbar';

type CallSheetView = 'cast' | 'extras' | 'pictureCars' | 'others' | 'crew';

interface CastCallForTable {
  cast: string;
  name: string;
  tScn: string;
  pickUp: string;
  callTime: string;
  onMakeUp: string;
  onWardrobe: string;
  readyToShoot: string;
  notes: string;
  castName: string;
}

interface CallSheetProps {
  isSection?: boolean;
  permissionType?: number | null;
}

const CallSheet: React.FC<CallSheetProps> = ({
  isSection = false,
  permissionType,
}) => {
  const tabsController = useHideTabs();
  const [view, setView] = useState<CallSheetView>('cast');
  const { id, shootingId } = useParams<{ id: string, shootingId: string }>();
  const { oneWrapDb } = React.useContext(DatabaseContext);
  const [castCalls, setCastCalls] = useState<any[]>([]);
  const [extraCalls, setExtraCalls] = useState<ExtraCall[]>([]);
  const [crewCalls, setCrewCalls] = useState<CrewCall[]>([]);
  const [otherCalls, setOtherCalls] = useState<OtherCall[]>([]);
  const [pictureCars, setPictureCars] = useState<PictureCar[]>([]);
  const [addNewCastCallModalIsOpen, setAddNewCastCallModalIsOpen] = useState(false);
  const [addNewExtraCAllModalIsOpen, setAddNewExtraCAllModalIsOpen] = useState(false);
  const [addNewCrewCallModalIsOpen, setAddNewCrewCallModalIsOpen] = useState(false);
  const [addNewOtherCallModalIsOpen, setAddNewOtherCallModalIsOpen] = useState(false);
  const [addNewPictureCarModalIsOpen, setAddNewPictureCarModalIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [thisShooting, setThisShooting] = useState<ShootingDocType>();
  const [castOptions, setCastOptions] = useState<any>([]);
  const [scenesInShoot, setScenesInShoot] = useState<any>([]);
  const [editedCastCalls, setEditedCastCalls] = useState<any>([]);
  const [searchMode, setSearchMode] = useState(false);
  const [searchText, setSearchText] = useState('');
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  const getTalentCastOptions = async () => {
    const talents = await oneWrapDb?.talents.find({}).exec() || [];
    const castOptions = talents.map((talent: any) => ({ value: talent._data, label: talent.castName })).sort((a, b) => a.label.localeCompare(b.label));
    setCastOptions(castOptions);
  };

  useEffect(() => {
    fetchCastCalls();
    getTalentCastOptions();
  }, [oneWrapDb]);

  const openAddNewModal = () => {
    switch (view) {
      case 'cast':
        setAddNewCastCallModalIsOpen(true);
        break;
      case 'extras':
        setAddNewExtraCAllModalIsOpen(true);
        break;
      case 'crew':
        setAddNewCrewCallModalIsOpen(true);
        break;
      case 'others':
        setAddNewOtherCallModalIsOpen(true);
        break;
      case 'pictureCars':
        setAddNewPictureCarModalIsOpen(true);
        break;
    }
  };

  const editCastCall = <K extends keyof CastCalls>(
    castIndex: number,
    castKey: K,
    newValue: any,
    type: string,
  ) => {
    setCastCalls((prevCastCalls) => {
      const editedCastCall = JSON.parse(JSON.stringify(prevCastCalls[castIndex]));
      editedCastCall[castKey] = newValue;
      const newCastCalls = [
        ...prevCastCalls.slice(0, castIndex),
        editedCastCall,
        ...prevCastCalls.slice(castIndex + 1),
      ];

      const getUniqueArrayValuesByKey = (array: any[], key: string) => [...new Map(array.map((item) => [item[key], item])).values()];

      const copyEditedCastCalls = [...editedCastCalls];
      const newEditedCastCalls = [...copyEditedCastCalls, editedCastCall];
      const uniqueEditedCastCalls = getUniqueArrayValuesByKey(newEditedCastCalls, 'castName');

      setEditedCastCalls(uniqueEditedCastCalls);

      return newCastCalls;
    });
  };

  const saveEditedCastCalls = async () => {
    try {
      const shootingCopy = { ...thisShooting };

      const newCastCalls = editedCastCalls.map((call: any) => {
        // Buscar si existe un call en la base de datos
        console.log('call', call);
        const callInDb = shootingCopy.castCalls?.find((callInDb: any) => callInDb.castName === call.castName);
        return {
          id: callInDb?.id || '',
          projectCastId: callInDb?.projectCastId || 0,
          shootingId: parseInt(shootingId, 10),
          pickUp: call.pickUp,
          callTime: call.callTime || callInDb?.callTime || '',
          onMakeUp: call.onMakeUp || callInDb?.onMakeUp || '',
          onWardrobe: call.onWardrobe || callInDb?.onWardrobe || '',
          readyToShoot: call.readyToShoot || callInDb?.readyToShoot || '',
          arrived: callInDb?.arrived || '',
          wrap: callInDb?.wrap || '',
          startProcesses: callInDb?.startProcesses || '',
          wrapSet: callInDb?.wrapSet || '',
          dropOff: callInDb?.dropOff || '',
          mealIn: callInDb?.mealIn || '',
          mealOut: callInDb?.mealOut || '',
          mealExtraIn: callInDb?.mealExtraIn || '',
          mealExtraOut: callInDb?.mealExtraOut || '',
          castName: call.castName,
          castNumber: call.castNumber || '',
          castCategory: call.castCategory || '',
          castCategoryId: callInDb?.castCategoryId || 0,
          notes: call.notes || callInDb?.notes || '',
          createdAt: callInDb?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      });

      // Combinar los castCalls existentes con los nuevos/editados
      const concatedCastCalls = [
        ...(shootingCopy.castCalls || []).filter((call: any) => !newCastCalls.some((newCall: any) => newCall.castName === call.castName)),
        ...newCastCalls,
      ];

      const newShooting: any = {
        ...shootingCopy,
        castCalls: concatedCastCalls,
        updatedAt: new Date().toISOString(),
      };
      setThisShooting(newShooting);
      await oneWrapDb?.shootings.upsert(newShooting);
      successToast('Cast Calls saved');
    } catch (error) {
      errorToast('Error saving Cast Calls');
      throw error;
    } finally {
      setEditedCastCalls([]);
    }
  };

  const editExtraCall = <K extends keyof ExtraCall>(
    extraIndex: number,
    extraKey: K,
    newValue: any,
    type: string,
  ) => {
    setExtraCalls((prevExtraCalls) => {
      const editedExtraCall = JSON.parse(JSON.stringify(prevExtraCalls[extraIndex]));
      editedExtraCall[extraKey] = newValue;
      const newExtraCalls = [
        ...prevExtraCalls.slice(0, extraIndex),
        editedExtraCall,
        ...prevExtraCalls.slice(extraIndex + 1),
      ];
      return newExtraCalls;
    });
  };

  const saveEditedExtraCalls = async () => {
    try {
      const shootingCopy = { ...thisShooting };
      shootingCopy.extraCalls = extraCalls;
      setThisShooting(shootingCopy as ShootingDocType);
      await oneWrapDb?.shootings.upsert(shootingCopy);
      successToast('Extra Calls saved');
    } catch (error) {
      errorToast('Error saving Extra Calls');
      throw error;
    }
  };

  const editOtherCall = <K extends keyof OtherCall>(
    otherIndex: number,
    otherKey: K,
    newValue: any,
    type: string,
  ) => {
    setOtherCalls((prevOtherCalls) => {
      const editedOtherCall = JSON.parse(JSON.stringify(prevOtherCalls[otherIndex]));
      editedOtherCall[otherKey] = newValue;
      const newOtherCalls = [
        ...prevOtherCalls.slice(0, otherIndex),
        editedOtherCall,
        ...prevOtherCalls.slice(otherIndex + 1),
      ];
      return newOtherCalls;
    });
  };

  const saveEditedOtherCalls = async () => {
    try {
      const shootingCopy = { ...thisShooting };
      shootingCopy.otherCalls = otherCalls;
      setThisShooting(shootingCopy as ShootingDocType);
      await oneWrapDb?.shootings.upsert(shootingCopy);
      successToast('Other Calls saved');
    } catch (error) {
      errorToast('Error saving Other Calls');
      throw error;
    }
  };

  const editPictureCar = <K extends keyof PictureCar>(
    pictureCarIndex: number,
    pictureCarKey: K,
    newValue: any,
    type: string,
  ) => {
    setPictureCars((prevPictureCars) => {
      const editedPictureCar = JSON.parse(JSON.stringify(prevPictureCars[pictureCarIndex]));

      editedPictureCar[pictureCarKey] = newValue;

      const newPictureCars = [
        ...prevPictureCars.slice(0, pictureCarIndex),
        editedPictureCar,
        ...prevPictureCars.slice(pictureCarIndex + 1),
      ];

      return newPictureCars;
    });
  };

  const saveEditedPictureCars = async () => {
    try {
      const shootingCopy = { ...thisShooting };
      shootingCopy.pictureCars = pictureCars;

      setThisShooting(shootingCopy as ShootingDocType);

      await oneWrapDb?.shootings.upsert(shootingCopy);
      successToast('Picture Cars saved');
    } catch (error) {
      errorToast('Error saving Picture Cars');
      throw error;
    }
  };

  const saveEdition = () => {
    switch (view) {
      case 'pictureCars':
        saveEditedPictureCars();
        break;
      case 'cast':
        saveEditedCastCalls();
        break;
      case 'extras':
        saveEditedExtraCalls();
        break;
      case 'others':
        saveEditedOtherCalls();
        break;
    }
    setEditMode(false);
  };

  const fetchCastCalls = async () => {
    try {
      const shootings: any = await oneWrapDb?.shootings.find({ selector: { id: shootingId } }).exec();
      setThisShooting(shootings[0]._data);
      const scenesInShoot = shootings[0]._data.scenes;
      const scenesIds = scenesInShoot.map((scene: any) => parseInt(scene.sceneId));
      const scenes = await oneWrapDb?.scenes.find({ selector: { sceneId: { $in: scenesIds } } }).exec() || [];

      const getNumberScenesByCast = (castName: string) => scenes.filter((scene: any) => {
        const characters = scene._data.characters || [];
        return characters.some((character: any) => normalizeString(character.characterName) === normalizeString(castName));
      }).length.toString() || '--';

      const characterNames = [...new Set(scenes.flatMap((scene: { _data: SceneDocType; }) => (scene._data.characters || []).map((character: Character) => character.characterName && normalizeString(character.characterName.toLowerCase()))))];

      const talents = await oneWrapDb?.talents.find({}).exec() || [];
      const castTalents = talents.filter((talent: Talent) => characterNames.includes(normalizeString(talent.castName)));

      const getCallInfo = (castName: string) => {
        const shootingCalls = shootings[0]._data.castCalls;
        const callInfo = shootingCalls.find((call: any) => normalizeString(call.castName) === normalizeString(castName));
        return callInfo;
      };

      const uniqueCastCalls = new Map();

      setScenesInShoot(scenes);

      scenes.forEach((scene: { _data: SceneDocType }) => {
        if (scene._data.characters) {
          scene._data.characters.forEach((character: Character) => {
            const key = character.characterName ? character.characterName.toLowerCase() : '';
            if (!uniqueCastCalls.has(key)) {
              const talentCallInfo = character.characterName ? getCallInfo(character.characterName) : undefined;
              const talent = castTalents.find((talent: any) => talent.castName.toLowerCase() === key);
              uniqueCastCalls.set(key, {
                cast: `${character.characterNum ? (`${character.characterNum}.`) : ''} ${character.characterName}`,
                name: `${talent?.name || ''} ${talent?.lastName || ''}`,
                tScn: character.characterName ? getNumberScenesByCast(character.characterName) : '--',
                pickUp: talentCallInfo?.pickUp || '--',
                callTime: talentCallInfo?.callTime || '--',
                onMakeUp: talentCallInfo?.onMakeUp || '--',
                onWardrobe: talentCallInfo?.onWardrobe || '--',
                readyToShoot: talentCallInfo?.readyToShoot || '--',
                notes: talentCallInfo?.notes || '',
                castName: character.characterName || '',
                category: talent?.castCategory || '',
              });
            }
          });
        }
      });

      setCastCalls(Array.from(uniqueCastCalls.values()) as any);

      const { extraCalls } = shootings[0]._data;
      setExtraCalls(extraCalls);

      const { crewCalls } = shootings[0]._data;
      setCrewCalls(crewCalls);

      const { otherCalls } = shootings[0]._data;
      setOtherCalls(otherCalls);

      const { pictureCars } = shootings[0]._data;
      setPictureCars(pictureCars);
    } catch (err) {
      errorToast('Error fetching Cast Calls');
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'cast':
        return (
          <CastView
            castData={castCalls}
            addNewModalIsOpen={addNewCastCallModalIsOpen}
            setIsOpen={setAddNewCastCallModalIsOpen}
            editMode={editMode && view === 'cast'}
            addNewCastCall={createNewCastCall}
            castOptions={castOptions}
            editCastCall={editCastCall}
            permissionType={permissionType}
            searchText={searchText}
          />
        );
      case 'extras':
        return (
          <ExtraView
            extraViewData={extraCalls}
            editMode={editMode && view === 'extras'}
            addNewModalIsOpen={addNewExtraCAllModalIsOpen}
            setAddNewModalIsOpen={setAddNewExtraCAllModalIsOpen}
            addNewExtraCall={createNewExtraCall}
            editExtraCall={editExtraCall}
            permissionType={permissionType}
            searchText={searchText}
          />
        );
      case 'pictureCars':
        return (
          <PictureCars
            pictureCars={pictureCars}
            isOpen={addNewPictureCarModalIsOpen}
            setIsOpen={setAddNewPictureCarModalIsOpen}
            addNewPictureCar={createNewPictureCar}
            editMode={editMode && view === 'pictureCars'}
            editPictureCar={editPictureCar}
            permissionType={permissionType}
            searchText={searchText}
          />
        );
      case 'others':
        return (
          <OtherCalls
            otherCalls={otherCalls}
            isOpen={addNewOtherCallModalIsOpen}
            setIsOpen={setAddNewOtherCallModalIsOpen}
            addNewOtherCall={createNewOtherCall}
            editMode={editMode && view === 'others'}
            editOtherCall={editOtherCall}
            permissionType={permissionType}
            searchText={searchText}
          />
        );
      case 'crew':
        return <CrewView crewCalls={crewCalls} editMode={editMode && view === 'crew'} setCrewCalls={setCrewCalls} searchText={searchText} openCopyCrewModal={addNewCrewCallModalIsOpen} setOpenCopyCrewModal={(ev: boolean) => setAddNewCrewCallModalIsOpen(ev)} />;
      default:
        return <ExploreContainer name="Default Content" />;
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const createNewExtraCall = async (formData: any): Promise<void> => {
    try {
      const quantity = formData.quantity ? parseInt(formData.quantity.toString()) : 0;
      const shootingIdInt = shootingId ? parseInt(shootingId) : 0;

      const pickUp = formData.pickUp && timeToISOString({
        hours: formData.pickUp.split(':')[0],
        minutes: formData.pickUp.split(':')[1],
      }, thisShooting?.shootDate || '');

      const callTime = formData.callTime && timeToISOString({
        hours: formData.callTime.split(':')[0],
        minutes: formData.callTime.split(':')[1],
      }, thisShooting?.shootDate || '');

      const onMakeUp = formData.onMakeUp && timeToISOString({
        hours: formData.onMakeUp.split(':')[0],
        minutes: formData.onMakeUp.split(':')[1],
      }, thisShooting?.shootDate || '');

      const onWardrobe = formData.onWardrobe && timeToISOString({
        hours: formData.onWardrobe.split(':')[0],
        minutes: formData.onWardrobe.split(':')[1],
      }, thisShooting?.shootDate || '');

      const readyToShoot = formData.readyToShoot && timeToISOString({
        hours: formData.readyToShoot.split(':')[0],
        minutes: formData.readyToShoot.split(':')[1],
      }, thisShooting?.shootDate || '');

      const arrived = formData.arrived && timeToISOString({
        hours: formData.arrived.split(':')[0],
        minutes: formData.arrived.split(':')[1],
      }, thisShooting?.shootDate || '');

      const wrap = formData.wrap && timeToISOString({
        hours: formData.wrap.split(':')[0],
        minutes: formData.wrap.split(':')[1],
      }, thisShooting?.shootDate || '');

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
        quantity,
        extraName: formData.extraName || '',
        talentAgency: formData.talentAgency || '',
        notes: formData.notes || '',
      };

      const shootingCopy = { ...thisShooting };
      shootingCopy.extraCalls = [...(shootingCopy.extraCalls || []), newExtraCall];

      setThisShooting(shootingCopy as ShootingDocType);

      await oneWrapDb?.shootings.upsert(shootingCopy);
      setExtraCalls([...extraCalls, newExtraCall]);
      successToast('Extra Call created');
    } catch (error) {
      errorToast('Error creating Extra Call');
      throw error;
    }
  };

  const createNewPictureCar = async (formData: any): Promise<void> => {
    try {
      const quantity = formData.quantity ? parseInt(formData.quantity.toString()) : 0;
      const shootingIdInt = shootingId ? parseInt(shootingId) : 0;

      const callTime = formData.callTime && timeToISOString({
        hours: formData.callTime.split(':')[0],
        minutes: formData.callTime.split(':')[1],
      }, thisShooting?.shootDate || '');

      const newPictureCar: PictureCar = {
        id: '',
        pictureCarId: 0,
        pictureCarName: formData.pictureCarName || '',
        quantity,
        callTime: callTime || '',
      };

      const shootingCopy = { ...thisShooting };
      shootingCopy.pictureCars = [...(shootingCopy.pictureCars || []), newPictureCar];

      setThisShooting(shootingCopy as ShootingDocType);

      await oneWrapDb?.shootings.upsert(shootingCopy);
      setPictureCars([...pictureCars, newPictureCar]);
      successToast('Picture Car created');
    } catch (error) {
      errorToast('Error creating Picture Car');
      throw error;
    }
  };

  const createNewOtherCall = async (formData: any): Promise<void> => {
    try {
      const quantity = formData.quantity ? parseInt(formData.quantity.toString()) : 0;
      const shootingIdInt = shootingId ? parseInt(shootingId) : 0;

      const callTime = formData.callTime && timeToISOString({
        hours: formData.callTime.split(':')[0],
        minutes: formData.callTime.split(':')[1],
      }, thisShooting?.shootDate || '');

      const newOtherCall: OtherCall = {
        id: '',
        otherCallId: 0,
        callTime: callTime || '',
        otherCallName: formData.otherCallName || '',
        quantity,
      };

      const shootingCopy = { ...thisShooting };
      shootingCopy.otherCalls = [...(shootingCopy.otherCalls || []), newOtherCall];

      setThisShooting(shootingCopy as ShootingDocType);

      await oneWrapDb?.shootings.upsert(shootingCopy);
      setOtherCalls([...otherCalls, newOtherCall]);
      successToast('Other Call created');
    } catch (error) {
      errorToast('Error creating Other Call');
      throw error;
    }
  };

  const createNewCastCall = async (formData: any): Promise<void> => {
    try {
      const shootingIdInt = shootingId ? parseInt(shootingId) : 0;

      const callTime = formData.callTime && timeToISOString({
        hours: formData.callTime.split(':')[0],
        minutes: formData.callTime.split(':')[1],
      }, thisShooting?.shootDate || '');

      const arrived = formData.arrived && timeToISOString({
        hours: formData.arrived.split(':')[0],
        minutes: formData.arrived.split(':')[1],
      }, thisShooting?.shootDate || '');

      const onMakeUp = formData.onMakeUp && timeToISOString({
        hours: formData.onMakeUp.split(':')[0],
        minutes: formData.onMakeUp.split(':')[1],
      }, thisShooting?.shootDate || '');

      const onWardrobe = formData.onWardrobe && timeToISOString({
        hours: formData.onWardrobe.split(':')[0],
        minutes: formData.onWardrobe.split(':')[1],
      }, thisShooting?.shootDate || '');

      const readyToShoot = formData.readyToShoot && timeToISOString({
        hours: formData.readyToShoot.split(':')[0],
        minutes: formData.readyToShoot.split(':')[1],
      }, thisShooting?.shootDate || '');

      const wrap = formData.wrap && timeToISOString({
        hours: formData.wrap.split(':')[0],
        minutes: formData.wrap.split(':')[1],
      }, thisShooting?.shootDate || '');

      const pickUp = formData.pickUp && timeToISOString({
        hours: formData.pickUp.split(':')[0],
        minutes: formData.pickUp.split(':')[1],
      }, thisShooting?.shootDate || '');

      const dropOff = formData.dropOff && timeToISOString({
        hours: formData.dropOff.split(':')[0],
        minutes: formData.dropOff.split(':')[1],
      }, thisShooting?.shootDate || '');

      const mealIn = formData.mealIn && timeToISOString({
        hours: formData.mealIn.split(':')[0],
        minutes: formData.mealIn.split(':')[1],
      }, thisShooting?.shootDate || '');

      const mealOut = formData.mealOut && timeToISOString({
        hours: formData.mealOut.split(':')[0],
        minutes: formData.mealOut.split(':')[1],
      }, thisShooting?.shootDate || '');

      const mealExtraIn = formData.mealExtraIn && timeToISOString({
        hours: formData.mealExtraIn.split(':')[0],
        minutes: formData.mealExtraIn.split(':')[1],
      }, thisShooting?.shootDate || '');

      const mealExtraOut = formData.mealExtraOut && timeToISOString({
        hours: formData.mealExtraOut.split(':')[0],
        minutes: formData.mealExtraOut.split(':')[1],
      }, thisShooting?.shootDate || '');

      const { cast } = formData;

      const character: Character = scenesInShoot.flatMap((scene: any) => scene._data.characters).find((character: any) => character.characterName && normalizeString(character.characterName) === normalizeString(cast.castName));

      const characterNum = character?.characterNum;

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
        wrapSet: formData.wrapSet || '',
      };

      const shootingCopy = { ...thisShooting };
      shootingCopy.castCalls = [...(shootingCopy.castCalls || []), newCastCall];

      setThisShooting(shootingCopy as ShootingDocType);

      await oneWrapDb?.shootings.upsert(shootingCopy);
      const formattedCastCall = {
        ...newCastCall,
        cast: `${cast.castName}`,
      };

      setCastCalls([...castCalls, formattedCastCall].sort((a, b) => a.cast.localeCompare(b.cast)));
      successToast('Cast Call created');
    } catch (error) {
      errorToast('Error creating Cast Call');
      throw error;
    }
  };

  const editButton = () => {
    return (
      thisShooting && thisShooting.status !== ShootingStatusEnum.Closed && (
        <div slot="end">
          {
            !editMode && (
              <AddButton onClick={() => openAddNewModal()} disabled={false} />
            )
          }
          {
            !editMode ? (
              <>
                <IonButton fill="clear" color={!editMode ? 'light' : 'success'} onClick={() => toggleEditMode()} disabled={false} className='ion-no-padding toolbar-button'>
                  <VscEdit className="toolbar-icon"/>
                </IonButton>
              </>
            ) : (
              <>
                <IonButton className="outline-success-button-small" onClick={() => saveEdition()} disabled={false}>
                  SAVE
                </IonButton>
                <IonButton className="outline-danger-button-small" onClick={() => toggleEditMode()}>
                  CANCEL
                </IonButton>
              </>
            )
          }
        </div>
      )
    );
  }


  if (!isSection) {
    return (
      <>
        <IonHeader>
          <Toolbar
            name={`${view.toUpperCase()} CALL TIME`}
            logoutIcon={false}
            search={true}
            searchMode={searchMode}
            setSearchMode={setSearchMode}
            searchText={searchText}
            setSearchText={setSearchText}
            customButtons={[editButton as any]}
          />
        </IonHeader>
        <IonContent color="tertiary" fullscreen className='fade-in'>
          <div className="ion-flex">
            <div
              style={!useIsMobile() ? { width: '150px' } : {}}
              className="ion-flex ion-align-items-center ion-padding"
            >
              <ShootingInfoLabels
                isEditable={false}
                title="general call"
                info={getHourMinutesFomISO(thisShooting?.generalCall || '', true)}
              />
            </div>
            <div
              style={!useIsMobile() ? { width: '150px' } : {}}
              className="ion-flex ion-align-items-center ion-padding"
            >
              <ShootingInfoLabels
                isEditable={false}
                title="ready to shoot"
                info={getHourMinutesFomISO(thisShooting?.onSet || '', true)}
              />
            </div>
          </div>
          {renderContent()}
        </IonContent>
        <CallSheetTabs view={view} setView={setView} handleBack={useHandleBack()} />
      </>
    );
  }
  const [open, setOpen] = useState(true);
  return (
    <>
      <div
        className="ion-flex ion-justify-content-between ion-padding-start"
        style={{
          border: '1px solid black',
          backgroundColor: 'var(--ion-color-dark)',
          alignItems: 'center',
        }}
      >
        <p style={{ fontSize: '18px' }}><b>CALL SHEET</b></p>
        <div onClick={(e) => e.stopPropagation()} className="ion-flex ion-align-items-center">
          {/* BUTTON FOR EVERY VIEW */}
          {
            !editMode && (
              <>
                <button
                  onClick={() => setView('cast')}
                  className={`section-button ${view === 'cast' ? 'active' : ''}`}
                >
                  Cast
                </button>
                <button
                  onClick={() => setView('extras')}
                  className={`section-button ${view === 'extras' ? 'active' : ''}`}
                >
                  Extras
                </button>
                <button
                  onClick={() => setView('pictureCars')}
                  className={`section-button ${view === 'pictureCars' ? 'active' : ''}`}
                >
                  Cars
                </button>
                <button
                  onClick={() => setView('others')}
                  className={`section-button ${view === 'others' ? 'active' : ''}`}
                >
                  Others
                </button>
              </>
            )
          }
          {
            !editMode ? (
              <IonButton
                fill="clear"
                color={!editMode ? 'light' : 'success'}
                onClick={() => toggleEditMode()}
                style={{
                  marginBottom: '12px',
                }}
              >
                <VscEdit />
              </IonButton>
            ) : (
              <div className="ion-flex ion-align-items-center">
                <IonButton className="outline-success-button-small" onClick={saveEdition}>
                  SAVE
                </IonButton>
                <IonButton className="outline-danger-button-small" onClick={toggleEditMode}>
                  CANCEL
                </IonButton>
              </div>
            )
          }
        </div>
      </div>
      {open && renderContent()}
    </>
  );
};

export default CallSheet;
