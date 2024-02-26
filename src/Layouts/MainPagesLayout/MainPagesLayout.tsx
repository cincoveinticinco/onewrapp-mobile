import { IonHeader, IonPage } from '@ionic/react';
import React from 'react';
import Toolbar from '../../components/Shared/Toolbar/Toolbar';

interface MainPagesLayoutProps {
  children: React.ReactNode
  searchText?: string
  setSearchText?: (searchText: string) => void
  handleBack?: () => void
  search?: boolean
  add?: boolean
  filter?: boolean
  elipse?: boolean
  sort?: boolean
  title: string
  sortTrigger?: string
}

/// INSTED OF CONFIRM FILTER

/// INSTEAD OF CANCEL RESET

/// UPDATE SCENE => SAVE

/// TIME AND PAGES FORMATTED

/// EDIT NAMES, EXAMPLE: CHANGE CHARACTER NAME IN CHARACTERS PAGE // EDIT CHARACTER NUMBER

// CHARACTER WITH MOST SETS, SCENES => SORTS

/// ALWAYS CHARACTER WITH CHARACTER NUMBER

/// CHARACTERS SORT (NUMBER, ALPHABETICALLY) // DEFAULT

// SET :

// CAST, SCENES, ELEMENTS PARTICIPATION: EXAMPLE: SCENES QUANTITY/ CHARACTER SCENES PARTICIPATION QUANTITY % WITH ONE DECIMAL

// LOCATION

// REPORTS PDF

const MainPagesLayout: React.FC<MainPagesLayoutProps> = ({
  children, searchText, setSearchText, handleBack, search = false, add = false, filter = false, elipse = false, sort = false, title, sortTrigger,
}) => {
  const [searchMode, setSearchMode] = React.useState(false);

  return (
    <IonPage>
      <IonHeader>
        <Toolbar
          name={title}
          back
          search={search}
          addScene={add}
          filter={filter}
          elipse={elipse}
          sort={sort}
          searchMode={searchMode}
          setSearchMode={setSearchMode}
          setSearchText={setSearchText}
          searchText={searchText}
          handleBack={handleBack}
          sortTrigger={sortTrigger}
        />
      </IonHeader>
      {children}
    </IonPage>
  );
};

export default MainPagesLayout;
