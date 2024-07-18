import {
  IonButton, IonButtons, IonIcon, IonTitle, IonToolbar,
} from '@ionic/react';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';

const weekViewToolbar = (currentDate: Date, onPrev: () => void, onNext: () => void) => (
  <IonToolbar color="tertiary">
    <IonButtons slot="start">
      <IonButton onClick={() => onPrev()}>
        <IonIcon slot="icon-only" icon={chevronBackOutline} />
      </IonButton>
    </IonButtons>
    <IonTitle>
      {format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d')}
      {' '}
      -
      {' '}
      {format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d, yyyy')}
    </IonTitle>
    <IonButtons slot="end">
      <IonButton onClick={() => onNext()}>
        <IonIcon slot="icon-only" icon={chevronForwardOutline} />
      </IonButton>
    </IonButtons>
  </IonToolbar>
);

export default weekViewToolbar;
