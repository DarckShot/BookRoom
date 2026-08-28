import { NON_DIGIT_PATTERN } from './constants';

export const maskTime = (value: string) => {
  const digits = value.replace(NON_DIGIT_PATTERN, '').slice(0, 4);

  return digits.length > 2 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : digits;
};
