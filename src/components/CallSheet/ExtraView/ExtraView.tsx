import React from 'react';
import GeneralTable, { Column } from '../../Shared/GeneralTable/GeneralTable';
import { ExtraCall } from '../../../interfaces/shootingTypes';
import NoRegisters from '../NoRegisters/NoRegisters';
import EditionModal, { FormInput } from '../../Shared/EditionModal/EditionModal';

interface ExtraViewProps {
  extraViewData: ExtraCall[];
  editMode: boolean;
  addNewModalIsOpen: boolean;
  setAddNewModalIsOpen: (isOpen: boolean) => void;
}

const columns: Column[] = [
  { key: 'extraName', title: 'Extra', textAlign: 'left' },
  { key: 'talentAgency', title: 'Talent/Agency' },
  { key: 'quantity', title: 'Quantity' },
  { key: 'callTime', title: 'Call', type: 'hour' },
  { key: 'onMakeUp', title: 'Makeup', type: 'hour' },
  { key: 'onWardrobe', title: 'Wardrobe', type: 'hour' },
  { key: 'readyToShoot', title: 'Ready', type: 'hour' },
  { key: 'arrived', title: 'Arrived', type: 'hour' },
  { key: 'wrap', title: 'Wrap', type: 'hour' },
  { key: 'notes', title: 'Notes' }
];

const ExtraView: React.FC<ExtraViewProps> = ({ extraViewData, editMode, addNewModalIsOpen, setAddNewModalIsOpen }) => {
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

    return (
      <EditionModal
        title="Add New Extra"
        formInputs={extraInputs}
        handleEdition={() => {}}
        modalId='addExtraModal'
        modalTrigger='Add New Extra'
        modalRef={modalRef}
        isOpen={addNewModalIsOpen}
        setIsOpen={setAddNewModalIsOpen}
        defaultFormValues={{}}
      />
    )
  }

  if(addNewModalIsOpen) return <AddNewExtraModal />
  
  if(!extraViewData.length) return <NoRegisters addNew={() => setAddNewModalIsOpen(true)} />

  return (
    <GeneralTable columns={columns} data={extraViewData} editMode={editMode} />
  );
};

export default ExtraView;
