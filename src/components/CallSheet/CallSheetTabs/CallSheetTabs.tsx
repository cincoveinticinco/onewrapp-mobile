import {
  IonIcon, IonFab, IonFabButton, IonFabList, IonLabel,
} from '@ionic/react';
import {
  albumsOutline, arrowUp, briefcaseOutline,
  carOutline, chevronUp, home, peopleOutline, personOutline,
} from 'ionicons/icons';
import React from 'react';

import './CallSheetTabs.scss';

type ProductionView = 'cast' | 'extras' | 'pictureCars' | 'others' | 'crew';

interface CallSheetFabProps {
  setView: (view: ProductionView) => void;
  view: ProductionView;
  handleBack: () => void;
}

const CallSheetFab: React.FC<CallSheetFabProps> = ({ setView, view, handleBack }) => (
  <IonFab vertical="bottom" horizontal="end" class='tabs' slot="fixed">
    <IonFabButton color="dark">
      <IonIcon icon={chevronUp} />
    </IonFabButton>
    
    <IonFabList side="top">
      <IonFabButton onClick={() => setView('cast')} color={view === 'cast' ? 'primary' : 'dark'}>
      <div className='fabButton'>
        <IonIcon icon={peopleOutline} />
        <IonLabel>CAST</IonLabel>
      </div>
      </IonFabButton>

      <IonFabButton onClick={() => setView('extras')} color={view === 'extras' ? 'primary' : 'dark'}>
      <div className='fabButton'>
        <IonIcon icon={personOutline} />
        <IonLabel>EXTRAS</IonLabel>
      </div>
      </IonFabButton>

      <IonFabButton onClick={() => setView('pictureCars')} color={view === 'pictureCars' ? 'primary' : 'dark'}>
      <div className='fabButton'>
        <IonIcon icon={carOutline} />
        <IonLabel>CARS</IonLabel>
      </div>
      </IonFabButton>

      <IonFabButton onClick={() => setView('others')} color={view === 'others' ? 'primary' : 'dark'}>
      <div className='fabButton'>
        <IonIcon icon={albumsOutline} />
        <IonLabel>OTHERS</IonLabel>
      </div>
      </IonFabButton>

      <IonFabButton onClick={() => setView('crew')} color={view === 'crew' ? 'primary' : 'dark'}>
      <div className='fabButton'>
        <IonIcon icon={briefcaseOutline} />
        <IonLabel>CREW</IonLabel>
      </div>
      </IonFabButton>
    </IonFabList>
  </IonFab>
);

export default CallSheetFab;
