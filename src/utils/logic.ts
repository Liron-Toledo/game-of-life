import { GridType } from '../types';

export const getNextGridState = (currentGrid: GridType): GridType => {
  const rows = currentGrid.length;
  const cols = currentGrid[0].length;

  const nextGrid: GridType = currentGrid.map((row) => row.map((cell) => ({ ...cell })));

  const getNeighbors = (x: number, y: number): number => {
    let aliveNeighbors = 0;

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (
          i === 0 &&
          j === 0 ||
          x + i < 0 ||
          y + j < 0 ||
          x + i >= rows ||
          y + j >= cols
        ) {
          continue;
        }
        if (currentGrid[x + i][y + j].isAlive) {
          aliveNeighbors += 1;
        }
      }
    }
    return aliveNeighbors;
  };

  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      const aliveNeighbors = getNeighbors(x, y);
      const cell = currentGrid[x][y];

      if (cell.isAlive) {
        if (aliveNeighbors < 2 || aliveNeighbors > 3) {
          nextGrid[x][y].isAlive = false;
        }
      } else {
        if (aliveNeighbors === 3) {
          nextGrid[x][y].isAlive = true;
        }
      }
    }
  }

  return nextGrid;
};