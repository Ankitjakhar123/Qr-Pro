import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, Bell, Settings, LogOut, QrCode, Download, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { usePWA } from '../../hooks/usePWA.js';

// Import Clerk components - will work if ClerkProvider is present in main.jsx
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';

// Safe Clerk wrapper component with error boundary
class ClerkAuthErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI if Clerk fails
      const { user, logout } = this.props;
      return !user ? (
        <>
          <Link to="/login" className="btn-secondary">Login</Link>
          <Link to="/register" className="btn-primary">Sign Up</Link>
        </>
      ) : (
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5 text-amoled-text" />
          <span className="text-sm text-amoled-text hidden sm:inline">{user?.name || user?.email}</span>
          <button onClick={logout} className="btn-secondary text-sm">Logout</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Safe Clerk wrapper component
const SafeClerkAuth = ({ user, logout }) => {
  const hasClerkKey = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  
  if (!hasClerkKey) {
    // Fallback to regular auth UI
    return !user ? (
      <>
        <Link to="/login" className="btn-secondary">Login</Link>
        <Link to="/register" className="btn-primary">Sign Up</Link>
      </>
    ) : (
      <div className="flex items-center space-x-2">
        <User className="w-5 h-5 text-amoled-text" />
        <span className="text-sm text-amoled-text hidden sm:inline">{user?.name || user?.email}</span>
        <button onClick={logout} className="btn-secondary text-sm">Logout</button>
      </div>
    );
  }

  // Use Clerk components wrapped in error boundary
  return (
    <ClerkAuthErrorBoundary user={user} logout={logout}>
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
    </ClerkAuthErrorBoundary>
  );
};

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
        <SafeClerkAuth user={user} logout={logout} />
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