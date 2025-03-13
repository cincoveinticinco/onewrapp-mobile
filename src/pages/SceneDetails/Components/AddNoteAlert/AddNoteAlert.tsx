import InputAlert from "../../../../Layouts/InputAlert/InputAlert";
import { useSceneDetailsContext } from "../../Context/SceneDetailsContext";

const AddNoteAlert = () => {

  const { addNoteModalOpen, setAddNoteModalOpen, form, currentUser } = useSceneDetailsContext();
  const { watch, setValue } = form;
  return (
    <InputAlert
      inputs={
        [
          {
            name: 'note',
            type: 'text',
            placeholder: 'Enter note',
            label: 'Note',
            value: '',
          },
        ]
      }
      header='Add Note'
      message='Add a note to this scene'
      handleOk={(inputData) => setValue('notes', [...(watch('notes') || []), {
        note: inputData.note,
        email: currentUser.userEmail || '',
      }])}
      isOpen={addNoteModalOpen}
      setIsOpen={setAddNoteModalOpen}
    />
  )
}

export default AddNoteAlert;
