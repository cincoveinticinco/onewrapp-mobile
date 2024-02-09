import { IonHeader, IonPage } from '@ionic/react';
import React, { useEffect } from 'react';
import Toolbar from '../../components/Shared/Toolbar/Toolbar';
import useIsMobile from '../../hooks/useIsMobile';

interface MainPagesLayoutProps {
  children: React.ReactNode
}

const MainPagesLayout: React.FC<MainPagesLayoutProps> = ({ children }) => {
  const [searchMode, setSearchMode] = React.useState(false);
  const isMobile = useIsMobile();

  return (
    <IonPage>
      <IonHeader>
        <Toolbar
          name="LVE-STRIPS"
          menu={!isMobile}
          back={isMobile}
          search
          addScene
          filter
          elipse
          sort
          searchMode={searchMode}
          setSearchMode={setSearchMode}
        />
      </IonHeader>
      {children}
    </IonPage>
  );
};

export default MainPagesLayout;
