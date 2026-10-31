require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const mongoose = require('../database/models/mongoose');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '25mb' }));

app.get('/api/health', (req, res) =>
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  })
);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/boardings', require('./routes/boardings'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/requests', require('./routes/requests'));

app.use((req, res) => res.status(404).json({ message: 'Route not found.' }));

app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(' ') });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'This email is already registered.' });
  }
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
});

if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
  console.error('Missing MONGO_URI / JWT_SECRET. Copy .env.example to .env and configure it.');
  process.exit(1);
}

connectDB()
  .then(() => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`API available on port ${port}`));
  })
  .catch((err) => {
    console.error('Server startup failed:', err.message);
    process.exit(1);
  });
