import React from 'react';
import GeneralTable, { Column } from '../../Shared/GeneralTable/GeneralTable';
import { ExtraCall } from '../../../interfaces/shootingTypes';
import NoRegisters from '../NoRegisters/NoRegisters';
import EditionModal, { FormInput } from '../../Shared/EditionModal/EditionModal';
import { normalizeString } from 'rxdb';

interface ExtraViewProps {
  extraViewData: ExtraCall[];
  editMode: boolean;
  addNewModalIsOpen: boolean;
  setAddNewModalIsOpen: (isOpen: boolean) => void;
  addNewExtraCall: (extraCall: ExtraCall) => void;
  editExtraCall: (index: number, key: any, newValue: any, type: string) => void;
}

const columns: Column[] = [
  { key: 'extraName', title: 'Extra', textAlign: 'left' },
  { key: 'talentAgency', title: 'Talent/Agency' },
  { key: 'quantity', title: 'Quantity', type: 'number', editable: true },
  { key: 'callTime', title: 'Call', type: 'hour', editable: true },
  { key: 'onMakeUp', title: 'Makeup', type: 'hour', editable: true },
  { key: 'onWardrobe', title: 'Wardrobe', type: 'hour', editable: true },
  { key: 'readyToShoot', title: 'Ready', type: 'hour', editable: true },
  { key: 'arrived', title: 'Arrived', type: 'hour', editable: true },
  { key: 'wrap', title: 'Wrap', type: 'hour', editable: true },
  { key: 'notes', title: 'Notes', editable: true }
];

const ExtraView: React.FC<ExtraViewProps> = ({ extraViewData, editMode, addNewModalIsOpen, setAddNewModalIsOpen, addNewExtraCall, editExtraCall }) => {
  const modalRef = React.useRef<HTMLIonModalElement>(null);

  // Para el modal de creacion, necesito las opciones Extra, Quantity, CAll, makeup, wardrobe, ready, arrived, wrap, notes y talent agency. Las llaves respectivas son extraName, quantity, callTime, onMakeUp, onWardrobe, readyToShoot, arrived, wrap, notes y talentAgency

  const AddNewExtraModal = () => {
    const extraInputs: FormInput[] = [
      {
        fieldName: 'extraName',
        label: 'Extra',
        placeholder: 'Enter extra name',
        type: 'text',
        required: true,
        col: '6'
      },
      {
        fieldName: 'talentAgency',
        label: 'Talent/Agency',
        placeholder: 'Enter talent or agency',
        type: 'text',
        required: true,
        col: '6'
      },
      {
        fieldName: 'quantity',
        label: 'Quantity',
        placeholder: 'Enter quantity',
        type: 'number',
        required: true,
        col: '4'
      },
      {
        fieldName: 'callTime',
        label: 'Call',
        placeholder: 'Enter call time',
        type: 'time',
        required: true,
        col: '4'
      },
      {
        fieldName: 'onMakeUp',
        label: 'Makeup',
        placeholder: 'Enter makeup time',
        type: 'time',
        required: true,
        col: '4'
      },
      {
        fieldName: 'onWardrobe',
        label: 'Wardrobe',
        placeholder: 'Enter wardrobe time',
        type: 'time',
        required: true,
        col: '4'
      },
      {
        fieldName: 'readyToShoot',
        label: 'On Set',
        placeholder: 'Enter ready time',
        type: 'time',
        required: true,
        col: '4'
      },
      {
        fieldName: 'notes',
        label: 'Notes',
        placeholder: 'Enter notes',
        type: 'text',
        required: false,
        col: '12'
      }
    ];

    const validateExtraExists = (extraName: string, fieldName: any) => {
      const extraExists = extraViewData.some((extra: ExtraCall) => normalizeString(extra.extraName || '') === normalizeString(extraName))
      console.log(fieldName, '************')
      if (extraExists && fieldName === 'extraName') return 'This extra already exists'
      return false
    }

    return (
      <EditionModal
        title="Add New Extra"
        formInputs={extraInputs}
        handleEdition={addNewExtraCall}
        modalId='addExtraModal'
        modalTrigger='Add New Extra'
        modalRef={modalRef}
        isOpen={addNewModalIsOpen}
        setIsOpen={setAddNewModalIsOpen}
        defaultFormValues={{}}
        validate={validateExtraExists}
      />
    )
  }

  if(addNewModalIsOpen) return <AddNewExtraModal />
  
  if(!extraViewData.length) return <NoRegisters addNew={() => setAddNewModalIsOpen(true)} />

  return (
    <GeneralTable columns={columns} data={extraViewData} editMode={editMode} editFunction={editExtraCall} />
  );
};

export default ExtraView;
