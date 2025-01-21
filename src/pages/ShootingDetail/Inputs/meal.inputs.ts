import { FormInput } from "../../../components/Shared/EditionModal/EditionModal";

export const mealInputs:FormInput[] = [
    {
      label: 'Meal', type: 'text', fieldKeyName: 'meal', placeholder: 'INSERT', required: true, inputName: 'add-meal-input', col: '9',
    },
    {
      label: 'Quantity', type: 'number', fieldKeyName: 'quantity', placeholder: 'INSERT', required: true, inputName: 'add-quantity-input', col: '3',
    },
    {
      label: 'From Time', type: 'time', fieldKeyName: 'ready_at', placeholder: 'SELECT TIME', required: true, inputName: 'add-from-time-input', col: '6',
    },
    {
      label: 'End Time', type: 'time', fieldKeyName: 'end_time', placeholder: 'SELECT TIME', required: true, inputName: 'add-end-time-input', col: '6',
    },
  ];