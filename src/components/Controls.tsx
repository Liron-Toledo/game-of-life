import React from 'react';

interface ControlsProps {
    isRunning: boolean;
    onStartPause: () => void;
    onClear: () => void;
    onRandom: () => void;
    speed: number;
    onSpeedChange: (speed: number) => void;
    gridSize: number;
    onGridSizeChange: (size: number) => void;
    onExport: () => void;
    onImport: (file: File) => void;
    currentStep: number;
    handleStepBack: () => void;
    handleStepForward: () => void;
    historyLength: number;
}

/** Component to manage various controls for the Game of Life */
const Controls: React.FC<ControlsProps> = ({
    isRunning,
    onStartPause,
    onClear,
    onRandom,
    speed,
    onSpeedChange,
    gridSize,
    onGridSizeChange,
    onExport,
    onImport,
    currentStep,
    handleStepBack,
    handleStepForward,
    historyLength
}) => {
    /**
     * Handles importing files from local device
     * @param e File input event
     */
    const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onImport(e.target.files[0]);
        }
    };

    return (
        <div className="space-y-6">
            {/* Control Buttons */}
            <div className="flex flex-col space-y-3">
                {/* Start/Pause Button */}
                <button
                    onClick={onStartPause}
                    className={`w-full px-4 py-2 rounded 
                        ${isRunning
                            ? 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700'
                            : 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700'} 
                        text-white font-semibold transition-colors duration-200`}
                >
                    {isRunning ? 'Pause' : 'Start'}
                </button>

                {/* Clear Button */}
                <button
                    onClick={onClear}
                    className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 rounded text-white font-semibold transition-colors duration-200"
                >
                    Clear
                </button>

                {/* Random Button */}
                <button
                    onClick={onRandom}
                    className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 rounded text-white font-semibold transition-colors duration-200"
                >
                    Random
                </button>
            </div>

            {/* Speed Control */}
            <div>
                <label htmlFor="speed" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Speed (ms): {speed}
                </label>
                <input
                    id="speed"
                    type="range"
                    min="100"
                    max="1000"
                    step="100"
                    value={speed}
                    onChange={(e) => onSpeedChange(Number(e.target.value))}
                    className="w-full"
                />
            </div>

            {/* Grid Size Control */}
            <div>
                <label htmlFor="gridSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Grid Size: {gridSize}x{gridSize}
                </label>
                <input
                    id="gridSize"
                    type="number"
                    min="3"
                    max="1000"
                    value={gridSize}
                    onChange={(e) => onGridSizeChange(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* History Controls */}
            <div className="flex space-x-3">
                <button
                    onClick={handleStepBack}
                    disabled={currentStep === 0}
                    className={`flex-1 px-4 py-2 rounded text-white font-semibold transition-colors duration-200 
                        ${currentStep === 0
                            ? 'bg-gray-300 cursor-not-allowed dark:bg-gray-600'
                            : 'bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700'}`}
                >
                    Step Back
                </button>
                <button
                    onClick={handleStepForward}
                    disabled={currentStep >= historyLength - 1}
                    className={`flex-1 px-4 py-2 rounded text-white font-semibold transition-colors duration-200 
                        ${currentStep >= historyLength - 1
                            ? 'bg-gray-300 cursor-not-allowed dark:bg-gray-600'
                            : 'bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700'}`}
                >
                    Step Forward
                </button>
            </div>

            {/* Export and Import */}
            <div className="flex flex-col space-y-3">
                {/* Export Button */}
                <button
                    onClick={onExport}
                    className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 rounded text-white font-semibold transition-colors duration-200"
                >
                    Export
                </button>

                {/* Import Button */}
                <label className="w-full px-4 py-2 bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700 rounded text-white font-semibold cursor-pointer flex items-center justify-center">
                    Import
                    <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
                </label>
            </div>
        </div>
    );
};

export default Controls;