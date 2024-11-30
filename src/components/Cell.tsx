import React from 'react';
import { CellType } from '../types';

interface CellProps {
  cell: CellType;
  onMouseDown: () => void;
  onMouseEnter: () => void;
}

const Cell: React.FC<CellProps> = ({ cell, onMouseDown, onMouseEnter }) => {
  return (
    <div
      className={`w-4 h-4 border border-gray-300`}
      style={{ backgroundColor: cell.isAlive ? cell.color : 'white' }}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
    ></div>
  );
};

export default Cell;