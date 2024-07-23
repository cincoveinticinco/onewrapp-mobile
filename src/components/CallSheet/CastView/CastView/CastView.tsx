import { useRef } from 'react'
import EditionModal, { FormInput } from '../../../Shared/EditionModal/EditionModal'
import GeneralTable, { Column } from '../../../Shared/GeneralTable/GeneralTable'
import { useParams } from 'react-router'
import NoRegisters from '../../NoRegisters/NoRegisters'

const CastView = ({ castData, addNewModalIsOpen, setIsOpen, editMode, addNewCastCall, castOptions }: { castData: any, addNewModalIsOpen: boolean, setIsOpen: any, editMode: any, addNewCastCall: any, castOptions: any }) => {

  const columns = [
    { key: 'cast', title: 'CAST', type: 'text', textAlign: 'left' },
    { key: 'name', title: 'TALENT', type: 'text' },
    { key: 'tScn', title: 'T. SCN.', type: 'text'},
    { key: 'pickUp', title: 'PICKUP', type: 'hour' },
    { key: 'callTime', title: 'CALL', type: 'hour' },
    { key: 'onMakeUp', title: 'MAKEUP', type: 'hour' },
    { key: 'onWardrobe', title: 'WARDROBE', type: 'hour'},
    { key: 'readyToShoot', title: 'READY', type: 'hour'},
    { key: 'notes', title: 'NOTES', type: 'text'},
  ] as Column[]

  const AddCastCallModal = () => {
    const modalRef = useRef<HTMLIonModalElement>(null)
    const { shootingId } = useParams<{ shootingId: string }>()
  
    const castCallInputs: FormInput[] = [
      {
        fieldName: 'cast',
        label: 'Cast',
        placeholder: 'Select cast',
        type: 'select',
        required: true,
        selectOptions: castOptions,
        col: '6'
      },
      {
        fieldName: 'pickUp',
        label: 'Pick Up',
        placeholder: 'Enter pick up time',
        type: 'time',
        required: false,
        col: '6'
      },
      {
        fieldName: 'callTime',
        label: 'Call Time',
        placeholder: 'Enter call time',
        type: 'time',
        required: true,
        col: '3'
      },
      {
        fieldName: 'onMakeUp',
        label: 'Make Up',
        placeholder: 'Enter make up time',
        type: 'time',
        required: false,
        col: '3'
      },
      {
        fieldName: 'onWardrobe',
        label: 'Wardrobe',
        placeholder: 'Enter wardrobe time',
        type: 'time',
        required: false,
        col: '3'
      },
      {
        fieldName: 'readyToShoot',
        label: 'Ready to Shoot',
        placeholder: 'Enter ready time',
        type: 'time',
        required: false,
        col: '3'
      },
      {
        fieldName: 'notes',
        label: 'Notes',
        placeholder: 'Enter notes',
        type: 'text',
        required: false,
        col: '6'
      }
    ];
  
    return (
      <EditionModal
        title="Add Cast Call"
        formInputs={castCallInputs}
        handleEdition={addNewCastCall}
        modalRef={modalRef}
        modalId={`add-cast-call-modal-${shootingId}`}
        modalTrigger='Add Cast Call'
        defaultFormValues={{ }}
        isOpen={addNewModalIsOpen}
        setIsOpen={setIsOpen}
      />
    )
  }

  if(addNewModalIsOpen) return <AddCastCallModal />

  if (!castData || castData.length === 0) {
    return (
      <NoRegisters addNew={() => setIsOpen(true)} />
    )
  }
  return (
    <>
      <GeneralTable columns={columns} data={castData} stickyColumnCount={1} editMode={editMode} />
    </>
  )
}

export default CastView