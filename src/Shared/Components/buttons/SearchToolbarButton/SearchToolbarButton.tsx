import React, { useRef } from 'react';
import { IonIcon, IonInput } from '@ionic/react';
import { caretForward, searchOutline } from 'ionicons/icons';
import ToolbarButton from '../ToolbarButton/ToolbarButton';

export interface SearchToolbarButtonProps {
  search: boolean;
  searchMode: boolean;
  toggleSearchMode: () => void;
  searchText: string;
  handleSearchInput: (e: CustomEvent) => void;
}

const SearchToolbarButton: React.FC<SearchToolbarButtonProps> = ({
  search,
  searchMode,
  toggleSearchMode,
  searchText,
  handleSearchInput,
}) => {
  const searchRef = useRef<HTMLIonInputElement>(null);

  return (
    <>
      {search && (
        <div slot="end" className={`ion-no-padding toolbar-search-wrapper ${searchMode ? 'search' : ''}`}>
          <ToolbarButton triggerId="search-button" click={toggleSearchMode} show={!searchMode}>
            <IonIcon color={searchMode ? 'primary' : 'light'} icon={searchMode ? caretForward : searchOutline} />
          </ToolbarButton>
          <IonInput
            value={searchText}
            onIonInput={handleSearchInput}
            className="toolbar-search-input"
            placeholder=""
            ref={searchRef}
            clearInput
          />
        </div>
      )}
    </>
  );
};

export default SearchToolbarButton;