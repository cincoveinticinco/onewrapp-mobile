import { IonContent } from "@ionic/react";
import { StripboardWeeks } from "../../../../../../hooks/database/useStripboards/useStripboards";
import { SceneDocType } from "../../../../../../Shared/types/scenes.types";
import WeekItem from "../WeekItem/WeekItem";


interface WeeksListProps {
  weeks: StripboardWeeks[];
  unitScenes: Record<string, SceneDocType[]>;
  updateUnitScenes: (unitId: number, scenes: SceneDocType[]) => void;
}

const WeeksList: React.FC<WeeksListProps> = ({ weeks, unitScenes, updateUnitScenes }) => {
  return (
    <IonContent color="tertiary" scrollEvents={true} className="hide-scrollbar">
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