import { IonInput, IonItem } from '@ionic/react';
import React, { useEffect } from 'react';
import fractionToFloat from '../../../utils/fractionToFloat';

interface AddPagesFormProps {
  handleChange: (value: any, field: string) => void
  observedField: number | null;
}

const AddPagesForm: React.FC<AddPagesFormProps> = ({ handleChange, observedField }) => {
  const [pageInteger, setPageInteger] = React.useState(0);
  const [pageFraction, setPageFraction] = React.useState(0);

  useEffect(() => {
    if (!observedField) {
      setPageInteger(0);
      setPageFraction(0);
    }
  }, [observedField]);

  useEffect(() => {
    handleChange(fractionToFloat(pageInteger, pageFraction), 'pages');
  }, [pageInteger, pageFraction]);

  return (
    <>
      <IonItem color="tertiary" id="add-pages-integer-input">
        <IonInput
          value={pageInteger}
          type="number"
          name="integerPart"
          label="PAGES"
          placeholder="0"
          onIonChange={(e) => setPageInteger(Number(e.detail.value))}
          labelPlacement="stacked"
        />
      </IonItem>
      <IonItem color="tertiary" id="add-pages-fraction-input">
        <IonInput
          value={pageFraction}
          type="number"
          name="fractionPart"
          label="PAGES"
          placeholder="0"
          onIonChange={(e) => setPageFraction(Number(e.detail.value))}
          labelPlacement="stacked"
        />
      </IonItem>
      <div id="add-pages-denominator">
        /8
      </div>
    </>
  );
};

export default AddPagesForm;
