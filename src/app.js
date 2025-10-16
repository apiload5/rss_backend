// /src/app.js

const express = require('express');
const cors = require('cors');
const { apiLimiter, publicLimiter } = require('./middleware/rateLimiter');
const feedRoutes = require('./routes/feedRoutes');
const authRoutes = require('./routes/authRoutes');
const publicRoutes = require('./routes/publicRoutes');

const app = express();

// ✅ Middleware
app.use(express.json());     // Parse JSON
app.use(cors());             // Enable CORS for all origins (adjust later if needed)

// ✅ Rate Limiting
app.use('/api/', apiLimiter); 
app.use('/api/public', publicLimiter, publicRoutes);

// ✅ Routes
app.use('/api/auth', authRoutes); 
app.use('/api/feeds', feedRoutes);

// ✅ Health Check Route
app.get('/', (req, res) => {
    res.status(200).send('✅ RSS Aggregator Backend API is operational!');
});

// ✅ Export for Vercel
module.exports = app;
