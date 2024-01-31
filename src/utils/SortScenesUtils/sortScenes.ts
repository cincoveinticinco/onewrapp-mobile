// import sceneData from '../../data/scn_data.json';

// CRITERIA is an array of criterias, where each criteria is an array with the following structure:
// [CRITERIAKEY, ASCENDING/DESCENDING]

const sortBySceneNumber = (a: any, b: any, criteriaOrder: string) => {
  const [aNumber, aLetter] = a.match(/(\d+)([A-Z]*)/).slice(1);
  const [bNumber, bLetter] = b.match(/(\d+)([A-Z]*)/).slice(1);

  // Convert aNumber and bNumber into integer numbers
  const aNumberInt = parseFloat(aNumber);
  const bNumberInt = parseFloat(bNumber);

  // Sort first by number and then by letter
  if (aNumberInt !== bNumberInt) {
    return criteriaOrder === 'asc' ? aNumberInt - bNumberInt : bNumberInt - aNumberInt;
  }
  // If numbers are equal, sort by letter (if any)
  if (aLetter && bLetter) {
    return criteriaOrder === 'asc' ? aLetter.localeCompare(bLetter) : bLetter.localeCompare(aLetter);
  } if (!aLetter && bLetter) {
    return criteriaOrder === 'asc' ? -1 : 1;
  } if (aLetter && !bLetter) {
    return criteriaOrder === 'asc' ? 1 : -1;
  }
  return 0;
};

// "1.1A"

const applySortCriteria = (data: any, criteria: any) => {
  const [criteriaKey, criteriaOrder] = criteria;
  if (criteriaKey === 'sceneNumber') {
    return data.sort((a: any, b: any) => sortBySceneNumber(a.sceneNumber, b.sceneNumber, criteriaOrder));
  }

  return data.sort((a: any, b: any) => {
    const aValue = !Number.isNaN(Number.parseFloat(a[criteriaKey])) ? Number.parseFloat(a[criteriaKey]) : a[criteriaKey];
    const bValue = !Number.isNaN(Number.parseFloat(b[criteriaKey])) ? Number.parseFloat(b[criteriaKey]) : b[criteriaKey];

    if (aValue < bValue) {
      return criteriaOrder === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return criteriaOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

const orderSortCriteria = (sortOptions: any[]) => {
  sortOptions.sort((a, b) => {
    const aOptionIndex = a[2];
    const bOptionIndex = b[2];
    return bOptionIndex - aOptionIndex;
  });
};

const sortScenes = (data: any, criterias: any) => {
  orderSortCriteria(criterias);
  return criterias.reduce((acc: any, criteria: any) => applySortCriteria(acc, criteria), data);
};

export default sortScenes;

// EXAMPLE

// THE FIRST CRITERIA APPLIED IS THE LAST ONE

// const scenes = [...sceneData.scenes];
// const sortCriteria = [['dayOrNightOption', 'desc']];

// CHECK DAY OR NIGHT OPTION

// const sortedScenes = sortScenes(scenes, sortCriteria);

// // console.log('UTILS DISPLAY', sortedScenes);
