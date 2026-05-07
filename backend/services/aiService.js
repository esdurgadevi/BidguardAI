const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdf = require('pdf-parse');
const fs = require('fs');
require('dotenv').config();

/**
 * Extracts text from a PDF file
 */
const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('❌ PDF Extraction Error:', error);
    throw new Error('Failed to extract text from the PDF tender document.');
  }
};

/**
 * Service to handle AI-powered parsing of tender documents.
 */
const parseTenderDocument = async (filePath) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('⚠️ No API Key found in .env. Using mock data.');
    return getMockData();
  }

  try {
    // 1. Initialize the Gemini SDK
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 2. Extract text from the PDF
    const tenderText = await extractTextFromPDF(filePath);

    // 3. Prepare the prompt
    const prompt = `
      You are an expert procurement officer. 
      Analyze the following tender document text and extract the eligibility criteria.
      
      Return ONLY a JSON object with these keys:
      - technical: (array of strings) technical requirements
      - financial: (array of strings) financial requirements
      - compliance: (array of strings) legal/registration requirements
      - summary: (string) 2-sentence overview

      Tender Document Content:
      ${tenderText.substring(0, 30000)}
    `;

    // 4. Try calling Gemini with different model names (Fallback logic)
    const modelNames = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-pro"];
    let lastError = null;

    for (const modelName of modelNames) {
      try {
        console.log(`🤖 Attempting AI analysis with model: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text();

        // 5. Parse JSON from response
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('Invalid AI response format');

        const parsedResult = JSON.parse(jsonMatch[0]);
        console.log(`✅ AI Analysis complete using ${modelName}!`);
        return parsedResult;
      } catch (err) {
        console.warn(`⚠️ Model ${modelName} failed: ${err.message}`);
        lastError = err;
        continue; // Try next model
      }
    }

    throw lastError || new Error('All AI models failed');

  } catch (error) {
    console.error('❌ AI Service Error:', error.message);
    
    // Fallback to mock data so the UI still works
    console.warn('⚠️ Using mock data as fallback.');
    return getMockData();
  }
};

const getMockData = () => ({
  technical: ["Experience in AI/ML (Mock)", "Govt projects history (Mock)"],
  financial: ["Turnover > 50Cr (Mock)", "Positive Net Worth (Mock)"],
  compliance: ["GST Registration (Mock)", "Non-blacklisting (Mock)"],
  summary: "This is a demonstration summary because the Gemini API could not be reached."
});

module.exports = {
  parseTenderDocument
};


