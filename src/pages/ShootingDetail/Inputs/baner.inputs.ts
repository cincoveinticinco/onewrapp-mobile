import { FormInput, SelectOptionsInterface } from "../../../Shared/Components/EditionModal/EditionModal";
import colorIsDark from "../../../Shared/Utils/colorIsDark";

const availableColors = [
  { value: '#3dc2ff', name: 'light blue' },
  { value: '#282f3a', name: 'dark gray' },
  { value: '#04feaa', name: 'green' },
  { value: '#ffb203', name: 'orange' },
  { value: '#ff4a8f', name: 'pink' },
  { value: '#707070', name: 'gray' },
  { value: '#000', name: 'black' },
  { value: '#f3fb8c', name: 'yellow' },
  { value: '#fdc6f7', name: 'light pink' },
];

const fontSizeOptions: SelectOptionsInterface[] = [
  { value: 12, label: '12 px' },
  { value: 14, label: '14 px' },
  { value: 16, label: '16 px' },
  { value: 18, label: '18 px' },
  { value: 20, label: '20 px' },
];

const bannersSelectOptions = availableColors.map((color) => ({
  value: color.value,
  label: color.name,
  style: {
    backgroundColor: color.value,
    color: colorIsDark(color.value) ? 'white' : 'black',
    border: '1px solid var(--ion-color-tertiary-dark)',
  },
}));

export const bannerInputs: FormInput[] = [
  {
    label: 'Description', type: 'text', fieldKeyName: 'description', placeholder: 'INSERT', required: true, inputName: 'add-banner-description-input', col: '4',
  },
  {
    label: 'Font Size', type: 'select', fieldKeyName: 'fontSize', placeholder: 'INSERT', required: false, inputName: 'add-character-name-input', col: '4', selectOptions: fontSizeOptions,
  },
  {
    label: 'Color',
    type: 'select',
    fieldKeyName: 'backgroundColor',
    placeholder: 'SELECT COLOR',
    required: false,
    inputName: 'add-background-color-input',
    selectOptions: bannersSelectOptions,
    col: '4',
  },
];