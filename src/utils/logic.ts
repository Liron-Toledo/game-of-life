import { GridType, CellType } from '../types';
import { CellCoordinates, serializeCoords, deserializeCoords } from './coordinate';
import { getAliveCellsSet, getCellsToEvaluate } from './grid';

export const getNextGridState = (currentGrid: GridType): GridType => {
  const rows = currentGrid.length;
  const cols = currentGrid[0].length;

  const aliveCells = getAliveCellsSet(currentGrid);
  const cellsToEvaluate = getCellsToEvaluate(aliveCells);

  const nextAliveCells = new Set<CellCoordinates>();
  const cellColors: { [key: CellCoordinates]: string } = {};

  cellsToEvaluate.forEach((coord) => {
    const [x, y] = deserializeCoords(coord);

    // Skip out-of-bounds coordinates
    if (x < 0 || y < 0 || x >= rows || y >= cols) {
      return;
    }

    let aliveNeighbors = 0;
    const neighborColors: string[] = [];

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;

        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= rows || ny >= cols) continue;

        const neighborCoord = serializeCoords(nx, ny);
        if (aliveCells.has(neighborCoord)) {
          aliveNeighbors += 1;
          const color = currentGrid[nx][ny].color;
          if (color) neighborColors.push(color);
        }
      }
    }

    const currentCellAlive = aliveCells.has(coord);
    const cell: CellType = currentGrid[x][y];

    if (currentCellAlive) {
      // Survival
      if (aliveNeighbors === 2 || aliveNeighbors === 3) {
        nextAliveCells.add(coord);
        cellColors[coord] = cell.color;
      } else {
        // Cell dies
      }
    } else {
      // Birth
      if (aliveNeighbors === 3) {
        nextAliveCells.add(coord);

        // Determine the most prevalent color among neighbors
        if (neighborColors.length > 0) {
          const colorCounts: Record<string, number> = {};
          neighborColors.forEach((color) => {
            colorCounts[color] = (colorCounts[color] || 0) + 1;
          });

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
          // Assign a random color if no neighboring colors
          cellColors[coord] = `hsl(${Math.random() * 360}, 100%, 50%)`;
        }
      }
    }
  });

  // Construct the next grid state
  const nextGrid: GridType = currentGrid.map((row) =>
    row.map(() => ({ isAlive: false, color: '' }))
  );

  nextAliveCells.forEach((coord) => {
    const [x, y] = deserializeCoords(coord);
    nextGrid[x][y] = {
      isAlive: true,
      color: cellColors[coord] || `hsl(${Math.random() * 360}, 100%, 50%)`,
    };
  });

  return nextGrid;
};