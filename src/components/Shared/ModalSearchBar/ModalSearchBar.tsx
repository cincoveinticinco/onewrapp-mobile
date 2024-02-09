import { IonSearchbar, IonToolbar } from '@ionic/react';
import { trash } from 'ionicons/icons';
import './ModalSearchBar.scss';

const ModalSearchBar = ({
  searchText,
  setSearchText,
  showSearchBar,
}: {
  searchText: string,
  setSearchText: (searchText: string) => void,
  showSearchBar: boolean
}) => (
  <>
    {showSearchBar && (
      <IonToolbar color="tertiary" className="search-bar-toolbar">
        {/* NO LESS THAN 10 */}
        <IonSearchbar
          className="ion-margin-top search-bar"
          value={searchText}
          onIonChange={(e) => setSearchText(e.detail.value!)}
          onIonInput={(e) => setSearchText(e.detail.value!)}
          placeholder="SEARCH"
          showCancelButton="focus"
          cancelButtonIcon={trash}
        />
      </IonToolbar>
    )}
  </>
);

export default ModalSearchBar;
