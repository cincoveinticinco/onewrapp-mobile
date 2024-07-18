import { IonSearchbar, IonToolbar } from '@ionic/react';
import { chevronBackOutline, closeOutline, trash } from 'ionicons/icons';
import './ModalSearchBar.scss';

const ModalSearchBar = ({
  searchText,
  setSearchText,
  showSearchBar,
  placeholder = 'SEARCH',
}: {
  searchText: string,
  setSearchText: (searchText: string) => void,
  showSearchBar: boolean,
  placeholder?: string,
}) => (
  <>
    {showSearchBar && (
      <div className="search-bar-toolbar">
        <IonSearchbar
          className="ion-margin-top search-bar"
          value={searchText.toUpperCase()}
          onIonChange={(e) => setSearchText(e.detail.value!)}
          onIonInput={(e) => setSearchText(e.detail.value!)}
          placeholder={placeholder}
          showCancelButton="focus"
          cancelButtonIcon={closeOutline}
          mode="md"
        />
      </div>
    )}
  </>
);

export default ModalSearchBar;
