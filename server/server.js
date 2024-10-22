const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');  // Ensure this matches the correct path
const bannerRoutes = require('./routes/banner');  // Ensure this matches the correct path

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// MongoDB connection with logging
(async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process if connection fails
  }
})();

// Routes
app.use('/api/auth', authRoutes);  // Auth routes
app.use('/api/banner', bannerRoutes);  // Banner routes

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
