import React from 'react';
import { normalizeString } from 'rxdb';
import { OtherCall } from '../../../interfaces/shooting.types';
import NoRegisters from '../NoRegisters/NoRegisters';
import GeneralTable, { Column } from '../../Shared/GeneralTable/GeneralTable';
import EditionModal, { FormInput } from '../../Shared/EditionModal/EditionModal';

interface OtherCallsProps {
  otherCalls: OtherCall[]
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  addNewOtherCall: (otherCall: OtherCall) => void
  editMode: boolean
  editOtherCall: (index: number, key: any, newValue: any, type: string) => void
}

const OtherCalls: React.FC<OtherCallsProps> = ({
  otherCalls,
  isOpen,
  setIsOpen,
  addNewOtherCall,
  editMode,
  editOtherCall,
}) => {
  // I need three columns for this, car name (key pictureCarName), quantity(quantity) and call time (key callTime)
  const otherCallsColumns: Column[] = [
    { key: 'otherCallName', title: 'Other Call Name', textAlign: 'left' },
    {
      key: 'quantity', title: 'Quantity', textAlign: 'center', editable: true, type: 'number',
    },
    {
      key: 'callTime', title: 'Call Time', type: 'hour', textAlign: 'right', editable: true,
    },
  ];

  const valiateOtherCallExists = (value: string) => {
    const otherCallExists = otherCalls.some((otherCall: OtherCall) => normalizeString(otherCall.otherCallName) === normalizeString(value));
    if (otherCallExists) return 'This other call already exists';
    return false;
  };

  const modalRef = React.useRef<HTMLIonModalElement>(null);

  const AddNewCallModal = () => {
    const callInputs: FormInput[] = [
      {
        fieldKeyName: 'otherCallName',
        label: 'Other Call Name',
        placeholder: 'Enter other call name',
        type: 'text',
        required: true,
        col: '4',
      },
      {
        fieldKeyName: 'quantity',
        label: 'Quantity',
        placeholder: 'Enter quantity',
        type: 'number',
        required: true,
        col: '4',
      },
      {
        fieldKeyName: 'callTime',
        label: 'Call Time',
        placeholder: 'Enter call time',
        type: 'time',
        required: true,
        col: '4',
      },
    ];

    return (
      <EditionModal
        title="Add New Call"
        formInputs={callInputs}
        modalRef={modalRef}
        handleEdition={addNewOtherCall}
        defaultFormValues={{}}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        validate={valiateOtherCallExists}
      />
    );
  };

  if (isOpen) return <AddNewCallModal />;

  if (!otherCalls.length) return <NoRegisters addNew={() => setIsOpen(true)} />;

  return (
    <>
      <GeneralTable
        columns={otherCallsColumns}
        data={otherCalls}
        stickyColumnCount={1}
        editMode={editMode}
        editFunction={editOtherCall}
      />
    </>
  );
};

export default OtherCalls;
