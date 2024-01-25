export function customArraySort(array: string[]): string[] {
  const extractNumber = (str: string): number => {
    const match = str.match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : Infinity;
  };

  return array.sort((a, b) => {
    const numberA = extractNumber(a);
    const numberB = extractNumber(b);

    if (numberA !== numberB) {
      return numberA - numberB;
    }

    return a.localeCompare(b);
  });
}
