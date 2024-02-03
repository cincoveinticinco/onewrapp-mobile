const getOptionsArray = (nestedKey: string, uniqueValuesArray: any[]) => {
  const extrasOrItemsArray: string[] = [];

  if (Array.isArray(uniqueValuesArray)) {
    uniqueValuesArray.forEach((value: any) => {
      if (value[nestedKey].length > 1) {
        extrasOrItemsArray.push(value[nestedKey]);
      }
    });
  }

  if (!Array.isArray(uniqueValuesArray)) {
    console.log('ALEEEERTTTTTT!!!!!!!!!!!!!!!!!');
    console.log('uniqueValuesArray is not an array', uniqueValuesArray, nestedKey);
  }

  return extrasOrItemsArray;
};

export default getOptionsArray;
