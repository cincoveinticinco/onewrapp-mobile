export const isNumberValidator = (value: string) => {
  return /^\d+$/.test(value);
}

export const isEmailValidator = (value: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export const isNotEmptyValidator = (value: string) => {
  return value.trim() !== '';
}

export const isMinLengthValidator = (value: string, minLength: number) => {
  return value.trim().length >= minLength;
}

export const isMaxLengthValidator = (value: string, maxLength: number) => {
  return value.trim().length <= maxLength;
}

export const isMinValueValidator = (value: number, minValue: number) => {
  return value >= minValue;
}