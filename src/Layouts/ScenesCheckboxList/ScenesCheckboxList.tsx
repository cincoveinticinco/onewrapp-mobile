import React from 'react';
import { IonCheckbox, IonList } from '@ionic/react';
import useIsMobile from '../../hooks/useIsMobile';
import './ScenesCheckboxList.scss';
import { Scene } from '../../interfaces/scenesTypes';
import SceneCard from '../../components/Strips/SceneCard';
import HighlightedText from '../../components/Shared/HighlightedText/HighlightedText';

interface ScenesCheckboxListProps {
  listOfScenes: Scene[];
  selectedScenes: Scene[];
  handleCheckboxToggle: (scene: Scene) => void;
  isSceneChecked: (scene: Scene) => boolean;
  multipleSelections: boolean;
  searchText: string;
  uncheckedFilteredScenes:  Scene[];
  checkedSelectedScenes: Scene[];
}

const ScenesCheckboxList: React.FC<ScenesCheckboxListProps> = ({
  listOfScenes,
  handleCheckboxToggle,
  isSceneChecked,
  multipleSelections,
  searchText,
  uncheckedFilteredScenes,
  checkedSelectedScenes,
}) => {
  const isMobile = useIsMobile();
  
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


  const getListStyles = () => {
    if (uncheckedFilteredScenes.length === 0 && listOfScenes.length > 10) {
      return { border: 'none', outline: 'none', marginTop: '100px' };
    }

    if (listOfScenes.length > 10) {
      return { marginTop: '100px' };
    }

    if (uncheckedFilteredScenes.length === 0 && listOfScenes.length <= 10) {
      return {};
    }

    return {};
  };

  return (
    <IonList color="tertiary" className="ion-no-padding ion-margin scenes-list" style={getListStyles()}>
      {uncheckedFilteredScenes.map((scene: Scene, i: number) => (
        <div
          color="tertiary"
          key={`filter-item-${i}`}
          className="checkbox-item-option filter-item ion-no-margin ion-no-padding"
          onClick={() => handleCheckboxToggle(scene)}
        >
          <IonCheckbox
            slot="start"
            className="ion-no-margin ion-no-padding checkbox-option"
            labelPlacement="end"
            checked={isSceneChecked(scene)}
            disabled={!multipleSelections && checkedSelectedScenes.length > 0}
          >
            <HighlightedText text={getSceneHeader(scene)} searchTerm={searchText} />
          </IonCheckbox>
        </div>
      ))}
    </IonList>
  );
};

export default ScenesCheckboxList;
