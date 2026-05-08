const express        = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Flashcard      = require('../models/Flashcard');
const router         = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const cards = await Flashcard.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/review', authMiddleware, async (req, res) => {
  try {
    const card = await Flashcard.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { reviewed: true },
      { new: true }
    );
    res.json(card);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Flashcard.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;