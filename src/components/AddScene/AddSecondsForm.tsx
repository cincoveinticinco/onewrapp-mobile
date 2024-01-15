import { IonInput, IonItem } from '@ionic/react'
import React, { useEffect } from 'react'
import { minSecToSeconds } from '../../utils/minSecToSeconds'

interface AddPagesFormProps {
  handleChange: (value: any, field: string) => void
}

const AddSecondsForm: React.FC<AddPagesFormProps> = ({ handleChange }) => {
  const [ minutes, setMinutes ] = React.useState(0)
  const [ seconds, setSeconds ] = React.useState(0)

  useEffect(() => {
    handleChange(minSecToSeconds(minutes, seconds), 'estimatedSeconds')
  }, [minutes, seconds])
  return (
    <>
      <IonItem color="tertiary" id ='add-scene-minutes-input'>
        <IonInput 
          value={minutes}
          type="number"
          name="minutes"
          label="MINUTES"
          placeholder='0'
          onIonChange={(e) => setMinutes(Number(e.detail.value))}
          labelPlacement='stacked'
        />
      </IonItem>
      <IonItem color="tertiary" id ='add-scene-seconds-input'>
        <IonInput 
          value={seconds}
          type="number"
          name="seconds"
          label="SECONDS"
          placeholder='0'
          onIonChange={(e) => setSeconds(Number(e.detail.value))}
          labelPlacement='stacked'
        />
      </IonItem>
    </>
  )
}

export default AddSecondsForm