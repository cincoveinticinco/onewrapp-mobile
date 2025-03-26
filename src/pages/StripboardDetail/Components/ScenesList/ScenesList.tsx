import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import DragAndDropBox from '../../../../Shared/Components/organizers/DragAndDropBox/DragAndDropBox';
import SceneCard from '../../../../Shared/Components/cards/SceneCard/SceneCard';
import { SceneDocType } from '../../../../Shared/types/scenes.types';
import { SearchToolbarButtonProps } from '../../../../Shared/Components/buttons/SearchToolbarButton/SearchToolbarButton';
import DraggableItem from '../../../../Shared/Components/organizers/DragAndDropBox/Components/DraggableItem/DraggableItem';
import { StripboardDetailContext } from '../../Context/StripboardDetailContext';
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
  const { displayOptions, setSearchText, searchText } = useContext(StripboardDetailContext);
  const [searchMode, setSearchMode] = useState<boolean>(false);

  const { setActiveScene, updateStripboardHasScenes, activeScene, deleteStripboardHasScene } = useContext(StripboardDetailContext);

  const isNotIncludedScenesList = !dayNumber || !unitId;

  const [scenesCopy, setScenesCopy] = useState<SceneDocType[]>([]);

  useEffect(() => {
    setScenesCopy(scenes);
  }, [scenes]);

  const filteredScenes = useMemo(() => {

    return scenes
      .slice(0, scenesToDisplay);
  }, [scenesCopy, scenesToDisplay]);

  interface OnDropParams {
    index?: number;
  }

  const onDrop = (params?: OnDropParams) => {
    const { index } = params || {};
    // if there are not dayNumber or unitId, it means is the not included scenes list. Drop an scene here, means we should delete it from stripboardHasScenes array in the stripboard document.
    if (isNotIncludedScenesList && activeScene) {
      console.log('deleteStripboardHasScene');
      deleteStripboardHasScene(activeScene);
    } else if (activeScene && dayNumber && unitId && index !== undefined) {
      console.log('updateStripboardHasScenes');
      updateStripboardHasScenes(activeScene, dayNumber, unitId, index);
    }

    console.error('onDrop', activeScene, dayNumber, unitId, index);
  };

  return (
    <DragAndDropBox
      listId={listId}
      className={`scenes-list scenes-list-${listId}`}
      style={{ padding: '6px', height: 'auto', minHeight: '100%', scrollbarWidth: 'none' }}
      scrollInfiniteComponent={children}
      onDrop={() => onDrop()}
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
          {index === 0 && !isNotIncludedScenesList && <DropArea itemId={scene.id as string} onDrop={() => onDrop({
            index: 0
          })} />}
          <DraggableItem
            key={scene.id}
            itemId={scene.sceneId!}
            elementPosition={index}
            setActiveElement={setActiveScene as any}
            onDrop={(itemId, elementPosition) => onDrop({ index: elementPosition })}
            {... {style: { marginBottom: isNotIncludedScenesList ? '12px' : '' }}}
          >
            <SceneCard
              scene={scene}
              displayOptions={displayOptions}
              goToDetail={false}
            />
          </DraggableItem>
          { 
            !isNotIncludedScenesList && (<DropArea itemId={scene.id as string} onDrop={() => onDrop({  index: index + 1 })} />)
          }
        </React.Fragment>
      ))}
    </DragAndDropBox>
  );
};

export default ScenesList;