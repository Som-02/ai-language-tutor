const express        = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Session        = require('../models/Session');
const Flashcard      = require('../models/Flashcard');
const router         = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const sessions   = await Session.find({ userId: req.userId });
    const flashcards = await Flashcard.find({ userId: req.userId });

    const totalSessions     = sessions.length;
    const totalCorrections  = sessions.reduce((a, s) => a + s.corrections.length, 0);
    const totalNewWords     = sessions.reduce((a, s) => a + s.newWords.length, 0);
    const reviewedCards     = flashcards.filter(f => f.reviewed).length;

    // Sessions per language
    const byLanguage = sessions.reduce((acc, s) => {
      acc[s.language] = (acc[s.language] || 0) + 1;
      return acc;
    }, {});

    // Last 7 sessions for chart
    const recentSessions = sessions.slice(-7).map(s => ({
      date:        s.createdAt,
      language:    s.language,
      corrections: s.corrections.length,
      newWords:    s.newWords.length
    }));

    res.json({ totalSessions, totalCorrections, totalNewWords, reviewedCards, byLanguage, recentSessions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;