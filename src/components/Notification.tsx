import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationProps {
  message: string | null;
}

const Notification: React.FC<NotificationProps> = ({ message }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }} // Starting state
          animate={{ opacity: 1, y: 0 }}   // Animated state
          exit={{ opacity: 0, y: -20 }}    // Exit state
          transition={{ duration: 0.5 }}   // Animation timing
          className="fixed top-4 right-4 bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;