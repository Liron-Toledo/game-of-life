import React from 'react';
import { CellType } from '../types';

interface CellProps {
  cell: CellType;
  onMouseDown: () => void;
  onMouseEnter: () => void;
}

const Cell: React.FC<CellProps> = React.memo(({ cell, onMouseDown, onMouseEnter }) => {
  return (
    <div
      className={`w-6 h-6 md:w-4 md:h-4 border border-gray-300 dark:border-gray-600 
        cursor-pointer transition-transform transform 
        hover:scale-110 relative`}
      style={{ backgroundColor: cell.isAlive ? cell.color : 'white' }}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      aria-label={cell.isAlive ? 'Alive Cell' : 'Dead Cell'}
    ></div>
  );
});

export default Cell;