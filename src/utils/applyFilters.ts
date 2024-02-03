const matchOption = (dataObject: any, optionKey: any, optionValues: any) => {
  if (Array.isArray(dataObject[optionKey])) {
    return optionValues.every((nestedOptionObject: any) => Object.entries(nestedOptionObject).every(([nestedOptionKey, nestedOptionArray]: any[]) => nestedOptionArray.every((option: any) => dataObject[optionKey].some((dataObjectItem: any) => dataObjectItem[nestedOptionKey] === option)))); // eslint-disable-line max-len
  }

  if (optionValues === null) {
    return dataObject[optionKey] === null;
  }

  return optionValues.includes(dataObject[optionKey]);
};

const applyFilters = (data: any, options: any) => data.filter((dataObject: any) => Object.entries(options).every(([optionKey, optionValues]) => matchOption(dataObject, optionKey, optionValues))); // eslint-disable-line max-len

export default applyFilters;

// example of no nested filter options
// const filterOptions = { sceneType: ['protection', 'scene']}

// example of nested filter options
// const filterOptions = { characters: [{categoryName: ['hero', 'villain']}, {characterName: ['Batman', 'Superman']}]}

// if a filter option is null, it should find all the data that has that value as null
