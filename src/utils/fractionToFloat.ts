export function fractionToFloat(integerPart: number, numerator: number): number {
  return integerPart + numerator / 8;
}
