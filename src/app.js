// /src/app.js

const express = require('express');
const connectDB = require('./config/db');
const feedRoutes = require('./routes/feedRoutes');
const authRoutes = require('./routes/authRoutes'); // authRoutes امپورٹ کریں

const app = express();
// ... (Middleware remains the same)

// Routes
app.use('/api/auth', authRoutes); // Auth routes شامل کریں
app.use('/api/feeds', feedRoutes);

app.get('/', (req, res) => {
    res.send('RSS Aggregator Backend API is operational!');
});

module.exports = app;
