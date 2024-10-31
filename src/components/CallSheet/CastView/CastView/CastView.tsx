import { useRef } from 'react';
import { useParams } from 'react-router';
import { normalizeString } from 'rxdb';
import EditionModal, { FormInput } from '../../../Shared/EditionModal/EditionModal';
import GeneralTable, { Column } from '../../../Shared/GeneralTable/GeneralTable';
import NoRegisters from '../../NoRegisters/NoRegisters';

interface CastViewProps {
  castData: any[];
  addNewModalIsOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  editMode: boolean;
  addNewCastCall: (formData: any) => Promise<void>;
  castOptions: { value: any; label: string }[];
  editCastCall: (index: number, key: any, newValue: any, type: string) => void
  permissionType?: number | null
  searchText?: string
}

const CastView: React.FC<CastViewProps> = ({
  castData,
  addNewModalIsOpen,
  setIsOpen,
  editMode,
  addNewCastCall,
  castOptions,
  editCastCall,
  permissionType,
  searchText
}) => {
  const columns: Column[] = [
    {
      key: 'cast', title: 'CAST', type: 'double-data', textAlign: 'left', secondaryKey: 'name',
    },
    {
      key: 'tScn', title: 'SCN.', type: 'text', notShowWhenEdit: true,
    },
    {
      key: 'pickUp', title: 'PICKUP', type: 'hour', editable: true,
    },
    {
      key: 'callTime', title: 'CALL', type: 'hour', editable: true,
    },
    {
      key: 'onMakeUp', title: 'MAKEUP', type: 'hour', editable: true,
    },
    {
      key: 'onWardrobe', title: 'WARDROBE', type: 'hour', editable: true,
    },
    {
      key: 'readyToShoot', title: 'READY AT', type: 'hour', editable: true,
    },
    {
      key: 'arrived', title: 'ARRIVED', type: 'hour', editable: true
    },
    {
      key: 'onProsthetic', title: 'ON PROSTHETIC', type: 'hour', editable: true
    },
    {
      key: 'outProsthetic', title: 'OUT PROSTHETIC', type: 'hour', editable: true
    },
    {
      key: 'startProcesses', title: 'START PROCESSES', type: 'hour', editable: true
    },
    {
      key: 'endProcesses', title: 'END PROCESSES', type: 'hour', editable: true
    },
    {
      key: 'wrap', title: 'WRAP', type: 'hour', editable: true,
    },
    {
      key: 'wrapSet', title: 'WRAP SET', type: 'hour', editable: true,
    },
    {
      key: 'mealIn', title: '1 MEAL IN', type: 'hour', editable: true,
    },
    {
      key: 'mealOut', title: '1 MEAL OUT', type: 'hour', editable: true,
    },
    {
      key: 'mealExtraIn', title: '2 MEAL IN', type: 'hour', editable: true,
    },
    {
      key: 'mealExtraOut', title: '2 MEAL OUT', type: 'hour', editable: true,
    },
    {
      key: 'notes', title: 'NOTES', type: 'text', editable: true,
    },
  ];

  const AddCastCallModal: React.FC = () => {
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
        validate={valiateCastExists}
      />
    );
  };

  const valiateCastExists = (talentName: string, fieldKeyName: any) => {
    const talentExists = castData.some((talent) => normalizeString(talent.name) === normalizeString(talentName));
    if (talentExists && fieldKeyName === 'cast') return 'This talent already exists';
    return false;
  };

  if (addNewModalIsOpen) return <AddCastCallModal />;

  if (!castData || castData.length === 0) {
    return <NoRegisters addNew={() => setIsOpen(true)} disabled={permissionType !== 1} />;
  }

  return (
    <>
      <GeneralTable
        columns={columns}
        data={castData}
        stickyColumnCount={1}
        editMode={editMode}
        editFunction={editCastCall}
        groupBy='category'
        searchText={searchText}
      />
    </>
  );
};

export default CastView;
