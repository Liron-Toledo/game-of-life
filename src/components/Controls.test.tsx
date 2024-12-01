// src/components/Controls.test.tsx
import { render, fireEvent } from '@testing-library/react';
import Controls from './Controls';

describe('Controls Component', () => {
  const mockProps = {
    isRunning: false,
    onStartPause: jest.fn(),
    onClear: jest.fn(),
    onRandom: jest.fn(),
    speed: 500,
    onSpeedChange: jest.fn(),
    gridSize: 20,
    onGridSizeChange: jest.fn(),
    onExport: jest.fn(),
    onImport: jest.fn(),
    currentStep: 0,
    handleStepBack: jest.fn(),
    handleStepForward: jest.fn(),
    historyLength: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all control buttons', () => {
    const { getByText } = render(<Controls {...mockProps} />);
    expect(getByText('Start')).toBeInTheDocument();
    expect(getByText('Clear')).toBeInTheDocument();
    expect(getByText('Random')).toBeInTheDocument();
    expect(getByText('Step Back')).toBeInTheDocument();
    expect(getByText('Step Forward')).toBeInTheDocument();
    expect(getByText('Export')).toBeInTheDocument();
    expect(getByText('Import')).toBeInTheDocument();
  });

  it('calls onStartPause when Start button is clicked', () => {
    const { getByText } = render(<Controls {...mockProps} />);
    fireEvent.click(getByText('Start'));
    expect(mockProps.onStartPause).toHaveBeenCalledTimes(1);
  });

  it('calls onClear when Clear button is clicked', () => {
    const { getByText } = render(<Controls {...mockProps} />);
    fireEvent.click(getByText('Clear'));
    expect(mockProps.onClear).toHaveBeenCalledTimes(1);
  });

  it('disables Step Back button when at the first step', () => {
    const { getByText } = render(<Controls {...mockProps} />);
    expect(getByText('Step Back')).toBeDisabled();
  });

  it('calls handleStepForward when Step Forward button is clicked', () => {
    const updatedProps = { ...mockProps, historyLength: 2 };
    const { getByText } = render(<Controls {...updatedProps} />);
    fireEvent.click(getByText('Step Forward'));
    expect(updatedProps.handleStepForward).toHaveBeenCalledTimes(1);
  });
});