import { serializeCoords, deserializeCoords } from './coordinate';

describe('Coordinate Utilities', () => {
  describe('serializeCoords', () => {
    it('serializes x and y coordinates into a string', () => {
      expect(serializeCoords(3, 5)).toBe('3,5');
      expect(serializeCoords(0, 0)).toBe('0,0');
      expect(serializeCoords(-1, -2)).toBe('-1,-2'); // Handles negative coordinates
    });
  });

  describe('deserializeCoords', () => {
    it('throws an error if the coordinate string is invalid', () => {
      expect(() => deserializeCoords('')).toThrowError('Invalid coordinate string: ""');
      expect(() => deserializeCoords('3,')).toThrowError('Invalid coordinate string: "3,"');
      expect(() => deserializeCoords('a,b')).toThrowError('Invalid coordinate string: "a,b"');
      expect(() => deserializeCoords('3,5,7')).toThrowError('Invalid coordinate string: "3,5,7"');
    });
  
    it('correctly deserializes valid coordinate strings', () => {
      expect(deserializeCoords('3,5')).toEqual([3, 5]);
      expect(deserializeCoords('0,0')).toEqual([0, 0]);
      expect(deserializeCoords('-1,-2')).toEqual([-1, -2]); // Handles negative coordinates
      expect(deserializeCoords('3,0')).toEqual([3, 0]); // Zero is a valid number
    });
  });

  describe('serializeCoords and deserializeCoords integration', () => {
    it('ensures serialization and deserialization are inverse operations', () => {
      const x = 10;
      const y = -20;
      const serialized = serializeCoords(x, y);
      const deserialized = deserializeCoords(serialized);
      expect(deserialized).toEqual([x, y]);
    });
  });
});