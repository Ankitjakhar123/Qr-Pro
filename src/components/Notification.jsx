import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

const Notification = ({ type = 'success', message, isVisible, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      default:
        return <CheckCircle className="w-5 h-5 text-amoled-accent" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-900/90 border-green-700';
      default:
        return 'bg-amoled-card border-amoled-border';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className={`fixed top-20 right-4 z-50 ${getBgColor()} border rounded-lg p-4 shadow-xl max-w-sm`}
        >
          <div className="flex items-start space-x-3">
            {getIcon()}
            <div className="flex-1">
              <p className="text-amoled-text text-sm font-medium">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="text-amoled-muted hover:text-amoled-text transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
