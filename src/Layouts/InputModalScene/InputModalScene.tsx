import {
  IonCol,
  IonContent, IonGrid, IonHeader, IonItem, IonLabel, IonModal,
  IonRow,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import React, { useRef, useState, useMemo } from 'react';
import useIsMobile from '../../hooks/useIsMobile';
import OutlinePrimaryButton from '../../components/Shared/OutlinePrimaryButton/OutlinePrimaryButton';
import OutlineLightButton from '../../components/Shared/OutlineLightButton/OutlineLightButton';
import './InputModalScene.scss';
import ModalToolbar from '../../components/Shared/ModalToolbar/ModalToolbar';
import { Scene } from '../../interfaces/scenesTypes';

interface InputModalProps {
  sceneName: string;
  listOfScenes: Scene[];
  modalTrigger: string;
  handleCheckboxToggle: (scene: Scene) => void;
  selectedScenes: Scene[];
  setSelectedScenes?: any;
  clearSelections: () => void;
  multipleSelections?: boolean;
  canCreateNew?: boolean;
  editMode?: boolean;
  sceneCategory?: string;
  existentScenes?: any[];
}

const InputModalScene: React.FC<InputModalProps> = ({
  sceneName,
  listOfScenes,
  modalTrigger,
  handleCheckboxToggle,
  clearSelections,
}) => {
  const [selectedOption, setSelectedOption] = useState<Scene | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<string>('');

  const modalRef = useRef<HTMLIonModalElement>(null);
  const isMobile = useIsMobile();

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.dismiss();
    }
    setSelectedEpisode('');
  };

  const filteredScenes = useMemo(() => {
    if (!selectedEpisode) return [];
    return listOfScenes.filter((scene: Scene) => 
      scene.episodeNumber === selectedEpisode
    );
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
    const episodes = new Set(listOfScenes.map(scene => scene.episodeNumber).filter(episode => episode !== null && episode !== undefined));
    return Array.from(episodes);
  }

  const saveOption = () => {
    if (selectedOption) {
      handleCheckboxToggle(selectedOption);
      console.log(selectedOption);
      closeModal();
    }
  }

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
          <IonGrid>
            <IonRow>
              <IonCol size="6">
                <IonItem color='tertiary'>
                  <IonSelect
                    value={selectedEpisode}
                    placeholder="Select episode"
                    onIonChange={(e) => setSelectedEpisode(e.detail.value)}
                    interface="popover"
                    label='Select episode'
                    labelPlacement='stacked'
                  >
                    {
                      getUniqueEpisodes().map((episode: any) => (
                        <IonSelectOption key={episode} value={episode}>
                          {episode}
                        </IonSelectOption>
                      ))
                    }
                  </IonSelect>
                </IonItem>
              </IonCol>
              <IonCol size='6'>
                <IonItem color='tertiary'>
                  <IonSelect
                    value={selectedOption}
                    placeholder="Select a scene"
                    label='Select a scene'
                    labelPlacement='stacked'
                    onIonChange={(e) => setSelectedOption(e.detail.value)}
                    interface="popover"
                    disabled={!selectedEpisode}
                  >
                    {
                      filteredScenes.map((scene: Scene) => (
                        <IonSelectOption key={scene.id} value={scene}>
                          {getSceneHeader(scene)}
                        </IonSelectOption>
                      ))
                    }
                  </IonSelect>
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