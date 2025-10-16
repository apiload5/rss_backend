// src/server.js (Main Application File)
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Init Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define Routes
// Yahan hum routes ko jod rahe hain.
// Ensure ki yeh files theek hon: userRoutes.js aur feedRoutes.js
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/feeds', require('./routes/feedRoutes'));

// Simple default route for checking server status
app.get('/', (req, res) => {
    res.send('RSS Backend API is running!');
});

// Vercel deployment ke liye, humein port ki zaroorat nahi hai.
// Export the app for Vercel's serverless function handler.
module.exports = app;
