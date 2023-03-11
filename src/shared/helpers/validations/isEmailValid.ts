import validator from 'validator';

export function isEmailValid(email: string) {
  return validator.isEmail(email);
}
