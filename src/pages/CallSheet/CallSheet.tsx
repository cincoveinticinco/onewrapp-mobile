import React, { useState } from 'react'
import { 
  IonButton,
  IonContent, 
  IonHeader, 
  IonIcon, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  useIonViewDidEnter 
} from '@ionic/react'
import ExploreContainer from '../../components/Shared/ExploreContainer/ExploreContainer'
import useHideTabs from '../../hooks/Shared/useHideTabs'
import './CallSheet.css'
import CallSheetTabs from '../../components/CallSheet/CallSheetTabs/CallSheetTabs'
import CastView from '../../components/CallSheet/CastView/CastView/CastView'
import { chevronBackOutline } from 'ionicons/icons'
import { useParams } from 'react-router'

type CallSheetView = 'cast' | 'extras' | 'pictureCars' | 'others' | 'crew';

const CallSheet: React.FC = () => {
  const tabsController = useHideTabs()
  const [view, setView] = useState<CallSheetView>('cast')
  const { id, shootingId } = useParams<{ id: string, shootingId: string }>()

  useIonViewDidEnter(() => {
    setTimeout(() => {
      tabsController.hideTabs()
    }, 500)
  })

  const renderContent = () => {
    switch(view) {
      case 'cast':
        return <CastView />
      case 'extras':
        return <ExploreContainer name="Extras Content" />
      case 'pictureCars':
        return <ExploreContainer name="Picture Cars Content" />
      case 'others':
        return <ExploreContainer name="Others Content" />
      case 'crew':
        return <ExploreContainer name="Crew Content" />
      default:
        return <ExploreContainer name="Default Content" />
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="tertiary">
          <IonButton 
            routerLink={`/my/projects/${id}/shooting/${shootingId}`} 
            color="light" 
            slot="start" 
            fill='clear'
          >
          <IonIcon slot="icon-only" icon={chevronBackOutline} />
          </IonButton>
          <IonTitle>CALL TIME</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color="tertiary" fullscreen>
        {renderContent()}
      </IonContent>
      <CallSheetTabs view={view} setView={setView} />
    </IonPage>
  )
}

export default CallSheet