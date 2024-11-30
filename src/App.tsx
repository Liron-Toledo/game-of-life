// src/App.tsx
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
  const [history, setHistory] = useState<GridType[]>([grid]);  
  const [currentStep, setCurrentStep] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // Refs to keep track of the latest currentStep and grid
  const currentStepRef = useRef(currentStep);
  const gridRef = useRef(grid);

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  // Helper function to update grid and history
  const updateGridAndHistory = (newGrid: GridType) => {
    setHistory((prevHistory) => {
      const updatedHistory = [...prevHistory.slice(0, currentStepRef.current + 1), newGrid];
      console.log('Updated History:', updatedHistory);
      return updatedHistory;
    });
    setGrid(newGrid);
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const runSimulation = () => {
    const nextGrid = getNextGridState(gridRef.current);
    updateGridAndHistory(nextGrid);
  };

  const handleStepBack = () => {
    if (currentStep > 0) {
      const previousStep = currentStep - 1;
      setGrid(history[previousStep]);
      setCurrentStep(previousStep);
      console.log('currentStep', currentStep);
      console.log('previousStep', previousStep);
      console.log('history', history);
      console.log('history step', history[previousStep]);
    }
  };

  const handleStepForward = () => {
    if (currentStep < history.length - 1) {
      const nextStep = currentStep + 1;
      setGrid(history[nextStep]);
      setCurrentStep(nextStep);
      console.log('currentStep', currentStep);
      console.log('nextStep', nextStep);
      console.log('history', history);
      console.log('history step', history[nextStep]);
    }
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(runSimulation, speed);
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
    const newGrid = grid.map((r, rowIdx) => 
      r.map((cell, colIdx) => {
        if (rowIdx === row && colIdx === col) {
          if (!cell.isAlive) {
            // Assign a random color when cell is made alive
            return { isAlive: true, color: `hsl(${Math.random() * 360}, 100%, 50%)` };
          } else {
            // Make cell dead and clear its color
            return { isAlive: false, color: '' };
          }
        }
        return cell;
      })
    );
    updateGridAndHistory(newGrid);
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleClear = () => {
    const emptyGrid = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => ({ isAlive: false, color: '' }))
    );
    setGrid(emptyGrid);
    setHistory([emptyGrid]);
    setCurrentStep(0);
    console.log('Grid cleared. History reset.');
  };

  const handleRandom = () => {
    const randomGrid = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => {
        if (Math.random() < 0.3) {
          // Assign a random color to alive cells
          return { isAlive: true, color: `hsl(${Math.random() * 360}, 100%, 50%)` };
        }
        return { isAlive: false, color: '' };
      })
    );
    updateGridAndHistory(randomGrid);
    console.log('Random grid generated.');
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    console.log(`Speed changed to ${newSpeed} ms.`);
  };

  const handleGridSizeChange = (newSize: number) => {
    setGridSize(newSize);
    const newGrid = Array.from({ length: newSize }, () =>
      Array.from({ length: newSize }, () => ({ isAlive: false, color: '' }))
    );
    setGrid(newGrid);
    setHistory([newGrid]);
    setCurrentStep(0);
    console.log(`Grid size changed to ${newSize}. History reset.`);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(grid);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.download = 'grid.json';
    link.href = url;
    link.click();
    console.log('Grid exported.');
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const importedGrid: GridType = JSON.parse(event.target.result as string);
        updateGridAndHistory(importedGrid);
        setGridSize(importedGrid.length);
        console.log('Grid imported.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4">
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
        currentStep={currentStep}
        handleStepBack={handleStepBack}
        handleStepForward={handleStepForward}
        historyLength={history.length}
      />
      <GridComponent grid={grid} onCellClick={onCellClick} />
    </div>
  );
};

export default App;