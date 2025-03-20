import { IonContent, IonHeader } from "@ionic/react";
import { StripboardWeeks } from "../../../../../../hooks/database/useStripboards/useStripboards";
import { SceneDocType } from "../../../../../../Shared/types/scenes.types";
import WeekItem from "../WeekItem/WeekItem";
import ModalToolbar from "../../../../../../Shared/Components/modals/ModalToolbar/ModalToolbar";


interface WeeksListProps {
  weeks: StripboardWeeks[];
  unitScenes: Record<string, SceneDocType[]>;
  updateUnitScenes: (unitId: number, scenes: SceneDocType[]) => void;
  stripboardName: string;
}

const WeeksList: React.FC<WeeksListProps> = ({ weeks, unitScenes, updateUnitScenes, stripboardName }) => {
  return (
    <IonContent color="tertiary" scrollEvents={true} className="hide-scrollbar">
      <IonHeader>
        <ModalToolbar
          toolbarTitle={stripboardName}
          color="tertiary-dark"
        />
      </IonHeader>
      {weeks.map((week, weekIndex) => (
        <WeekItem
          key={`week-${week.weekNumber}-${weekIndex}`} 
          week={week} 
          unitScenes={unitScenes} 
          updateUnitScenes={updateUnitScenes} 
        />
      ))}
    </IonContent>
  );
};

export default WeeksList;