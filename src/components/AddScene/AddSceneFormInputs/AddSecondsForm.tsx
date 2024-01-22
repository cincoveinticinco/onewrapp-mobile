import { IonInput, IonItem } from '@ionic/react'
import React, { useEffect } from 'react'
import { minSecToSeconds } from '../../../utils/minSecToSeconds'

interface AddPagesFormProps {
  handleChange: (value: any, field: string) => void
}

const AddSecondsForm: React.FC<AddPagesFormProps> = ({ handleChange }) => {
  const [ minutes, setMinutes ]: any[] = React.useState(null)
  const [ seconds, setSeconds ]: any[] = React.useState(null)

  useEffect(() => {
    handleChange(minSecToSeconds(minutes, seconds), 'estimatedSeconds')
  }, [minutes, seconds])
  return (
    <div className='estimated-minutes-input'>
      <p id='estimated-minutes-label'>ESTIMATED TIME (MM:SS)</p>
      <IonItem color="tertiary" id ='add-scene-minutes-input'>
        <IonInput 
          value={minutes}
          type="number"
          name="minutes"
          aria-label="MINUTES"
          placeholder='MM'
          onIonChange={(e) => setMinutes(Number(e.detail.value))}
          labelPlacement='stacked'
        />
      </IonItem>
      <p id="semicolon-estimated-seconds"> : </p>
      <IonItem color="tertiary" id ='add-scene-seconds-input'>
        <IonInput 
          value={seconds}
          type="number"
          name="seconds"
          aria-label="SECONDS"
          placeholder='SS'
          onIonChange={(e) => setSeconds(Number(e.detail.value))}
          labelPlacement='stacked'
        />
      </IonItem>
    </div>
  )
}

export default AddSecondsForm