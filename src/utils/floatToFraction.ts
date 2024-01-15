export function floatToFraction(number: number) {
  const denominator = 8;
  const integerPart = Math.floor(number);
  const fractionalPart = number - integerPart;
  let numerator = Math.round(fractionalPart * denominator);

  if (numerator === denominator) {
      return `${integerPart + 1}`;
  } else if (numerator === 0) {
      return `${integerPart}`;
  } else {
      return `${integerPart} ${numerator}/${denominator}`;
  }
}
