import { IonContent, IonHeader } from "@ionic/react";
import WeekItem from "../WeekItem/WeekItem";
import ModalToolbar from "../../../../Shared/Components/modals/ModalToolbar/ModalToolbar";
import { StripboardWeeks } from "../../../../Shared/types/stripboard.types";
import React from "react";


interface WeeksListProps {
  weeks: StripboardWeeks[];
  stripboardName: string;
}

const WeeksList: React.FC<WeeksListProps> = ({ weeks, stripboardName }) => {

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
        />
      ))}
    </IonContent>
  );
};

export default React.memo(WeeksList);