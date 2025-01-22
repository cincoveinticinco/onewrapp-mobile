export default function sortArrayAlphabeticaly(array: any[]): string[] {
  return array.sort((a, b) => {
    if (a !== null && b !== null) {
      if (a.toLowerCase() < b.toLowerCase()) {
        return -1;
      }
      if (a.toLowerCase() > b.toLowerCase()) {
        return 1;
      }
    }
    return 0;
  });
}
