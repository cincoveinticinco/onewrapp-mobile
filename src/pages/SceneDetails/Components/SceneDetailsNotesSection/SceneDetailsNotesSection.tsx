import { IonCard } from "@ionic/react";
import AddButton from "../../../../Shared/Components/buttons/AddButton/AddButton";
import { useSceneDetailsContext } from "../../Context/SceneDetailsContext";
import AddNoteAlert from "../AddNoteAlert/AddNoteAlert";
import { Note } from "../../../../Shared/types/scenes.types";

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
        (watch("notes") || []).map((note: Note, index: number) => (
          <IonCard
            color='tertiary-dark'
            key={`note-${index}`}
            className="scene-details-card ion-flex-column ion-justify-content-center ion-align-items-start ion-padding-start"
          >
            <p>{note.note}</p>
            <p>{note.email}</p>
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