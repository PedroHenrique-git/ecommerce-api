import { Injectable } from '@nestjs/common';

import validator from 'validator';

@Injectable()
export class ValidationService {
  isEmailValid(email: string) {
    return validator.isEmail(email);
  }

  isPasswordValid(password: string) {
    return validator.isStrongPassword(password, {
      minLength: 8,
      minNumbers: 1,
      minUppercase: 1,
      minSymbols: 1,
      minLowercase: 1,
    });
  }
}
