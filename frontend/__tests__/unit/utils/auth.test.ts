// Mock auth utility functions (adjust based on your actual auth utils)
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

const formatUserName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`.trim();
};

describe('Auth Utils', () => {
  describe('isValidEmail', () => {
    it('returns true for valid email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('returns false for invalid email', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('returns true for valid password', () => {
      expect(isValidPassword('password123')).toBe(true);
      expect(isValidPassword('12345678')).toBe(true);
    });

    it('returns false for invalid password', () => {
      expect(isValidPassword('short')).toBe(false);
      expect(isValidPassword('1234567')).toBe(false);
      expect(isValidPassword('')).toBe(false);
    });
  });

  describe('formatUserName', () => {
    it('formats full name correctly', () => {
      expect(formatUserName('John', 'Doe')).toBe('John Doe');
    });

    it('handles single name', () => {
      expect(formatUserName('John', '')).toBe('John');
      expect(formatUserName('', 'Doe')).toBe('Doe');
    });

    it('handles empty names', () => {
      expect(formatUserName('', '')).toBe('');
    });
  });
});
