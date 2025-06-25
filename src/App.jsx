import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from './components/Layout/Layout.jsx';
import PWAInstallBanner from './components/PWAInstallBanner.jsx';
import Notification from './components/Notification.jsx';
import { usePWA } from './hooks/usePWA.js';
import Home from './pages/Home.jsx';
import Generator from './pages/Generator.jsx';
import Templates from './pages/Templates.jsx';
import History from './pages/History.jsx';
import Analytics from './pages/Analytics.jsx';
import Profile from './pages/Profile.jsx';
import Admin from './pages/Admin.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Upgrade from './pages/Upgrade.jsx';
import ProtectedRoute from './components/Auth/ProtectedRoute.jsx';

function App() {
  const { showInstallSuccess, setShowInstallSuccess } = usePWA();
  
  return (
    <div className="min-h-screen bg-amoled-bg text-amoled-text">
      <PWAInstallBanner />
      <Notification
        type="success"
        message="QR Pro has been installed successfully! You can now access it from your home screen."
        isVisible={showInstallSuccess}
        onClose={() => setShowInstallSuccess(false)}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="generate" element={<Generator />} />
          <Route path="templates" element={<Templates />} />
          <Route 
            path="history" 
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="analytics" 
            element={
              <ProtectedRoute requiredRole="pro">
                <Analytics />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="upgrade" 
            element={
              <ProtectedRoute>
                <Upgrade />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <Admin />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;