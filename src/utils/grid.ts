import { GridType } from '../types';
import { CellCoordinates, serializeCoords, deserializeCoords } from './coordinate';

/**
 * Converts the current grid into a set of alive cell coordinates.
 * @param grid - The current grid state.
 * @returns A set containing serialized coordinates of alive cells.
 */
export const getAliveCellsSet = (grid: GridType): Set<CellCoordinates> => {
  const aliveCells = new Set<CellCoordinates>();

  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[0].length; y++) {
      if (grid[x][y].isAlive) {
        aliveCells.add(serializeCoords(x, y));
      }
    }
  }

  return aliveCells;
};

/**
 * Generates a set of cells that need to be evaluated for state changes.
 * This includes all alive cells and their neighbors.
 * @param aliveCells - A set of serialized coordinates of alive cells.
 * @returns A set of serialized coordinates to evaluate.
 */
export const getCellsToEvaluate = (aliveCells: Set<CellCoordinates>): Set<CellCoordinates> => {
  const cellsToEvaluate = new Set<CellCoordinates>();

  aliveCells.forEach((coord) => {
    const [x, y] = deserializeCoords(coord);

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const nx = x + dx;
        const ny = y + dy;

        // Ensure coordinates are non-negative (valid for the grid)
        if (nx >= 0 && ny >= 0) {
          cellsToEvaluate.add(serializeCoords(nx, ny));
        }
      }
    }
  });

  return cellsToEvaluate;
};