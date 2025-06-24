import React from 'react';
import { motion } from 'framer-motion';

const Templates = () => {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-amoled-text mb-4">
          QR Templates
        </h1>
        <p className="text-lg text-amoled-muted">
          Choose from beautiful pre-designed QR code templates
        </p>
      </motion.div>

      <div className="glass-card p-12 text-center">
        <h2 className="text-2xl font-bold text-amoled-text mb-4">Coming Soon</h2>
        <p className="text-amoled-muted">
          We're working on beautiful QR code templates for you!
        </p>
      </div>
    </div>
  );
};

export default Templates;