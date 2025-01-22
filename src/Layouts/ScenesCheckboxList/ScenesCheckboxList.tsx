import { IonCheckbox, IonList } from '@ionic/react';
import React from 'react';
import HighlightedText from '../../Shared/Components/HighlightedText/HighlightedText';
import useIsMobile from '../../Shared/hooks/useIsMobile';
import { SceneDocType } from '../../Shared/types/scenes.types';
import './ScenesCheckboxList.scss';

interface ScenesCheckboxListProps {
  listOfScenes: SceneDocType[];
  selectedScenes: SceneDocType[];
  handleCheckboxToggle: (scene: SceneDocType) => void;
  isSceneChecked: (scene: SceneDocType) => boolean;
  multipleSelections: boolean;
  searchText: string;
  uncheckedFilteredScenes: SceneDocType[];
  checkedSelectedScenes: SceneDocType[];
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

  function getSceneHeader(scene: SceneDocType) {
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
      {uncheckedFilteredScenes.map((scene: SceneDocType, i: number) => (
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
