import React from 'react'
import { OtherCall } from '../../../interfaces/shootingTypes'
import NoRegisters from '../NoRegisters/NoRegisters'
import GeneralTable, { Column } from '../../Shared/GeneralTable/GeneralTable'
import EditionModal, { FormInput } from '../../Shared/EditionModal/EditionModal'

interface OtherCallsProps {
  otherCalls: OtherCall[]
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  addNewOtherCall: (otherCall: OtherCall) => void
}

const OtherCalls: React.FC<OtherCallsProps> = ( { otherCalls, isOpen, setIsOpen, addNewOtherCall }) => {
   // I need three columns for this, car name (key pictureCarName), quantity(quantity) and call time (key callTime)
  const otherCallsColumns: Column[] = [
    { key: 'otherCallName', title: 'Other Call Name', textAlign: 'left' },
    { key: 'quantity', title: 'Quantity', textAlign: 'center' },
    { key: 'callTime', title: 'Call Time', type: 'hour', textAlign: 'right' }
  ]

  const modalRef = React.useRef<HTMLIonModalElement>(null)

  const AddNewCallModal = () => {
    const callInputs: FormInput[] = [
      {
        fieldName: 'otherCallName',
        label: 'Other Call Name',
        placeholder: 'Enter other call name',
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
        col: '4'
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
        title="Add New Call"
        formInputs={callInputs}
        modalRef={modalRef}
        handleEdition={addNewOtherCall}
        defaultFormValues={{}}
        modalTrigger='Add New Call'
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    )
  
  }

  if (isOpen) return <AddNewCallModal />

  if (!otherCalls.length) return <NoRegisters addNew={() => setIsOpen(true)} />

  return (
    <>
      <GeneralTable columns={otherCallsColumns} data={otherCalls} stickyColumnCount={1} />
    </>
  )
}

export default OtherCalls