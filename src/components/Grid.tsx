import React, { useRef, useCallback } from 'react';
import { FixedSizeGrid as VirtualizedGrid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import Cell from './Cell';
import { GridType } from '../types';

interface GridProps {
  grid: GridType;
  onCellClick: (row: number, col: number, action: 'setAlive' | 'setDead') => void;
}

const Grid: React.FC<GridProps> = ({ grid, onCellClick }) => {
  const minCellSize = 20; // Minimum cell size to ensure usability
  const isMouseDown = useRef(false); // Track if the mouse is currently pressed
  const currentAction = useRef<'setAlive' | 'setDead' | null>(null); // Track the current action

  // Handlers to manage mouse state
  const handleMouseDown = useCallback(() => {
    isMouseDown.current = true;
  }, []);

  const handleMouseUp = useCallback(() => {
    isMouseDown.current = false;
    currentAction.current = null;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isMouseDown.current = false;
    currentAction.current = null;
  }, []);

  const CellRenderer = useCallback(
    ({ columnIndex, rowIndex, style }: any) => {
      const cell = grid[rowIndex][columnIndex];

      const handleCellMouseDown = () => {
        if (!isMouseDown.current) {
          // Determine action based on current cell state
          const action = cell.isAlive ? 'setDead' : 'setAlive';
          currentAction.current = action;
          onCellClick(rowIndex, columnIndex, action);
        }
      };

      const handleCellMouseEnter = () => {
        if (isMouseDown.current && currentAction.current) {
          onCellClick(rowIndex, columnIndex, currentAction.current);
        }
      };

      return (
        <div
          style={style}
          onMouseDown={handleCellMouseDown}
          onMouseEnter={handleCellMouseEnter}
          onDragStart={(e) => e.preventDefault()}
        >
          <Cell cell={cell} />
        </div>
      );
    },
    [grid, onCellClick]
  );

  return (
    <div
      className="w-full h-full bg-gray-100 dark:bg-gray-900"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      <AutoSizer>
        {({ width, height }) => {
          const cellSize = Math.max(
            Math.floor(Math.min(width / grid.length, height / grid.length)),
            minCellSize
          );

          return (
            <VirtualizedGrid
              columnCount={grid.length}
              rowCount={grid.length}
              columnWidth={cellSize}
              rowHeight={cellSize}
              width={width}
              height={height}
              itemKey={({ rowIndex, columnIndex }) => `${rowIndex}-${columnIndex}`}
            >
              {CellRenderer}
            </VirtualizedGrid>
          );
        }}
      </AutoSizer>
    </div>
  );
};

export default Grid;