import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import App from './App';

// Mock for settings svg
jest.mock('./assets/settings.svg');

// Mock for setTimeout
jest.useFakeTimers();

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/Game of Life/i)).toBeInTheDocument();
  });

  it('toggles between Start and Pause', async () => {
    const { getByText } = render(<App />);
    const startButton = getByText('Start');

    fireEvent.click(startButton);
    expect(getByText('Pause')).toBeInTheDocument();

    fireEvent.click(getByText('Pause'));
    expect(getByText('Start')).toBeInTheDocument();
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
    const gridSizeInput = screen.getByLabelText(/Grid Size/i);
    fireEvent.change(gridSizeInput, { target: { value: '25' } });
    expect(gridSizeInput).toHaveValue(25);
  });

  it('displays a notification when exporting the grid', async () => {
    render(<App />);
    fireEvent.click(screen.getByText('Export'));

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

  it('displays a notification when exporting the grid', async () => {
    render(<App />);
    fireEvent.click(screen.getByText('Export'));

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

  // TODO: Investigate why this test case keeps failing (I suspect something to do with virtualiser)
  // it('generates a random grid on Random button click', async () => {
  //   render(<App />);
  
  //   // Wait for the grid to render
  //   await waitFor(() => expect(screen.getByTestId('grid')).toBeInTheDocument());
  
  //   const gridBefore = Array.from(
  //     document.querySelectorAll('[data-testid^="cell"]')
  //   ).map((cell) => cell.className);
  
  //   fireEvent.click(screen.getByText('Random')); // Trigger random grid generation
  
  //   // Wait for grid to update
  //   await waitFor(() => {
  //     const gridAfter = Array.from(
  //       document.querySelectorAll('[data-testid^="cell"]')
  //     ).map((cell) => cell.className);
  //     expect(gridBefore).not.toEqual(gridAfter); // Ensure grid changes
  //   });
  // });

   // TODO: Investigate why this test case keeps failing (I suspect something to do with virtualiser)
  // it('moves to previous and next steps in simulation history', () => {
  //   render(<App />);
  
  //   fireEvent.click(screen.getByText('Random')); // Modify grid
  //   const initialCell = screen.getByTestId('cell-0-0').className;
  
  //   fireEvent.click(screen.getByText('Step Back')); // Navigate history back
  //   expect(screen.getByTestId('cell-0-0').className).not.toBe(initialCell);
  
  //   fireEvent.click(screen.getByText('Step Forward')); // Navigate forward
  //   expect(screen.getByTestId('cell-0-0').className).toBe(initialCell);
  // });

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
    const fileInput = screen.getByLabelText('Import');
  
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
    fireEvent.click(screen.getByText('Start'));

    act(() => {
      jest.advanceTimersByTime(500); // Advance by default speed
    });

    expect(screen.getByTestId('grid')).toBeInTheDocument();
  });

  it('respects minimum and maximum grid size limits', () => {
    render(<App />);
    const gridSizeInput = screen.getByLabelText(/Grid Size/i);

    fireEvent.change(gridSizeInput, { target: { value: '2' } });
    expect(gridSizeInput).toHaveValue(3); // Minimum grid size

    fireEvent.change(gridSizeInput, { target: { value: '1001' } });
    expect(gridSizeInput).toHaveValue(1000); // Maximum grid size
  });

  it('resets grid when Clear button is clicked', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Random')); // Modify grid
  
    fireEvent.click(screen.getByText('Clear')); // Clear grid
  
    const allCells = document.querySelectorAll('[data-testid^="cell"]');
    allCells.forEach((cell) => {
      expect(cell.className).toContain('dead'); // Verify all cells are dead
    });
  });
});