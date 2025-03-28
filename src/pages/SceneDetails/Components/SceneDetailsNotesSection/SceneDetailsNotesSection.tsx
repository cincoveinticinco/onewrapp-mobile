import { IonCard } from "@ionic/react";
import AddButton from "../../../../Shared/Components/buttons/AddButton/AddButton";
import { useSceneDetailsContext } from "../../Context/SceneDetailsContext";
import AddNoteAlert from "../AddNoteAlert/AddNoteAlert";
import { Note } from "../../../../Shared/types/scenes.types";
import { useEffect } from "react";

const SceneDetailsNotesSection = () => {
  const { editMode, setAddNoteModalOpen, form } = useSceneDetailsContext();
  const { watch } = form;
  return (
    <div className={`section-wrapper notes-info`}>
      <div className="ion-flex ion-justify-content-between" style={{ backgroundColor: "var(--ion-color-dark)" }}>
        <p className="ion-flex ion-align-items-center ion-padding-start">NOTES</p>
        {editMode && <AddButton onClick={() => setAddNoteModalOpen(true)} slot="end" />}
      </div>
      {(watch("notes") || []).length > 0 ? (
        (watch("notes") || []).map((note: Note) => (
          <IonCard
            color='tertiary-dark'
            key={`note-${note}`}
            className="scene-details-card ion-flex-column ion-justify-content-center ion-align-items-start ion-padding-start"
          >
            <p className="ion-no-padding ion-no-margin-bottom"><b>{note.userName?.toLocaleUpperCase()}</b></p>
            <p className="ion-no-padding ion-no-margin-top">{note.note?.toLocaleUpperCase()}</p>
          </IonCard>
        ))
      ) : (
        <IonCard
          className="ion-flex-column ion-justify-content-center ion-align-items-center"
          color='tertiary-dark'
        >
          <p>NO NOTES ADDED</p>
        </IonCard>
      )}
      <AddNoteAlert />
    </div>
  );
}

export default SceneDetailsNotesSection;