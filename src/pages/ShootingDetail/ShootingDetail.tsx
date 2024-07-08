import { IonContent, IonHeader, IonPage } from '@ionic/react'
import React, { useContext, useEffect } from 'react'
import Toolbar from '../../components/Shared/Toolbar/Toolbar'
import ShootingDetailTabs from '../../components/ShootingDetail/ShootingDetailTabs/ShootingDetailTabs';
import { useHistory, useParams } from 'react-router';
import DatabaseContext from '../../context/database';
import SceneCard from '../../components/Strips/SceneCard';
import { ShootingSceneStatusEnum } from '../../Ennums/ennums';

const ShootingDetail = () => {
  const { shootingId } = useParams<{ shootingId: string }>();
  const { oneWrapDb } = useContext(DatabaseContext);
  const history = useHistory();

  const [shootingData, setShootingData] = React.useState<any>({
    scenes: []
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
        ...scene._data,
        ...sceneShootingData
      }
    });

    return mergedScenesData || [];
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
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          shootingData.scenes.map((scene: any) => (
            <SceneCard key={scene.sceneId} scene={scene} isShooting={true} isProduced={
              scene.status !== ShootingSceneStatusEnum.NotShoot
            }/>
          ))
        )}
      </IonContent>
      <ShootingDetailTabs shootingId={shootingId} />
    </IonPage>
  )
}

export default ShootingDetail