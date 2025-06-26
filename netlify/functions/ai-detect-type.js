import { connectToDatabase, createResponse, handleCors } from './utils/database.js';
import { authenticateToken, extractTokenFromEvent } from './utils/auth.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const handler = async (event, context) => {
  // Handle CORS
  const corsResponse = handleCors(event);
  if (corsResponse) return corsResponse;

  try {
    await connectToDatabase();

    const token = extractTokenFromEvent(event);
    await authenticateToken(token);

    const { input } = JSON.parse(event.body);

    if (!input) {
      return createResponse(400, { message: 'Input text is required' });
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

    return createResponse(200, {
      detectedType: qrType,
      confidence: 'high'
    });
  } catch (error) {
    console.error('AI detect type error:', error);
    return createResponse(500, { message: 'Error detecting QR type' });
  }
};
