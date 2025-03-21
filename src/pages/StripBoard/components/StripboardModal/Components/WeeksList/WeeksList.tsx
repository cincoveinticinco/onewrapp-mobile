import { IonContent, IonHeader } from "@ionic/react";
import WeekItem from "../WeekItem/WeekItem";
import ModalToolbar from "../../../../../../Shared/Components/modals/ModalToolbar/ModalToolbar";
import { StripboardWeeks } from "../../../../../../Shared/types/stripboard.types";
import { SceneDocType } from "../../../../../../Shared/types/scenes.types";
import React from "react";


interface WeeksListProps {
  weeks: StripboardWeeks[];
  stripboardName: string;
  updateStripboardHasScenes: (scenes: SceneDocType[], dayNumber: number, unitId: number) => void
}

const WeeksList: React.FC<WeeksListProps> = ({ weeks, stripboardName, updateStripboardHasScenes }) => {
  

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
          updateStripboardHasScenes={updateStripboardHasScenes}
        />
      ))}
    </IonContent>
  );
};

export default React.memo(WeeksList);