const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('No API key found');
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // The SDK doesn't have a direct "listModels" in the simple GenAI class usually, 
    // but we can try to hit a known model.
    
    console.log('Testing gemini-2.5-flash...');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent('hi');
    console.log('Response from gemini-2.5-flash:', result.response.text());
  } catch (err) {
    console.error('Error testing gemini-2.5-flash:', err.message);
    
    console.log('\nTesting gemini-2.0-flash...');
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent('hi');
      console.log('Response from gemini-2.0-flash:', result.response.text());
    } catch (err2) {
      console.error('Error testing gemini-2.0-flash:', err2.message);
    }
  }
}

listModels();
