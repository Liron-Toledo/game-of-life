import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationProps {
  message: string | null;
}

/**
 * Notification component that displays a temporary message with a fade-in and fade-out animation.
 * The animation is handled using Framer Motion.
 * @param message - The message to display in the notification
 */
const Notification: React.FC<NotificationProps> = ({ message }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }} // Starting state
          animate={{ opacity: 1, y: 0 }}   // Animated state
          exit={{ opacity: 0, y: -20 }}    // Exit state
          transition={{ duration: 0.5 }}   // Animation timing
          className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;