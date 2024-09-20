import {
  IonCol,
  IonContent, IonGrid, IonHeader, IonItem, IonLabel, IonModal,
  IonRow,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import React, { useRef, useState, useMemo } from 'react';
import useIsMobile from '../../hooks/Shared/useIsMobile';
import OutlinePrimaryButton from '../../components/Shared/OutlinePrimaryButton/OutlinePrimaryButton';
import OutlineLightButton from '../../components/Shared/OutlineLightButton/OutlineLightButton';
import './InputModalScene.scss';
import ModalToolbar from '../../components/Shared/ModalToolbar/ModalToolbar';
import { Scene } from '../../interfaces/scenesTypes';
import CustomSelect from '../../components/Shared/CustomSelect/CustomSelect';

interface InputModalProps {
  sceneName: string;
  listOfScenes: Scene[];
  modalTrigger?: string;
  handleCheckboxToggle: (scene: Scene) => void;
  selectedScenes: Scene[];
  setSelectedScenes?: any;
  clearSelections: () => void;
  multipleSelections?: boolean;
  canCreateNew?: boolean;
  editMode?: boolean;
  sceneCategory?: string;
  existentScenes?: any[];
  modalRef: React.RefObject<HTMLIonModalElement>;
}

const InputModalScene: React.FC<InputModalProps> = ({
  sceneName,
  listOfScenes,
  modalTrigger,
  handleCheckboxToggle,
  clearSelections,
  modalRef,
}) => {
  const [selectedOption, setSelectedOption] = useState<Scene | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<string>('');

  const isMobile = useIsMobile();

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.dismiss();
    }
    setSelectedEpisode('');
  };

  const filteredScenes = useMemo(() => {
    if (!selectedEpisode) return [];
    return listOfScenes.filter((scene: Scene) => scene.episodeNumber === selectedEpisode);
  }, [listOfScenes, selectedEpisode]);

  function getSceneHeader(scene: Scene) {
    const episodeNumber = scene.episodeNumber || '';
    const sceneNumber = scene.sceneNumber || '';
    const intOrExt = scene.intOrExtOption || '';
    const locationName = scene.locationName || '';
    const setName = scene.setName || '';
    const dayOrNight = scene.dayOrNightOption || '';
    const scriptDay = scene.scriptDay || '';
    const year = scene.year || '';

    const sceneHeader = `${parseInt(episodeNumber) > 0 ? (`${episodeNumber}.`) : ''}${sceneNumber} ${intOrExt ? (`${intOrExt}.`) : ''} ${locationName ? (`${locationName}.`) : ''} ${setName}-${dayOrNight}${scriptDay} ${year ? `(${
      year})` : ''}`;

    return sceneHeader.toUpperCase();
  }

  const getUniqueEpisodes = () => {
    const episodes = new Set(listOfScenes.map((scene) => scene.episodeNumber).filter((episode) => episode !== null && episode !== undefined));
    return Array.from(episodes).map((episode: any) => ({ value: episode, label: episode })).sort((a, b) => parseInt(a.value) - parseInt(b.value));
  };

  const episodeInput = {
    fieldName: 'episode',
    label: 'Select episode',
    placeholder: 'Select episode',
    selectOptions: getUniqueEpisodes(),
  };

  const sceneInput = {
    fieldName: 'scene',
    label: 'Select a scene',
    placeholder: 'Select a scene',
    selectOptions: filteredScenes.map((scene: Scene) => ({
      value: scene,
      label: getSceneHeader(scene),
    })),
  };

  const saveOption = () => {
    if (selectedOption) {
      handleCheckboxToggle(selectedOption);
      console.log(selectedOption);
      closeModal();
    }
  };

  return (
    <IonModal ref={modalRef} trigger={modalTrigger} id="add-scenes-scenes-modal">
      <IonHeader>
        <ModalToolbar
          handleSave={closeModal}
          toolbarTitle={sceneName}
          handleReset={clearSelections}
          handleBack={closeModal}
          showReset={false}
        />
      </IonHeader>
      <IonContent color="tertiary">
        <>
          <IonGrid className="inputs-grid">
            <IonRow>
              <IonCol size="6">
                <IonItem color="tertiary">
                  <CustomSelect
                    input={episodeInput}
                    setNewOptionValue={(fieldName, value) => setSelectedEpisode(value)}
                    enableSearch
                  />
                </IonItem>
              </IonCol>
              <IonCol size="6">
                <IonItem color="tertiary">
                  <CustomSelect
                    input={sceneInput}
                    setNewOptionValue={(fieldName, value: Scene) => {
                      setSelectedOption(value || null);
                    }}
                    enableSearch
                  />
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
          <OutlinePrimaryButton
            buttonName="SAVE"
            onClick={saveOption}
            className="ion-margin modal-confirm-button"
          />
          {isMobile && (
            <OutlineLightButton
              buttonName="CANCEL"
              onClick={saveOption}
              className="ion-margin cancel-input-modal-button cancel-button"
            />
          )}
        </>
      </IonContent>
    </IonModal>
  );
};

export default InputModalScene;
