import { FilterOptionsInterface } from '../../context/ScenesContext';

const toggleFilterOption = (prevOptions: FilterOptionsInterface, category: string, optionValue: string) => {
  const updatedOptions: { [key: string]: any[] } = { ...prevOptions };
  const currentOptions: any[] = updatedOptions[category as keyof typeof updatedOptions] || [];
  const optionIndex = currentOptions.indexOf(optionValue);

  if (optionIndex > -1) {
    currentOptions.splice(optionIndex, 1);
  } else {
    currentOptions.push(optionValue);
  }

  updatedOptions[category] = currentOptions.length > 0 ? currentOptions : [];

  if (updatedOptions[category] && updatedOptions[category].length === 0) {
    delete updatedOptions[category as keyof typeof updatedOptions];
  }

  return updatedOptions;
};

export default toggleFilterOption;
