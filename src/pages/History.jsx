import React from 'react';
import { motion } from 'framer-motion';

const History = () => {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-amoled-text mb-4">
          QR History
        </h1>
        <p className="text-lg text-amoled-muted">
          View and manage all your generated QR codes
        </p>
      </motion.div>

      <div className="glass-card p-12 text-center">
        <h2 className="text-2xl font-bold text-amoled-text mb-4">No QR Codes Yet</h2>
        <p className="text-amoled-muted">
          Generate your first QR code to see it here!
        </p>
      </div>
    </div>
  );
};

export default History;