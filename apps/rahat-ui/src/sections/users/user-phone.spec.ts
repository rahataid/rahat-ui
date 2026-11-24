import { userPhoneSchema } from './user-phone';

describe('user phone validation', () => {
  const phone = userPhoneSchema('Invalid phone number');

  it('allows an empty optional phone number', () => {
    expect(phone.safeParse('').success).toBe(true);
  });

  it('accepts valid numbers for supported countries', () => {
    expect(phone.safeParse('+9779841234567').success).toBe(true);
    expect(phone.safeParse('+254712345678').success).toBe(true);
  });

  it('rejects incomplete or invalid numbers', () => {
    for (const value of ['+977', '+977123', '1234567890']) {
      const result = phone.safeParse(value);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid phone number');
      }
    }
  });
});
