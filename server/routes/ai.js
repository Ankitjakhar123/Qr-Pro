import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Detect QR type from input
router.post('/detect-type', authenticateToken, async (req, res) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ message: 'Input text is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
    Analyze the following text and determine the best QR code type for it. 
    Respond with only one of these types: url, text, email, phone, sms, wifi, vcard, location, event
    
    Text to analyze: "${input}"
    
    Guidelines:
    - If it contains http/https or looks like a website, choose "url"
    - If it contains @ symbol and looks like email, choose "email"
    - If it starts with + or contains phone number pattern, choose "phone"
    - If it contains coordinates or address, choose "location"
    - If it contains contact information, choose "vcard"
    - If it contains network/password keywords, choose "wifi"
    - If it mentions dates/events, choose "event"
    - Otherwise, choose "text"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const detectedType = response.text().trim().toLowerCase();

    // Validate the response
    const validTypes = ['url', 'text', 'email', 'phone', 'sms', 'wifi', 'vcard', 'location', 'event'];
    const qrType = validTypes.includes(detectedType) ? detectedType : 'text';

    res.json({
      detectedType: qrType,
      confidence: 'high' // You could implement confidence scoring
    });
  } catch (error) {
    console.error('AI detection error:', error);
    res.status(500).json({ message: 'Error detecting QR type' });
  }
});

// Generate smart suggestions
router.post('/suggest', authenticateToken, async (req, res) => {
  try {
    const { input, type } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
    Based on this QR code content and type, provide helpful suggestions:
    
    Type: ${type}
    Content: "${input}"
    
    Please provide:
    1. A suitable title for this QR code (max 50 characters)
    2. A brief description (max 100 characters)
    3. Suggested color scheme (2 colors in hex format)
    4. Use case suggestions
    
    Format your response as JSON with keys: title, description, colors, useCases
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    try {
      const suggestions = JSON.parse(response.text());
      res.json(suggestions);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      res.json({
        title: `${type.toUpperCase()} QR Code`,
        description: 'Generated QR code',
        colors: ['#00ff88', '#000000'],
        useCases: ['General purpose QR code']
      });
    }
  } catch (error) {
    console.error('AI suggestion error:', error);
    res.status(500).json({ message: 'Error generating suggestions' });
  }
});

// Magic generate - convert natural language to QR data
router.post('/magic-generate', authenticateToken, async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const systemPrompt = `
    Convert the following natural language request into proper QR code data:
    
    User request: "${prompt}"
    
    Based on the request, generate appropriate QR code data and format it correctly.
    
    Examples:
    - "Create QR for my website" → need URL
    - "QR for my contact info" → vCard format
    - "QR for WiFi password 12345 network MyWiFi" → WiFi format
    - "QR for my phone number" → tel: format
    - "QR for email to john@example.com" → mailto: format
    
    Respond with JSON containing:
    {
      "type": "detected_type",
      "data": "formatted_data",
      "title": "suggested_title",
      "instructions": "what_user_needs_to_do_if_any"
    }
    `;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    
    try {
      const magicResult = JSON.parse(response.text());
      res.json(magicResult);
    } catch (parseError) {
      res.json({
        type: 'text',
        data: prompt,
        title: 'Generated QR',
        instructions: 'Please provide more specific information'
      });
    }
  } catch (error) {
    console.error('Magic generate error:', error);
    res.status(500).json({ message: 'Error with magic generation' });
  }
});

export default router;