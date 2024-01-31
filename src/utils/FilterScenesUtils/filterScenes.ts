const matchCriteria = (dataObject: any, criteriaKey: any, criteriaValues: any) => {
  if (Array.isArray(dataObject[criteriaKey])) {
    return criteriaValues.every((nestedCriteriaObject: any) => Object.entries(nestedCriteriaObject).every(([nestedCriteriaKey, nestedCriteriaArray]: any[]) => nestedCriteriaArray.every((criteria: any) => dataObject[criteriaKey].some((dataObjectItem: any) => dataObjectItem[nestedCriteriaKey] === criteria)))); // eslint-disable-line max-len
  }
  return criteriaValues.includes(dataObject[criteriaKey]);
};

const filterScenes = (data: any, criterias: any) => data.filter((dataObject: any) => Object.entries(criterias).every(([criteriaKey, criteriaValues]) => matchCriteria(dataObject, criteriaKey, criteriaValues))); // eslint-disable-line max-len

export default filterScenes;
