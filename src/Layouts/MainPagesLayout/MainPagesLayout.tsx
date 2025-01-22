import { IonHeader, IonPage } from '@ionic/react';
import React from 'react';
import Toolbar from '../../Shared/Components/Toolbar/Toolbar';
import { useHistory } from 'react-router';

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
  isLoading?: boolean
  customButtons?: any[]
  permissionType?: number | null
}

const MainPagesLayout: React.FC<MainPagesLayoutProps> = ({
  children, searchText, setSearchText, search = false, add = false, filter = false, elipse = false, sort = false, title, sortTrigger, isLoading = false, customButtons = [], permissionType,
}) => {
  const [searchMode, setSearchMode] = React.useState(false);
  const history = useHistory();
  const handleBack = () => history.push('/my/projects');

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
          isLoading={isLoading}
          customButtons={customButtons}
          permissionType={permissionType}
        />
      </IonHeader>
      {children}
    </IonPage>
  );
};

export default MainPagesLayout;
