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
  title: string
  isLoading?: boolean
  customButtons?: any[]
  permissionType?: number | null
}

const MainPagesLayout: React.FC<MainPagesLayoutProps> = ({
  children, searchText, setSearchText, search = false, title, isLoading = false, customButtons = [], permissionType,
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
          searchMode={searchMode}
          setSearchMode={setSearchMode}
          setSearchText={setSearchText}
          searchText={searchText}
          handleBack={handleBack}
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
