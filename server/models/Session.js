const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role:    { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true }
});

const sessionSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  language:    { type: String, required: true },
  level:       { type: String, required: true },
  scenario:    { type: String, required: true },
  messages:    [messageSchema],
  corrections: [{ original: String, corrected: String, explanation: String }],
  newWords:    [{ word: String, translation: String }],
  duration:    { type: Number, default: 0 },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', sessionSchema);