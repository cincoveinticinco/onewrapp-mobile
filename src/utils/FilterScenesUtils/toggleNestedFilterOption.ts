import { SelectedFilterOptionsInterface } from '../../context/ScenesContext';

const toggleNestedFilterOption = (
  prevOptions: SelectedFilterOptionsInterface,
  category: string, nestedKey: string,
  optionValue: string,
) => {
  const updatedOptions: SelectedFilterOptionsInterface = { ...prevOptions };

  interface SelectedFilterOptionsInterface {
    [key: string]: any;
  }

  updatedOptions[category as keyof typeof updatedOptions] = updatedOptions[category] || [];

  const nestedOption = updatedOptions[category].find((opt: { [x: string]: any; }) => opt[nestedKey]);
  if (!nestedOption) {
    updatedOptions[category].push({ [nestedKey]: [] });
  }

  const nestedOptionArray = updatedOptions[category].find((opt: { [x: string]: any; }) => opt[nestedKey]);
  const optionIndex = nestedOptionArray[nestedKey].indexOf(optionValue);

  if (optionIndex > -1) {
    nestedOptionArray[nestedKey].splice(optionIndex, 1);
  } else {
    nestedOptionArray[nestedKey].push(optionValue);
  }

  if (nestedOptionArray[nestedKey].length === 0) {
    updatedOptions[category] = updatedOptions[category].filter((opt: any) => opt[nestedKey].length > 0);
  }

  if (updatedOptions[category].length === 0) {
    delete updatedOptions[category];
  }

  return updatedOptions;
};

export default toggleNestedFilterOption;
