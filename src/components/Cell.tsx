import React from 'react';
import { CellType } from '../types';

interface CellProps {
  cell: CellType;
}

const Cell: React.FC<CellProps> = React.memo(({ cell }) => {
  return (
    <div
      className={`w-full h-full border border-gray-300 dark:border-gray-600 cursor-pointer transition-all duration-200
        ${!cell.isAlive ? 'bg-white dark:bg-gray-800' : ''} 
        hover:brightness-90 dark:hover:brightness-75 hover:shadow-md dark:hover:shadow-lg`}
      style={{
        backgroundColor: cell.isAlive ? cell.color : undefined,
        boxShadow: cell.isAlive ? 'inset 0 0 5px rgba(0,0,0,0.3)' : 'none',
      }}
      aria-label={cell.isAlive ? 'Alive Cell' : 'Dead Cell'}
    ></div>
  );
});

export default Cell;