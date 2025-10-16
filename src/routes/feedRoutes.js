// src/routes/feedRoutes.js

const express = require('express');
const router = express.Router();
// Yahan hum controllers ke functions ko sahi CommonJS tareeqay se require kar rahe hain.
const { addFeed, getUserFeeds, getFeedItems } = require('../controllers/feedController'); 
const { protect } = require('../middleware/authMiddleware'); // authMiddleware ki zaroorat hai routes ko protect karne ke liye

// Har route (API call) jo iske baad ayega, woh protect middleware se guzrega (yani JWT token zaroori hoga)
router.use(protect);

// @route   POST /api/feeds/add
// @desc    Add a new RSS feed URL
// @access  Private
router.post('/add', addFeed);

// @route   GET /api/feeds
// @desc    Get all user feeds (overview)
// @access  Private
router.get('/', getUserFeeds);

// @route   GET /api/feeds/:feedId
// @desc    Get detailed items for a specific feed
// @access  Private
router.get('/:feedId', getFeedItems);


module.exports = router;
