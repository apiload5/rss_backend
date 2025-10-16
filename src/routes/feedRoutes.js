// src/routes/feedRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { addFeed, getUserFeeds, getFeedItems } = require('../controllers/feedController');

// ✅ Routes
router.post('/add', protect, addFeed);       // Add new feed
router.get('/', protect, getUserFeeds);      // Get all feeds
router.get('/:feedId', protect, getFeedItems); // Get specific feed details

// ✅ Export router
module.exports = router;
