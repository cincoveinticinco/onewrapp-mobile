import { useRef } from 'react'
import EditionModal, { FormInput } from '../../../Shared/EditionModal/EditionModal'
import GeneralTable, { Column } from '../../../Shared/GeneralTable/GeneralTable'
import { useParams } from 'react-router'
import OutlineLightButton from '../../../Shared/OutlineLightButton/OutlineLightButton'
import NoRegisters from '../../NoRegisters/NoRegisters'

const CastView = ({ castData, addNewModalIsOpen, setIsOpen, editMode }: { castData: any, addNewModalIsOpen: boolean, setIsOpen: any, editMode: any }) => {

  const columns = [
    { key: 'cast', title: 'CAST', type: 'text', textAlign: 'left' },
    { key: 'talent', title: 'TALENT', type: 'text' },
    { key: 'tScn', title: 'T. SCN.', type: 'text'},
    { key: 'pickup', title: 'PICKUP', type: 'hour' },
    { key: 'call', title: 'CALL', type: 'hour' },
    { key: 'makeup', title: 'MAKEUP', type: 'hour' },
    { key: 'wardrobe', title: 'WARDROBE', type: 'hour'},
    { key: 'ready', title: 'READY', type: 'hour'},
    { key: 'notes', title: 'NOTES', type: 'text'},
  ] as Column[]

  const AddCastCallModal = () => {
    const modalRef = useRef<HTMLIonModalElement>(null)
    const castOptions = castData.map((cast: any) => ({ value: cast.cast, label: cast.cast }))
    const { shootingId } = useParams<{ shootingId: string }>()

    // Necessary fields: Cast* (select), pickup, call, makeup, wardrobe, ready, notes
    const castCallInputs: FormInput[] = [
      {
        fieldName: 'cast',
        label: 'Cast',
        placeholder: 'Select cast',
        type: 'select',
        required: true,
        selectOptions: castOptions,
        col: '4'
      },
      {
        fieldName: 'pickup',
        label: 'Pickup',
        placeholder: 'Enter pickup time',
        type: 'time',
        required: true,
        col: '4'
      },
      {
        fieldName: 'call',
        label: 'Call',
        placeholder: 'Enter call time',
        type: 'time',
        required: true,
        col: '4'
      },
      {
        fieldName: 'makeup',
        label: 'Makeup',
        placeholder: 'Enter makeup time',
        type: 'time',
        required: true,
        col: '4'
      },
      {
        fieldName: 'wardrobe',
        label: 'Wardrobe',
        placeholder: 'Enter wardrobe time',
        type: 'time',
        required: true,
        col: '4'
      },
      {
        fieldName: 'ready',
        label: 'Ready',
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
        title="Add Cast Call"
        formInputs={castCallInputs}
        handleEdition={(values: any) => console.log(values)}
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