const matchOption = (dataObject: any, optionKey: any, optionValues: any) => {
  if (Array.isArray(dataObject[optionKey])) {
    return optionValues.every((nestedOptionObject: any) => Object.entries(nestedOptionObject).every(([nestedOptionKey, nestedOptionArray]: any[]) => nestedOptionArray.every((option: any) => dataObject[optionKey].some((dataObjectItem: any) => dataObjectItem[nestedOptionKey] === option)))); // eslint-disable-line max-len
  }
  return optionValues.includes(dataObject[optionKey]);
};

const filterScenes = (data: any, options: any) => data.filter((dataObject: any) => Object.entries(options).every(([optionKey, optionValues]) => matchOption(dataObject, optionKey, optionValues))); // eslint-disable-line max-len

export default filterScenes;
