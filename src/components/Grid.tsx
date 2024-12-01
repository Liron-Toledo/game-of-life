import React, { useRef, useCallback, useState, useEffect } from 'react';
import { FixedSizeGrid as VirtualizedGrid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import Cell from './Cell';
import { GridType } from '../types';

interface GridProps {
  grid: GridType;
  onCellClick: (row: number, col: number, action: 'setAlive' | 'setDead') => void; // Callback for cell interaction
}

/** Component to display and manage grid */
const Grid: React.FC<GridProps> = ({ grid, onCellClick }) => {
  const [mobileGridHeight, setMobileGridHeight] = useState<number | null>(null); // Dynamic height for the grid on mobile
  const [minCellSize, setMinCellSize] = useState(20); // Initial minimum cell size
  const isMouseDown = useRef(false); // Tracks if the mouse is currently pressed
  const currentAction = useRef<'setAlive' | 'setDead' | null>(null); // Tracks the current action being performed

  /**
   * Handles mouse down events to initiate a click-and-drag interaction.
   */
  const handleMouseDown = useCallback(() => {
    isMouseDown.current = true;
  }, []);

  /**
   * Handles mouse up events to end a click-and-drag interaction.
   */
  const handleMouseUp = useCallback(() => {
    isMouseDown.current = false;
    currentAction.current = null; // Reset the current action
  }, []);

  /**
   * Handles mouse leave events to ensure state resets when the mouse leaves the grid area.
   */
  const handleMouseLeave = useCallback(() => {
    isMouseDown.current = false;
    currentAction.current = null; // Reset the current action
  }, []);

  /**
   * Updates grid height and cell size based on screen size.
   */
  useEffect(() => {
    const updateGridSettings = () => {
      const isMobile = window.innerWidth < 640; // Mobile breakpoint
      const header = document.querySelector('header');
      const headerHeight = header ? header.offsetHeight : 0;

      // Set grid height dynamically on mobile, null otherwise
      setMobileGridHeight(isMobile ? window.innerHeight - headerHeight : null);

      // Adjust minimum cell size for mobile and larger screens
      setMinCellSize(isMobile ? 10 : 20);
    };

    updateGridSettings();
    window.addEventListener('resize', updateGridSettings); // Update on resize
    return () => window.removeEventListener('resize', updateGridSettings);
  }, []);

  /**
   * Renders an individual cell in the grid.
   * Handles mouse interactions for toggling cell state.
   */
  const CellRenderer = useCallback(
    ({ columnIndex, rowIndex, style }: any) => {
      const cell = grid[rowIndex][columnIndex];

      /**
       * Handles mouse down on a cell to toggle its state.
       */
      const handleCellMouseDown = () => {
        if (!isMouseDown.current) {
          const action = cell.isAlive ? 'setDead' : 'setAlive'; // Determine action based on cell state
          currentAction.current = action;
          onCellClick(rowIndex, columnIndex, action);
        }
      };

      /**
       * Handles mouse entering a cell during a click-and-drag to update its state.
       */
      const handleCellMouseEnter = () => {
        if (isMouseDown.current && currentAction.current) {
          onCellClick(rowIndex, columnIndex, currentAction.current);
        }
      };

      /**
     * Handles touch start on a cell to toggle its state.
     */
      const handleCellTouchStart = () => {
        const action = cell.isAlive ? 'setDead' : 'setAlive'; // Determine action based on cell state
        currentAction.current = action;
        onCellClick(rowIndex, columnIndex, action);
      };

      /**
       * Handles touch move over a cell to update its state.
       */
      const handleCellTouchMove = () => {
        if (currentAction.current) {
          onCellClick(rowIndex, columnIndex, currentAction.current);
        }
      };

      return (
        <div
          style={style} // Position and size of the cell (calculated by VirtualizedGrid)
          onMouseDown={handleCellMouseDown}
          onMouseEnter={handleCellMouseEnter}
          onTouchStart={handleCellTouchStart}
          onTouchMove={handleCellTouchMove}
          onDragStart={(e) => e.preventDefault()} // Prevents unwanted drag interactions

        >
          <Cell cell={cell} />
        </div>
      );
    },
    [grid, onCellClick]
  );

  return (
    <div
      className="w-full"
      style={{ height: mobileGridHeight || '100%' }}

      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      <AutoSizer>
        {({ width, height }) => {

          // Dynamically calculate cell size based on grid dimensions and available space
          const cellSize = Math.max(
            Math.floor(Math.min(width / grid.length, height / grid.length)),
            minCellSize
          );

          return (
            <VirtualizedGrid
              columnCount={grid.length} // Number of columns in the grid
              rowCount={grid.length} // Number of rows in the grid
              columnWidth={cellSize} // Width of each cell
              rowHeight={cellSize} // Height of each cell
              width={width} // Total width of the grid container
              height={height} // Total height of the grid container
              itemKey={({ rowIndex, columnIndex }) => `${rowIndex}-${columnIndex}`} // Unique key for each cell
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