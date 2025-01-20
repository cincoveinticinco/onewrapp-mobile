import { useRef } from "react";
import { useParams } from "react-router";
import EditionModal, { FormInput } from "../../../../Shared/EditionModal/EditionModal";

interface AddCastCallModalProps {
  addNewModalIsOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addNewCastCall: (formData: any) => Promise<void>;
  castOptions: { value: any; label: string }[];
  validateCastExists: (talentName: string, fieldKeyName: any) => boolean | string ;
}

const AddCastCallModal: React.FC<AddCastCallModalProps> = ({
  addNewModalIsOpen,
  setIsOpen,
  addNewCastCall,
  castOptions,
  validateCastExists,
}) => {
  const modalRef = useRef<HTMLIonModalElement>(null);
  const { shootingId } = useParams<{ shootingId: string }>();

  const castCallInputs: FormInput[] = [
    {
    fieldKeyName: 'cast',
    label: 'Cast',
    placeholder: 'Select cast',
    type: 'select',
    required: true,
    selectOptions: castOptions,
    col: '6',
    },
    {
    fieldKeyName: 'pickUp',
    label: 'Pick Up',
    placeholder: 'Enter pick up time',
    type: 'time',
    required: false,
    col: '6',
    },
    {
    fieldKeyName: 'callTime',
    label: 'Call Time',
    placeholder: 'Enter call time',
    type: 'time',
    required: true,
    col: '3',
    },
    {
    fieldKeyName: 'onMakeUp',
    label: 'Make Up',
    placeholder: 'Enter make up time',
    type: 'time',
    required: false,
    col: '3',
    },
    {
    fieldKeyName: 'onWardrobe',
    label: 'Wardrobe',
    placeholder: 'Enter wardrobe time',
    type: 'time',
    required: false,
    col: '3',
    },
    {
    fieldKeyName: 'readyToShoot',
    label: 'Ready to Shoot',
    placeholder: 'Enter ready time',
    type: 'time',
    required: false,
    col: '3',
    },
    {
    fieldKeyName: 'arrived',
    label: 'Arrived',
    placeholder: 'Enter arrived time',
    type: 'time',
    required: false,
    col: '3',
    },
    {
    fieldKeyName: 'onProsthetic',
    label: 'On Prosthetic',
    placeholder: 'Enter on prosthetic time',
    type: 'time',
    required: false,
    col: '3',
    },
    {
      fieldKeyName: 'outProsthetic',
      label: 'Out Prosthetic',
      placeholder: 'Enter out prosthetic time',
      type: 'time',
      required: false,
    },
    {
    fieldKeyName: 'outProsthetic',
    label: 'Out Prosthetic',
    placeholder: 'Enter out prosthetic time',
    type: 'time',
    required: false,
    col: '3',
    },
    {
    fieldKeyName: 'startProcesses',
    label: 'Start Processes',
    placeholder: 'Enter start processes time',
    type: 'time',
    required: false,
    col: '3',
    },
    {
    fieldKeyName: 'endProcesses',
    label: 'End Processes',
    placeholder: 'Enter end processes time',
    type: 'time',
    required: false,
    col: '3',
    },
    {
    fieldKeyName: 'wrap',
    label: 'Wrap',
    placeholder: 'Enter wrap time',
    type: 'time',
    required: false,
    col: '3',
    },
    {
    fieldKeyName: 'wrapSet',
    label: 'Wrap Set',
    placeholder: 'Enter wrap set time',
    type: 'time',
    required: false,
    col: '3',
    },
    {
    fieldKeyName: 'mealIn',
    label: '1 Meal In',
    placeholder: 'Enter 1 meal in time',
    type: 'time',
    required: false,
    col: '3',
    },
    {
    fieldKeyName: 'mealOut',
    label: '1 Meal Out',
    placeholder: 'Enter 1 meal out time',
    type: 'time',
    required: false,
    col: '3',
    },
    {
    fieldKeyName: 'mealExtraIn',
    label: '2 Meal In',
    placeholder: 'Enter 2 meal in time',
    type: 'time',
    required: false,
    col: '3',
    },
    {
    fieldKeyName: 'mealExtraOut',
    label: '2 Meal Out',
    placeholder: 'Enter 2 meal out time',
    type: 'time',
    required: false,
    col: '3',
    },
    {
    fieldKeyName: 'notes',
    label: 'Notes',
    placeholder: 'Enter notes',
    type: 'text',
    required: false,
    col: '6',
    },
  ];

  return (
    <EditionModal
      title="Add Cast Call"
      formInputs={castCallInputs}
      handleEdition={addNewCastCall}
      modalRef={modalRef}
      modalId={`add-cast-call-modal-${shootingId}`}
      defaultFormValues={{}}
      isOpen={addNewModalIsOpen}
      setIsOpen={setIsOpen}
      validate={validateCastExists}
    />
  );
};

export default AddCastCallModal;