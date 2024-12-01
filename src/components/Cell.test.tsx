import { render } from '@testing-library/react';
import Cell from './Cell';
import { CellType } from '../types';

describe('Cell Component', () => {
  it('renders a dead cell correctly', () => {
    const cell: CellType = { isAlive: false, color: '' };
    const { getByLabelText } = render(<Cell cell={cell} />);
    const cellElement = getByLabelText('Dead Cell');
    expect(cellElement).toBeInTheDocument();
    expect(cellElement).toHaveClass('bg-white', 'dark:bg-gray-800');
  });

  it('renders an alive cell correctly', () => {
    const cell: CellType = { isAlive: true, color: 'hsl(100, 100%, 50%)' };
    const { getByLabelText } = render(<Cell cell={cell} />);
    const cellElement = getByLabelText('Alive Cell');
    expect(cellElement).toBeInTheDocument();
    expect(cellElement).toHaveStyle(`background-color: ${cell.color}`);
  });
});