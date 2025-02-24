import { IonInput, IonItem } from '@ionic/react';
import React, { useEffect } from 'react';
import minSecToSeconds from '../../../../Shared/Utils/minSecToSeconds';

interface AddSecondsFormProps {
  handleChange: (value: any, field: string) => void
  observedField: number
  labels?: boolean
}

const AddSecondsForm: React.FC<AddSecondsFormProps> = ({ handleChange, observedField, labels = true }) => {
  const [minutes, setMinutes]: any[] = React.useState(null);
  const [seconds, setSeconds]: any[] = React.useState(null);
  const [formInitialized, setFormInitialized] = React.useState(false);

  useEffect(() => {
    if (!formInitialized) {
      setMinutes(Math.floor(observedField / 60));
      setSeconds(observedField % 60);
      setFormInitialized(true);
    }
  }, []);

  useEffect(() => {
    handleChange(minSecToSeconds(minutes, seconds), 'estimatedSeconds');
  }, [minutes, seconds]);

  return (
    <div className="estimated-minutes-input">
      { labels && <p id="estimated-minutes-label">Estimated Time</p> }
      <IonItem color="tertiary" id="add-scene-minutes-input">
        <IonInput
          value={minutes}
          type="number"
          name="minutes"
          aria-label="MINUTES"
          placeholder="MM"
          onIonChange={(e) => setMinutes(Number(e.detail.value))}
          labelPlacement="floating"
        />
      </IonItem>
      <p id="semicolon-estimated-seconds"> : </p>
      <IonItem color="tertiary" id="add-scene-seconds-input">
        <IonInput
          value={seconds}
          type="number"
          name="seconds"
          aria-label="SECONDS"
          placeholder="SS"
          onIonChange={(e) => setSeconds(Number(e.detail.value))}
          labelPlacement="floating"
        />
      </IonItem>
    </div>
  );
};

export default AddSecondsForm;
