import React from 'react';
import { ShootingSceneStatusEnum } from '../../../../Ennums/ennums';
import { mergedSceneShoot } from '../../../../pages/ShootingDetail/ShootingDetail';
import GeneralTable, { Column } from '../../../Shared/GeneralTable/GeneralTable';
import OutlinePrimaryButton from '../../../Shared/OutlinePrimaryButton/OutlinePrimaryButton';

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
      key: 'sceneNumber',
      title: 'Scene',
      sticky: true,
      textAlign: 'center',
      backgroundColor: 'backgroundColor',
    },
    {
      key: 'estimatedSeconds',
      title: 'Est. Time(mm:ss)',
      type: 'seconds',
      textAlign: 'center',
    },
    {
      key: 'rehersalStart',
      title: 'Rehearsal Start',
      type: 'hour',
      textAlign: 'center',
      editable: !disableEditions,
    },
    {
      key: 'rehersalEnd',
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
      key: 'setups',
      title: 'Setups',
      type: 'number',
      textAlign: 'center',
      editable: !disableEditions,
    },
    {
      key: 'producedSeconds',
      title: 'Produced Time (mm:ss)',
      type: 'seconds',
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
      textAlign: 'center',
      editable: !disableEditions,
      minWidth: 200,
    },
    {
      key: 'status',
      title: 'Status',
      textAlign: 'center',
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
        <GeneralTable
          columns={tableColumns}
          data={mergedScenesShoot}
          editMode={editMode}
          editFunction={editFunction}
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
