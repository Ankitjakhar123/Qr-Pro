import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  QrCode, 
  Zap, 
  Palette, 
  BarChart3, 
  Shield, 
  ArrowRight,
  Sparkles,
  Clock,
  Download,
  Smartphone
} from 'lucide-react';
import { usePWA } from '../hooks/usePWA.js';

const Home = () => {
  const { isInstallable, installPWA, isPWAInstalled } = usePWA();
  
  const features = [
    {
      icon: QrCode,
      title: 'Multi-Type QR Codes',
      description: 'Generate QR codes for URLs, text, email, phone, WiFi, vCard, and more with instant preview.'
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Generation',
      description: 'Let AI detect the best QR type and generate smart suggestions based on your input.'
    },
    {
      icon: Palette,
      title: 'Advanced Customization',
      description: 'Customize colors, shapes, add logos, and choose from beautiful pre-made templates.'
    },
    {
      icon: BarChart3,
      title: 'Scan Analytics',
      description: 'Track QR code performance with detailed analytics and insights (Pro feature).'
    },
    {
      icon: Clock,
      title: 'QR History',
      description: 'Save and manage all your generated QR codes in one organized dashboard.'
    },
    {
      icon: Download,
      title: 'Multiple Formats',
      description: 'Download as PNG, SVG, or share directly via Web Share API.'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-16"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-24 h-24 bg-amoled-accent rounded-2xl flex items-center justify-center mx-auto mb-8 neon-glow"
        >
          <QrCode className="w-12 h-12 text-black" />
        </motion.div>

        <h1 className="text-6xl font-bold text-amoled-text mb-6">
          QR Generator
          <span className="text-amoled-accent"> Pro</span>
        </h1>
        
        <p className="text-xl text-amoled-muted mb-8 max-w-2xl mx-auto leading-relaxed">
          Create professional QR codes with AI assistance, advanced customization, 
          and powerful analytics. Perfect for businesses and creators.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/generate" className="btn-primary text-lg px-8 py-4">
            Start Generating 
          </Link>
          <Link to="/templates" className="btn-secondary text-lg px-8 py-4">
            Browse Templates
          </Link>
          
          {/* PWA Install Button */}
          {isInstallable && !isPWAInstalled && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={installPWA}
              className="flex items-center space-x-2 px-6 py-3 bg-amoled-card border border-amoled-accent/50 text-amoled-accent rounded-lg hover:bg-amoled-accent/10 transition-all font-medium"
            >
              <Smartphone className="w-5 h-5" />
              <span>Install App</span>
            </motion.button>
          )}
        </div>

        <div className="flex items-center justify-center mt-8 space-x-6 text-sm text-amoled-muted">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-amoled-accent" />
            <span>10-day free trial</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amoled-accent" />
            <span>AI-powered</span>
          </div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <section>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-amoled-text mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-amoled-muted max-w-2xl mx-auto">
            Everything you need to create, customize, and track professional QR codes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="glass-card p-6 hover:border-amoled-accent/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-amoled-accent/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amoled-accent/30 transition-colors">
                  <Icon className="w-6 h-6 text-amoled-accent" />
                </div>
                <h3 className="text-xl font-semibold text-amoled-text mb-3">
                  {feature.title}
                </h3>
                <p className="text-amoled-muted leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="glass-card text-center px-4 py-10 sm:p-12 max-w-2xl mx-auto my-8 flex flex-col items-center justify-center"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amoled-text mb-4 leading-tight">
          Ready to create amazing QR codes?
        </h2>
        <p className="text-base sm:text-lg text-amoled-muted mb-8 max-w-lg mx-auto">
          Start your free trial today and experience the power of AI-assisted QR generation
        </p>
        <Link
          to="/generate"
          className="btn-primary w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 flex items-center justify-center mx-auto"
        >
          Get Started Now <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </motion.section>
    </div>
  );
};

export default Home;