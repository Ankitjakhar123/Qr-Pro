import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, Bell, Settings, LogOut, QrCode } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const TopBar = () => {
  const { sidebarOpen, setSidebarOpen, toggleSidebar, isMobile } = useTheme();
  const { user, logout } = useAuth();

  const handleMenuClick = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      toggleSidebar();
    }
  };

  return (
    <header className="h-16 bg-amoled-card border-b border-amoled-border flex items-center justify-between px-6 flex-shrink-0">
      {/* Left side */}
      <div className="flex items-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleMenuClick}
          className="w-10 h-10 bg-amoled-border rounded-lg flex items-center justify-center hover:bg-amoled-accent/20 transition-colors"
        >
          <Menu className="w-5 h-5 text-amoled-text" />
        </motion.button>

        {/* Mobile logo */}
        {isMobile && (
          <Link to="/" className="flex items-center space-x-2">
            <QrCode className="w-6 h-6 text-amoled-accent" />
            <span className="font-bold text-amoled-text">QR Pro</span>
          </Link>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-3">
        {user ? (
          <>
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