import { IonSearchbar, IonToolbar } from '@ionic/react';
import { trash } from 'ionicons/icons';
import './ModalSearchBar.scss';

const ModalSearchBar = ({
  searchText,
  setSearchText,
}: {
  searchText: string,
  setSearchText: (searchText: string) => void
}) => (
  <IonToolbar color="tertiary" className='search-bar-toolbar'>
    <IonSearchbar
      className="ion-margin-top search-bar"
      value={searchText}
      onIonChange={(e) => setSearchText(e.detail.value!)}
      placeholder="SEARCH"
      showCancelButton="focus"
      cancelButtonIcon={trash}
    />
  </IonToolbar>
);

export default ModalSearchBar;
