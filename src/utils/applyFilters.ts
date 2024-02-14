const normalizeString = (string: string) => string ? string.toLowerCase().replace(/ /g, '') : '';

const matchOption = (dataObject: any, optionKey: any, optionValues: any) => {

  if (optionValues[0] === null) {
    return dataObject[optionKey] === null;
  }

  if (Array.isArray(dataObject[optionKey])) {
    return optionValues.every((nestedOptionObject: any) => Object.entries(nestedOptionObject).every(([nestedOptionKey, nestedOptionArray]: any[]) => nestedOptionArray.every((option: any) => dataObject[optionKey].some((dataObjectItem: any) => normalizeString(dataObjectItem[nestedOptionKey]).includes( normalizeString(option))))));
  }

  return dataObject[optionKey] && optionValues.some((option: any) => normalizeString(dataObject[optionKey]).includes(normalizeString(option)));
};

const applyFilters = (data: any, options: any) => {
  if ('$or' in options) {
    const orOptions = options['$or'];

    return data.filter((dataObject: any) =>
      Object.entries(orOptions).some(([optionKey, optionValues]: [string, any]) =>
        matchOption(dataObject, optionKey, optionValues)
      )
    );
  } else {
    return data.filter((dataObject: any) =>
    Object.entries(options).every(([optionKey, optionValues]: [string, any]) =>
      matchOption(dataObject, optionKey, optionValues)
    )
    );
  }

  
};

export default applyFilters;

// example of no nested filter options
// const filterOptions = { sceneType: ['protection', 'scene']}

// example of nested filter options
// const filterOptions = { characters: [{categoryName: ['hero', 'villain']}, {characterName: ['Batman', 'Superman']}]}

// if a filter option is null, it should find all the data that has that value as null
