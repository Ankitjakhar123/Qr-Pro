import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar.jsx';
import TopBar from './TopBar.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

const Layout = () => {
  const { sidebarOpen, setSidebarOpen, isMobile, setIsMobile } = useTheme();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobile]);

  return (
    <div className="flex h-screen bg-amoled-bg overflow-hidden">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <motion.div
          initial={false}
          animate={{ 
            width: sidebarOpen ? 320 : 0,
            opacity: sidebarOpen ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="relative z-30 overflow-hidden"
        >
          <div className="w-80 h-full">
            <Sidebar />
          </div>
        </motion.div>
      )}

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed left-0 top-0 h-full z-50 w-80"
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;