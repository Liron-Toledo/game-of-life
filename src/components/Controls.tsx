// src/components/Controls.tsx
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
    currentStep: number
    handleStepBack: () => void;
    handleStepForward: () => void;
    historyLength: number;
}

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
    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onImport(e.target.files[0]);
        }
    };

    return (
        <div className="flex space-x-2">
            <button onClick={onStartPause} className="btn">
                {isRunning ? 'Pause' : 'Start'}
            </button>
            <button onClick={onClear} className="btn">
                Clear
            </button>
            <button onClick={onRandom} className="btn">
                Random
            </button>
            <div>
                <label>Speed:</label>
                <input
                    type="range"
                    min="100"
                    max="1000"
                    step="100"
                    value={speed}
                    onChange={(e) => onSpeedChange(Number(e.target.value))}
                />
            </div>
            <div>
                <label>Grid Size:</label>
                <input
                    type="number"
                    min="3"
                    max="1000"
                    value={gridSize}
                    onChange={(e) => onGridSizeChange(Number(e.target.value))}
                />
            </div>
            <div>
                {!isRunning && (
                    <div>
                        <button onClick={handleStepBack} disabled={currentStep === 0}>
                            Step Back
                        </button>
                        <button onClick={handleStepForward} disabled={currentStep >= historyLength - 1}>
                            Step Forward
                        </button>
                    </div>
                )}
            </div>
            <button onClick={onExport} className="btn">
                Export
            </button>
            <input type="file" accept=".json" onChange={handleImport} />
        </div>
    );
};

export default Controls;