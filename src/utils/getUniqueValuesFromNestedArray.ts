export default function getUniqueValuesFromNestedArray(items: any, arrayKey: any, valueKey: any) {
  const uniqueValues = new Map();

  items.forEach((item: any) => {
    item[arrayKey].forEach((nestedItem: any) => {
      const value = nestedItem[valueKey];
      uniqueValues.set(value, nestedItem);
    });
  });

  return Array.from(uniqueValues.values());
}

const data = [
  { characterArray: [{ characterName: 'Daniel', color: 'red' }] },
  { characterArray: [{ characterName: 'Daniel', color: 'blue' }, { characterName: 'Fernando', color: 'purple' }] },
];

console.log(getUniqueValuesFromNestedArray(data, 'characterArray', 'characterName'));
// Output:[{ characterName: 'Daniel', color: 'blue' },{ characterName: 'Fernando', color: 'purple' }]
