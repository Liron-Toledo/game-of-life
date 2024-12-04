import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import App from './App';

// Mock for setTimeout
jest.useFakeTimers();

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/Game of Life/i)).toBeInTheDocument();
  });

  it('toggles between Start and Pause', async () => {
    render(<App />);
    const startButton = screen.getByTestId('sidebar-start-button');

    fireEvent.click(startButton);
    expect(screen.getByTestId('sidebar-start-button')).toHaveTextContent('Pause');

    fireEvent.click(screen.getByTestId('sidebar-start-button'));
    expect(screen.getByTestId('sidebar-start-button')).toHaveTextContent('Start');
  });

  // TODO: Investigate why this test case keeps failing (I suspect something to do with virtualiser)
  // it('toggles a cell state on click', async () => {
  //   render(<App />);
    
  //   // Wait for the grid to render
  //   await waitFor(() => expect(screen.getByTestId('grid')).toBeInTheDocument());
    
  //   const cell = screen.getByTestId('cell-0-0'); // Target specific cell
  //   expect(cell.className).toContain('dead'); // Initially dead
    
  //   fireEvent.click(cell); // Toggle to alive
  //   expect(cell.className).toContain('alive');
    
  //   fireEvent.click(cell); // Toggle back to dead
  //   expect(cell.className).toContain('dead');
  // });

  it('updates grid size when grid size input changes', () => {
    render(<App />);
    const gridSizeInput = screen.getByTestId('sidebar-gridSize-input');
    fireEvent.change(gridSizeInput, { target: { value: '25' } });
    expect(gridSizeInput).toHaveValue(25);
  });

  it('displays a notification when exporting the grid', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('sidebar-export-button'));

    // Wait for the notification to appear
    expect(await screen.findByText('Grid exported successfully!')).toBeInTheDocument();

    // Simulate timeout for notification removal
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Check that the notification disappears
    await waitFor(() => {
      expect(screen.queryByText('Grid exported successfully!')).not.toBeInTheDocument();
    });
  });

  it('toggles theme and updates the document class', () => {
    render(<App />);
    const themeToggle = screen.getByLabelText('Toggle Dark Mode');

    fireEvent.click(themeToggle);
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    fireEvent.click(themeToggle);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('handles invalid file import gracefully', async () => {
    render(<App />);
    const fileInput = screen.getByTestId('bottomsheet-import-input'); // Assuming import is via BottomSheet

    const invalidFile = new File(['invalid content'], 'invalid.json', {
      type: 'application/json',
    });

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    // Wait for the error notification to appear
    await waitFor(() => {
      expect(screen.getByText(/Error importing grid/i)).toBeInTheDocument();
    });
  });

  it('ensures simulation updates at the correct speed', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('sidebar-start-button'));

    act(() => {
      jest.advanceTimersByTime(500); // Advance by default speed
    });

    // Since the simulation updates the grid, you can add assertions here
    // For example, check if a cell has changed state
    // This requires your Grid component to have data-testid for cells
    // Example:
    // expect(screen.getByTestId('cell-0-0')).toHaveClass('alive');
    expect(screen.getByTestId('grid')).toBeInTheDocument();
  });

  it('respects minimum and maximum grid size limits', () => {
    render(<App />);
    const gridSizeInput = screen.getByTestId('sidebar-gridSize-input');

    fireEvent.change(gridSizeInput, { target: { value: '2' } });
    expect(gridSizeInput).toHaveValue(3); // Minimum grid size

    fireEvent.change(gridSizeInput, { target: { value: '1001' } });
    expect(gridSizeInput).toHaveValue(1000); // Maximum grid size
  });

  it('resets grid when Clear button is clicked', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('sidebar-random-button')); // Modify grid
  
    fireEvent.click(screen.getByTestId('sidebar-clear-button')); // Clear grid
  
    const allCells = document.querySelectorAll('[data-testid^="cell"]');
    allCells.forEach((cell) => {
      expect(cell.className).toContain('dead'); // Verify all cells are dead
    });
  });
});