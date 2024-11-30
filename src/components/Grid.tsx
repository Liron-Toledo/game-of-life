import React, { useState } from 'react';
import Cell from './Cell';
import { GridType } from '../types';

interface GridProps {
  grid: GridType;
  onCellClick: (row: number, col: number) => void;
}

const Grid: React.FC<GridProps> = ({ grid, onCellClick }) => {
    const [isMouseDown, setIsMouseDown] = useState(false);
  
    const handleMouseDown = (row: number, col: number) => {
      setIsMouseDown(true);
      onCellClick(row, col);
    };
  
    const handleMouseUp = () => {
      setIsMouseDown(false);
    };
  
    return (
      <div
        className="grid grid-cols-1"
        onMouseLeave={handleMouseUp}
        onMouseUp={handleMouseUp}
      >
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                cell={cell}
                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                onMouseEnter={() => isMouseDown && onCellClick(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

export default Grid;