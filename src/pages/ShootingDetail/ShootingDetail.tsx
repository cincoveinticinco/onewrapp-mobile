import { IonContent, IonHeader, IonPage, IonReorderGroup, ItemReorderEventDetail, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter } from '@ionic/react';
import React, { useContext, useEffect, useState } from 'react';
import Toolbar from '../../components/Shared/Toolbar/Toolbar';
import ShootingDetailTabs from '../../components/ShootingDetail/ShootingDetailTabs/ShootingDetailTabs';
import { useHistory, useParams } from 'react-router';
import DatabaseContext from '../../context/database';
import SceneCard from '../../components/Strips/SceneCard';
import { ShootingSceneStatusEnum } from '../../Ennums/ennums';
import useLoader from '../../hooks/useLoader';
import ShootingBanner from '../../components/ShootingDetail/ShootingBannerCard/ShootingBanner';
import { ShootingScene } from '../../interfaces/shootingTypes';

const ShootingDetail = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const { shootingId } = useParams<{ shootingId: string }>();
  const { oneWrapDb } = useContext(DatabaseContext);
  const history = useHistory();

  const [shootingData, setShootingData] = React.useState<any>({
    scenes: [],
  });
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    saveOrder();
  }, [shootingData.scenes]);

  const formatSceneAsShootingScene = (scene: any): ShootingScene => {
    return {
      id: scene.id,
      projectId: scene.projectId,
      shootingId: scene.shootingId,
      sceneId: scene.sceneId,
      status: scene.status,
      position: scene.position,
      rehersalStart: scene.rehersalStart,
      rehersalEnd: scene.rehersalEnd,
      startShooting: scene.startShooting,
      endShooting: scene.endShooting,
      producedSeconds: scene.producedSeconds,
      setups: scene.setups,
      createdAt: scene.createdAt,
      updatedAt: scene.updatedAt
    };
  };

  const saveOrder = async () => {
    if (oneWrapDb && shootingId) {
      try {
        const shooting = await oneWrapDb.shootings.findOne({
          selector: { id: shootingId }
        }).exec();

        if (shooting) {
          const updatedScenes = shootingData.scenes.filter((item: any) => item.cardType === 'scene')
            .map(({ cardType, ...scene }: {
              cardType: string;
              sceneId: string;
              position: number;
              status: string;
            }) => formatSceneAsShootingScene(scene));
          const updatedBanners = shootingData.scenes.filter((item: any) => item.cardType === 'banner')
            .map(({ cardType, ...banner }: {
              cardType: string;
              id: string;
              position: number;
              description: string;
            }) => banner);

          let shootingCopy = { ...shooting._data };
          shootingCopy.scenes = updatedScenes;
          shootingCopy.banners = updatedBanners;

          return await oneWrapDb.shootings.upsert(shootingCopy);

        }
      } catch (error) {
        console.error('Error saving new order:', error);
      }
    }
  };

  const handleReorder = async (event: CustomEvent<ItemReorderEventDetail>) => {
    console.log('Dragged from index', event.detail.from, 'to', event.detail.to);
    
    const items = [...shootingData.scenes];
    const [reorderedItem] = items.splice(event.detail.from, 1);
    items.splice(event.detail.to, 0, reorderedItem);
  
    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index
    }));
  
    setShootingData((prev: any) => ({
      ...prev,
      scenes: updatedItems
    }));

    event.detail.complete();
    
    try {
      console.log('Order saved successfully');
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  const { setViewTabs } = useContext(DatabaseContext);

  useIonViewDidEnter(() => {
    setViewTabs(false);
  });

  useIonViewWillEnter(() => {
    setViewTabs(false);
  });

  useIonViewDidLeave(() => {
    setViewTabs(true);
  });

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
        console.log(shootingData.scenes);
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
      console.log(sceneShootingData);
      return {
        cardType: 'scene',
        ...scene._data,
        ...sceneShootingData
      };
    }) ?? [];
    
    const bannersWIthType = bannersInShoot.map((banner: any) => {
      return {
        cardType: 'banner',
        ...banner
      };
    });
    
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
  );
};

export default ShootingDetail;
