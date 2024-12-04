import React, { useState, useEffect, useRef, useCallback } from 'react';
import Grid from './components/Grid';
import { GridType } from './types';
import { getNextGridState } from './utils/logic';
import Controls from './components/Controls';
import Notification from './components/Notification';
import ThemeToggle from './components/ThemeToggle';
import { FiMenu, FiX } from 'react-icons/fi';
import BottomSheet from './components/BottomSheet';
import { ResizableBox } from 'react-resizable';
import useWindowSize from './hooks/useWindowSize';
import { MOBILE_BREAKPOINT } from './constants';

const App: React.FC = () => {
  // State variables
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    const savedWidth = localStorage.getItem('sidebarWidth');
    return savedWidth ? parseInt(savedWidth, 10) : 300; // Default width: 300px
  });
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
  const [speed, setSpeed] = useState(500);
  const [history, setHistory] = useState<GridType[]>([grid]);
  const [currentStep, setCurrentStep] = useState(0);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const [isResizing, setIsResizing] = useState(false); // State to control transition during resizing

  // References for managing intervals and external state
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const notificationTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentStepRef = useRef(currentStep);
  const gridRef = useRef(grid);

  // Hook for screen size
  const { width } = useWindowSize();

  // Update refs when state changes
  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  /**
   * Updates the grid and adds it to the simulation history.
   * Prevents duplicate states from being added.
   */
  const updateGridAndHistory = useCallback(
    (newGrid: GridType) => {
      setHistory((prevHistory) => {
        const lastGrid = prevHistory[currentStepRef.current];

        // Custom deep comparison for grid equality
        const isSameGrid =
          lastGrid &&
          newGrid.every((row, rowIndex) =>
            row.every(
              (cell, colIndex) =>
                cell.isAlive === lastGrid[rowIndex][colIndex].isAlive &&
                cell.color === lastGrid[rowIndex][colIndex].color
            )
          );

        if (isSameGrid) {
          return prevHistory; // No change, return the current history as-is
        }

        return [...prevHistory.slice(0, currentStepRef.current + 1), newGrid];
      });

      // Update grid and step only if it's a new state
      const lastGrid = history[currentStep];
      const isSameGrid =
        lastGrid &&
        newGrid.every((row, rowIndex) =>
          row.every(
            (cell, colIndex) =>
              cell.isAlive === lastGrid[rowIndex][colIndex].isAlive &&
              cell.color === lastGrid[rowIndex][colIndex].color
          )
        );

      if (!isSameGrid) {
        setGrid(newGrid);
        setCurrentStep((prevStep) => prevStep + 1);
      }
    },
    [history, currentStep]
  );

  /**
   * Generates the next grid state and updates the simulation.
   */
  const runSimulation = useCallback(() => {
    const nextGrid = getNextGridState(gridRef.current);
    updateGridAndHistory(nextGrid);
  }, [updateGridAndHistory]);

  /**
   * Handles cell click to toggle between alive and dead states.
   */
  const onCellClick = useCallback(
    (row: number, col: number, action: 'setAlive' | 'setDead') => {
      setGrid((prevGrid) => {
        const cell = prevGrid[row][col];
        if ((action === 'setAlive' && cell.isAlive) || (action === 'setDead' && !cell.isAlive)) {
          return prevGrid;
        }
        const newGrid = [...prevGrid];
        newGrid[row] = [...prevGrid[row]];
        newGrid[row][col] = {
          isAlive: action === 'setAlive',
          color: action === 'setAlive' ? cell.color || `hsl(${Math.random() * 360}, 100%, 50%)` : '',
        };
        updateGridAndHistory(newGrid);
        return newGrid;
      });
    },
    [updateGridAndHistory]
  );

  /**
   * Toggles the simulation start/pause state.
   */
  const handleStartPause = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  /**
   * Clears the grid and resets the simulation history.
   */
  const handleClear = useCallback(() => {
    const emptyGrid = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => ({ isAlive: false, color: '' }))
    );
    setGrid(emptyGrid);
    setHistory([emptyGrid]);
    setCurrentStep(0);
  }, [gridSize]);

  /**
   * Generates a random grid and updates the simulation history.
   */
  const handleRandom = useCallback(() => {
    const randomGrid = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () =>
        Math.random() < 0.3
          ? { isAlive: true, color: `hsl(${Math.random() * 360}, 100%, 50%)` }
          : { isAlive: false, color: '' }
      )
    );
    updateGridAndHistory(randomGrid);
  }, [gridSize, updateGridAndHistory]);

  /**
   * Moves to the previous step in the simulation history.
   */
  const handleStepBack = useCallback(() => {
    if (currentStep > 0) {
      const previousStep = currentStep - 1;
      setGrid(history[previousStep]);
      setCurrentStep(previousStep);
    }
  }, [currentStep, history]);

  /**
   * Moves to the next step in the simulation history.
   */
  const handleStepForward = useCallback(() => {
    if (currentStep < history.length - 1) {
      const nextStep = currentStep + 1;
      setGrid(history[nextStep]);
      setCurrentStep(nextStep);
    }
  }, [currentStep, history]);

  /**
   * Updates the simulation speed.
   */
  const handleSpeedChange = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  /**
   * Updates the grid size and resets the simulation.
   */
  const handleGridSizeChange = useCallback((newSize: number) => {
    const minSize = 3;
    const maxSize = 1000;

    if (newSize > maxSize) {
      createNotification(`Maximum grid size is ${maxSize}.`, "warning");
      newSize = maxSize;
    }
    if (newSize < minSize) {
      createNotification(`Minimum grid size is ${minSize}.`, "warning");
      newSize = minSize;
    }

    setGridSize(newSize);
    const newGrid = Array.from({ length: newSize }, () =>
      Array.from({ length: newSize }, () => ({ isAlive: false, color: '' }))
    );
    setGrid(newGrid);
    setHistory([newGrid]);
    setCurrentStep(0);
  }, []);

  /**
   * Exports the current grid state to a JSON file.
   */
  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify(grid);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.download = 'grid.json';
    link.href = url;
    link.click();

    createNotification('Grid exported successfully!');
  }, [grid]);

  /**
   * Imports a grid state from a JSON file.
   */
  const handleImport = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          if (event.target?.result) {
            // Validate and parse the JSON
            const importedGrid: GridType = JSON.parse(event.target.result as string);

            // Validate the grid structure
            if (!Array.isArray(importedGrid) || !importedGrid.every(row => Array.isArray(row))) {
              throw new Error('Invalid grid format');
            }

            updateGridAndHistory(importedGrid);
            setGridSize(importedGrid.length);

            // Success notification
            createNotification('Grid imported successfully!');
          }
        } catch (error) {
          console.error('Failed to import grid:', error);
          createNotification('Error importing grid. Please check the file format.', "error");
        }
      };
      reader.readAsText(file);
    },
    [updateGridAndHistory]
  );

  /**
   * Displays a notification message for a specified duration.
   */
  const createNotification = (
    message: string,
    type: 'success' | 'error' | 'warning' = 'success',
    milliseconds: number = 5000
  ) => {
    setNotification({ message, type });
    if (notificationTimeout.current) {
      clearTimeout(notificationTimeout.current);
    }
    notificationTimeout.current = setTimeout(() => {
      setNotification(null);
    }, milliseconds);
  };

  /**
   * Effect to run simulation every 'speed' milliseconds
   */
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
  }, [isRunning, speed, runSimulation]);

  /**
   * Persist sidebar width to localStorage whenever it changes
   */
  useEffect(() => {
    if (sidebarWidth > 0) {
      localStorage.setItem('sidebarWidth', sidebarWidth.toString());
    }
  }, [sidebarWidth]);

  /**
   * Toggles the sidebar visibility
   */
  const toggleSidebar = () => {
    if (width < MOBILE_BREAKPOINT) {
      setIsBottomSheetOpen((prev) => !prev);
    } else {
      setIsSidebarVisible((prev) => !prev);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="p-4 bg-blue-600 dark:bg-blue-800 text-white flex items-center justify-between">
        <h1 className="font-sans text-3xl font-extrabold">Game of Life</h1>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <button
            onClick={toggleSidebar}
            className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label={isSidebarVisible ? 'Hide Controls' : 'Show Controls'}
          >
            {(width >= MOBILE_BREAKPOINT && isSidebarVisible) || (width < MOBILE_BREAKPOINT && isBottomSheetOpen) ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1">
        {/* Sidebar Controls */}
        {width >= MOBILE_BREAKPOINT && (
          <ResizableBox
            width={isSidebarVisible ? sidebarWidth : 0}
            height={Infinity}
            minConstraints={[250, Infinity]}
            maxConstraints={[700, Infinity]} // Maximum width: 600px
            axis="x" // Allow horizontal resizing only
            onResizeStart={() => setIsResizing(true)}
            onResizeStop={(_, { size }) => {
              setSidebarWidth(size.width);
              setIsResizing(false);
              if (size.width > 0) {
                localStorage.setItem('sidebarWidth', size.width.toString());
              }
            }}
            handle={
              <div
                className="absolute top-0 right-0 h-full w-6 cursor-ew-resize bg-transparent"
              />
            }
            className={`relative bg-white dark:bg-gray-800 text-white rounded shadow overflow-auto ${isResizing ? 'sidebar-no-transition' : 'sidebar-transition'
              } `}
            // Apply transition only when not resizing
            style={
              isResizing
                ? { transition: 'none' }
                : { transition: 'width 0.5s ease' }
            }
          >
            {/* Controls Container with Proper Padding */}
            <div className="p-4">
              <Controls
                parent='sidebar-'
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
            </div>
          </ResizableBox>
        )}

        {/* Grid Section */}
        <section
          className={`flex-1 bg-white dark:bg-gray-800 p-2 md:p-6 rounded-lg shadow-lg transition-all duration-500 ${isSidebarVisible ? '' : 'w-full'
            }`}
        >
          <Grid grid={grid} onCellClick={onCellClick} />
        </section>
      </main>

      {/* Bottom Sheet for Mobile */}
      <BottomSheet isOpen={isBottomSheetOpen} onClose={() => setIsBottomSheetOpen(false)}>
        <Controls
          parent='bottomsheet-'
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
      </BottomSheet>

      {/* Notification */}
      <Notification message={notification?.message} type={notification?.type} />
    </div>
  );
};

export default App;