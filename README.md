# QR Pro - Professional QR Code Generator

<div align="center">

![QR Pro Logo](public/qr-logo.svg)

**Create professional QR codes with AI assistance, advanced customization, and powerful analytics**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-qrproo.netlify.app-00ff88?style=for-the-badge)](https://qrproo.netlify.app/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Netlify](https://img.shields.io/badge/Netlify-Deployed-00C7B7?style=for-the-badge&logo=netlify)](https://netlify.com/)

</div>

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Live Demo](#live-demo)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Features in Detail](#features-in-detail)
- [Future Additions](#future-additions)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

QR Pro is a modern, feature-rich Progressive Web App (PWA) for generating professional QR codes. Built with React and Vite, it offers an intuitive interface with AI-powered features, extensive customization options, and analytics capabilities. The application is fully serverless, deployed on Netlify with MongoDB Atlas for data storage.

### Key Highlights

- ✨ **30+ QR Code Types** - Support for URLs, payments, contacts, WiFi, social media, and more
- 🤖 **AI-Powered Generation** - Smart type detection and content generation using Google Gemini AI
- 🎨 **Advanced Customization** - Colors, shapes, logos, borders, and pre-made templates
- 📊 **Analytics Dashboard** - Track QR code performance (Pro feature)
- 📱 **Progressive Web App** - Installable on mobile and desktop devices
- 🔒 **Secure Authentication** - JWT-based auth with Clerk integration
- 💾 **QR History** - Save and manage all generated QR codes
- 🌐 **Serverless Architecture** - Scalable Netlify Functions backend

## ✨ Features

### Core Features

- **Multi-Type QR Code Generation**
  - Website URLs
  - Plain text
  - Email with subject and body
  - Phone calls and SMS
  - WhatsApp, Telegram, Skype
  - Contact cards (vCard, MeCard)
  - GPS locations
  - WiFi network credentials
  - Calendar events
  - Social media profiles (Instagram, Facebook, Twitter, LinkedIn, YouTube, TikTok, Snapchat)
  - Music platforms (Spotify, Apple Music, SoundCloud)
  - App store links (iOS, Android)
  - Video conferencing (Zoom, Teams, Google Meet)
  - Payment methods (UPI, PayPal, Venmo, Cash App)
  - And many more...

- **AI-Powered Features**
  - Automatic QR type detection from user input
  - Smart content generation using natural language prompts
  - Context-aware suggestions

- **Advanced Customization**
  - Custom colors for dots, background, and corners
  - Multiple dot shapes (square, rounded, extra-rounded)
  - Corner square and dot customization
  - Logo/image embedding
  - Custom borders with adjustable size and color
  - Label text and icon customization
  - Shadow effects
  - Multiple export formats (PNG, SVG)

- **User Management**
  - User registration and authentication
  - Profile management
  - Role-based access (Free, Pro, Admin)
  - 10-day free trial for Pro features

- **QR Code Management**
  - Save generated QR codes to history
  - Organize and manage QR codes
  - Delete unwanted QR codes
  - Quick access to previously generated codes

- **Analytics (Pro Feature)**
  - Track QR code scans
  - Performance insights
  - Usage statistics
  - Detailed analytics dashboard

- **Progressive Web App**
  - Installable on mobile and desktop
  - Offline support
  - App-like experience
  - Push notifications support

- **Modern UI/UX**
  - Dark theme (AMOLED-friendly)
  - Smooth animations with Framer Motion
  - Responsive design
  - Intuitive navigation
  - Accessible components

## 🛠 Tech Stack

### Frontend

- **React 18.3.1** - UI library
- **Vite 5.4.2** - Build tool and dev server
- **React Router DOM 6.20.1** - Client-side routing
- **Framer Motion 10.16.4** - Animation library
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Lucide React 0.344.0** - Icon library
- **QR Code Styling 1.6.0-rc.1** - QR code generation library
- **HTML to Image 1.11.13** - Image export functionality
- **Axios 1.6.2** - HTTP client

### Backend & Services

- **Netlify Functions** - Serverless backend
- **MongoDB Atlas** - Cloud database
- **Google Gemini AI** - AI-powered features
- **Clerk** - Authentication service (optional)
- **JWT** - Token-based authentication

### Development Tools

- **ESLint 9.9.1** - Code linting
- **PostCSS 8.4.35** - CSS processing
- **Autoprefixer 10.4.18** - CSS vendor prefixing
- **Vite PWA Plugin 0.17.4** - PWA support

## 🌐 Live Demo

**Visit the live application:** [https://qrproo.netlify.app/](https://qrproo.netlify.app/)

The application is fully functional and deployed on Netlify with serverless functions handling the backend operations.

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **Git** - Version control
- **MongoDB Atlas Account** - For database (free tier available)
- **Google AI Studio Account** - For Gemini API key (free tier available)
- **Netlify Account** - For deployment (free tier available)
- **Clerk Account** (Optional) - For authentication

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/ankitjakhar123/qr-pro.git
cd qr-pro
```

2. **Install dependencies**

```bash
npm install
```

3. **Install Netlify Functions dependencies** (if deploying serverless functions)

```bash
cd netlify/functions
npm install
cd ../..
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:8888/.netlify/functions
# For production, use: VITE_API_URL=https://your-app.netlify.app/.netlify/functions

# Clerk Authentication (Optional)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key_here

# Backend Environment Variables (for Netlify Functions)
# Set these in Netlify Dashboard > Site Settings > Environment Variables
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/qr-generator
JWT_SECRET=your-super-secret-jwt-key-here-min-32-characters
GEMINI_API_KEY=your-google-gemini-api-key
CLIENT_URL=http://localhost:5173
# For production: CLIENT_URL=https://your-app.netlify.app
```

#### Getting API Keys

**MongoDB Atlas:**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create database user
4. Whitelist IP (0.0.0.0/0 for all IPs)
5. Get connection string

**Google Gemini API:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create new API key
3. Copy and add to environment variables

**Clerk (Optional):**
1. Sign up at [Clerk](https://clerk.com/)
2. Create new application
3. Copy publishable key

### Running Locally

1. **Start development server**

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

2. **Run with Netlify Functions (for full backend)**

```bash
# Install Netlify CLI globally (if not already installed)
npm install -g netlify-cli

# Run development server with functions
npm run dev:netlify
# or
netlify dev
```

This will start both the frontend and serverless functions locally.

3. **Build for production**

```bash
npm run build
```

4. **Preview production build**

```bash
npm run preview
```

5. **Lint code**

```bash
npm run lint
```

## 📁 Project Structure

```
qr-pro/
├── public/                 # Static assets
│   ├── favicon.svg
│   ├── manifest.json       # PWA manifest
│   ├── apple-touch-icon.png
│   └── ...
├── src/
│   ├── components/         # React components
│   │   ├── Auth/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── Layout/
│   │   │   ├── Layout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── TopBar.jsx
│   │   ├── IconPicker.jsx
│   │   ├── Notification.jsx
│   │   ├── PWAInstallBanner.jsx
│   │   └── QrCard.jsx
│   ├── context/           # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/             # Custom React hooks
│   │   └── usePWA.js
│   ├── pages/             # Page components
│   │   ├── Admin.jsx
│   │   ├── Analytics.jsx
│   │   ├── Generator.jsx
│   │   ├── History.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   ├── Register.jsx
│   │   ├── Templates.jsx
│   │   └── Upgrade.jsx
│   ├── App.jsx            # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── netlify/
│   ├── functions/          # Serverless functions
│   │   ├── models/        # Database models
│   │   ├── utils/         # Utility functions
│   │   ├── auth-register.js
│   │   ├── auth-login.js
│   │   ├── auth-me.js
│   │   ├── qr-create.js
│   │   ├── qr-list.js
│   │   ├── qr-delete.js
│   │   ├── ai-detect-type.js
│   │   ├── ai-magic-generate.js
│   │   └── health.js
│   └── ...
├── dev-dist/               # Development build output
├── index.html              # HTML template
├── netlify.toml            # Netlify configuration
├── vite.config.js          # Vite configuration
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
├── eslint.config.js         # ESLint configuration
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

## 🚢 Deployment

### Netlify Deployment

The application is configured for easy deployment on Netlify:

1. **Connect Repository**
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "New site from Git"
   - Connect your GitHub/GitLab/Bitbucket repository
   - Select the QR Pro repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

3. **Set Environment Variables**
   - Go to Site Settings > Environment Variables
   - Add all required variables:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `GEMINI_API_KEY`
     - `CLIENT_URL` (your Netlify app URL)
     - `VITE_CLERK_PUBLISHABLE_KEY` (if using Clerk)

4. **Deploy**
   - Click "Deploy site"
   - Netlify will automatically build and deploy

5. **Custom Domain (Optional)**
   - Go to Domain settings
   - Add your custom domain
   - Configure DNS as instructed

### Manual Deployment

```bash
# Build the project
npm run build

# The dist/ folder contains the production build
# Deploy the dist/ folder to your hosting provider
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### QR Code Endpoints

#### Create QR Code
```http
POST /api/qr/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "url",
  "data": "https://example.com",
  "options": {
    "width": 300,
    "height": 300,
    "dotsOptions": { "color": "#000000" },
    "backgroundOptions": { "color": "#FFFFFF" }
  },
  "labelText": "My QR Code",
  "labelIcon": "phone"
}
```

#### Get User's QR Codes
```http
GET /api/qr/my-codes
Authorization: Bearer <token>
```

#### Delete QR Code
```http
DELETE /api/qr/:id
Authorization: Bearer <token>
```

### AI Endpoints

#### Detect QR Type
```http
POST /api/ai/detect-type
Content-Type: application/json

{
  "input": "Contact me at john@example.com"
}
```

#### Magic Generate
```http
POST /api/ai/magic-generate
Content-Type: application/json

{
  "prompt": "Create a QR code for my Instagram profile"
}
```

### Health Check
```http
GET /api/health
```

## 🎨 Features in Detail

### QR Code Types Supported

1. **Payment Methods**
   - UPI (India)
   - PayPal
   - Venmo
   - Cash App

2. **Communication**
   - Email (with subject and body)
   - Phone call
   - SMS
   - WhatsApp
   - Telegram
   - Skype

3. **Contact Information**
   - vCard (standard contact card)
   - MeCard (mobile-friendly)

4. **Location & Navigation**
   - GPS coordinates
   - Google Maps links

5. **Network**
   - WiFi credentials (WPA, WEP, Open)

6. **Social Media**
   - Instagram
   - Facebook
   - Twitter/X
   - LinkedIn
   - YouTube
   - TikTok
   - Snapchat

7. **Entertainment**
   - Spotify
   - Apple Music
   - SoundCloud

8. **Apps & Stores**
   - App Store (iOS)
   - Google Play Store

9. **Video Conferencing**
   - Zoom
   - Microsoft Teams
   - Google Meet

10. **Calendar**
    - Calendar events (iCal format)

### Customization Options

- **Colors**: Customize dot color, background color, corner colors
- **Shapes**: Square, rounded, extra-rounded dots
- **Corners**: Customize corner squares and dots
- **Logo**: Embed custom images/logos in QR codes
- **Borders**: Adjustable border size, color, and style (rounded/square)
- **Labels**: Add text labels with custom icons
- **Shadows**: Add shadow effects for depth
- **Export**: PNG (raster) and SVG (vector) formats

### AI Features

- **Type Detection**: Automatically detects the best QR code type from user input
- **Content Generation**: Generates QR code content from natural language prompts
- **Smart Suggestions**: Context-aware recommendations

## 🔮 Future Additions

The following features are planned for future releases:

### High Priority

- [ ] **QR Code Templates Library**
  - Pre-designed templates for different use cases
  - Industry-specific templates (restaurants, events, business cards)
  - Customizable template presets
  - Template marketplace

- [ ] **Enhanced Analytics Dashboard**
  - Real-time scan tracking
  - Geographic scan distribution
  - Time-based analytics (hourly, daily, weekly, monthly)
  - Device and browser analytics
  - Export analytics reports (PDF, CSV)
  - QR code performance comparison

- [ ] **Dynamic QR Codes**
  - Editable QR codes (change content without regenerating)
  - Short URLs with redirect tracking
  - QR code expiration dates
  - Password-protected QR codes

- [ ] **Bulk QR Code Generation**
  - CSV import for bulk generation
  - Batch processing
  - Template-based bulk generation
  - Export bulk QR codes as ZIP

- [ ] **QR Code Branding**
  - Custom branding colors and logos
  - White-label options
  - Branded QR code frames
  - Custom domain for short URLs

### Medium Priority

- [ ] **QR Code Scanning**
  - Built-in QR code scanner
  - Camera integration
  - Scan history
  - Quick actions from scanned codes

- [ ] **Advanced Customization**
  - Gradient backgrounds
  - Pattern overlays
  - Custom shapes and masks
  - Animation effects (for digital displays)

- [ ] **Collaboration Features**
  - Team workspaces
  - Shared QR code libraries
  - Role-based permissions
  - Activity logs

- [ ] **Integration APIs**
  - RESTful API for developers
  - Webhooks for scan events
  - Zapier integration
  - WordPress plugin
  - Shopify app

- [ ] **Mobile Apps**
  - Native iOS app
  - Native Android app
  - Offline QR code generation
  - Mobile-optimized scanning

### Low Priority / Nice to Have

- [ ] **QR Code Campaigns**
  - A/B testing for QR codes
  - Campaign management
  - Performance optimization suggestions

- [ ] **White Label Solution**
  - Customizable branding
  - Multi-tenant support
  - Custom domain support

- [ ] **Advanced Security**
  - Two-factor authentication
  - QR code encryption
  - Access control lists
  - Audit logs

- [ ] **Social Features**
  - Share QR codes on social media
  - Public QR code gallery
  - QR code ratings and reviews

- [ ] **Internationalization**
  - Multi-language support
  - Regional QR code standards
  - Currency localization

- [ ] **Accessibility Improvements**
  - Screen reader optimization
  - High contrast mode
  - Keyboard navigation enhancements

- [ ] **Performance Optimizations**
  - Image optimization
  - Lazy loading
  - CDN integration
  - Caching strategies

- [ ] **Documentation & Tutorials**
  - Video tutorials
  - Interactive guides
  - Best practices documentation
  - Use case examples

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
5. **Push to the branch** (`git push origin feature/amazing-feature`)
6. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

### Code Style

- Use ESLint for linting
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused
- Use meaningful variable and function names

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Ankit Jakhar**
- GitHub: [@ankitjakhar123](https://github.com/ankitjakhar123)
- Email: ankitjakhar836@gmail.com
- Website: [ankitjakhar.me](https://ankitjakhar.me)

## 🙏 Acknowledgments

- [QR Code Styling](https://github.com/kozakdenys/qr-code-styling) - QR code generation library
- [Lucide Icons](https://lucide.dev/) - Beautiful icon library
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Netlify](https://www.netlify.com/) - Hosting and serverless functions
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Cloud database
- [Google Gemini AI](https://ai.google.dev/) - AI capabilities

## 📞 Support

For support, email ankitjakhar836@gmail.com or open an issue in the GitHub repository.

## 🌟 Show Your Support

If you find this project helpful, please give it a ⭐ on GitHub!

---

**Made with ❤️ using React, Vite, and modern web technologies**

