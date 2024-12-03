import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationProps {
  message: string | undefined;
  type?: 'success' | 'error' | 'warning';
}

/**
 * Notification component that displays a temporary message with a fade-in and fade-out animation.
 * The animation is handled using Framer Motion.
 * @param message - The message to display in the notification
 * @param type - The type of notification ('success', 'error', or 'warning')
 */
const Notification: React.FC<NotificationProps> = ({ message, type = 'success' }) => {
  // Determine notification color based on the type
  const notificationClass =
    type === 'success'
      ? 'bg-green-500 dark:bg-green-600'
      : type === 'error'
      ? 'bg-red-500 dark:bg-red-600'
      : 'bg-orange-500 dark:bg-orange-600'; // Warning type

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }} // Starting state
          animate={{ opacity: 1, y: 0 }}   // Animated state
          exit={{ opacity: 0, y: -20 }}    // Exit state
          transition={{ duration: 0.5 }}   // Animation timing
          className={`fixed top-4 left-0 right-0 mx-auto ${notificationClass} text-white px-6 py-3 rounded-lg shadow-lg text-center max-w-sm`}
          >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;