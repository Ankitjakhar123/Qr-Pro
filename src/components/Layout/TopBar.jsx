import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, Bell, Settings, LogOut, QrCode, Download } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { usePWA } from '../../hooks/usePWA.js';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';

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
      <div className="flex items-center sm:space-x-3 space-x-2">
        {/* Clerk Auth Buttons */}
        <SignedOut>
          <SignInButton mode="modal">
            <button className="btn-secondary">Login</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="btn-primary">Sign Up</button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
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
      </div>
    </header>
  );
};

export default TopBar;