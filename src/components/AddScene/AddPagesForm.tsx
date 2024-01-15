import { IonButton, IonInput, IonItem } from '@ionic/react'
import React, { useEffect } from 'react'
import { fractionToFloat } from '../../utils/fractionToFloat'

interface AddPagesFormProps {
  handleChange: (value: any, field: string) => void
}

export const AddPagesForm: React.FC<AddPagesFormProps> = ({ handleChange }) => {
  const [pageInteger, setPageInteger] = React.useState(0)
  const [pageFraction, setPageFraction] = React.useState(0)

  useEffect(() => {
    handleChange(fractionToFloat(pageInteger, pageFraction), 'pages')
  }, [pageInteger, pageFraction])

  return (
    <>
      <IonItem color='tertiary' id='add-pages-integer-input'>
        <IonInput
          value={pageInteger}
          type="number" 
          name="integerPart" 
          label="PAGES" 
          placeholder='0'
          onIonChange={(e) => setPageInteger(Number(e.detail.value))}
          labelPlacement='stacked'
        />
      </IonItem>
      <IonItem color='tertiary' id='add-pages-fraction-input' className='ion-flex'>
        <IonInput
          value={pageFraction}
          type="number"
          name="fractionPart"
          label="PAGES"
          placeholder='0'
          onIonChange={(e) => setPageFraction(Number(e.detail.value))}
          labelPlacement='stacked'
        />
      </IonItem>
    </>
  )
}
