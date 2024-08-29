import { IonContent, IonPage } from '@ionic/react'
import React, { useEffect } from 'react'
import { mergedSceneShoot } from '../../../../pages/ShootingDetail/ShootingDetail'

interface ScriptReportViewProps {
  mergedScenesShoot: mergedSceneShoot[]
}

const ScriptReportView: React.FC<ScriptReportViewProps> = ({
  mergedScenesShoot,
}) => {
  useEffect(() => {
    console.log(mergedScenesShoot)
  }, [mergedScenesShoot])
  return (
    <IonContent color='tertiary'>
      <h1>Script Report</h1>
    </IonContent>
  )
}

export default ScriptReportView