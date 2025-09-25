import { describe, it, expect } from 'vitest';
import { findLicense, findProduct } from './database';

describe('Database', () => {
  describe('findLicense', () => {
    it('should return the correct license when a valid key is provided', () => {
      const license = findLicense('DTL-VALID-PRO-12345');
      expect(license).toBeDefined();
      expect(license.key).toBe('DTL-VALID-PRO-12345');
    });

    it('should return undefined when an invalid key is provided', () => {
      const license = findLicense('invalid-key');
      expect(license).toBeUndefined();
    });
  });

  describe('findProduct', () => {
    it('should return the correct product when valid parameters are provided', () => {
      const product = findProduct('deepthought-pro', '2.1.0', 'arm64');
      expect(product).toBeDefined();
      expect(product.id).toBe('deepthought-pro');
      expect(product.version).toBe('2.1.0');
      expect(product.platform).toBe('arm64');
    });

    it('should return undefined when an invalid id is provided', () => {
      const product = findProduct('invalid-id', '2.1.0', 'arm64');
      expect(product).toBeUndefined();
    });

    it('should return undefined when an invalid version is provided', () => {
      const product = findProduct('deepthought-pro', 'invalid-version', 'arm64');
      expect(product).toBeUndefined();
    });

    it('should return undefined when an invalid platform is provided', () => {
      const product = findProduct('deepthought-pro', '2.1.0', 'invalid-platform');
      expect(product).toBeUndefined();
    });
  });
});