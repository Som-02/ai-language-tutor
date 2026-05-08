const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes      = require('./routes/auth');
const chatRoutes      = require('./routes/chat');
const sessionRoutes   = require('./routes/sessions');
const flashcardRoutes = require('./routes/flashcards');
const progressRoutes  = require('./routes/progress');

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth',       authRoutes);
app.use('/api/chat',       chatRoutes);
app.use('/api/sessions',   sessionRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/progress',   progressRoutes);

// Health check
app.get('/', (req, res) => res.json({ status: 'AI Language Tutor API running' }));

// Connect to MongoDB then start server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch(err => console.error('MongoDB connection error:', err));