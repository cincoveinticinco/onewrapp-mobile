const getOptionsArray = (nestedKey: string, uniqueValuesArray: any[]) => {
  const extrasOrItemsArray: string[] = [];

  if (Array.isArray(uniqueValuesArray)) {
    uniqueValuesArray.forEach((value: any) => {
      if (value[nestedKey].length > 1) {
        extrasOrItemsArray.push(value[nestedKey]);
      }
    });
  }

  return extrasOrItemsArray;
};

export default getOptionsArray;
