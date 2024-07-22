const getArrayWithUniqueValues = (array: any[]) => {
  return Array.from(new Set(array));
}

export default getArrayWithUniqueValues;