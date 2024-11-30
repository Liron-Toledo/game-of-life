// In Cell.tsx
import React from 'react';
import { CellType } from '../types';

interface CellProps {
  cell: CellType;
}

const Cell: React.FC<CellProps> = React.memo(({ cell }) => {
  return (
    <div
      className={`w-full h-full border border-gray-300 dark:border-gray-600 cursor-pointer transition-filter duration-200 hover:filter hover:brightness-90`}
      style={{
        backgroundColor: cell.isAlive ? cell.color : 'white',
        boxShadow: cell.isAlive ? 'inset 0 0 5px rgba(0,0,0,0.3)' : 'none',
      }}
      aria-label={cell.isAlive ? 'Alive Cell' : 'Dead Cell'}
    ></div>
  );
});

export default Cell;