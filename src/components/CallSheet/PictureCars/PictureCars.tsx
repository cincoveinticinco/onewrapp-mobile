import React from 'react'
import { PictureCar } from '../../../interfaces/shootingTypes'
import NoRegisters from '../NoRegisters/NoRegisters'
import GeneralTable, { Column } from '../../Shared/GeneralTable/GeneralTable'
import EditionModal, { FormInput } from '../../Shared/EditionModal/EditionModal'

interface PictureCarsProps {
  pictureCars: PictureCar[]
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void;
  addNewPictureCar: (pictureCar: PictureCar) => void;
  editMode: boolean;
  editPictureCar: (pictureCarIndex: number, key: any, newValue: any, type: any) => void;
}

const PictureCars: React.FC<PictureCarsProps> = ({ pictureCars, isOpen, setIsOpen, addNewPictureCar, editMode, editPictureCar }) => {

  const modalRef = React.useRef<HTMLIonModalElement>(null)

  const AddNewModal = () => {
    const pictureCarInputs: FormInput[] = [
      {
        fieldName: 'pictureCarName',
        label: 'Car Name',
        placeholder: 'Enter car name',
        type: 'text',
        required: true,
        col: '4'
      },
      {
        fieldName: 'quantity',
        label: 'Quantity',
        placeholder: 'Enter quantity',
        type: 'number',
        required: true,
        col: '4',
      },
      {
        fieldName: 'callTime',
        label: 'Call Time',
        placeholder: 'Enter call time',
        type: 'time',
        required: true,
        col: '4'
      }
    ]

    return (
      <EditionModal
        title="Add New Picture Car"
        formInputs={pictureCarInputs}
        modalRef={modalRef}
        handleEdition={addNewPictureCar}
        defaultFormValues={{}}
        modalTrigger='Add New Picture Car'
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    )
  }

  const pictureCarsColumns: Column[] = [
    { key: 'pictureCarName', title: 'Car Name', textAlign: 'left', editable: true },
    { key: 'quantity', title: 'Quantity', textAlign: 'center', editable: true, type: 'number' },
    { key: 'callTime', title: 'Call Time', type: 'hour', textAlign: 'right', editable: true }
  ]

  if(isOpen) return <AddNewModal />

  if(!pictureCars.length) return <NoRegisters addNew={() => setIsOpen(true)} />

  return (
    <>
      <GeneralTable columns={pictureCarsColumns} data={pictureCars} editMode={editMode} editFunction={editPictureCar}/>
    </>
  )
}

export default PictureCars