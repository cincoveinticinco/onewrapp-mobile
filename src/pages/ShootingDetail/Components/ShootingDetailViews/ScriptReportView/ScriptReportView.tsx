import React from 'react';
import { ShootingSceneStatusEnum } from '../../../../../Shared/ennums/ennums';
import { Column } from '../../../../../Shared/Components/GeneralTable/GeneralTable';
import OutlinePrimaryButton from '../../../../../Shared/Components/OutlinePrimaryButton/OutlinePrimaryButton';
import GeneralCards from '../../../../../Shared/Components/GeneralCards/GeneralCards';
import { mergedSceneShoot } from '../../../types/ShootingDetail.types';

interface ScriptReportViewProps {
  mergedScenesShoot: mergedSceneShoot[];
  editMode: boolean;
  setMergedScenesShoot: (mergedScenesShoot: mergedSceneShoot[]) => void;
  permissionType?: number | null;
  openSceneModal?: () => void;
}

const ScriptReportView: React.FC<ScriptReportViewProps> = ({
  mergedScenesShoot,
  editMode,
  setMergedScenesShoot,
  permissionType,
  openSceneModal,
}) => {
  const editFunction = (rowIndex: number, rowKey: keyof mergedSceneShoot, rowValue: any) => {
    const copy: mergedSceneShoot[] = [...mergedScenesShoot];

    if (rowKey === 'partiality') {
      if (rowValue) {
        copy[rowIndex].status = ShootingSceneStatusEnum.Shoot;
      } else {
        copy[rowIndex].status = ShootingSceneStatusEnum.Assigned;
      }
    }
    const copyMergedScenesInShoot = copy.map((item, index) => {
      if (index === rowIndex) {
        return { ...item, [rowKey]: rowValue };
      }
      return item;
    });
    console.log(copyMergedScenesInShoot);
    setMergedScenesShoot(copyMergedScenesInShoot);
  };

  const disableEditions = permissionType !== 1;

  const tableColumns: Column[] = [
    {
      key: 'sceneHeader',
      title: 'Scene',
      sticky: true,
      textAlign: 'center',
      backgroundColor: 'backgroundColor',
      header: true
    },
    {
      key: 'estimatedSeconds',
      title: 'Est. Time',
      type: 'seconds',
      textAlign: 'center',
      notShowWhenEdit: true,
    },
    {
      key: 'rehearsalStart',
      title: 'Rehearsal Start',
      type: 'hour',
      textAlign: 'center',
      editable: !disableEditions,
    },
    {
      key: 'rehearsalEnd',
      title: 'Rehearsal End',
      type: 'hour',
      textAlign: 'center',
      editable: !disableEditions,
    },
    {
      key: 'startShooting',
      title: 'Shoot Start',
      type: 'hour',
      textAlign: 'center',
      editable: !disableEditions,
    },
    {
      key: 'endShooting',
      title: 'Shoot End',
      type: 'hour',
      textAlign: 'center',
      editable: !disableEditions,
    },
    {
      key: 'producedSeconds',
      title: 'Produced Time',
      type: 'seconds',
      textAlign: 'center',
      editable: !disableEditions,
    },
    {
      key: 'setups',
      title: 'Setups',
      type: 'number',
      textAlign: 'center',
      editable: !disableEditions,
    },
    {
      key: 'partiality',
      title: 'Partially Shoot',
      type: 'boolean',
      textAlign: 'center',
      editable: !disableEditions,
    },
    {
      key: 'comment',
      title: 'Comment',
      textAlign: 'left',
      editable: !disableEditions,
      minWidth: 200,
      colSpan: 16,
      placeHolder: 'Add a comment',
      emptyText: 'No comment added',
    },
    {
      key: 'status',
      title: 'Status',
      textAlign: 'left',
      type: 'switch',
      editable: !disableEditions,
      switchValues: {
        left: ShootingSceneStatusEnum.NotShoot,
        neutral: ShootingSceneStatusEnum.Assigned,
        right: ShootingSceneStatusEnum.Shoot,
      },
      showOnlyWhenEdit: true,
    },
  ];

  return (
    <>
      {mergedScenesShoot.length > 0 ? (
        <GeneralCards
          columns={tableColumns}
          data={mergedScenesShoot}
          editMode={editMode}
          editFunction={editFunction}
          numberOfColumns={16}
        />
      ) : (
        <div className="center-absolute">
          <OutlinePrimaryButton buttonName="Add New" onClick={openSceneModal} disabled={permissionType !== 1} />
        </div>
      )}
    </>
  );
};

export default ScriptReportView;
