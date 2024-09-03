import { IonContent } from '@ionic/react'
import React, { useEffect } from 'react'
import { mergedSceneShoot } from '../../../../pages/ShootingDetail/ShootingDetail'
import GeneralTable, { Column } from '../../../Shared/GeneralTable/GeneralTable'
import { ShootingSceneStatusEnum } from '../../../../Ennums/ennums'

interface ScriptReportViewProps {
  mergedScenesShoot: mergedSceneShoot[]
  editMode: boolean
  setMergedScenesShoot: (mergedScenesShoot: mergedSceneShoot[]) => void
}

const ScriptReportView: React.FC<ScriptReportViewProps> = ({
  mergedScenesShoot,
  editMode,
  setMergedScenesShoot
}) => {
  useEffect(() => {
    console.log(mergedScenesShoot)
  }, [mergedScenesShoot])

  const editFunction = (rowIndex: number, rowKey: keyof mergedSceneShoot, rowValue: any, type: any) => {
    console.log('rowIndex', rowValue);
    const copy: mergedSceneShoot[] = mergedScenesShoot.map((item, index) => {
      if (index === rowIndex) {
        return { ...item, [rowKey]: rowValue };
      }
      return item;
    });
    setMergedScenesShoot(copy); 
  };

  const tableColumns: Column[] = [
    {
      key: 'sceneNumber',
      title: 'Scene',
      sticky: true,
      textAlign: 'center',
      backgroundColor: 'backgroundColor'
    },
    {
      key: 'estimatedSeconds',
      title: 'Est. Time(mm:ss)',
      type: 'seconds',
      textAlign: 'center'
    },
    {
      key: 'rehersalStart',
      title: 'Rehersal Start',
      type: 'hour',
      textAlign: 'center',
      editable: true,
    },
    {
      key: 'rehersalEnd',
      title: 'Rehersal End',
      type: 'hour',
      textAlign: 'center',
      editable: true,
    },
    {
      key: 'startShooting',
      title: 'Shoot Start',
      type: 'hour',
      textAlign: 'center',
      editable: true,
    },
    {
      key: 'endShooting',
      title: 'Shoot End',
      type: 'hour',
      textAlign: 'center',
      editable: true,
    },
    {
      key: 'setups',
      title: 'Setups',
      type: 'number',
      textAlign: 'center',
      editable: true,
    },
    {
      key: 'producedSeconds',
      title: 'Produced Time (mm:ss)',
      type: 'seconds',
      textAlign: 'center',
      editable: true,
    },
    {
      key: 'partiality',
      title: 'Partially Shoot',
      type: 'boolean',
      textAlign: 'center',
      editable: true,
    },
    {
      key: 'comment',
      title: 'Comment',
      textAlign: 'center',
      editable: true
    },
    {
      key: 'status',
      title: 'Status',
      textAlign: 'center',
      type: 'switch', 
      editable: true,
      switchValues: {
        left: ShootingSceneStatusEnum.NotShoot,
        neutral: ShootingSceneStatusEnum.Assigned,
        right: ShootingSceneStatusEnum.Shoot,
      },
      showOnlyWhenEdit: true,
    }
  ]

  return (
    <IonContent color='tertiary'>
      <GeneralTable
        columns={tableColumns}
        data={mergedScenesShoot}
        editMode={editMode}
        editFunction={editFunction}
      />
    </IonContent>
  )
}

export default ScriptReportView