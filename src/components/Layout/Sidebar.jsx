import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  QrCode, 
  Home, 
  Palette, 
  History, 
  BarChart3, 
  User, 
  Settings,
  Crown,
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const Sidebar = () => {
  const location = useLocation();
  const { user, trialDaysLeft } = useAuth();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/generate', icon: QrCode, label: 'Generate QR' },
    { path: '/templates', icon: Palette, label: 'Templates' },
    { path: '/history', icon: History, label: 'History', requireAuth: true },
    { path: '/analytics', icon: BarChart3, label: 'Analytics', requireRole: 'pro' },
    { path: '/profile', icon: User, label: 'Profile', requireAuth: true },
  ];

  const adminItems = [
    { path: '/admin', icon: Shield, label: 'Admin Panel', requireRole: 'admin' }
  ];

  const shouldShowItem = (item) => {
    if (item.requireAuth && !user) return false;
    if (item.requireRole && (!user || user.role !== item.requireRole)) return false;
    return true;
  };

  return (
    <div className="w-80 h-full bg-amoled-card border-r border-amoled-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-amoled-border">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-amoled-accent rounded-lg flex items-center justify-center">
            <QrCode className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-amoled-text">QR Pro</h1>
            <p className="text-sm text-amoled-muted">Generator</p>
          </div>
        </Link>
      </div>

      {/* Trial Status */}
      {user && user.role === 'trial' && (
        <div className="mx-4 mt-4 p-4 bg-amoled-accent/10 border border-amoled-accent/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Crown className="w-4 h-4 text-amoled-accent" />
            <span className="text-sm font-medium text-amoled-accent">
              Trial: {trialDaysLeft} days left
            </span>
          </div>
          <Link 
            to="/upgrade" 
            className="text-xs text-amoled-accent hover:underline mt-1 block"
          >
            Upgrade to Pro →
          </Link>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.filter(shouldShowItem).map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-amoled-accent text-black' 
                    : 'text-amoled-muted hover:text-amoled-text hover:bg-amoled-border/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}

        {/* Admin Section */}
        {adminItems.filter(shouldShowItem).length > 0 && (
          <>
            <div className="border-t border-amoled-border my-4" />
            {adminItems.filter(shouldShowItem).map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-amoled-purple text-white' 
                        : 'text-amoled-muted hover:text-amoled-text hover:bg-amoled-border/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* User Info */}
      {user && (
        <div className="p-4 border-t border-amoled-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-amoled-accent rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-amoled-text truncate">
                {user.name || 'User'}
              </p>
              <p className="text-xs text-amoled-muted capitalize">
                {user.role} account
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;