export function floatToFraction(number: number) {
  const denominator = 8;
  const integerPart = Math.floor(number);
  const fractionalPart = number - integerPart;
  const numerator = Math.round(fractionalPart * denominator);

  if (numerator === denominator) {
    return `${integerPart + 1}`;
  } if (numerator === 0) {
    return `${integerPart}`;
  }
  return `${integerPart} ${numerator}/${denominator}`;
}
