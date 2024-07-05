import { IonCard, IonCardContent } from "@ionic/react"
import { Shooting } from "../../../interfaces/shootingTypes"
import { ShootingSceneStatusEnum } from "../../../Ennums/ennums";
import useIsMobile from "../../../hooks/useIsMobile";

const ShootingCard: React.FC<{ className?: string, shooting: Shooting }> = ({ className, shooting}) => {
  const getTotalProducedScenes = () => {
    return shooting.scenes.reduce((acc, scene) => {
      return scene.status === ShootingSceneStatusEnum.Shoot ? acc + 1 : acc;
    }, 0);
  }

  const isMobile = useIsMobile();
  return (
    <IonCard className={className} onClick={() => console.log(shooting)}>
      <IonCardContent class="space-flex-row" style={{width: '100%', padding: '6px'}}>
        <p className='unit-name'><b>U.{shooting && shooting.unitNumber}</b></p>
        {
          !isMobile && (
            <p className='unit-produced'> {getTotalProducedScenes()} / {shooting.scenes.length}</p>
          )
        }
      </IonCardContent>
      <p></p>
    </IonCard>
  )
}

export default ShootingCard