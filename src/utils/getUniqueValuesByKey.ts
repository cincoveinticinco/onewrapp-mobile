import { Scene } from "../interfaces/scenesTypes";

interface SceneWithIndexSignature extends Scene {
  [key: string]: any;
}

export function getUniqueValuesByKey(array: SceneWithIndexSignature[], key: string | number) {
  const uniqueValues = new Set();
  array.forEach(item => {
      if (item[key]) {
          uniqueValues.add(item[key]);
      }
  });
  return Array.from(uniqueValues);
}