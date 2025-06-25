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
      color: '#FFFFFF'
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
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [magicPrompt, setMagicPrompt] = useState('');
  const [isMagicLoading, setIsMagicLoading] = useState(false);
  const qrRef = useRef(null);
  const qrCode = useRef(null);
  const modalQrRef = useRef(null); // Separate ref for modal preview
  const modalQrCode = useRef(null); // Separate QR instance for modal
  const [labelText, setLabelText] = useState('SoundLink');
  const [labelIcon, setLabelIcon] = useState('phone'); // default to phone icon key
  const [customIcon, setCustomIcon] = useState(null); // for uploaded icon
  const [borderStyle, setBorderStyle] = useState('rounded'); // 'rounded' or 'square'
  const cardRef = useRef(null);
  const [borderSize, setBorderSize] = useState(4);
  const [borderColor, setBorderColor] = useState('#000000');
  const [labelBgColor, setLabelBgColor] = useState('#000000');
  const [labelTextColor, setLabelTextColor] = useState('#ffffff');
  const [shadow, setShadow] = useState(true);
  const [previewBgColor, setPreviewBgColor] = useState('#1a1a1a'); // Dark background for better contrast
  const [qrTitle, setQrTitle] = useState('My QR Code'); // QR code title/name
  
  // Dynamic form data for different QR types
  const [formData, setFormData] = useState({
    // UPI fields
    upiId: 'example@upi',
    payeeName: 'John Doe',
    amount: '100',
    currency: 'INR',
    transactionNote: 'Payment for services',
    
    // Email fields
    emailTo: 'example@email.com',
    emailSubject: 'Hello',
    emailBody: 'Message',
    
    // SMS fields
    smsNumber: '+1234567890',
    smsMessage: 'Hello there!',
    
    // Phone fields
    phoneNumber: '+1234567890',
    
    // WhatsApp fields
    whatsappNumber: '1234567890',
    whatsappMessage: 'Hello',
    
    // WiFi fields
    wifiSSID: 'MyNetwork',
    wifiPassword: 'MyPassword',
    wifiSecurity: 'WPA',
    wifiHidden: false,
    
    // vCard fields
    vcardName: 'John Doe',
    vcardOrg: 'Company Inc',
    vcardPhone: '+1234567890',
    vcardEmail: 'john@example.com',
    vcardWebsite: 'https://example.com',
    
    // MeCard fields
    mecardFirstName: 'John',
    mecardLastName: 'Doe',
    mecardOrg: 'Company Inc',
    mecardPhone: '+1234567890',
    mecardEmail: 'john@example.com',
    
    // Skype fields
    skypeUsername: 'username',
    skypeAction: 'call',
    
    // Location fields
    latitude: '40.7128',
    longitude: '-74.0060',
    locationName: 'New York City',
    
    // Calendar fields
    eventTitle: 'Meeting',
    eventStartDate: '2024-01-01',
    eventStartTime: '12:00',
    eventEndDate: '2024-01-01',
    eventEndTime: '13:00',
    eventLocation: 'Office',
    
    // General URL/text
    url: 'https://example.com',
    text: 'Your text here'
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Initialize QR data on component mount and when form data changes
  useEffect(() => {
    const initialData = generateQRData(qrType, formData);
    setQrData(initialData);
    setQrOptions(prev => ({ ...prev, data: initialData }));
  }, []); // Only run once on mount

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

  // Force QR code re-render when data changes
  useEffect(() => {
    if (qrCode.current && qrRef.current) {
      qrRef.current.innerHTML = '';
      qrCode.current.append(qrRef.current);
    }
  }, [qrData]);

  // Manage modal QR code separately
  useEffect(() => {
    if (showDownloadModal) {
      if (!modalQrCode.current) {
        modalQrCode.current = new QRCodeStyling(qrOptions);
      } else {
        modalQrCode.current.update(qrOptions);
      }

      if (modalQrRef.current && modalQrCode.current) {
        modalQrRef.current.innerHTML = '';
        modalQrCode.current.append(modalQrRef.current);
      }
    }
  }, [showDownloadModal, qrOptions]);

  const qrTypes = [
    // Payment (Popular)
    { value: 'upi', label: 'UPI Payment', placeholder: 'upi://pay?pa=example@upi&pn=John Doe&am=100&cu=INR&tn=Payment for services' },
    
    // Basic Types
    { value: 'url', label: 'Website URL', placeholder: 'https://example.com' },
    { value: 'text', label: 'Plain Text', placeholder: 'Your text here' },
    
    // Communication
    { value: 'email', label: 'Email', placeholder: 'mailto:example@email.com?subject=Hello&body=Message' },
    { value: 'phone', label: 'Phone Call', placeholder: 'tel:+1234567890' },
    { value: 'sms', label: 'SMS Message', placeholder: 'sms:+1234567890?body=Hello there!' },
    { value: 'whatsapp', label: 'WhatsApp', placeholder: 'https://wa.me/1234567890?text=Hello' },
    { value: 'telegram', label: 'Telegram', placeholder: 'https://t.me/username' },
    { value: 'skype', label: 'Skype Call', placeholder: 'skype:username?call' },
    
    // Contact & Location
    { value: 'vcard', label: 'Contact Card (vCard)', placeholder: 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nORG:Company Inc\nTEL:+1234567890\nEMAIL:john@example.com\nURL:https://example.com\nEND:VCARD' },
    { value: 'mecard', label: 'Contact Card (MeCard)', placeholder: 'MECARD:N:Doe,John;ORG:Company;TEL:+1234567890;EMAIL:john@example.com;;' },
    { value: 'location', label: 'GPS Location', placeholder: 'geo:40.7128,-74.0060?q=New York City' },
    
    // Network & Tech
    { value: 'wifi', label: 'WiFi Network', placeholder: 'WIFI:T:WPA;S:MyNetwork;P:MyPassword;H:false;;' },
    { value: 'calendar', label: 'Calendar Event', placeholder: 'BEGIN:VEVENT\nSUMMARY:Meeting\nDTSTART:20240101T120000Z\nDTEND:20240101T130000Z\nLOCATION:Office\nEND:VEVENT' },
    
    // Social Media
    { value: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/username' },
    { value: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/pagename' },
    { value: 'twitter', label: 'Twitter/X', placeholder: 'https://twitter.com/username' },
    { value: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
    { value: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/watch?v=dQw4w9WgXcQ' },
    { value: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@username' },
    { value: 'snapchat', label: 'Snapchat', placeholder: 'https://snapchat.com/add/username' },
    
    // Entertainment & Media
    { value: 'spotify', label: 'Spotify', placeholder: 'https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh' },
    { value: 'apple_music', label: 'Apple Music', placeholder: 'https://music.apple.com/album/1234567890' },
    { value: 'soundcloud', label: 'SoundCloud', placeholder: 'https://soundcloud.com/artist/track' },
    
    // Apps & Stores
    { value: 'app_store', label: 'App Store (iOS)', placeholder: 'https://apps.apple.com/app/id123456789' },
    { value: 'google_play', label: 'Google Play', placeholder: 'https://play.google.com/store/apps/details?id=com.example.app' },
    
    // Business & Meetings
    { value: 'zoom', label: 'Zoom Meeting', placeholder: 'https://zoom.us/j/1234567890?pwd=abcdef' },
    { value: 'teams', label: 'Microsoft Teams', placeholder: 'https://teams.microsoft.com/l/meetup-join/...' },
    { value: 'google_meet', label: 'Google Meet', placeholder: 'https://meet.google.com/abc-defg-hij' },
    
    // Payments & Finance
    { value: 'paypal', label: 'PayPal', placeholder: 'https://paypal.me/username/50' },
    { value: 'venmo', label: 'Venmo', placeholder: 'https://venmo.com/u/username' },
    { value: 'bitcoin', label: 'Bitcoin', placeholder: 'bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa?amount=0.01&label=Payment' },
    { value: 'ethereum', label: 'Ethereum', placeholder: 'ethereum:0x742d35Cc6634C0532925a3b8D4a0d1D9a2a4f5C3?value=1000000000000000000' },
    
    // Files & Documents
    { value: 'pdf', label: 'PDF Document', placeholder: 'https://example.com/document.pdf' },
    { value: 'google_drive', label: 'Google Drive', placeholder: 'https://drive.google.com/file/d/1234567890/view' },
    { value: 'dropbox', label: 'Dropbox', placeholder: 'https://dropbox.com/s/abcdefg/file.pdf' },
    
    // Reviews & Feedback
    { value: 'google_review', label: 'Google Review', placeholder: 'https://g.page/r/BusinessName/review' },
    { value: 'tripadvisor', label: 'TripAdvisor', placeholder: 'https://tripadvisor.com/Restaurant_Review-g123456-d789012.html' },
    
    // Other Services
    { value: 'uber', label: 'Uber Ride', placeholder: 'https://m.uber.com/ul/?pickup=lat,lng&dropoff=lat,lng' },
    { value: 'airbnb', label: 'Airbnb', placeholder: 'https://airbnb.com/rooms/12345678' },
    { value: 'booking', label: 'Booking.com', placeholder: 'https://booking.com/hotel/property.html' }
  ];

  const renderFormFields = () => {
    switch (qrType) {
      case 'upi':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-amoled-text mb-2">UPI ID</label>
              <input
                type="text"
                value={formData.upiId}
                onChange={(e) => handleFormDataChange('upiId', e.target.value)}
                placeholder="example@upi"
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-amoled-text mb-2">Payee Name</label>
              <input
                type="text"
                value={formData.payeeName}
                onChange={(e) => handleFormDataChange('payeeName', e.target.value)}
                placeholder="John Doe"
                className="input-field w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-amoled-text mb-2">Amount</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleFormDataChange('amount', e.target.value)}
                  placeholder="100"
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amoled-text mb-2">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleFormDataChange('currency', e.target.value)}
                  className="input-field w-full"
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-amoled-text mb-2">Transaction Note</label>
              <input
                type="text"
                value={formData.transactionNote}
                onChange={(e) => handleFormDataChange('transactionNote', e.target.value)}
                placeholder="Payment for services"
                className="input-field w-full"
              />
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-amoled-text mb-2">Email Address</label>
              <input
                type="email"
                value={formData.emailTo}
                onChange={(e) => handleFormDataChange('emailTo', e.target.value)}
                placeholder="example@email.com"
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-amoled-text mb-2">Subject</label>
              <input
                type="text"
                value={formData.emailSubject}
                onChange={(e) => handleFormDataChange('emailSubject', e.target.value)}
                placeholder="Hello"
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-amoled-text mb-2">Message</label>
              <textarea
                value={formData.emailBody}
                onChange={(e) => handleFormDataChange('emailBody', e.target.value)}
                placeholder="Your message here..."
                className="input-field w-full h-24 resize-none"
              />
            </div>
          </div>
        );

      case 'phone':
        return (
          <div>
            <label className="block text-sm font-medium text-amoled-text mb-2">Phone Number</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleFormDataChange('phoneNumber', e.target.value)}
              placeholder="+1234567890"
              className="input-field w-full"
            />
          </div>
        );

      case 'sms':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-amoled-text mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.smsNumber}
                onChange={(e) => handleFormDataChange('smsNumber', e.target.value)}
                placeholder="+1234567890"
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-amoled-text mb-2">Message</label>
              <textarea
                value={formData.smsMessage}
                onChange={(e) => handleFormDataChange('smsMessage', e.target.value)}
                placeholder="Your message here..."
                className="input-field w-full h-24 resize-none"
              />
            </div>
          </div>
        );

      case 'whatsapp':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-amoled-text mb-2">WhatsApp Number</label>
              <input
                type="tel"
                value={formData.whatsappNumber}
                onChange={(e) => handleFormDataChange('whatsappNumber', e.target.value)}
                placeholder="1234567890"
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-amoled-text mb-2">Message</label>
              <textarea
                value={formData.whatsappMessage}
                onChange={(e) => handleFormDataChange('whatsappMessage', e.target.value)}
                placeholder="Hello"
                className="input-field w-full h-24 resize-none"
              />
            </div>
          </div>
        );

      case 'wifi':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-amoled-text mb-2">Network Name (SSID)</label>
              <input
                type="text"
                value={formData.wifiSSID}
                onChange={(e) => handleFormDataChange('wifiSSID', e.target.value)}
                placeholder="MyNetwork"
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-amoled-text mb-2">Password</label>
              <input
                type="password"
                value={formData.wifiPassword}
                onChange={(e) => handleFormDataChange('wifiPassword', e.target.value)}
                placeholder="MyPassword"
                className="input-field w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-amoled-text mb-2">Security</label>
                <select
                  value={formData.wifiSecurity}
                  onChange={(e) => handleFormDataChange('wifiSecurity', e.target.value)}
                  className="input-field w-full"
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">Open</option>
                </select>
              </div>
              <div className="flex items-center pt-6">
                <input
                  type="checkbox"
                  id="wifi-hidden"
                  checked={formData.wifiHidden}
                  onChange={(e) => handleFormDataChange('wifiHidden', e.target.checked)}
                  className="accent-amoled-accent mr-2"
                />
                <label htmlFor="wifi-hidden" className="text-sm text-amoled-text">Hidden Network</label>
              </div>
            </div>
          </div>
        );

      case 'vcard':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-amoled-text mb-2">Full Name</label>
              <input
                type="text"
                value={formData.vcardName}
                onChange={(e) => handleFormDataChange('vcardName', e.target.value)}
                placeholder="John Doe"
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-amoled-text mb-2">Organization</label>
              <input
                type="text"
                value={formData.vcardOrg}
                onChange={(e) => handleFormDataChange('vcardOrg', e.target.value)}
                placeholder="Company Inc"
                className="input-field w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-amoled-text mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.vcardPhone}
                  onChange={(e) => handleFormDataChange('vcardPhone', e.target.value)}
                  placeholder="+1234567890"
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amoled-text mb-2">Email</label>
                <input
                  type="email"
                  value={formData.vcardEmail}
                  onChange={(e) => handleFormDataChange('vcardEmail', e.target.value)}
                  placeholder="john@example.com"
                  className="input-field w-full"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-amoled-text mb-2">Website</label>
              <input
                type="url"
                value={formData.vcardWebsite}
                onChange={(e) => handleFormDataChange('vcardWebsite', e.target.value)}
                placeholder="https://example.com"
                className="input-field w-full"
              />
            </div>
          </div>
        );

      case 'location':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-amoled-text mb-2">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => handleFormDataChange('latitude', e.target.value)}
                  placeholder="40.7128"
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amoled-text mb-2">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => handleFormDataChange('longitude', e.target.value)}
                  placeholder="-74.0060"
                  className="input-field w-full"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-amoled-text mb-2">Location Name</label>
              <input
                type="text"
                value={formData.locationName}
                onChange={(e) => handleFormDataChange('locationName', e.target.value)}
                placeholder="New York City"
                className="input-field w-full"
              />
            </div>
          </div>
        );

      case 'calendar':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-amoled-text mb-2">Event Title</label>
              <input
                type="text"
                value={formData.eventTitle}
                onChange={(e) => handleFormDataChange('eventTitle', e.target.value)}
                placeholder="Meeting"
                className="input-field w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-amoled-text mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.eventStartDate}
                  onChange={(e) => handleFormDataChange('eventStartDate', e.target.value)}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amoled-text mb-2">Start Time</label>
                <input
                  type="time"
                  value={formData.eventStartTime}
                  onChange={(e) => handleFormDataChange('eventStartTime', e.target.value)}
                  className="input-field w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-amoled-text mb-2">End Date</label>
                <input
                  type="date"
                  value={formData.eventEndDate}
                  onChange={(e) => handleFormDataChange('eventEndDate', e.target.value)}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amoled-text mb-2">End Time</label>
                <input
                  type="time"
                  value={formData.eventEndTime}
                  onChange={(e) => handleFormDataChange('eventEndTime', e.target.value)}
                  className="input-field w-full"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-amoled-text mb-2">Location</label>
              <input
                type="text"
                value={formData.eventLocation}
                onChange={(e) => handleFormDataChange('eventLocation', e.target.value)}
                placeholder="Office"
                className="input-field w-full"
              />
            </div>
          </div>
        );

      case 'url':
        return (
          <div>
            <label className="block text-sm font-medium text-amoled-text mb-2">Website URL</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => handleFormDataChange('url', e.target.value)}
              placeholder="https://example.com"
              className="input-field w-full"
            />
          </div>
        );

      case 'text':
        return (
          <div>
            <label className="block text-sm font-medium text-amoled-text mb-2">Text Content</label>
            <textarea
              value={formData.text}
              onChange={(e) => handleFormDataChange('text', e.target.value)}
              placeholder="Your text here..."
              className="input-field w-full h-32 resize-none"
            />
          </div>
        );

      case 'instagram':
      case 'facebook':
      case 'twitter':
      case 'linkedin':
      case 'youtube':
      case 'tiktok':
      case 'snapchat':
      case 'telegram':
      case 'spotify':
      case 'apple_music':
      case 'soundcloud':
      case 'app_store':
      case 'google_play':
      case 'zoom':
      case 'teams':
      case 'google_meet':
      case 'paypal':
      case 'venmo':
      case 'bitcoin':
      case 'ethereum':
      case 'pdf':
      case 'google_drive':
      case 'dropbox':
      case 'google_review':
      case 'tripadvisor':
      case 'uber':
      case 'airbnb':
      case 'booking':
        return (
          <div>
            <label className="block text-sm font-medium text-amoled-text mb-2">
              {qrTypes.find(t => t.value === qrType)?.label} URL
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => handleFormDataChange('url', e.target.value)}
              placeholder={qrTypes.find(t => t.value === qrType)?.placeholder || 'https://example.com'}
              className="input-field w-full"
            />
            <p className="text-xs text-amoled-muted mt-2">
              {qrType === 'instagram' ? 'Enter your Instagram profile URL' :
               qrType === 'facebook' ? 'Enter your Facebook page URL' :
               qrType === 'twitter' ? 'Enter your Twitter/X profile URL' :
               qrType === 'linkedin' ? 'Enter your LinkedIn profile URL' :
               qrType === 'youtube' ? 'Enter YouTube video or channel URL' :
               qrType === 'tiktok' ? 'Enter your TikTok profile URL' :
               qrType === 'snapchat' ? 'Enter your Snapchat profile URL' :
               qrType === 'telegram' ? 'Enter your Telegram username or group link' :
               qrType === 'spotify' ? 'Enter Spotify track, album, or playlist URL' :
               qrType === 'apple_music' ? 'Enter Apple Music URL' :
               qrType === 'soundcloud' ? 'Enter SoundCloud track URL' :
               qrType === 'app_store' ? 'Enter App Store URL (iOS)' :
               qrType === 'google_play' ? 'Enter Google Play Store URL' :
               qrType === 'zoom' ? 'Enter Zoom meeting URL' :
               qrType === 'teams' ? 'Enter Microsoft Teams meeting URL' :
               qrType === 'google_meet' ? 'Enter Google Meet URL' :
               qrType === 'paypal' ? 'Enter PayPal.me URL' :
               qrType === 'venmo' ? 'Enter Venmo profile URL' :
               qrType === 'bitcoin' ? 'Enter Bitcoin wallet address with amount' :
               qrType === 'ethereum' ? 'Enter Ethereum wallet address' :
               qrType === 'pdf' ? 'Enter PDF document URL' :
               qrType === 'google_drive' ? 'Enter Google Drive file URL' :
               qrType === 'dropbox' ? 'Enter Dropbox file URL' :
               qrType === 'google_review' ? 'Enter Google Business review URL' :
               qrType === 'tripadvisor' ? 'Enter TripAdvisor business URL' :
               qrType === 'uber' ? 'Enter Uber ride request URL' :
               qrType === 'airbnb' ? 'Enter Airbnb listing URL' :
               qrType === 'booking' ? 'Enter Booking.com property URL' :
               'Enter the URL for this service'}
            </p>
          </div>
        );

      case 'skype':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-amoled-text mb-2">Skype Username</label>
              <input
                type="text"
                value={formData.skypeUsername || ''}
                onChange={(e) => handleFormDataChange('skypeUsername', e.target.value)}
                placeholder="your.username"
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-amoled-text mb-2">Action</label>
              <select
                value={formData.skypeAction || 'call'}
                onChange={(e) => handleFormDataChange('skypeAction', e.target.value)}
                className="input-field w-full"
              >
                <option value="call">Voice Call</option>
                <option value="chat">Chat</option>
                <option value="userinfo">View Profile</option>
              </select>
            </div>
          </div>
        );

      case 'mecard':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-amoled-text mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.mecardFirstName || ''}
                  onChange={(e) => handleFormDataChange('mecardFirstName', e.target.value)}
                  placeholder="John"
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amoled-text mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.mecardLastName || ''}
                  onChange={(e) => handleFormDataChange('mecardLastName', e.target.value)}
                  placeholder="Doe"
                  className="input-field w-full"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-amoled-text mb-2">Organization</label>
              <input
                type="text"
                value={formData.mecardOrg || ''}
                onChange={(e) => handleFormDataChange('mecardOrg', e.target.value)}
                placeholder="Company Inc"
                className="input-field w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-amoled-text mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.mecardPhone || ''}
                  onChange={(e) => handleFormDataChange('mecardPhone', e.target.value)}
                  placeholder="+1234567890"
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amoled-text mb-2">Email</label>
                <input
                  type="email"
                  value={formData.mecardEmail || ''}
                  onChange={(e) => handleFormDataChange('mecardEmail', e.target.value)}
                  placeholder="john@example.com"
                  className="input-field w-full"
                />
              </div>
            </div>
          </div>
        );

      default:
        // For other types (social media, etc.), show URL input
        return (
          <div>
            <label className="block text-sm font-medium text-amoled-text mb-2">URL</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => handleFormDataChange('url', e.target.value)}
              placeholder={qrTypes.find(t => t.value === qrType)?.placeholder || 'https://example.com'}
              className="input-field w-full"
            />
          </div>
        );
    }
  };

  const handleTypeChange = (type) => {
    setQrType(type);
    const generatedData = generateQRData(type, formData);
    setQrData(generatedData);
    setQrOptions(prev => ({ ...prev, data: generatedData }));
  };

  const generateQRData = (type, data) => {
    try {
      switch (type) {
        case 'upi':
          return `upi://pay?pa=${data.upiId || 'example@upi'}&pn=${encodeURIComponent(data.payeeName || 'John Doe')}&am=${data.amount || '100'}&cu=${data.currency || 'INR'}&tn=${encodeURIComponent(data.transactionNote || 'Payment')}`;
        
        case 'email':
          return `mailto:${data.emailTo || 'example@email.com'}?subject=${encodeURIComponent(data.emailSubject || 'Hello')}&body=${encodeURIComponent(data.emailBody || 'Message')}`;
        
        case 'phone':
          return `tel:${data.phoneNumber || '+1234567890'}`;
        
        case 'sms':
          return `sms:${data.smsNumber || '+1234567890'}?body=${encodeURIComponent(data.smsMessage || 'Hello')}`;
        
        case 'whatsapp':
          return `https://wa.me/${data.whatsappNumber || '1234567890'}?text=${encodeURIComponent(data.whatsappMessage || 'Hello')}`;
        
        case 'wifi':
          return `WIFI:T:${data.wifiSecurity || 'WPA'};S:${data.wifiSSID || 'MyNetwork'};P:${data.wifiPassword || 'MyPassword'};H:${data.wifiHidden ? 'true' : 'false'};;`;
        
        case 'vcard':
          return `BEGIN:VCARD\nVERSION:3.0\nFN:${data.vcardName || 'John Doe'}\nORG:${data.vcardOrg || 'Company Inc'}\nTEL:${data.vcardPhone || '+1234567890'}\nEMAIL:${data.vcardEmail || 'john@example.com'}\nURL:${data.vcardWebsite || 'https://example.com'}\nEND:VCARD`;
        
        case 'mecard':
          const lastName = data.mecardLastName || (data.vcardName?.split(' ')[1]) || 'Doe';
          const firstName = data.mecardFirstName || (data.vcardName?.split(' ')[0]) || 'John';
          return `MECARD:N:${lastName},${firstName};ORG:${data.mecardOrg || data.vcardOrg || ''};TEL:${data.mecardPhone || data.vcardPhone || ''};EMAIL:${data.mecardEmail || data.vcardEmail || ''};;`;
        
        case 'location':
          return `geo:${data.latitude || '40.7128'},${data.longitude || '-74.0060'}?q=${encodeURIComponent(data.locationName || 'New York City')}`;
        
        case 'calendar':
          const startDate = (data.eventStartDate || '2024-01-01').replace(/-/g, '');
          const startTime = (data.eventStartTime || '12:00').replace(':', '');
          const endDate = (data.eventEndDate || '2024-01-01').replace(/-/g, '');
          const endTime = (data.eventEndTime || '13:00').replace(':', '');
          return `BEGIN:VEVENT\nSUMMARY:${data.eventTitle || 'Meeting'}\nDTSTART:${startDate}T${startTime}00Z\nDTEND:${endDate}T${endTime}00Z\nLOCATION:${data.eventLocation || 'Office'}\nEND:VEVENT`;
        
        case 'skype':
          return `skype:${data.skypeUsername || 'username'}?${data.skypeAction || 'call'}`;
        
        case 'text':
          return data.text || 'Your text here';
        
        case 'url':
        case 'instagram':
        case 'facebook':
        case 'twitter':
        case 'linkedin':
        case 'youtube':
        case 'tiktok':
        case 'snapchat':
        case 'telegram':
        case 'spotify':
        case 'apple_music':
        case 'soundcloud':
        case 'app_store':
        case 'google_play':
        case 'zoom':
        case 'teams':
        case 'google_meet':
        case 'paypal':
        case 'venmo':
        case 'bitcoin':
        case 'ethereum':
        case 'pdf':
        case 'google_drive':
        case 'dropbox':
        case 'google_review':
        case 'tripadvisor':
        case 'uber':
        case 'airbnb':
        case 'booking':
          return data.url || 'https://example.com';
        
        default:
          return data.url || data.text || 'https://example.com';
      }
    } catch (error) {
      console.error('Error generating QR data:', error);
      return 'https://example.com';
    }
  };

  const handleFormDataChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Regenerate QR data with new form data
    const generatedData = generateQRData(qrType, newFormData);
    setQrData(generatedData);
    setQrOptions(prev => ({ ...prev, data: generatedData }));
  };

  const handleDataChange = (newData) => {
    setQrData(newData);
    setQrOptions(prev => ({ ...prev, data: newData }));
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
    let fileName = `${qrTitle.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}_qr_code`;
    
    try {
      // Primary: Download the entire card with styling (default behavior)
      if (cardRef.current) {
        let dataUrl;
        
        // Wait to ensure QR code is fully rendered
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (format === 'svg') {
          dataUrl = await htmlToImage.toSvg(cardRef.current, {
            quality: 1,
            pixelRatio: 2,
            backgroundColor: 'transparent',
            style: {
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontWeight: '600',
              transform: 'scale(1)',
              transformOrigin: 'top left'
            },
            filter: (node) => {
              // Include all nodes including dynamically added QR code
              return true;
            }
          });
          fileName += '.svg';
        } else {
          dataUrl = await htmlToImage.toPng(cardRef.current, {
            quality: 1,
            pixelRatio: 2,
            backgroundColor: 'transparent',
            filter: (node) => {
              // Include all nodes including dynamically added QR code
              return true;
            },
            style: {
              transform: 'scale(1)',
              transformOrigin: 'top left'
            }
          });
          fileName += '.png';
        }
        
        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataUrl;
        link.click();
        return;
      }
      
      // Fallback 1: Use QR code library's built-in download (QR only)
      if (format === 'svg' || format === 'png') {
        if (qrCode.current) {
          await qrCode.current.download({
            name: fileName,
            extension: format
          });
          return;
        }
      }
      
    } catch (error) {
      console.error('Download failed:', error);
      
      // Final fallback: try to download just the QR code element
      try {
        if (qrRef.current) {
          const dataUrl = await htmlToImage.toPng(qrRef.current, {
            quality: 1,
            pixelRatio: 2,
            backgroundColor: 'white'
          });
          
          const link = document.createElement('a');
          link.download = `${fileName}.png`;
          link.href = dataUrl;
          link.click();
        }
      } catch (fallbackError) {
        console.error('Fallback download also failed:', fallbackError);
        alert('Download failed. Please try again or use a different format.');
      }
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
      
      // Update title if provided
      if (title) {
        setQrTitle(title);
      }
      
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 max-h-80 overflow-y-auto custom-scrollbar">
              {qrTypes.map((type) => {
                // Group types by category for better organization
                const getTypeIcon = (typeValue) => {
                  if (['upi', 'paypal', 'venmo', 'bitcoin', 'ethereum'].includes(typeValue)) return '💳';
                  if (['email', 'phone', 'sms', 'whatsapp', 'telegram', 'skype'].includes(typeValue)) return '📞';
                  if (['instagram', 'facebook', 'twitter', 'linkedin', 'youtube', 'tiktok', 'snapchat'].includes(typeValue)) return '📱';
                  if (['vcard', 'mecard', 'location'].includes(typeValue)) return '👤';
                  if (['wifi', 'calendar'].includes(typeValue)) return '⚙️';
                  if (['spotify', 'apple_music', 'soundcloud'].includes(typeValue)) return '🎵';
                  if (['app_store', 'google_play'].includes(typeValue)) return '📲';
                  if (['zoom', 'teams', 'google_meet'].includes(typeValue)) return '💼';
                  if (['pdf', 'google_drive', 'dropbox'].includes(typeValue)) return '📄';
                  if (['google_review', 'tripadvisor'].includes(typeValue)) return '⭐';
                  if (['uber', 'airbnb', 'booking'].includes(typeValue)) return '🚗';
                  if (typeValue === 'url') return '🌐';
                  if (typeValue === 'text') return '📝';
                  return '🔗';
                };

                return (
                  <button
                    key={type.value}
                    onClick={() => handleTypeChange(type.value)}
                    className={`p-3 rounded-lg border transition-all text-left group hover:shadow-lg ${
                      qrType === type.value
                        ? 'border-amoled-accent bg-amoled-accent/10 text-amoled-accent shadow-lg shadow-amoled-accent/20'
                        : 'border-amoled-border text-amoled-muted hover:border-amoled-accent/50 hover:bg-amoled-accent/5'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-lg flex-shrink-0">{getTypeIcon(type.value)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{type.label}</div>
                        <div className="text-xs opacity-70 mt-1 truncate">
                          {/* Payment */}
                          {type.value === 'upi' ? 'UPI payment (India)' :
                           
                           /* Basic */
                           type.value === 'url' ? 'Link to website' :
                           type.value === 'text' ? 'Plain text content' :
                           
                           /* Communication */
                           type.value === 'email' ? 'Send email' :
                           type.value === 'phone' ? 'Make phone call' :
                           type.value === 'sms' ? 'Send text message' :
                           type.value === 'whatsapp' ? 'WhatsApp message' :
                           type.value === 'telegram' ? 'Telegram contact' :
                           type.value === 'skype' ? 'Skype call' :
                           
                           /* Contact & Location */
                           type.value === 'vcard' ? 'Digital business card' :
                           type.value === 'mecard' ? 'Mobile contact card' :
                           type.value === 'location' ? 'GPS coordinates' :
                           
                           /* Network & Tech */
                           type.value === 'wifi' ? 'WiFi connection' :
                           type.value === 'calendar' ? 'Calendar event' :
                           
                           /* Social Media */
                           type.value === 'instagram' ? 'Instagram profile' :
                           type.value === 'facebook' ? 'Facebook page' :
                           type.value === 'twitter' ? 'Twitter/X profile' :
                           type.value === 'linkedin' ? 'LinkedIn profile' :
                           type.value === 'youtube' ? 'YouTube video/channel' :
                           type.value === 'tiktok' ? 'TikTok profile' :
                           type.value === 'snapchat' ? 'Snapchat profile' :
                           
                           /* Entertainment */
                           type.value === 'spotify' ? 'Spotify music' :
                           type.value === 'apple_music' ? 'Apple Music' :
                           type.value === 'soundcloud' ? 'SoundCloud track' :
                           
                           /* Apps */
                           type.value === 'app_store' ? 'iOS app download' :
                           type.value === 'google_play' ? 'Android app download' :
                           
                           /* Business */
                           type.value === 'zoom' ? 'Video meeting' :
                           type.value === 'teams' ? 'Teams meeting' :
                           type.value === 'google_meet' ? 'Google Meet' :
                           
                           /* Payments */
                           type.value === 'paypal' ? 'PayPal payment' :
                           type.value === 'venmo' ? 'Venmo payment' :
                           type.value === 'bitcoin' ? 'Bitcoin wallet' :
                           type.value === 'ethereum' ? 'Ethereum wallet' :
                           
                           /* Files */
                           type.value === 'pdf' ? 'PDF document' :
                           type.value === 'google_drive' ? 'Google Drive file' :
                           type.value === 'dropbox' ? 'Dropbox file' :
                           
                           /* Reviews */
                           type.value === 'google_review' ? 'Google review' :
                           type.value === 'tripadvisor' ? 'TripAdvisor review' :
                           
                           /* Services */
                           type.value === 'uber' ? 'Uber ride request' :
                           type.value === 'airbnb' ? 'Airbnb listing' :
                           type.value === 'booking' ? 'Hotel booking' :
                           
                           type.label}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
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
            
            {/* QR Type Info */}
            <div className="mb-4 p-3 bg-amoled-accent/10 rounded-lg border border-amoled-accent/20">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 bg-amoled-accent rounded-full"></div>
                <span className="text-sm font-medium text-amoled-text">
                  {qrTypes.find(t => t.value === qrType)?.label}
                </span>
              </div>
              <p className="text-xs text-amoled-muted">
                {qrType === 'upi' ? 'Create QR codes for UPI payments. Recipients can scan to pay instantly.' :
                 qrType === 'email' ? 'Generate QR codes that pre-fill email forms with recipient, subject, and message.' :
                 qrType === 'phone' ? 'Create QR codes that initiate phone calls when scanned.' :
                 qrType === 'sms' ? 'Generate QR codes that pre-fill SMS messages.' :
                 qrType === 'whatsapp' ? 'Create QR codes that open WhatsApp with a pre-filled message.' :
                 qrType === 'wifi' ? 'Generate QR codes for WiFi network connection. Users can connect instantly.' :
                 qrType === 'vcard' ? 'Create digital business cards that can be saved to contacts.' :
                 qrType === 'mecard' ? 'Generate mobile-friendly contact cards for easy contact sharing.' :
                 qrType === 'location' ? 'Create QR codes that open GPS coordinates in maps applications.' :
                 qrType === 'calendar' ? 'Generate QR codes that add events to calendar applications.' :
                 qrType === 'url' ? 'Create QR codes that open websites or web pages.' :
                 qrType === 'text' ? 'Generate QR codes containing plain text content.' :
                 'Create QR codes that open the specified URL or content.'}
              </p>
            </div>
            
            {/* Dynamic Form Fields */}
            {renderFormFields()}
            
            {/* Generated QR Data Preview */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-amoled-text mb-2">Generated QR Data</label>
              <textarea
                value={qrData}
                readOnly
                className="input-field w-full h-20 resize-none text-xs text-amoled-muted bg-amoled-bg/20"
                placeholder="QR data will appear here..."
              />
            </div>
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
          <div className="glass-card p-8 mb-6" style={{ backgroundColor: previewBgColor }}>
            {/* Header with Title and Download Options */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-amoled-text mb-2">Preview</h3>
                <input
                  type="text"
                  value={qrTitle}
                  onChange={(e) => setQrTitle(e.target.value)}
                  placeholder="Enter QR code name..."
                  className="text-sm bg-transparent border-none outline-none text-amoled-muted focus:text-amoled-text transition-colors w-full max-w-xs"
                />
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleDownload('png')}
                    className="flex items-center space-x-2 btn-primary"
                    title="Quick Download PNG"
                  >
                    <Download className="w-4 h-4" />
                    <span>PNG</span>
                  </button>
                  <button
                    onClick={() => setShowDownloadModal(true)}
                    className="px-3 py-3 text-sm border border-amoled-border rounded-lg hover:border-amoled-accent/50 text-amoled-muted hover:text-amoled-text transition-all"
                    title="More Download Options"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-3 py-2 text-sm border border-amoled-border rounded-lg hover:border-amoled-accent/50 text-amoled-muted hover:text-amoled-text transition-all"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* QR Code Display */}
            <div className="flex justify-center">
              <div 
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleDownload('png');
                }}
                title="Right-click to download quickly"
              >
                <QrCard
                  qrRef={qrRef}
                  labelText={labelText}
                  labelIcon={customIcon || ICONS.find(i => i.key === labelIcon)?.icon}
                  borderStyle={borderStyle}
                  borderSize={borderSize}
                  borderColor={borderColor}
                  backgroundColor={qrOptions.backgroundOptions.color}
                  labelBgColor={labelBgColor}
                  labelTextColor={labelTextColor}
                  shadow={shadow}
                  cardRef={cardRef}
                />
              </div>
            </div>
            
            {/* QR Code Info */}
            <div className="mt-6 p-4 bg-amoled-bg/30 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <div className="text-amoled-muted">
                  <span className="font-medium">Type:</span> {qrTypes.find(t => t.value === qrType)?.label}
                </div>
                <div className="text-amoled-muted">
                  <span className="font-medium">Size:</span> {qrOptions.width}×{qrOptions.height}px
                </div>
              </div>
            </div>
            </div>

          {/* Customization */}
          <div className="glass-card p-8">
            <h3 className="text-lg font-semibold text-amoled-text mb-6">Customization</h3>
            <div className="space-y-4">
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
              <div>
                <label className="block text-sm font-medium text-amoled-text mb-2">Border Size</label>
                <input
                  type="range"
                  min="1"
                  max="16"
                  value={borderSize}
                  onChange={e => setBorderSize(Number(e.target.value))}
                  className="w-full accent-amoled-accent"
                />
                <span className="text-xs text-amoled-muted">{borderSize}px</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-amoled-text mb-2">Border Color</label>
                <input
                  type="color"
                  value={borderColor}
                  onChange={e => setBorderColor(e.target.value)}
                  className="w-12 h-8 rounded border border-amoled-border bg-amoled-card cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amoled-text mb-2">Label Background Color</label>
                <input
                  type="color"
                  value={labelBgColor}
                  onChange={e => setLabelBgColor(e.target.value)}
                  className="w-12 h-8 rounded border border-amoled-border bg-amoled-card cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amoled-text mb-2">Label Text Color</label>
                <input
                  type="color"
                  value={labelTextColor}
                  onChange={e => setLabelTextColor(e.target.value)}
                  className="w-12 h-8 rounded border border-amoled-border bg-amoled-card cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={shadow}
                  onChange={e => setShadow(e.target.checked)}
                  id="shadow-toggle"
                  className="accent-amoled-accent"
                />
                <label htmlFor="shadow-toggle" className="text-sm text-amoled-text">Enable Shadow</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-amoled-text mb-2">Preview Background</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={previewBgColor}
                    onChange={e => setPreviewBgColor(e.target.value)}
                    className="w-12 h-8 rounded border border-amoled-border bg-amoled-card cursor-pointer"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setPreviewBgColor('#ffffff')}
                      className="px-3 py-1 text-xs rounded bg-white text-black border hover:bg-gray-100 transition-colors"
                    >
                      Light
                    </button>
                    <button
                      onClick={() => setPreviewBgColor('#1a1a1a')}
                      className="px-3 py-1 text-xs rounded bg-gray-800 text-white border border-gray-600 hover:bg-gray-700 transition-colors"
                    >
                      Dark
                    </button>
                  </div>
                </div>
              </div>
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
                { fg: '#000000', bg: '#ffffff', name: 'Classic' },
                { fg: '#ffffff', bg: '#000000', name: 'Inverted' },
                { fg: '#2563eb', bg: '#ffffff', name: 'Blue' },
                { fg: '#dc2626', bg: '#ffffff', name: 'Red' },
                { fg: '#059669', bg: '#ffffff', name: 'Green' },
                { fg: '#7c3aed', bg: '#ffffff', name: 'Purple' },
                { fg: '#ea580c', bg: '#ffffff', name: 'Orange' },
                { fg: '#db2777', bg: '#ffffff', name: 'Pink' }
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

      {/* Download Options Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Download className="w-6 h-6 text-amoled-accent" />
                <h3 className="text-xl font-semibold text-amoled-text">Download QR Code</h3>
              </div>
              <button
                onClick={() => setShowDownloadModal(false)}
                className="text-amoled-muted hover:text-amoled-text transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Options */}
              <div className="space-y-6">
                {/* File Name */}
                <div>
                  <label className="block text-sm font-medium text-amoled-text mb-2">
                    File Name
                  </label>
                  <input
                    type="text"
                    value={qrTitle}
                    onChange={(e) => setQrTitle(e.target.value)}
                    placeholder="Enter file name..."
                    className="input-field w-full"
                  />
                </div>

                {/* Format Options */}
                <div>
                  <label className="block text-sm font-medium text-amoled-text mb-3">
                    Choose Format
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        handleDownload('png');
                        setShowDownloadModal(false);
                      }}
                      className="flex flex-col items-center space-y-2 p-4 border border-amoled-border rounded-lg hover:border-amoled-accent/50 hover:bg-amoled-accent/5 transition-all group"
                    >
                      <div className="w-12 h-12 bg-amoled-accent/10 rounded-lg flex items-center justify-center group-hover:bg-amoled-accent/20 transition-colors">
                        <Download className="w-6 h-6 text-amoled-accent" />
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-amoled-text">PNG</div>
                        <div className="text-xs text-amoled-muted">High quality raster image</div>
                        <div className="text-xs text-amoled-muted">Best for sharing & printing</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        handleDownload('svg');
                        setShowDownloadModal(false);
                      }}
                      className="flex flex-col items-center space-y-2 p-4 border border-amoled-border rounded-lg hover:border-amoled-accent/50 hover:bg-amoled-accent/5 transition-all group"
                    >
                      <div className="w-12 h-12 bg-amoled-accent/10 rounded-lg flex items-center justify-center group-hover:bg-amoled-accent/20 transition-colors">
                        <svg className="w-6 h-6 text-amoled-accent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14,2 14,8 20,8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10,9 9,9 8,9" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-amoled-text">SVG</div>
                        <div className="text-xs text-amoled-muted">Scalable vector format</div>
                        <div className="text-xs text-amoled-muted">Perfect for web & design</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Download Info */}
                <div className="bg-amoled-bg/20 rounded-lg p-4">
                  <h4 className="font-medium text-amoled-text mb-3">Download Settings</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-amoled-muted">Type:</span>
                      <span className="ml-2 text-amoled-text font-medium">
                        {qrTypes.find(t => t.value === qrType)?.label}
                      </span>
                    </div>
                    <div>
                      <span className="text-amoled-muted">Size:</span>
                      <span className="ml-2 text-amoled-text font-medium">
                        {qrOptions.width}×{qrOptions.height}px
                      </span>
                    </div>
                    <div>
                      <span className="text-amoled-muted">Quality:</span>
                      <span className="ml-2 text-amoled-text font-medium">High (2x)</span>
                    </div>
                    <div>
                      <span className="text-amoled-muted">Background:</span>
                      <span className="ml-2 text-amoled-text font-medium">Transparent</span>
                    </div>
                  </div>
                </div>

                {/* Alternative Download Methods */}
                <div>
                  <label className="block text-sm font-medium text-amoled-text mb-3">
                    Alternative Download Methods
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={async () => {
                        try {
                          if (qrRef.current) {
                            // Wait to ensure QR code is fully rendered
                            await new Promise(resolve => setTimeout(resolve, 300));
                            
                            const dataUrl = await htmlToImage.toPng(qrRef.current, {
                              quality: 1,
                              pixelRatio: 2,
                              backgroundColor: 'white',
                              filter: (node) => {
                                // Ensure we capture the QR code SVG/canvas elements
                                return true;
                              },
                              style: {
                                transform: 'scale(1)',
                                transformOrigin: 'top left'
                              }
                            });
                            
                            const link = document.createElement('a');
                            link.download = `${qrTitle.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}_qr_only.png`;
                            link.href = dataUrl;
                            link.click();
                            setShowDownloadModal(false);
                          }
                        } catch (error) {
                          console.error('QR-only download failed:', error);
                          alert('QR-only download failed. Please try the main download options.');
                        }
                      }}
                      className="w-full p-3 text-sm border border-amoled-border rounded-lg hover:border-amoled-accent/50 text-amoled-text transition-all"
                    >
                      Download QR Code Only (PNG)
                    </button>
                    
                    <button
                      onClick={async () => {
                        try {
                          if (cardRef.current) {
                            // Wait a bit to ensure QR code is fully rendered
                            await new Promise(resolve => setTimeout(resolve, 500));
                            
                            const dataUrl = await htmlToImage.toPng(cardRef.current, {
                              quality: 1,
                              pixelRatio: 2,
                              backgroundColor: 'transparent',
                              filter: (node) => {
                                // Ensure we capture all child elements including dynamically added QR code
                                return true;
                              },
                              style: {
                                transform: 'scale(1)',
                                transformOrigin: 'top left'
                              }
                            });
                            
                            const link = document.createElement('a');
                            link.download = `${qrTitle.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}_with_card.png`;
                            link.href = dataUrl;
                            link.click();
                            setShowDownloadModal(false);
                          }
                        } catch (error) {
                          console.error('Card download failed:', error);
                          alert('Card download failed. Please try the main download options.');
                        }
                      }}
                      className="w-full p-3 text-sm border border-amoled-border rounded-lg hover:border-amoled-accent/50 text-amoled-text transition-all"
                    >
                      Download with Styling (PNG)
                    </button>

                    <button
                      onClick={async () => {
                        try {
                          // Use the QR library's built-in canvas method
                          if (qrCode.current) {
                            const canvas = await qrCode.current.getRawData('png');
                            if (canvas) {
                              const link = document.createElement('a');
                              link.download = `${qrTitle.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}_raw_qr.png`;
                              link.href = URL.createObjectURL(canvas);
                              link.click();
                              URL.revokeObjectURL(link.href);
                              setShowDownloadModal(false);
                            } else {
                              throw new Error('Could not get canvas data');
                            }
                          } else {
                            throw new Error('QR Code not available');
                          }
                        } catch (error) {
                          console.error('Raw QR download failed:', error);
                          alert('Raw QR download failed. Please try other download options.');
                        }
                      }}
                      className="w-full p-3 text-sm border border-amoled-border rounded-lg hover:border-amoled-accent/50 text-amoled-text transition-all"
                    >
                      Download Raw QR (PNG)
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Preview */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-amoled-text mb-3">
                    Preview
                  </label>
                  <div className="flex justify-center p-6 bg-amoled-bg/30 rounded-lg min-h-[300px] items-center">
                    <QrCard
                      qrRef={modalQrRef}
                      labelText={labelText}
                      labelIcon={customIcon || ICONS.find(i => i.key === labelIcon)?.icon}
                      borderStyle={borderStyle}
                      borderSize={borderSize}
                      borderColor={borderColor}
                      backgroundColor={qrOptions.backgroundOptions.color}
                      labelBgColor={labelBgColor}
                      labelTextColor={labelTextColor}
                      shadow={shadow}
                      cardRef={null} // Don't pass cardRef to modal preview to avoid conflicts
                    />
                  </div>
                </div>

                {/* Content Info */}
                <div className="bg-amoled-bg/20 rounded-lg p-4">
                  <h4 className="font-medium text-amoled-text mb-2">QR Content</h4>
                  <div className="text-sm text-amoled-muted break-all bg-amoled-bg/10 rounded p-2 max-h-20 overflow-y-auto">
                    {qrData}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Generator;