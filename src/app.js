// /src/app.js

const express = require('express');
const connectDB = require('./config/db');
const feedRoutes = require('./routes/feedRoutes');
const authRoutes = require('./routes/authRoutes');
const publicRoutes = require('./routes/publicRoutes'); // publicRoutes شامل کریں

const app = express();
// ... (Middleware remains the same)

// Routes
app.use('/api/auth', authRoutes); 
app.use('/api/feeds', feedRoutes);
app.use('/api/public', publicRoutes); // Public routes شامل کریں

app.get('/', (req, res) => {
    res.send('RSS Aggregator Backend API is operational!');
});

module.exports = app;
