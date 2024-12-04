import React from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, children }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          data-testid="bottom-sheet-overlay"
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
          aria-label="Close Bottom Sheet"
        ></div>
      )}

      {/* Sheet */}
      <div
        data-testid="bottom-sheet-sheet"
        className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-lg p-4 z-50 transform transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
      >
        {/* Drag Handle (Dragging would be nice future feature) */}
        {/* <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-2"></div> */}

        {/* Content */}
        {children}
      </div>
    </>
  );
};

export default BottomSheet;