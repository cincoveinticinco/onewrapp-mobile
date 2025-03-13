import { useRef } from "react";
import { ShootingInfoLabels } from "../../../../pages/ShootingDetail/Components/ShootingBasicInfo/ShootingBasicInfo";
import EditionModal from "../../modals/EditionModal/EditionModal";

export const EditableTimeField: React.FC<{
  value: number | null;
  title: string;
  updateTime: (minutes: number, seconds: number) => void;
  editMode: boolean;
}> = ({ value, title, updateTime, editMode }) => {

  const editionModalRef = useRef<HTMLIonModalElement>(null);

  const handleEdit = () => {
    if (editionModalRef.current) {
      editionModalRef.current.present();
    }
  };

  const handleEdition = (formData: { minutes: string; seconds: string }) => {
    updateTime(parseInt(formData.minutes), parseInt(formData.seconds));
  };

  const editionInputs = [
    {
      fieldKeyName: 'minutes',
      label: 'Minutes',
      placeholder: 'Enter minutes',
      type: 'number',
      required: true,
      col: '6',
    },
    {
      fieldKeyName: 'seconds',
      label: 'Seconds',
      placeholder: 'Enter seconds',
      type: 'number',
      required: true,
      col: '6',
    },
  ];

  const [minutes, seconds] = value ? [Math.floor(value / 60), value % 60] : [0, 0];

  return (
    <>
      <ShootingInfoLabels
        info={`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
        title={title}
        onEdit={handleEdit}
        isEditable={editMode}
      />
      <EditionModal
        modalRef={editionModalRef}
        modalTrigger="open-edit-time-modal-produced-seconds"
        title={`Edit ${title} (MM:SS)`}
        formInputs={editionInputs}
        handleEdition={handleEdition}
        defaultFormValues={{
          minutes: minutes.toString(),
          seconds: seconds.toString(),
        }}
        modalId="edit-time-modal-produced-seconds"
      />
    </>
  );
};

export default EditableTimeField;