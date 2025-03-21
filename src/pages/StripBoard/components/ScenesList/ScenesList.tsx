import React, { useCallback, useContext, useMemo, useState } from 'react';
import DragAndDropBox from '../../../../Shared/Components/organizers/DragAndDropBox/DragAndDropBox';
import SceneCard from '../../../../Shared/Components/cards/SceneCard/SceneCard';
import { SceneDocType } from '../../../../Shared/types/scenes.types';
import { SearchToolbarButtonProps } from '../../../../Shared/Components/buttons/SearchToolbarButton/SearchToolbarButton';
import { StripboardContext } from '../../context/StripboardContext/StripboardContext';
import DraggableItem from '../../../../Shared/Components/organizers/DragAndDropBox/Components/DraggableItem/DraggableItem';
import { StripboardDetailContext } from '../StripboardModal/Context/StripboardDetailContext';
import DropArea from '../../../../Shared/Components/organizers/DragAndDropBox/Components/DropArea/DropArea';

interface ScenesListProps {
  scenes: SceneDocType[];
  scenesToDisplay: number;
  listId: string;
  children?: React.ReactNode;
  sectionToolbar?: (search?: SearchToolbarButtonProps) => React.ReactNode;
  dayNumber?: number;
  unitId?: number;
}

const ScenesList: React.FC<ScenesListProps> = ({
  scenes,
  scenesToDisplay,
  listId,
  children,
  sectionToolbar,
  unitId,
  dayNumber
}) => {
  const { displayOptions } = useContext(StripboardContext);
  const [searchText, setSearchText] = useState<string>('');
  const [searchMode, setSearchMode] = useState<boolean>(false);

  const { setActiveScene, updateStripboardHasScenes } = useContext(StripboardDetailContext);
  
  const filteredScenes = useMemo(() => {
    if (!searchText) return scenes.slice(0, scenesToDisplay);
    
    return scenes
      .slice(0, scenesToDisplay);
  }, [scenes, scenesToDisplay, searchText]);

  interface OnDropParams {
    sceneId: string | number;
    index: number;
  }

  const onDrop = ({ sceneId, index }: OnDropParams) => {
    if (!unitId) return;
    if (!dayNumber) return;
    if (!sceneId) return;
    console.log(`${sceneId} dropped at index ${index} from ${unitId ? `unit ${unitId}` : `not included scenes`} at ${unitId ? `unit ${unitId}` : `not included scenes`}`);
    updateStripboardHasScenes(sceneId, dayNumber, unitId, index);
  };
  
  return (
    <DragAndDropBox
      onItemMove={() => {}}
      listId={listId}
      className={`scenes-list scenes-list-${listId}`}
      style={{ padding: '6px', height: 'auto', minHeight: '100%', scrollbarWidth: 'none' }}
      scrollInfiniteComponent={children}
    >
      {sectionToolbar && sectionToolbar({
        search: true,
        searchMode,
        toggleSearchMode: () => setSearchMode(prev => !prev),
        searchText,
        handleSearchInput: (e: CustomEvent) => setSearchText(e.detail.value!)
      })}
    
      {filteredScenes.map((scene, index) => (
        <React.Fragment key={`${scene.id}`}>
        {index === 0 && <DropArea itemId={scene.id as string} onDrop={() => onDrop({
          sceneId: scene.id as string,
          index: 0
        })} />}
        <DraggableItem
          key={scene.id}
          itemId={scene.sceneId!}
          elementPosition={index}
          setActiveElement={setActiveScene as any}
          onDrop={(itemId, elementPosition) => onDrop({ sceneId: itemId, index: elementPosition })}
        >
          <SceneCard
            scene={scene}
            displayOptions={displayOptions}
            goToDetail={false}
          />
        </DraggableItem>
        </React.Fragment>
      ))}
    </DragAndDropBox>
  );
};

export default ScenesList;