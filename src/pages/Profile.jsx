import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';

const Profile = () => {
  const { user, trialDaysLeft } = useAuth();

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-amoled-text mb-4">
          Profile
        </h1>
        <p className="text-lg text-amoled-muted">
          Manage your account settings and preferences
        </p>
      </motion.div>

      <div className="glass-card p-8">
        <h2 className="text-2xl font-bold text-amoled-text mb-6">Account Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-amoled-muted mb-1">Name</label>
            <p className="text-amoled-text">{user?.name || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-amoled-muted mb-1">Email</label>
            <p className="text-amoled-text">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-amoled-muted mb-1">Account Type</label>
            <p className="text-amoled-text capitalize">{user?.role}</p>
          </div>
          {user?.role === 'trial' && (
            <div>
              <label className="block text-sm font-medium text-amoled-muted mb-1">Trial Status</label>
              <p className="text-amoled-accent">{trialDaysLeft} days remaining</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;