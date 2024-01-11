export function floatToFraction(number: number): string {
  const tolerance = 1.0E-6; // precisión
  let numerator = 1;
  let denominator = 1;
  let lowerNumerator = 0;
  let lowerDenominator = 1;
  let upperNumerator = 1;
  let upperDenominator = 0;
  let fraction = numerator / denominator;

  while (Math.abs(fraction - number) > tolerance) {
      if (number > fraction) {
          lowerNumerator = numerator;
          lowerDenominator = denominator;
          numerator += upperNumerator;
          denominator += upperDenominator;
      } else {
          upperNumerator = numerator;
          upperDenominator = denominator;
          numerator += lowerNumerator;
          denominator += lowerDenominator;
      }
      fraction = numerator / denominator;
  }

  return `${numerator}/${denominator}`;
}