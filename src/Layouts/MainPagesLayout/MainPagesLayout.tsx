import { IonHeader, IonPage } from '@ionic/react';
import React, { useEffect } from 'react';
import Toolbar from '../../components/Shared/Toolbar/Toolbar';
import useIsMobile from '../../hooks/useIsMobile';

interface MainPagesLayoutProps {
  children: React.ReactNode
  searchText?: string
  setSearchText?: (searchText: string) => void
}

const MainPagesLayout: React.FC<MainPagesLayoutProps> = ({ children, searchText, setSearchText }) => {
  const [searchMode, setSearchMode] = React.useState(false);
  const isMobile = useIsMobile();

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
        />
      </IonHeader>
      {children}
    </IonPage>
  );
};

export default MainPagesLayout;
