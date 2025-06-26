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

    const { prompt } = JSON.parse(event.body);

    if (!prompt) {
      return createResponse(400, { message: 'Prompt is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const aiPrompt = `
    Based on this user request, generate a complete QR code configuration:
    "${prompt}"
    
    Analyze the request and respond with a JSON object containing:
    {
      "type": "url|text|email|phone|sms|wifi|vcard|location|event",
      "data": "the actual data that should go in the QR code",
      "title": "a short descriptive title for this QR code",
      "instructions": "brief user-friendly instructions for what this QR does"
    }
    
    Examples:
    - "Website for my business example.com" → {"type": "url", "data": "https://example.com", "title": "Business Website", "instructions": "Scan to visit our website"}
    - "My email is john@example.com" → {"type": "email", "data": "mailto:john@example.com", "title": "Contact Email", "instructions": "Scan to send an email"}
    - "WiFi network MyWiFi password 12345" → {"type": "wifi", "data": "WIFI:T:WPA;S:MyWiFi;P:12345;H:false;;", "title": "WiFi Access", "instructions": "Scan to connect to WiFi"}
    
    Always ensure the data field contains properly formatted content for the QR type.
    `;

    const result = await model.generateContent(aiPrompt);
    const response = await result.response;
    
    try {
      const qrConfig = JSON.parse(response.text());
      return createResponse(200, qrConfig);
    } catch (parseError) {
      // Fallback if AI doesn't return valid JSON
      return createResponse(200, {
        type: 'text',
        data: prompt,
        title: 'Custom QR Code',
        instructions: 'Scan to view content'
      });
    }
  } catch (error) {
    console.error('AI magic generate error:', error);
    return createResponse(500, { message: 'Error generating QR code' });
  }
};
