export default function sortArrayAlphabeticaly(array: any[]): string[] {
  return array.sort((a, b) => a.localeCompare(b));
}
