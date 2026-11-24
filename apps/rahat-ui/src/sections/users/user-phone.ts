import { isValidPhoneNumber } from 'react-phone-number-input';
import { z } from 'zod';

export function userPhoneSchema(invalidPhoneMessage: string) {
  return z.string().refine(
    (value) => value === '' || isValidPhoneNumber(value),
    { message: invalidPhoneMessage },
  );
}
