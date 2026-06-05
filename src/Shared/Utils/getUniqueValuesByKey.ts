import { SceneDocType } from '../types/scenes.types';

type SceneWithIndexSignature = SceneDocType & {
  [key: string]: any;
};

function getUniqueValuesByKey(array: SceneWithIndexSignature[], key: keyof SceneWithIndexSignature) {
  const uniqueValues = new Set<SceneWithIndexSignature[keyof SceneWithIndexSignature]>();
  array?.forEach((item) => {
    if (item[key]) {
      uniqueValues.add(item[key]);
    }
  });
  return Array.from(uniqueValues);
}

export default getUniqueValuesByKey;

// EXAMPLE
// const scenes = [
//   { id: 1, setName: 'A' },
//   { id: 2, setName: 'B' },
//   { id: 3, setName: 'A' },
//   { id: 4, setName: 'C' },
//   { id: 5, setName: 'A' },
//   { id: 6, setName: 'B' }];
// getUniqueValuesByKey(scenes, 'setName');
// // ['A', 'B', 'C']
