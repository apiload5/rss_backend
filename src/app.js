// /src/app.js

const express = require('express');
const connectDB = require('./config/db'); // نیا DB فنکشن
const feedRoutes = require('./routes/feedRoutes');

// DB سے جڑیں (connectDB اب یہاں کال نہیں ہو گا، یہ server.js میں ہو گا)

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/feeds', feedRoutes);

app.get('/', (req, res) => {
    res.send('RSS Aggregator Backend API is operational!');
});

module.exports = app;
