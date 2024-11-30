// src/App.tsx
import React, { useState, useEffect, useRef } from 'react';
import GridComponent from './components/Grid';
import { GridType } from './types';
import { getNextGridState } from './utils/logic';
import Controls from './components/Controls';
import ThemeToggle from './components/ThemeToggle';

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
  const [notification, setNotification] = useState<string | null>(null);

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

    setNotification('Grid exported successfully!');
    setTimeout(() => setNotification(null), 3000);
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

    setNotification('Grid imported successfully!');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">

      <header className="p-4 bg-blue-600 text-white text-center">
        <h1 className="font-sans text-3xl font-extrabold">Conway's Game of Life</h1>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 flex-col md:flex-row p-4 space-y-4 md:space-y-0 md:space-x-4">
        <aside className="md:w-1/4 bg-white p-4 rounded shadow">
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
        </aside>
        <section className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <GridComponent grid={grid} onCellClick={onCellClick} />
        </section>
      </main>

      {/* <footer className="p-4 bg-blue-600 text-white text-center">
        <p>&copy; {new Date().getFullYear()} Footer Content</p>
      </footer> */}

      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {notification}
        </div>
      )}

    </div>
  );
};

export default App;