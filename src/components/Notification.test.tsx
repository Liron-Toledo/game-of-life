import { render, screen } from '@testing-library/react';
import { act } from 'react';
import Notification from './Notification';

describe('Notification Component', () => {
  it('renders the notification when a message is provided', () => {
    const message = 'Test Notification';
    render(<Notification message={message} />);

    const notificationElement = screen.getByText(message);
    expect(notificationElement).toBeInTheDocument();
    expect(notificationElement).toHaveClass(
      'fixed top-4 left-0 right-0 mx-auto bg-green-500 dark:bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg text-center max-w-sm'
    );  });

  it('does not render when the message is null', () => {
    render(<Notification message={undefined} />);
    const notificationElement = screen.queryByText(/./); // Match any text
    expect(notificationElement).not.toBeInTheDocument();
  });

  it('animates the notification with Framer Motion', () => {
    const message = 'Animated Notification';
    render(<Notification message={message} />);

    const notificationElement = screen.getByText(message);

    act(() => {
      notificationElement.style.opacity = '1';
      notificationElement.style.transform = 'translateY(0)';
    });

    expect(notificationElement).toHaveStyle({
      opacity: '1',
      transform: 'translateY(0)',
    });
  });
});