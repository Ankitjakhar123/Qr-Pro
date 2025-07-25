import React from 'react';
import { motion } from 'framer-motion';

const Analytics = () => {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-amoled-text mb-4">
          QR Analytics
        </h1>
        <p className="text-lg text-amoled-muted">
          Track your QR code performance and insights
        </p>
      </motion.div>

      <div className="glass-card p-12 text-center">
        <h2 className="text-2xl font-bold text-amoled-text mb-4">Pro Feature</h2>
        <p className="text-amoled-muted">
          Analytics dashboard for tracking QR code scans and performance
        </p>
      </div>
    </div>
  );
};

export default Analytics;