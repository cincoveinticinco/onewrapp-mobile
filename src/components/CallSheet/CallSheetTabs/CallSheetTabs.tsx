import {
  IonIcon, IonLabel, IonTabBar, IonTabButton,
} from '@ionic/react';
import {
  albumsOutline, briefcaseOutline,
  carOutline,
  home,
  peopleOutline, personOutline,
} from 'ionicons/icons';
import React from 'react';

type ProductionView = 'cast' | 'extras' | 'pictureCars' | 'others' | 'crew';

interface CallSheetTabsProps {
  setView: (view: ProductionView) => void;
  view: ProductionView;
  handleBack: () => void;
}

const CallSheetTabs: React.FC<CallSheetTabsProps> = ({ setView, view, handleBack }) => (
  <IonTabBar slot="bottom" color="dark" mode="md">
    <IonTabButton
      tab="cast"
      className="tab-bar-buttons"
      onClick={() => handleBack()}
    >
      <IonIcon icon={home} />
      <IonLabel>
        HOME
      </IonLabel>
    </IonTabButton>
    <IonTabButton
      tab="cast"
      className="tab-bar-buttons"
      onClick={() => setView('cast')}
    >
      <IonIcon icon={peopleOutline} color={view === 'cast' ? 'primary' : 'light'} />
      <IonLabel style={{
        color: view === 'cast' ? 'var(--ion-color-primary)' : 'var(--ion-color-light)',
      }}
      >
        CAST
      </IonLabel>
    </IonTabButton>

    <IonTabButton
      tab="extras"
      className="tab-bar-buttons"
      onClick={() => setView('extras')}
    >
      <IonIcon icon={personOutline} color={view === 'extras' ? 'primary' : 'light'} />
      <IonLabel style={{
        color: view === 'extras' ? 'var(--ion-color-primary)' : 'var(--ion-color-light)',
      }}
      >
        EXTRAS
      </IonLabel>
    </IonTabButton>

    <IonTabButton
      tab="pictureCars"
      className="tab-bar-buttons"
      onClick={() => setView('pictureCars')}
    >
      <IonIcon icon={carOutline} color={view === 'pictureCars' ? 'primary' : 'light'} />
      <IonLabel style={{
        color: view === 'pictureCars' ? 'var(--ion-color-primary)' : 'var(--ion-color-light)',
      }}
      >
        PICTURE CARS
      </IonLabel>
    </IonTabButton>

    <IonTabButton
      tab="others"
      className="tab-bar-buttons"
      onClick={() => setView('others')}
    >
      <IonIcon icon={albumsOutline} color={view === 'others' ? 'primary' : 'light'} />
      <IonLabel style={{
        color: view === 'others' ? 'var(--ion-color-primary)' : 'var(--ion-color-light)',
      }}
      >
        OTHERS
      </IonLabel>
    </IonTabButton>

    <IonTabButton
      tab="crew"
      className="tab-bar-buttons"
      onClick={() => setView('crew')}
    >
      <IonIcon icon={briefcaseOutline} color={view === 'crew' ? 'primary' : 'light'} />
      <IonLabel style={{
        color: view === 'crew' ? 'var(--ion-color-primary)' : 'var(--ion-color-light)',
      }}
      >
        CREW
      </IonLabel>
    </IonTabButton>
  </IonTabBar>
);

export default CallSheetTabs;
