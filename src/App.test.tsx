import { render, fireEvent } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
  });

  it('toggles between Start and Pause', async () => {
    const { getByText } = render(<App />);
    const startButton = getByText('Start');

    fireEvent.click(startButton);
    expect(getByText('Pause')).toBeInTheDocument();

    fireEvent.click(getByText('Pause'));
    expect(getByText('Start')).toBeInTheDocument();
  });

  it('updates grid size when grid size input changes', () => {
    const { getByLabelText } = render(<App />);
    const gridSizeInput = getByLabelText(/Grid Size/i);
    fireEvent.change(gridSizeInput, { target: { value: '25' } });
    expect(gridSizeInput).toHaveValue(25);
  });
});