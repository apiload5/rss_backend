// /src/app.js

const express = require('express');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feedRoutes');

const app = express();

// Middleware
app.use(express.json());

// Database Connection (MongoDB example)
const DB_URI = process.env.MONGO_URI; 

mongoose.connect(DB_URI)
  .then(() => console.log('Database connected successfully!'))
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1); // اگر کنکشن فیل ہو جائے تو ایپلیکیشن سے باہر نکل جائیں
  });

// Routes
app.use('/api/feeds', feedRoutes);

// Basic health check route
app.get('/', (req, res) => {
    res.send('RSS Aggregator Backend API is operational!');
});

module.exports = app;
