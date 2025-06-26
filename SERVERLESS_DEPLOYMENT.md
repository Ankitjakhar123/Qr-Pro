# Serverless Backend Deployment Guide

## Overview
The QR Pro backend has been converted to serverless functions that can be deployed on Netlify.

## Prerequisites
1. Netlify account
2. MongoDB Atlas database (cloud MongoDB instance)
3. Google AI Studio account for Gemini API key

## Environment Variables
Set these environment variables in your Netlify dashboard (Site settings > Environment variables):

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/qr-generator
JWT_SECRET=your-super-secret-jwt-key-here
GEMINI_API_KEY=your-google-gemini-api-key
CLIENT_URL=https://your-app-name.netlify.app
```

## Deployment Steps

### 1. Connect Repository
- Go to Netlify dashboard
- Click "New site from Git"
- Connect your GitHub repository
- Select the QR Pro repository

### 2. Configure Build Settings
- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`

### 3. Install Dependencies
The serverless functions have their own package.json. Netlify will automatically install dependencies.

### 4. Set Environment Variables
In Netlify dashboard:
- Go to Site settings > Environment variables
- Add all the required environment variables listed above

### 5. Deploy
- Click "Deploy site"
- Netlify will build and deploy your application

## API Endpoints
After deployment, your API endpoints will be:

```
POST https://your-app.netlify.app/api/auth/register
POST https://your-app.netlify.app/api/auth/login
GET  https://your-app.netlify.app/api/auth/me
POST https://your-app.netlify.app/api/qr/create
GET  https://your-app.netlify.app/api/qr/my-codes
POST https://your-app.netlify.app/api/ai/detect-type
POST https://your-app.netlify.app/api/ai/magic-generate
DELETE https://your-app.netlify.app/api/qr/:id
GET  https://your-app.netlify.app/api/health
```

## Database Setup (MongoDB Atlas)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Add your IP to the IP whitelist (or use 0.0.0.0/0 for all IPs)
5. Get the connection string and add it to MONGODB_URI

## Getting Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your environment variables as GEMINI_API_KEY

## Local Development with Serverless Functions

To test serverless functions locally:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Run development server with functions
netlify dev
```

## Frontend Configuration

The frontend is already configured to use serverless functions:
- `.env` file contains `VITE_API_URL=/.netlify/functions`
- All API calls will automatically route to serverless functions

## File Structure

```
netlify/
├── functions/
│   ├── models/
│   │   ├── User.js
│   │   └── QRCode.js
│   ├── utils/
│   │   ├── database.js
│   │   └── auth.js
│   ├── auth-register.js
│   ├── auth-login.js
│   ├── auth-me.js
│   ├── qr-create.js
│   ├── qr-list.js
│   ├── qr-delete.js
│   ├── ai-detect-type.js
│   ├── ai-magic-generate.js
│   ├── health.js
│   └── package.json
netlify.toml
```

## Benefits of Serverless Architecture

1. **Automatic Scaling**: Functions scale automatically with demand
2. **Cost Effective**: Pay only for what you use
3. **No Server Management**: No need to manage servers or infrastructure
4. **Global CDN**: Netlify provides global edge locations
5. **Built-in CI/CD**: Automatic deployments from Git

## Monitoring and Logs

- View function logs in Netlify dashboard under Functions tab
- Monitor API usage and performance
- Set up alerts for errors

## Security Notes

1. Environment variables are securely stored by Netlify
2. CORS headers are configured for your domain
3. JWT tokens provide authentication
4. MongoDB connection uses secure connection strings

Your QR Pro application is now ready for serverless deployment on Netlify!
