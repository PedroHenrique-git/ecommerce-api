import validator from 'validator';

export function isPasswordValid(password: string) {
  return validator.isStrongPassword(password, {
    minLength: 8,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 1,
    minLowercase: 1,
  });
}
