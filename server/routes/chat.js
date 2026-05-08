const express      = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const authMiddleware = require('../middleware/authMiddleware');
const Session      = require('../models/Session');
const Flashcard    = require('../models/Flashcard');
const { buildSystemPrompt } = require('../utils/promptBuilder');

const router = express.Router();
const genAI  = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { message, language, level, scenario, history = [], sessionId } = req.body;

    const systemPrompt = buildSystemPrompt(language, level, scenario);

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',          // free tier model
      systemInstruction: systemPrompt,    // same system prompt, no changes needed
    });

    // Convert history to Gemini's format
    // Gemini uses 'user' and 'model' (not 'assistant')
    // Convert history to Gemini's format
// Gemini requires history to start with 'user' role — filter out leading model messages
const allHistory = history.map(msg => ({
  role:  msg.role === 'assistant' ? 'model' : 'user',
  parts: [{ text: msg.content }]
}));

// Drop any leading 'model' messages (Gemini strict requirement)
const firstUserIdx = allHistory.findIndex(m => m.role === 'user');
const geminiHistory = firstUserIdx === -1 ? [] : allHistory.slice(firstUserIdx);

    // Start a chat session with history
    const chat = model.startChat({ history: geminiHistory });

    // Send the new message
    const result   = await chat.sendMessage(message);
    const fullText = result.response.text();

    // Parse corrections JSON block from response (same logic as before)
    let corrections = [], newWords = [], reply = fullText;
    const jsonMatch = fullText.match(/\{[\s\S]*\}(?=[^{}]*$)/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        corrections  = parsed.corrections || [];
        newWords     = parsed.newWords    || [];
        reply        = fullText.slice(0, jsonMatch.index).trim();
      } catch (e) { /* keep full text if parse fails */ }
    }

    // Save to MongoDB session (unchanged)
    let session;
    if (sessionId) {
      session = await Session.findById(sessionId);
      if (session) {
        session.messages.push(
          { role: 'user',      content: message },
          { role: 'assistant', content: reply }
        );
        session.corrections.push(...corrections);
        session.newWords.push(...newWords);
        await session.save();
      }
    } else {
      session = await Session.create({
        userId: req.userId, language, level, scenario,
        messages: [
          { role: 'user',      content: message },
          { role: 'assistant', content: reply }
        ],
        corrections, newWords
      });
    }

    // Auto-save corrections as flashcards (unchanged)
    if (corrections.length > 0) {
      const cards = corrections.map(c => ({
        userId: req.userId, language,
        original: c.original, corrected: c.corrected, explanation: c.explanation
      }));
      await Flashcard.insertMany(cards);
    }

    res.json({ reply, corrections, newWords, sessionId: session._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;