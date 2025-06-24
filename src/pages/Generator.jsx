import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Share2, 
  Palette, 
  Upload,
  Sparkles,
  Settings,
  Copy,
  Check,
  X
} from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';
import axios from 'axios';
import QrCard from '../components/QrCard';
import IconPicker from '../components/IconPicker';
import * as htmlToImage from 'html-to-image';

const Generator = () => {
  const [qrData, setQrData] = useState('https://example.com');
  const [qrType, setQrType] = useState('url');
  const [qrOptions, setQrOptions] = useState({
    width: 300,
    height: 300,
    type: 'svg',
    data: 'https://example.com',
    dotsOptions: {
      color: '#000000',
      type: 'rounded'
    },
    backgroundOptions: {
      color: '#ffffff'
    },
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: 10
    },
    cornersSquareOptions: {
      color: '#000000',
      type: 'extra-rounded'
    },
    cornersDotOptions: {
      color: '#000000',
      type: 'dot'
    }
  });
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showMagicModal, setShowMagicModal] = useState(false);
  const [magicPrompt, setMagicPrompt] = useState('');
  const [isMagicLoading, setIsMagicLoading] = useState(false);
  const qrRef = useRef(null);
  const qrCode = useRef(null);
  const [labelText, setLabelText] = useState('SoundLink');
  const [labelIcon, setLabelIcon] = useState('phone'); // default to phone icon key
  const [customIcon, setCustomIcon] = useState(null); // for uploaded icon
  const [borderStyle, setBorderStyle] = useState('rounded'); // 'rounded' or 'square'
  const cardRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (!qrCode.current) {
      qrCode.current = new QRCodeStyling(qrOptions);
    } else {
      qrCode.current.update(qrOptions);
    }

    if (qrRef.current) {
      qrRef.current.innerHTML = '';
      qrCode.current.append(qrRef.current);
    }
  }, [qrOptions]);

  const qrTypes = [
    { value: 'url', label: 'Website URL', placeholder: 'https://example.com' },
    { value: 'text', label: 'Plain Text', placeholder: 'Your text here' },
    { value: 'email', label: 'Email', placeholder: 'example@email.com' },
    { value: 'phone', label: 'Phone', placeholder: '+1234567890' },
    { value: 'sms', label: 'SMS', placeholder: '+1234567890' },
    { value: 'wifi', label: 'WiFi', placeholder: 'Network name' },
    { value: 'vcard', label: 'Contact Card', placeholder: 'Contact info' },
    { value: 'location', label: 'Location', placeholder: 'Latitude,Longitude' }
  ];

  const handleDataChange = (value) => {
    setQrData(value);
    setQrOptions(prev => ({ ...prev, data: value }));
  };

  const handleTypeChange = (type) => {
    setQrType(type);
    const placeholder = qrTypes.find(t => t.value === type)?.placeholder || '';
    setQrData(placeholder);
    setQrOptions(prev => ({ ...prev, data: placeholder }));
  };

  const handleColorChange = (colorType, color) => {
    if (colorType === 'foreground') {
      setQrOptions(prev => ({
        ...prev,
        dotsOptions: { ...prev.dotsOptions, color },
        cornersSquareOptions: { ...prev.cornersSquareOptions, color },
        cornersDotOptions: { ...prev.cornersDotOptions, color }
      }));
    } else {
      setQrOptions(prev => ({
        ...prev,
        backgroundOptions: { ...prev.backgroundOptions, color }
      }));
    }
  };

  const handleDownload = async (format = 'png') => {
    if (cardRef.current) {
      const dataUrl = await htmlToImage.toPng(cardRef.current);
      const link = document.createElement('a');
      link.download = `qr-card.${format}`;
      link.href = dataUrl;
      link.click();
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'QR Code',
          text: 'Check out this QR code!',
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(qrData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMagicGenerate = async () => {
    if (!magicPrompt.trim()) return;
    
    setIsMagicLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/ai/magic-generate`, 
        { prompt: magicPrompt },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      const { type, data, title, instructions } = response.data;
      
      // Update QR code with AI-generated data
      setQrType(type);
      setQrData(data);
      setQrOptions(prev => ({ ...prev, data }));
      
      // Close modal and show success
      setShowMagicModal(false);
      setMagicPrompt('');
      
      // You could show a success message here
      console.log('Magic generation successful:', { type, data, title, instructions });
      
    } catch (error) {
      console.error('Magic generation error:', error);
      // You could show an error message here
    } finally {
      setIsMagicLoading(false);
    }
  };

  // Example SVG icons for IconPicker
  const ICONS = [
    {
      key: 'phone',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="6" y="2" width="12" height="20" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="12" cy="18" r="1" fill="currentColor" />
        </svg>
      ),
    },
    {
      key: 'music',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
          <rect x="10" y="8" width="4" height="8" fill="currentColor" />
        </svg>
      ),
    },
    {
      key: 'link',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M10 13a5 5 0 007.07 0l2.83-2.83a5 5 0 00-7.07-7.07l-1.41 1.41" />
          <path d="M14 11a5 5 0 01-7.07 0L4.1 8.17a5 5 0 017.07-7.07l1.41 1.41" />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-amoled-text mb-4">
          QR Code Generator
        </h1>
        <p className="text-lg text-amoled-muted">
          Create professional QR codes with advanced customization options
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel - Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* QR Type Selection */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-amoled-text mb-4">QR Code Type</h3>
            <div className="grid grid-cols-2 gap-3">
              {qrTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleTypeChange(type.value)}
                  className={`p-3 rounded-lg border transition-all ${
                    qrType === type.value
                      ? 'border-amoled-accent bg-amoled-accent/10 text-amoled-accent'
                      : 'border-amoled-border text-amoled-muted hover:border-amoled-accent/50'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Data Input */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-amoled-text">Content</h3>
              <button
                onClick={copyToClipboard}
                className="flex items-center space-x-2 text-sm text-amoled-muted hover:text-amoled-accent transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <textarea
              value={qrData}
              onChange={(e) => handleDataChange(e.target.value)}
              placeholder={qrTypes.find(t => t.value === qrType)?.placeholder}
              className="input-field w-full h-32 resize-none"
            />
          </div>

          {/* Basic Customization */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-amoled-text mb-4">Appearance</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amoled-text mb-2">
                    Foreground Color
                  </label>
                  <input
                    type="color"
                    value={qrOptions.dotsOptions.color}
                    onChange={(e) => handleColorChange('foreground', e.target.value)}
                    className="w-full h-10 rounded-lg border border-amoled-border bg-amoled-card cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amoled-text mb-2">
                    Background Color
                  </label>
                  <input
                    type="color"
                    value={qrOptions.backgroundOptions.color}
                    onChange={(e) => handleColorChange('background', e.target.value)}
                    className="w-full h-10 rounded-lg border border-amoled-border bg-amoled-card cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-amoled-text mb-2">
                  Size: {qrOptions.width}px
                </label>
                <input
                  type="range"
                  min="200"
                  max="500"
                  value={qrOptions.width}
                  onChange={(e) => setQrOptions(prev => ({
                    ...prev,
                    width: parseInt(e.target.value),
                    height: parseInt(e.target.value)
                  }))}
                  className="w-full accent-amoled-accent"
                />
              </div>
            </div>
          </div>

          {/* Advanced Options */}
          <div className="glass-card p-6">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full mb-4"
            >
              <h3 className="text-lg font-semibold text-amoled-text">Advanced Options</h3>
              <Settings className={`w-5 h-5 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
            </button>
            
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-amoled-text mb-2">
                    Dot Style
                  </label>
                  <select
                    value={qrOptions.dotsOptions.type}
                    onChange={(e) => setQrOptions(prev => ({
                      ...prev,
                      dotsOptions: { ...prev.dotsOptions, type: e.target.value }
                    }))}
                    className="input-field w-full"
                  >
                    <option value="rounded">Rounded</option>
                    <option value="dots">Dots</option>
                    <option value="classy">Classy</option>
                    <option value="classy-rounded">Classy Rounded</option>
                    <option value="square">Square</option>
                    <option value="extra-rounded">Extra Rounded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-amoled-text mb-2">
                    Logo Upload
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setQrOptions(prev => ({
                              ...prev,
                              image: event.target.result
                            }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="flex items-center space-x-2 btn-secondary cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Logo</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* AI Assistant */}
          <div className="glass-card p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Sparkles className="w-5 h-5 text-amoled-accent" />
              <h3 className="text-lg font-semibold text-amoled-text">AI Assistant</h3>
            </div>
            <p className="text-sm text-amoled-muted mb-4">
              Let AI analyze your content and suggest the best QR type and styling
            </p>
            <button 
              className="btn-primary w-full"
              onClick={() => setShowMagicModal(true)}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Magic Generate
            </button>
          </div>
        </motion.div>

        {/* Right Panel - Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* QR Preview */}
          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-amoled-text">Preview</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDownload('png')}
                  className="flex items-center space-x-2 btn-secondary"
                >
                  <Download className="w-4 h-4" />
                  <span>PNG</span>
                </button>
              </div>
            </div>
            <QrCard
              qrRef={qrRef}
              labelText={labelText}
              labelIcon={customIcon || ICONS.find(i => i.key === labelIcon)?.icon}
              borderStyle={borderStyle}
              backgroundColor={qrOptions.backgroundOptions.color}
              cardRef={cardRef}
            />
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-amoled-text mb-2">Label Text</label>
                <input
                  type="text"
                  value={labelText}
                  onChange={e => setLabelText(e.target.value)}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amoled-text mb-2">Label Icon</label>
                <IconPicker
                  icons={ICONS}
                  value={labelIcon}
                  onChange={val => {
                    if (val.startsWith('data:')) {
                      setCustomIcon(val);
                    } else {
                      setLabelIcon(val);
                      setCustomIcon(null);
                    }
                  }}
                  allowUpload={true}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amoled-text mb-2">Border Style</label>
                <select
                  value={borderStyle}
                  onChange={e => setBorderStyle(e.target.value)}
                  className="input-field w-full"
                >
                  <option value="rounded">Rounded</option>
                  <option value="square">Square</option>
                </select>
              </div>
            </div>
            <div className="mt-6 p-4 bg-amoled-border/20 rounded-lg">
              <p className="text-sm text-amoled-muted mb-2">Content:</p>
              <p className="text-sm text-amoled-text font-mono break-all">
                {qrData}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-amoled-text mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="btn-secondary">
                <Palette className="w-4 h-4 mr-2" />
                Templates
              </button>
              <button className="btn-secondary">
                Save QR
              </button>
            </div>
          </div>

          {/* Color Presets */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-amoled-text mb-4">Color Presets</h3>
            <div className="grid grid-cols-4 gap-3">
              {[
                { fg: '#00ff88', bg: '#ffffff', name: 'Default' },
                { fg: '#000000', bg: '#ffffff', name: 'Classic' },
                { fg: '#ffffff', bg: '#000000', name: 'Inverted' },
                { fg: '#ff0080', bg: '#ffffff', name: 'Pink' },
                { fg: '#0080ff', bg: '#ffffff', name: 'Blue' },
                { fg: '#ff8000', bg: '#ffffff', name: 'Orange' },
                { fg: '#8000ff', bg: '#ffffff', name: 'Purple' },
                { fg: '#ff4040', bg: '#ffffff', name: 'Red' }
              ].map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    handleColorChange('foreground', preset.fg);
                    handleColorChange('background', preset.bg);
                  }}
                  className="flex flex-col items-center space-y-2 p-3 rounded-lg border border-amoled-border hover:border-amoled-accent/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded border border-amoled-border flex">
                    <div 
                      className="w-4 h-8 rounded-l"
                      style={{ backgroundColor: preset.fg }}
                    />
                    <div 
                      className="w-4 h-8 rounded-r"
                      style={{ backgroundColor: preset.bg }}
                    />
                  </div>
                  <span className="text-xs text-amoled-muted">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Magic Generate Modal */}
      {showMagicModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-6 h-6 text-amoled-accent" />
                <h3 className="text-xl font-semibold text-amoled-text">Magic Generate</h3>
              </div>
              <button
                onClick={() => setShowMagicModal(false)}
                className="text-amoled-muted hover:text-amoled-text transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-amoled-muted mb-4">
              Describe what you want in your QR code and AI will generate it for you.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-amoled-text mb-2">
                  Describe your QR code
                </label>
                <textarea
                  value={magicPrompt}
                  onChange={(e) => setMagicPrompt(e.target.value)}
                  placeholder="e.g., 'Create a QR code for my website https://example.com' or 'QR for WiFi network MyWiFi with password 12345'"
                  className="input-field w-full h-24 resize-none"
                  disabled={isMagicLoading}
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowMagicModal(false)}
                  className="btn-secondary flex-1"
                  disabled={isMagicLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleMagicGenerate}
                  className="btn-primary flex-1"
                  disabled={!magicPrompt.trim() || isMagicLoading}
                >
                  {isMagicLoading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Generator;