/* eslint-disable */

import removeAccents from './removeAccents';

export const normalizeString = (string: string) => (
  string ? removeAccents(string.toLowerCase().replace(/ /g, '')) : ''
);

const matchOption = (dataObject: any, optionKey: any, optionValues: any) => {
  if (optionValues[0] === null) {
    return dataObject[optionKey] === null;
  }

  if (Array.isArray(dataObject[optionKey])) {
    return optionValues.every((nestedOptionObject: any) =>
      Object.entries(nestedOptionObject).every(([nestedOptionKey, nestedOptionArray]: any[]) =>
        nestedOptionArray.every((option: any) =>
          dataObject[optionKey].some((dataObjectItem: any) =>
            normalizeString(dataObjectItem[nestedOptionKey]).includes(normalizeString(option))
          )
        )
      )
    );
  }

  return (
    dataObject[optionKey] &&
    optionValues.some((option: any) =>
      normalizeString(dataObject[optionKey]).includes(normalizeString(option))
    )
  );
};

const applyFilters = (data: any, options: any, extraKey = true) => {
  if (extraKey) {
    data.forEach((dataObject: any) => {
      dataObject.episodeSceneNumber = `${dataObject.episodeNumber}.${dataObject.sceneNumber}`;
    });
  }

  if ('$or' in options) {
    const orOptions = options.$or;

    return data.filter((dataObject: any) =>
      Object.entries(orOptions).some(([optionKey, optionValues]: [string, any]) =>
        optionValues
          .flatMap((innerOption: any) => matchOption(dataObject, optionKey, [innerOption]))
          .some((result: any) => result)
      )
    );
  }

  return data.filter((dataObject: any) =>
    Object.entries(options).every(([optionKey, optionValues]: [string, any]) =>
      matchOption(dataObject, optionKey, optionValues)
    )
  );
};

export default applyFilters;

// Example of no nested filter options
// const filterOptions = { sceneType: ['protection', 'scene']}

// Example of nested filter options
// const filterOptions = { characters: [{categoryName: ['hero', 'villain']}, {characterName: ['Batman', 'Superman']}]}

// If a filter option is null, it should find all the data that has that value as null
