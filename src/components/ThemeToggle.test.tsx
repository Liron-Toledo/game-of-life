import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from './ThemeToggle';

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark'); // Ensure no pre-existing theme class
  });

  it('renders with initial light theme', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /toggle dark mode/i });

    expect(button).toBeInTheDocument();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light'); // 'light' is app's default
  });

  it('toggles to dark theme when clicked', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /toggle dark mode/i });

    fireEvent.click(button);

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('toggles back to light theme when clicked again', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /toggle dark mode/i });

    fireEvent.click(button); // Dark
    fireEvent.click(button); // Light

    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('retains the theme based on localStorage after re-render', () => {
    localStorage.setItem('theme', 'dark');
    render(<ThemeToggle />);

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});