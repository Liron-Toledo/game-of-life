import { render } from '@testing-library/react';
import Grid from './Grid';
import { GridType } from '../types';

describe('Grid Component', () => {
  const gridSize = 5;
  const grid: GridType = Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => ({ isAlive: false, color: '' }))
  );

  it('renders without crashing', () => {
    render(<Grid grid={grid} onCellClick={() => {}} />);
    // Further testing may require more complex setups due to virtualization (Something to do if more time was available)
  });
});