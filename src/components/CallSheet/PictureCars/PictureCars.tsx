import React from 'react';
import { PictureCar } from '../../../interfaces/shooting.types';
import EditionModal, { FormInput } from '../../Shared/EditionModal/EditionModal';
import GeneralTable, { Column } from '../../Shared/GeneralTable/GeneralTable';
import NoRegisters from '../NoRegisters/NoRegisters';

interface PictureCarsProps {
  pictureCars: PictureCar[]
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void;
  addNewPictureCar: (pictureCar: PictureCar) => void;
  editMode: boolean;
  editPictureCar: (pictureCarIndex: number, key: any, newValue: any, type: any) => void;
  permissionType?: number | null;
}

const PictureCars: React.FC<PictureCarsProps> = ({
  pictureCars, isOpen, setIsOpen, addNewPictureCar, editMode, editPictureCar, permissionType,
}) => {
  const modalRef = React.useRef<HTMLIonModalElement>(null);

  const validatePictureCarExists = (value: string) => {
    const pictureCarExists = pictureCars.some((pictureCar: PictureCar) => pictureCar.pictureCarName === value);
    if (pictureCarExists) return 'This picture car already exists';
    return false;
  };

  const AddNewModal = () => {
    const pictureCarInputs: FormInput[] = [
      {
        fieldKeyName: 'pictureCarName',
        label: 'Car Name',
        placeholder: 'Enter car name',
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
        title="Add New Picture Car"
        formInputs={pictureCarInputs}
        modalRef={modalRef}
        handleEdition={addNewPictureCar}
        defaultFormValues={{}}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        validate={validatePictureCarExists}
      />
    );
  };

  const pictureCarsColumns: Column[] = [
    { key: 'pictureCarName', title: 'Car Name', textAlign: 'left' },
    {
      key: 'quantity', title: 'Quantity', textAlign: 'center', editable: true, type: 'number',
    },
    {
      key: 'callTime', title: 'Call Time', type: 'hour', textAlign: 'right', editable: true,
    },
  ];

  if (isOpen) return <AddNewModal />;

  if (!pictureCars.length) {
    return (
      <NoRegisters
        addNew={() => setIsOpen(true)}
        disabled={
  permissionType !== 1
}
      />
    );
  }

  return (
    <>
      <GeneralTable columns={pictureCarsColumns} data={pictureCars} editMode={editMode} editFunction={editPictureCar} />
    </>
  );
};

export default PictureCars;
