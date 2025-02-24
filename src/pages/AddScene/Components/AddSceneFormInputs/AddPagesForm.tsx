import { IonInput, IonItem } from '@ionic/react';
import React, { useEffect } from 'react';
import fractionToFloat from '../../../../Shared/Utils/fractionToFloat';

interface AddPagesFormProps {
  handleChange: (value: any, field: string) => void
  observedField: number | null;
  labels?: boolean
}

const AddPagesForm: React.FC<AddPagesFormProps> = ({ handleChange, observedField, labels = true }) => {
  // Inicializar los estados con los valores calculados
  const initialInteger = observedField ? Math.floor(observedField) : 0;
  const initialFraction = observedField ? 
    Math.round((observedField - Math.floor(observedField)) * 8) : 0;

  const [pageInteger, setPageInteger] = React.useState(initialInteger);
  const [pageFraction, setPageFraction] = React.useState(initialFraction);

  // Solo actualizar cuando observedField cambia externamente
  useEffect(() => {
    if (observedField !== null) {
      const integerPart = Math.floor(observedField);
      const fraction = observedField - integerPart;
      const fractionPart = Math.round(fraction * 8);
      
      setPageInteger(integerPart);
      setPageFraction(fractionPart);
    }
  }, [observedField]);

  const handleIntegerChange = (value: number) => {
    setPageInteger(value);
    const newValue = fractionToFloat(value, pageFraction);
    handleChange(newValue, 'pages');
  };

  const handleFractionChange = (value: number) => {
    setPageFraction(value);
    const newValue = fractionToFloat(pageInteger, value);
    handleChange(newValue, 'pages');
  };

  return (
    <>
      <IonItem color="tertiary" id="add-pages-integer-input">
        <IonInput
          value={pageInteger}
          type="number"
          name="integerPart"
          label={labels ? 'PAGES' : ''}
          placeholder="0"
          onIonChange={(e) => handleIntegerChange(Number(e.detail.value))}
          labelPlacement="floating"
        />
      </IonItem>
      <IonItem color="tertiary" id="add-pages-fraction-input">
        <IonInput
          value={pageFraction}
          type="number"
          name="fractionPart"
          label={labels ? 'PAGES' : ''}
          placeholder="0"
          onIonChange={(e) => handleFractionChange(Number(e.detail.value))}
          labelPlacement="floating"
        />
      </IonItem>
      <div id="add-pages-denominator">
        /8
      </div>
    </>
  );
};

export default AddPagesForm;