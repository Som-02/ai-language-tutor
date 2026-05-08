const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  language:    { type: String, required: true },
  original:    { type: String, required: true },
  corrected:   { type: String, required: true },
  explanation: { type: String },
  reviewed:    { type: Boolean, default: false },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Flashcard', flashcardSchema);