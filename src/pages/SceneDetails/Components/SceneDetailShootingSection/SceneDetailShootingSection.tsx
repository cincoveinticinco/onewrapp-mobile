import { IonButton, IonCheckbox } from "@ionic/react";
import { useSceneDetailsContext } from "../../Context/SceneDetailsContext";
import { ShootingSceneStatusEnum } from "../../../../Shared/enums/ennums";
import { EditableField } from "../../../ShootingDetail/Components/ShootingBasicInfo/ShootingBasicInfo";
import EditableTimeField from "../../../../Shared/Components/inputs/EditableTimeField/EditableTimeField";

const SceneDetailShootingSection = () => {

  const { isShooting, thisSceneShooting, editMode, handleNotShootClick, handleShootClick, updateShootingTime, updateProducedSeconds, updatePartiality } = useSceneDetailsContext();
  return (
    isShooting && (
      <div className="shoot-info">
        <div className="ion-flex ion-justify-content-between ion-padding-start" style={{ border: '1px solid black', backgroundColor: 'var(--ion-color-dark)' }}>
          <p className="ion-flex ion-align-items-center">SCRIPT INFO</p>
          {editMode && (
            <div className="buttons-wrapper">
              <IonButton
                fill="clear"
                className={`success${thisSceneShooting?.status === ShootingSceneStatusEnum.Shoot ? ' active' : ''}`}
                size="small"
                onClick={handleShootClick}
              >
                <b>SHOOT</b>
              </IonButton>
              <IonButton
                className={`danger${thisSceneShooting?.status === ShootingSceneStatusEnum.NotShoot ? ' active' : ''}`}
                fill="clear"
                size="small"
                onClick={handleNotShootClick}
              >
                <b>NOT SHOOT</b>
              </IonButton>
            </div>
          )}
        </div>
        <div className="info">
          <EditableField
            field="rehearsalStart"
            value={thisSceneShooting?.rehearsalStart || ''}
            title="Rehersal Start"
            withSymbol={false}
            permissionType={1}
            updateShootingTime={updateShootingTime}
            editMode={editMode}
          />
          <EditableField
            field="rehearsalEnd"
            value={thisSceneShooting?.rehearsalEnd || ''}
            title="Rehersal End"
            withSymbol={false}
            permissionType={1}
            updateShootingTime={updateShootingTime}
            editMode={editMode}
          />
          {/* <EditableField
              field="shootStart"
              value={thisSceneShooting?.shootStart || ''}
              title="Shoot Start"
              withSymbol={false}
              permissionType={1}
              updateShootingTime={updateShootingTime}
              editMode={editMode}
            />
            <EditableField
              field="shootEnd"
              value={thisSceneShooting?.shootEnd || ''}
              title="Shoot End"
              withSymbol={false}
              permissionType={1}
              updateShootingTime={updateShootingTime}
              editMode={editMode}
            /> */}
          <EditableTimeField
            value={thisSceneShooting?.producedSeconds || null}
            title="Shoot Time"
            updateTime={updateProducedSeconds}
            editMode={editMode}
          />
          {editMode && (
            <div>
              <IonCheckbox
                checked={thisSceneShooting?.partiality || false}
                onIonChange={(e) => updatePartiality(e.detail.checked)}
                labelPlacement="end"
                className="partiality-checkbox"
              >
                PARTIALY SHOOT
              </IonCheckbox>
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default SceneDetailShootingSection;