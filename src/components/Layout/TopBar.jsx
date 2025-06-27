import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, Bell, Settings, LogOut, QrCode, Download } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { usePWA } from '../../hooks/usePWA.js';

const TopBar = () => {
  const { sidebarOpen, setSidebarOpen, toggleSidebar, isMobile } = useTheme();
  const { user, logout } = useAuth();
  const { isInstallable, installPWA, isPWAInstalled } = usePWA();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleMenuClick = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      toggleSidebar();
    }
  };

  // Close mobile menu on navigation or logout
  const handleMobileMenuAction = (action) => {
    setShowMobileMenu(false);
    if (action === 'logout') logout();
  };

  return (
    <header className="h-16 bg-amoled-card border-b border-amoled-border flex items-center justify-between sm:px-6 px-2 flex-shrink-0">
      {/* Left side */}
      <div className="flex items-center sm:space-x-4 space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleMenuClick}
          className="w-10 h-10 bg-amoled-border rounded-lg flex items-center justify-center hover:bg-amoled-accent/20 transition-colors"
        >
          <Menu className="w-5 h-5 text-amoled-text" />
        </motion.button>

        {/* Mobile logo - centered on mobile */}
        {isMobile && (
          <div className="flex-1 flex justify-center">
            <Link to="/" className="flex items-center space-x-2">
              <QrCode className="w-6 h-6 text-amoled-accent" />
              <span className="font-bold text-amoled-text">QR Pro</span>
            </Link>
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center sm:space-x-3 space-x-1">
        {/* PWA Install Button - only show if installable and not already installed, and only on sm+ */}
        {isInstallable && !isPWAInstalled && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={installPWA}
            className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-amoled-accent/20 text-amoled-accent border border-amoled-accent/30 rounded-lg hover:bg-amoled-accent/30 transition-colors text-sm font-medium"
            title="Install QR Pro as an app"
          >
            <Download className="w-4 h-4" />
            <span>Install App</span>
          </motion.button>
        )}

        {/* Desktop: show all user actions; Mobile: show a single More button */}
        {user ? (
          <>
            {/* Desktop actions */}
            <div className="hidden sm:flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-amoled-border rounded-lg flex items-center justify-center hover:bg-amoled-accent/20 transition-colors"
              >
                <Bell className="w-5 h-5 text-amoled-text" />
              </motion.button>

              <Link to="/profile">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-amoled-border rounded-lg flex items-center justify-center hover:bg-amoled-accent/20 transition-colors"
                >
                  <Settings className="w-5 h-5 text-amoled-text" />
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="w-10 h-10 bg-amoled-red/20 rounded-lg flex items-center justify-center hover:bg-amoled-red/30 transition-colors"
              >
                <LogOut className="w-5 h-5 text-amoled-red" />
              </motion.button>
            </div>
            {/* Mobile: More menu */}
            <div className="sm:hidden relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMobileMenu((v) => !v)}
                className="w-10 h-10 bg-amoled-border rounded-lg flex items-center justify-center hover:bg-amoled-accent/20 transition-colors"
                aria-label="Open user menu"
              >
                <Settings className="w-5 h-5 text-amoled-text" />
              </motion.button>
              {showMobileMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-amoled-card border border-amoled-border rounded-lg shadow-lg z-50 animate-fade-in">
                  <button
                    onClick={() => handleMobileMenuAction('notifications')}
                    className="w-full flex items-center px-4 py-2 text-sm text-amoled-text hover:bg-amoled-accent/10"
                  >
                    <Bell className="w-4 h-4 mr-2" /> Notifications
                  </button>
                  <Link
                    to="/profile"
                    onClick={() => handleMobileMenuAction('profile')}
                    className="w-full flex items-center px-4 py-2 text-sm text-amoled-text hover:bg-amoled-accent/10"
                  >
                    <Settings className="w-4 h-4 mr-2" /> Profile
                  </Link>
                  <button
                    onClick={() => handleMobileMenuAction('logout')}
                    className="w-full flex items-center px-4 py-2 text-sm text-amoled-red hover:bg-amoled-red/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center space-x-2">
            <Link to="/login" className="btn-secondary">
              Login
            </Link>
            <Link to="/register" className="btn-primary">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;