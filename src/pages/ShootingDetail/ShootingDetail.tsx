import { IonContent, IonHeader, IonPage, IonReorderGroup, ItemReorderEventDetail, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter } from '@ionic/react'
import React, { useContext, useEffect, useState } from 'react'
import Toolbar from '../../components/Shared/Toolbar/Toolbar'
import ShootingDetailTabs from '../../components/ShootingDetail/ShootingDetailTabs/ShootingDetailTabs';
import { useHistory, useParams } from 'react-router';
import DatabaseContext from '../../context/database';
import SceneCard from '../../components/Strips/SceneCard';
import { ShootingSceneStatusEnum } from '../../Ennums/ennums';
import useLoader from '../../hooks/useLoader';
import ShootingBanner from '../../components/ShootingDetail/ShootingBannerCard/ShootingBanner';
import useHideTabs from '../../hooks/useHideTabs';

const ShootingDetail = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const { shootingId } = useParams<{ shootingId: string }>();
  const { oneWrapDb } = useContext(DatabaseContext);
  const history = useHistory();
  
  const handleReorder = (event: CustomEvent<ItemReorderEventDetail>) => {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log('Dragged from index', event.detail.from, 'to', event.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    event.detail.complete();
  }
  
  const { setViewTabs } = useContext(DatabaseContext);

  useIonViewDidEnter(() => {
    setViewTabs(false);
  })
  
  useIonViewWillEnter(() => {
    setViewTabs(false);
  })

  useIonViewDidLeave(() => {
    setViewTabs(true);
  })

  useIonViewDidLeave(() => {
    setViewTabs(true);
  })

  const [shootingData, setShootingData] = React.useState<any>({
    scenes: [],
  });
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const scenesData = await getScenesData();
        setShootingData({
          scenes: scenesData
        });
      } catch (error) {
        console.error('Error fetching scenes:', error);
      } finally {
        console.log(shootingData.scenes)
        setIsLoading(false);
      }
    };

    fetchData();
  }, [oneWrapDb, shootingId]);

  const getScenesData = async () => {
    const shootings: any = await oneWrapDb?.shootings.find({
      selector: {
        id: shootingId
      }
    }).exec();
    
    const scenesInShoot = shootings[0]._data.scenes;
    const bannersInShoot = shootings[0]._data.banners;
    const scenesIds = scenesInShoot.map((scene: any) => parseInt(scene.sceneId));

    const scenesData = await oneWrapDb?.scenes.find({
      selector: {
        sceneId: {
          $in: scenesIds
        }
      }
    }).exec();
    
    const mergedScenesData = scenesData?.map((scene: any) => {
      const sceneShootingData = scenesInShoot.find((sceneInShoot: any) => parseInt(sceneInShoot.sceneId) === parseInt(scene.sceneId));
      console.log(sceneShootingData)
      return {
        cardType: 'scene',
        ...scene._data,
        ...sceneShootingData
      }
    }) ?? [];
    
    const bannersWIthType = bannersInShoot.map((banner: any) => {
      return {
        cardType: 'banner',
        ...banner
      }
    })
    
    return [...mergedScenesData, ...bannersWIthType].sort((a: any, b: any) => a.position - b.position);

  };

  const handleBack = () => {
    history.push('/my/projects/163/calendar');
  };

  return (
    <IonPage>
      <IonHeader>
        <Toolbar name="" backString prohibited deleteButton edit handleBack={handleBack} />
      </IonHeader>
      <IonContent color="tertiary" fullscreen>
        <IonReorderGroup disabled={isDisabled} onIonItemReorder={handleReorder}>
          {isLoading ? (
            useLoader()
          ) : (
            shootingData.scenes.map((scene: any) => (
              scene.cardType === 'scene' ? (
                <SceneCard key={scene.sceneId} scene={scene} isShooting={true} isProduced={
                  scene.status !== ShootingSceneStatusEnum.NotShoot
                }/>) : (
                <ShootingBanner key={scene.id} banner={scene} />
              )
            ))
          )}
        </IonReorderGroup>
      </IonContent>
      <ShootingDetailTabs shootingId={shootingId} />
    </IonPage>
  )
}

export default ShootingDetail