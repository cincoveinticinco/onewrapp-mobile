import { IonHeader, IonPage } from '@ionic/react';
import React from 'react';
import Toolbar from '../../components/Shared/Toolbar/Toolbar';

interface MainPagesLayoutProps {
  children: React.ReactNode
  searchText?: string
  setSearchText?: (searchText: string) => void
  handleBack?: () => void
}

const MainPagesLayout: React.FC<MainPagesLayoutProps> = ({ children, searchText, setSearchText, handleBack }) => {
  const [searchMode, setSearchMode] = React.useState(false);

  return (
    <IonPage>
      <IonHeader>
        <Toolbar
          name="LVE-STRIPS"
          back
          search
          addScene
          filter
          elipse
          sort
          searchMode={searchMode}
          setSearchMode={setSearchMode}
          setSearchText={setSearchText}
          searchText={searchText}
          handleBack={handleBack}
        />
      </IonHeader>
      {children}
    </IonPage>
  );
};

export default MainPagesLayout;
