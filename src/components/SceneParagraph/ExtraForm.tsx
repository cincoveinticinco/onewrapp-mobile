import { IonInput, IonItem } from "@ionic/react";
import { Extra } from "../../interfaces/scenesTypes";
import { useState } from "react";

interface ExtraFormProps {
  extra: Extra;
  setExtra: React.Dispatch<React.SetStateAction<any>>;
}

const ExtraForm: React.FC<ExtraFormProps> = ({ extra, setExtra }) => {

  const [isFocused, setIsFocused] = useState(false)

  return (
    <>
      <IonItem color='tertiary'>
        <IonInput
          className={isFocused ? "input-item" : "script-popup-input"}
          value={extra.extraName}
          labelPlacement="stacked"
          label="Extra Name *"
          placeholder="INSERT EXTRA NAME"
          style={{
            borderBottom: '1px solid var(--ion-color-light)',
            fontSize: '12px',
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </IonItem>
    </>
  );
}

export default ExtraForm;