import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Smartphone } from 'lucide-react';
import { usePWA } from '../hooks/usePWA.js';

const PWAInstallBanner = () => {
  const [dismissed, setDismissed] = useState(false);
  const { isInstallable, installPWA, isPWAInstalled } = usePWA();

  // Don't show if not installable, already installed, or dismissed
  if (!isInstallable || isPWAInstalled || dismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-amoled-accent text-black p-4 shadow-lg"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5" />
              <span className="font-semibold">Install QR Pro</span>
            </div>
            <span className="text-sm opacity-90">
              Get the full app experience with offline support and faster access
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={installPWA}
              className="flex items-center space-x-2 bg-black/10 hover:bg-black/20 px-4 py-2 rounded-lg transition-colors font-medium"
            >
              <Download className="w-4 h-4" />
              <span>Install</span>
            </button>
            
            <button
              onClick={() => setDismissed(true)}
              className="p-2 hover:bg-black/10 rounded-lg transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PWAInstallBanner;
