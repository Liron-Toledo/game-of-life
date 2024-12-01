import { getNextGridState } from './logic';

describe('getNextGridState', () => {
  it('calculates the next state of the grid correctly', () => {
    const initialGrid = [
      [
        { isAlive: false, color: '' },
        { isAlive: true, color: '' },
        { isAlive: false, color: '' },
      ],
      [
        { isAlive: true, color: '' },
        { isAlive: true, color: '' },
        { isAlive: true, color: '' },
      ],
      [
        { isAlive: false, color: '' },
        { isAlive: true, color: '' },
        { isAlive: false, color: '' },
      ],
    ];

    const expectedNextGrid = [
      [
        { isAlive: true, color: '' },
        { isAlive: true, color: '' },
        { isAlive: true, color: '' },
      ],
      [
        { isAlive: true, color: '' },
        { isAlive: false, color: '' },
        { isAlive: true, color: '' },
      ],
      [
        { isAlive: true, color: '' },
        { isAlive: true, color: '' },
        { isAlive: true, color: '' },
      ],
    ];

    const nextGrid = getNextGridState(initialGrid);

    expect(nextGrid.map(row => row.map(cell => ({ isAlive: cell.isAlive })))).toEqual(
      expectedNextGrid.map(row => row.map(cell => ({ isAlive: cell.isAlive })))
    );
  });
});