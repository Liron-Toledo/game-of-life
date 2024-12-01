import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from './ThemeToggle';

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    // Clear document classList before each test
    document.documentElement.classList.remove('dark');
  });

  it('renders with initial light theme', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /toggle dark mode/i });

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('☀️ Light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('toggles to dark theme when clicked', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /toggle dark mode/i });

    // Click to enable dark mode
    fireEvent.click(button);

    expect(button).toHaveTextContent('🌙 Dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('toggles back to light theme when clicked again', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /toggle dark mode/i });

    // Click to enable dark mode
    fireEvent.click(button);

    // Click again to disable dark mode
    fireEvent.click(button);

    expect(button).toHaveTextContent('☀️ Light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('applies correct styles for dark mode', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /toggle dark mode/i });

    // Click to enable dark mode
    fireEvent.click(button);

    expect(button).toHaveClass('dark:bg-gray-700 dark:text-gray-200');
  });

  it('applies correct styles for light mode', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /toggle dark mode/i });

    expect(button).toHaveClass('bg-gray-300 text-gray-800');
  });
});