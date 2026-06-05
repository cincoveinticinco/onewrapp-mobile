import React from "react"
import EditionModal, { FormInput } from "../../../../Shared/Components/modals/EditionModal/EditionModal"
import useUnits from "../../../../hooks/database/useUnits/useUnits";

interface CreateStripboardModalProps {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
}

const CreateStripboardModal: React.FC<CreateStripboardModalProps> = ({
  openModal,
  setOpenModal,
}) => {
  const addShootingInputs: FormInput[] = [    
    {
      fieldKeyName: 'name',
      label: 'Name',
      placeholder: 'Name *',
      type: 'text',
      required: true,
      search: true,
      col: '6',
      offset: '3',
    },
    {
      fieldKeyName: 'startDate',
      label: 'Stripboard Date',
      placeholder: 'Enter stripboard date',
      type: 'date',
      required: true,
      col: '6',
      offset: '3',
      min: new Date().toISOString().split('T')[0] as `${number}${number}${number}${number}-${number}${number}-${number}${number}`,
    },
  ];
  return (
    <EditionModal
      isOpen={openModal}
      setIsOpen={setOpenModal}
      title="Create Stripboard"
      formInputs={addShootingInputs}
      handleEdition={(data: any) => console.log(data)}
    ></EditionModal>
  )
}

export default CreateStripboardModal