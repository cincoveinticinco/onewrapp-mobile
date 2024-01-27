import { FilterOptionsInterface } from '../../context/scenesFiltersContext';

const toggleFilterOption = (prevOptions: FilterOptionsInterface, category: string, optionValue: string) => {
  const updatedOptions = { ...prevOptions };
  const currentOptions: any[] = updatedOptions[category as keyof typeof updatedOptions] || [];
  const optionIndex = currentOptions.indexOf(optionValue);

  if (optionIndex > -1) {
    currentOptions.splice(optionIndex, 1);
  } else {
    currentOptions.push(optionValue);
  }

  updatedOptions[category as keyof typeof updatedOptions] = currentOptions.length > 0 ? currentOptions : undefined;

  return updatedOptions;
};

export default toggleFilterOption;
