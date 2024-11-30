import React, { useState, useEffect, useRef } from 'react';
import GridComponent from './components/Grid';
import { GridType } from './types';
import { getNextGridState } from './utils/logic';
import Controls from './components/Controls';

const App: React.FC = () => {
  const [gridSize, setGridSize] = useState(20);
  const [grid, setGrid] = useState<GridType>(
    Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => ({
        isAlive: false,
        color: '',
      }))
    )
  );

  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500); // Default speed in milliseconds
  const intervalRef = useRef<number | null>(null);

  const runSimulation = () => {
    setGrid((prevGrid) => getNextGridState(prevGrid));
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(runSimulation, speed);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, speed]);

  const onCellClick = (row: number, col: number) => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) => row.slice());
      newGrid[row][col].isAlive = !newGrid[row][col].isAlive;
      return newGrid;
    });
  };const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleClear = () => {
    setGrid(
      Array.from({ length: gridSize }, () =>
        Array.from({ length: gridSize }, () => ({
          isAlive: false,
          color: '',
        }))
      )
    );
  };

  const handleRandom = () => {
    setGrid(
      Array.from({ length: gridSize }, () =>
        Array.from({ length: gridSize }, () => ({
          isAlive: Math.random() < 0.3,
          color: '',
        }))
      )
    );
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
  };

  const handleGridSizeChange = (newSize: number) => {
    setGridSize(newSize);
    // Reset the grid
    setGrid(
      Array.from({ length: newSize }, () =>
        Array.from({ length: newSize }, () => ({
          isAlive: false,
          color: '',
        }))
      )
    );
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(grid);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.download = 'grid.json';
    link.href = url;
    link.click();
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const importedGrid: GridType = JSON.parse(event.target.result as string);
        setGrid(importedGrid);
        setGridSize(importedGrid.length);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <Controls
        isRunning={isRunning}
        onStartPause={handleStartPause}
        onClear={handleClear}
        onRandom={handleRandom}
        speed={speed}
        onSpeedChange={handleSpeedChange}
        gridSize={gridSize}
        onGridSizeChange={handleGridSizeChange}
        onExport={handleExport}
        onImport={handleImport}
      />
      <GridComponent grid={grid} onCellClick={onCellClick} />
    </div>
  );
};

export default App;