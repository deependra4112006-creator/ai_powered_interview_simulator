import { getAIEngineStatus } from '../services/aiService.js';
import { getDBStatus } from '../config/db.js';

export const getSystemSettings = async (req, res) => {
  try {
    const aiEngine = getAIEngineStatus();
    const dbStatus = getDBStatus();

    return res.json({
      success: true,
      aiEngine,
      database: dbStatus,
      version: '1.0.0',
      features: {
        voiceInterviews: true,
        codeEditor: true,
        realtimeEvaluation: true,
        starMethodRubric: true,
        offlinePersistentStorage: true
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error retrieving system settings.' });
  }
};

export const testLLMConnection = async (req, res) => {
  try {
    const { apiKey, provider = 'gemini' } = req.body;

    if (!apiKey || apiKey.trim() === '') {
      return res.status(400).json({ success: false, message: 'Please provide an API key to test.' });
    }

    if (provider === 'gemini') {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Respond with the word "CONNECTED" in plain text.' }] }]
        })
      });

      if (!response.ok) {
        return res.status(400).json({
          success: false,
          message: `Google Gemini API returned status ${response.status}. Please verify the key has Gemini API enabled.`
        });
      }

      // Update runtime process.env
      process.env.GEMINI_API_KEY = apiKey.trim();

      return res.json({
        success: true,
        message: 'Successfully verified and connected Google Gemini API!',
        aiEngine: getAIEngineStatus()
      });
    }

    return res.status(400).json({ success: false, message: 'Unsupported provider.' });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Failed to connect: ${err.message}`
    });
  }
};
