import { render, screen, fireEvent } from '@testing-library/react';
import BottomSheet from './BottomSheet'; // Adjust the import path as needed

describe('BottomSheet Component', () => {
  const mockOnClose = jest.fn();
  const childText = 'This is the content inside the BottomSheet';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders overlay and sheet when isOpen is true', () => {
    render(
      <BottomSheet isOpen={true} onClose={mockOnClose}>
        <div>{childText}</div>
      </BottomSheet>
    );

    // Check for overlay
    const overlay = screen.getByTestId('bottom-sheet-overlay');
    expect(overlay).toBeInTheDocument();

    // Check for sheet
    const sheet = screen.getByTestId('bottom-sheet-sheet');
    expect(sheet).toBeInTheDocument();
    expect(sheet).toHaveClass('translate-y-0');

    // Check for children
    expect(screen.getByText(childText)).toBeInTheDocument();
  });

  test('does not render overlay and sheet when isOpen is false', () => {
    render(
      <BottomSheet isOpen={false} onClose={mockOnClose}>
        <div>{childText}</div>
      </BottomSheet>
    );

    // The overlay should not be in the document
    expect(screen.queryByTestId('bottom-sheet-overlay')).not.toBeInTheDocument();

    // The sheet should have class 'translate-y-full'
    const sheet = screen.getByTestId('bottom-sheet-sheet');
    expect(sheet).toBeInTheDocument();
    expect(sheet).toHaveClass('translate-y-full');
  });

  test('calls onClose when overlay is clicked', () => {
    render(
      <BottomSheet isOpen={true} onClose={mockOnClose}>
        <div>{childText}</div>
      </BottomSheet>
    );

    // Simulate clicking the overlay
    const overlay = screen.getByTestId('bottom-sheet-overlay');
    fireEvent.click(overlay);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('renders children correctly inside the sheet', () => {
    render(
      <BottomSheet isOpen={true} onClose={mockOnClose}>
        <div data-testid="child-content">{childText}</div>
      </BottomSheet>
    );

    const child = screen.getByTestId('child-content');
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent(childText);
  });

  test('applies correct classes based on isOpen prop', () => {
    const { rerender, getByTestId } = render(
      <BottomSheet isOpen={true} onClose={mockOnClose}>
        <div>{childText}</div>
      </BottomSheet>
    );

    const sheet = getByTestId('bottom-sheet-sheet');
    expect(sheet).toHaveClass('translate-y-0');

    rerender(
      <BottomSheet isOpen={false} onClose={mockOnClose}>
        <div>{childText}</div>
      </BottomSheet>
    );

    expect(sheet).toHaveClass('translate-y-full');
  });
});