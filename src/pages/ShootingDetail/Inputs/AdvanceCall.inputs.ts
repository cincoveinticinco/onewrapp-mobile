import { FormInput, SelectOptionsInterface } from "../../../components/Shared/EditionModal/EditionModal";

export const advanceCallInputs: (departments: SelectOptionsInterface[] ) => FormInput[]  = (departments) => [
    {
      label: 'Department', type: 'select', fieldKeyName: 'dep_name_eng', placeholder: 'INSERT', required: true, inputName: 'add-department-input', col: '6', selectOptions: departments, search: true
    },
    {
      label: 'Call', type: 'time', fieldKeyName: 'advCallTime', placeholder: 'SELECT TIME', required: true, inputName: 'add-call-input', col: '6',
    },
    {
      label: 'Description', type: 'text', fieldKeyName: 'description', placeholder: 'INSERT', required: false, inputName: 'add-description-input', col: '12'
    },
  ];