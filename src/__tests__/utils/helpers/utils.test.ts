import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IS_BROWSER, ensureStartsWith, formatDate } from '@/utils/helpers/utils';
import { format } from 'date-fns';

// Mock date-fns format function
vi.mock('date-fns', () => ({
  format: vi.fn((date, formatString) => `Mocked format: ${formatString}`)
}));

describe('Utils helpers', () => {
  describe('IS_BROWSER', () => {
    it('should be a boolean value', () => {
      expect(typeof IS_BROWSER).toBe('boolean');
    });
  });

  describe('ensureStartsWith', () => {
    it('should return the original string if it already starts with the prefix', () => {
      const result = ensureStartsWith('https://example.com', 'https://');
      expect(result).toBe('https://example.com');
    });

    it('should add the prefix if the string does not start with it', () => {
      const result = ensureStartsWith('example.com', 'https://');
      expect(result).toBe('https://example.com');
    });

    it('should handle empty strings', () => {
      const result = ensureStartsWith('', 'prefix-');
      expect(result).toBe('prefix-');
    });

    it('should handle empty prefix', () => {
      const result = ensureStartsWith('example.com', '');
      expect(result).toBe('example.com');
    });
  });

  describe('formatDate', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should call date-fns format with the correct parameters', () => {
      const testDate = new Date(2023, 0, 15); // January 15, 2023
      formatDate(testDate);
      
      expect(format).toHaveBeenCalledTimes(1);
      expect(format).toHaveBeenCalledWith(testDate, 'dd MMMM, yyyy');
    });

    it('should return the formatted date string', () => {
      const testDate = new Date(2023, 0, 15);
      const result = formatDate(testDate);
      
      expect(result).toBe('Mocked format: dd MMMM, yyyy');
    });
  });
});
