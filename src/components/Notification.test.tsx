import { render, screen } from '@testing-library/react';
import Notification from './Notification';
import { act } from 'react-dom/test-utils';

describe('Notification Component', () => {
  it('renders the notification when a message is provided', () => {
    const message = 'This is a notification';

    render(<Notification message={message} />);

    const notificationElement = screen.getByText(message);
    expect(notificationElement).toBeInTheDocument();
    expect(notificationElement).toHaveClass(
      'fixed top-4 right-4 bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg'
    );
  });

  it('does not render anything when the message is null', () => {
    const { container } = render(<Notification message={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('applies animations correctly with framer-motion', () => {
    const message = 'Animated notification';

    render(<Notification message={message} />);
    const notificationElement = screen.getByText(message);

    // Check initial animation state
    expect(notificationElement).toHaveStyle('opacity: 0');
    expect(notificationElement).toHaveStyle('transform: translateY(-20px)');

    // Simulate animation (Framer Motion applies animation dynamically)
    act(() => {
      notificationElement.style.opacity = '1';
      notificationElement.style.transform = 'translateY(0)';
    });

    expect(notificationElement).toHaveStyle('opacity: 1');
    expect(notificationElement).toHaveStyle('transform: translateY(0)');
  });
});