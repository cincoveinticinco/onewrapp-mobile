import { IonHeader, IonPage } from '@ionic/react'
import React from 'react'
import Toolbar from '../components/Shared/Toolbar/Toolbar'

interface MainPagesLayoutProps {
  children: React.ReactNode
}

const MainPagesLayout: React.FC<MainPagesLayoutProps> = ({ children }) => {
  return (
  <IonPage>
    <IonHeader>
      <Toolbar name="LVE-STRIPS" search addScene filter elipse sort />
    </IonHeader>
    {children}
  </IonPage>
  )
}

export default MainPagesLayout