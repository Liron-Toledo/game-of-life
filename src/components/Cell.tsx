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
        className={`w-4 h-4 border border-gray-300 ${
          cell.isAlive ? 'bg-blue-500' : 'bg-white'
        }`}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
      ></div>
    );
  };

export default Cell;