export const isNumberValidator = (value: string) => 
  /^\d+$/.test(value) ? true : 'Must be a number';

export const isEmailValidator = (value: string) => 
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? true : 'Invalid email format';

export const isNotEmptyValidator = (value: string) => 
  value.trim() !== '' ? true : 'Cannot be empty';

export const isMinLengthValidator = (value: string, minLength: number) => 
  value.trim().length >= minLength ? true : `Minimum length is ${minLength}`;

export const isMaxLengthValidator = (value: string, maxLength: number) => 
  value.trim().length <= maxLength ? true : `Maximum length is ${maxLength}`;

export const isMinValueValidator = (value: number, minValue: number) => 
  value >= minValue ? true : `Minimum value is ${minValue}`;

export const isRequiredValidator = (value: any) => 
  (value !== null && value !== undefined && value !== '') ? true : 'Required *';