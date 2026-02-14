import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { log } from '../src/utils';

describe('utils', () => {
  describe('log', () => {
    let consoleLogSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleLogSpy.mockRestore();
    });

    it('should log a message with the UserScript prefix', () => {
      log('Test message');

      expect(consoleLogSpy).toHaveBeenCalledWith('[UserScript] Test message');
    });

    it('should log multiple messages independently', () => {
      log('First message');
      log('Second message');

      expect(consoleLogSpy).toHaveBeenCalledTimes(2);
      expect(consoleLogSpy).toHaveBeenNthCalledWith(1, '[UserScript] First message');
      expect(consoleLogSpy).toHaveBeenNthCalledWith(2, '[UserScript] Second message');
    });

    it('should handle empty strings', () => {
      log('');

      expect(consoleLogSpy).toHaveBeenCalledWith('[UserScript] ');
    });
  });
});
