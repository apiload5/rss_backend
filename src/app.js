// /src/app.js

const express = require('express');
const connectDB = require('./config/db');
const feedRoutes = require('./routes/feedRoutes');
const authRoutes = require('./routes/authRoutes');
const publicRoutes = require('./routes/publicRoutes');
const { apiLimiter, publicLimiter } = require('./middleware/rateLimiter'); 
const cors = require('cors'); // اگر آپ فرنٹ اینڈ کے ساتھ ٹیسٹ کر رہے ہیں تو CORS شامل کریں

const app = express();

// Middleware
// ہر request سے پہلے JSON body کو پارس کریں
app.use(express.json());
// CORS کو فعال کریں (صرف ٹیسٹنگ کے لیے)
app.use(cors()); 

// Rate Limiting کو لاگو کریں: 
// 1. تمام محفوظ APIs پر ایک عمومی حد لگائیں
app.use('/api/', apiLimiter); 

// 2. پبلک روٹس پر زیادہ سخت حد لگائیں
app.use('/api/public', publicLimiter, publicRoutes); 

// Routes
// Authentication routes
app.use('/api/auth', authRoutes); 
// Protected user feed management routes
app.use('/api/feeds', feedRoutes);

// Health check / Default Route
app.get('/', (req, res) => {
    res.send('RSS Aggregator Backend API is operational!');
});

module.exports = app;
