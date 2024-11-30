import { GridType } from '../types';

export const getNextGridState = (currentGrid: GridType): GridType => {
  const rows = currentGrid.length;
  const cols = currentGrid[0].length;

  const nextGrid: GridType = currentGrid.map((row) => row.map((cell) => ({ ...cell })));

  const getNeighbors = (x: number, y: number): { count: number; colors: string[] } => {
    let aliveNeighbors = 0;
    const colors: string[] = [];

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue; // Skip the cell itself
        const nx = x + i;
        const ny = y + j;
        if (nx < 0 || ny < 0 || nx >= rows || ny >= cols) continue; // Out of bounds

        const neighbor = currentGrid[nx][ny];
        if (neighbor.isAlive) {
          aliveNeighbors += 1;
          if (neighbor.color) colors.push(neighbor.color);
        }
      }
    }

    return { count: aliveNeighbors, colors };
  };

  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      const { count: aliveNeighbors, colors: neighborColors } = getNeighbors(x, y);
      const cell = currentGrid[x][y];

      if (cell.isAlive) {
        // Survival
        if (aliveNeighbors < 2 || aliveNeighbors > 3) {
          nextGrid[x][y].isAlive = false;
          nextGrid[x][y].color = '';
        }
        // Else, cell survives with the same color
      } else {
        // Birth
        if (aliveNeighbors === 3) {
          nextGrid[x][y].isAlive = true;

          if (neighborColors.length > 0) {
            // Inherit the most prevalent color
            const colorCounts: Record<string, number> = {};
            neighborColors.forEach((color) => {
              colorCounts[color] = (colorCounts[color] || 0) + 1;
            });

            // Determine the most prevalent color
            let prevalentColor = neighborColors[0];
            let maxCount = colorCounts[prevalentColor];
            for (const color in colorCounts) {
              if (colorCounts[color] > maxCount) {
                prevalentColor = color;
                maxCount = colorCounts[color];
              }
            }

            nextGrid[x][y].color = prevalentColor;
          } else {
            // Assign a random color if no neighboring colors
            nextGrid[x][y].color = `hsl(${Math.random() * 360}, 100%, 50%)`;
          }
        }
      }
    }
  }

  return nextGrid;
};