import { GridType, CellType } from '../types';
import { CellCoordinates, serializeCoords, deserializeCoords } from './coordinate';
import { getAliveCellsSet, getCellsToEvaluate } from './grid';

/**
 * Computes the next state of the grid based on Conway's Game of Life rules.
 * 
 * @param currentGrid - The current state of the grid.
 * @returns The next state of the grid.
 */
export const getNextGridState = (currentGrid: GridType): GridType => {
  const rows = currentGrid.length; // Number of rows in the grid
  const cols = currentGrid[0].length; // Number of columns in the grid

  // Get the set of currently alive cells
  const aliveCells = getAliveCellsSet(currentGrid);
  // Get the set of cells (alive and their neighbors) to evaluate for the next state
  const cellsToEvaluate = getCellsToEvaluate(aliveCells);

  const nextAliveCells = new Set<CellCoordinates>(); // Cells that will be alive in the next state
  const cellColors: { [key: CellCoordinates]: string } = {}; // Colors of cells in the next state

  // Evaluate each cell in the set of cells to evaluate
  cellsToEvaluate.forEach((coord) => {
    const [x, y] = deserializeCoords(coord);

    // Skip cells that are out-of-bounds
    if (x < 0 || y < 0 || x >= rows || y >= cols) {
      return;
    }

    let aliveNeighbors = 0; // Count of alive neighbors
    const neighborColors: string[] = []; // Colors of alive neighbors

    // Check the 8 neighbors of the cell
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue; // Skip the cell itself

        const nx = x + dx; // Neighbor's x-coordinate
        const ny = y + dy; // Neighbor's y-coordinate

        // Skip out-of-bounds neighbors
        if (nx < 0 || ny < 0 || nx >= rows || ny >= cols) continue;

        const neighborCoord = serializeCoords(nx, ny); // Serialized neighbor coordinates
        if (aliveCells.has(neighborCoord)) {
          aliveNeighbors += 1; // Increment alive neighbor count
          const color = currentGrid[nx][ny].color; // Get neighbor's color
          if (color) neighborColors.push(color); // Add color to the list if present
        }
      }
    }

    const currentCellAlive = aliveCells.has(coord); // Whether the current cell is alive
    const cell: CellType = currentGrid[x][y]; // Current cell properties

    if (currentCellAlive) {
      // If the cell is alive, it survives only with 2 or 3 alive neighbors
      if (aliveNeighbors === 2 || aliveNeighbors === 3) {
        nextAliveCells.add(coord);
        cellColors[coord] = cell.color;
      }
    } else {
      // If the cell is dead, it becomes alive with exactly 3 alive neighbors
      if (aliveNeighbors === 3) {
        nextAliveCells.add(coord);

        // Determine the most prevalent color among neighbors
        if (neighborColors.length > 0) {
          const colorCounts: Record<string, number> = {};
          neighborColors.forEach((color) => {
            colorCounts[color] = (colorCounts[color] || 0) + 1;
          });

          // Find the most common color
          let prevalentColor = neighborColors[0];
          let maxCount = colorCounts[prevalentColor];
          for (const color in colorCounts) {
            if (colorCounts[color] > maxCount) {
              prevalentColor = color;
              maxCount = colorCounts[color];
            }
          }

          cellColors[coord] = prevalentColor;
        } else {
          // Assign a random color if no neighbors have colors
          cellColors[coord] = `hsl(${Math.random() * 360}, 100%, 50%)`;
        }
      }
    }
  });

  // Create the next grid state, initializing all cells as dead
  const nextGrid: GridType = currentGrid.map((row) =>
    row.map(() => ({ isAlive: false, color: '' }))
  );

  // Set cells that are alive in the next state
  nextAliveCells.forEach((coord) => {
    const [x, y] = deserializeCoords(coord);
    nextGrid[x][y] = {
      isAlive: true,
      color: cellColors[coord] || `hsl(${Math.random() * 360}, 100%, 50%)`, // Assign color or random
    };
  });

  return nextGrid; // Return the computed next grid state
};