import { getAliveCellsSet, getCellsToEvaluate } from './grid';
import { serializeCoords } from './coordinate';
import { GridType } from '../types';

describe('Grid Utility Functions', () => {
  describe('getAliveCellsSet', () => {
    it('returns an empty set for a grid with no alive cells', () => {
      const grid: GridType = [
        [{ isAlive: false, color: '' }, { isAlive: false, color: '' }],
        [{ isAlive: false, color: '' }, { isAlive: false, color: '' }],
      ];

      const result = getAliveCellsSet(grid);
      expect(result.size).toBe(0);
    });

    it('returns a set of serialized coordinates for alive cells', () => {
      const grid: GridType = [
        [{ isAlive: true, color: 'red' }, { isAlive: false, color: '' }],
        [{ isAlive: false, color: '' }, { isAlive: true, color: 'blue' }],
      ];

      const result = getAliveCellsSet(grid);
      expect(result.size).toBe(2);
      expect(result.has(serializeCoords(0, 0))).toBe(true);
      expect(result.has(serializeCoords(1, 1))).toBe(true);
    });
  });

  describe('getCellsToEvaluate', () => {
    it('handles multiple alive cells and their neighbors correctly', () => {
      const aliveCells = new Set([
        serializeCoords(1, 1),
        serializeCoords(2, 2),
        serializeCoords(3, 3),
      ]);
    
      const result = getCellsToEvaluate(aliveCells);
  
      const expectedCoords = new Set([
        serializeCoords(0, 0),
        serializeCoords(0, 1),
        serializeCoords(0, 2),
        serializeCoords(1, 0),
        serializeCoords(1, 1),
        serializeCoords(1, 2),
        serializeCoords(1, 3),
        serializeCoords(2, 0),
        serializeCoords(2, 1),
        serializeCoords(2, 2),
        serializeCoords(2, 3),
        serializeCoords(2, 4),
        serializeCoords(3, 1),
        serializeCoords(3, 2),
        serializeCoords(3, 3),
        serializeCoords(3, 4),
        serializeCoords(4, 2),
        serializeCoords(4, 3),
        serializeCoords(4, 4),
      ]);
  
      expect(result.size).toBe(expectedCoords.size);
  
      expectedCoords.forEach((coord) => {
        expect(result.has(coord)).toBe(true);
      });
    });
  });
});