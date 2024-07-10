import {
  IonContent, IonHeader, IonModal,
} from '@ionic/react';
import React, { useRef, useState, useMemo } from 'react';
import useIsMobile from '../../hooks/useIsMobile';
import OutlinePrimaryButton from '../../components/Shared/OutlinePrimaryButton/OutlinePrimaryButton';
import OutlineLightButton from '../../components/Shared/OutlineLightButton/OutlineLightButton';
import './InputModalScene.scss';
import ModalSearchBar from '../../components/Shared/ModalSearchBar/ModalSearchBar';
import removeNumberAndDot from '../../utils/removeNumberAndDot';
import ModalToolbar from '../../components/Shared/ModalToolbar/ModalToolbar';
import { Scene } from '../../interfaces/scenesTypes';
import ScenesCheckboxList from '../ScenesCheckboxList/ScenesCheckboxList';
import ScrollInfiniteContext from '../../context/ScrollInfiniteContext';

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
  selectedScenes,
  clearSelections,
  multipleSelections = true,
  canCreateNew = false,
}) => {
  const [searchText, setSearchText] = useState('');
  const [createNewMode, setCreateNewMode] = useState(false);
  const [displayedScenes, setDisplayedScenes] = useState<Scene[]>([]);

  const modalRef = useRef<HTMLIonModalElement>(null);
  const isMobile = useIsMobile();

  const clearSearchTextModal = () => {
    setSearchText('');
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.dismiss();
    }
    setSearchText('');
  };

  const filteredScenes = useMemo(() => {
    if (!searchText) return listOfScenes;
    
    const searchLower = searchText.toLowerCase();
    return listOfScenes.filter((scene: Scene) => {
      return Object.values(scene).some(value => {
        if (typeof value === 'string') {
          return removeNumberAndDot(value).toLowerCase().includes(searchLower);
        }
        if (typeof value === 'number') {
          return value.toString().includes(searchLower);
        }
        return false;
      });
    });
  }, [listOfScenes, searchText]);

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
        <ModalSearchBar searchText={searchText} setSearchText={setSearchText} showSearchBar={listOfScenes.length > 10} />
        <ScrollInfiniteContext
          setDisplayedData={setDisplayedScenes}
          filteredData={filteredScenes}
        >
          {searchText.length > 0 && filteredScenes.length === 0 && (
            <p className="no-items-message">
              There are no coincidences. Do you want to{' '}
              <span onClick={() => setSearchText('')} style={{ color: 'var(--ion-color-primary)' }}>
                reset{' '}
              </span>
              ?
            </p>
          )}
          <ScenesCheckboxList
            listOfScenes={displayedScenes}
            selectedScenes={selectedScenes}
            handleCheckboxToggle={handleCheckboxToggle}
            multipleSelections={multipleSelections}
            searchText={searchText}
            uncheckedFilteredScenes={displayedScenes.filter(scene => !selectedScenes.some(s => s.id === scene.id))}
            checkedSelectedScenes={displayedScenes.filter(scene => selectedScenes.some(s => s.id === scene.id))}
            isSceneChecked={(scene: Scene) => selectedScenes.some((selectedScene: any) => selectedScene.id === scene.id)}
          />
          {filteredScenes.length === 0 && canCreateNew && (
            <p className="no-items-message">
              There are no coincidences. Do you want to create a new one ?
              <span className="no-items-buttons-container ion-flex ion-justify-content-center ion-align-items-center">
                <OutlinePrimaryButton buttonName="CREATE NEW" className="ion-margin no-items-confirm" onClick={() => setCreateNewMode(true)} />
                <OutlineLightButton buttonName="CANCEL" className="ion-margin cancel-button no-items-cancel" onClick={clearSearchTextModal} />
              </span>
            </p>
          )}
          {filteredScenes.length > 0 && (
            <OutlinePrimaryButton buttonName="SAVE" onClick={closeModal} className="ion-margin modal-confirm-button" />
          )}
          {isMobile && filteredScenes.length > 0 && (
            <OutlineLightButton
              buttonName="CANCEL"
              onClick={closeModal}
              className="ion-margin cancel-input-modal-button cancel-button"
            />
          )}
        </ScrollInfiniteContext>
      </IonContent>
    </IonModal>
  );
};

export default InputModalScene;