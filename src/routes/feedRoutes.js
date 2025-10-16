// src/routes/feedRoutes.js

const express = require('express');
const router = express.Router();

// ✅ Import controller functions
// Make sure this path matches your folder structure exactly
const {
  addFeed,
  getUserFeeds,
  getFeedItems
} = require('../controllers/feedController');

// ✅ Import authentication middleware (agar use kar rahe ho)
const authMiddleware = require('../middleware/authMiddleware');

// ==============================
// 🚀 Routes Configuration
// ==============================

// @route   POST /api/feeds/add
// @desc    Add a new RSS feed for the logged-in user
// @access  Private
router.post('/add', authMiddleware, addFeed);

// @route   GET /api/feeds
// @desc    Get all RSS feeds of the authenticated user
// @access  Private
router.get('/', authMiddleware, getUserFeeds);

// @route   GET /api/feeds/:feedId
// @desc    Get feed items for a specific feed
// @access  Private
router.get('/:feedId', authMiddleware, getFeedItems);

// ==============================
// ✅ Export router
// ==============================
module.exports = router;

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// 🧪 Test route to verify JWT middleware
router.get('/test', authMiddleware, (req, res) => {
    res.json({
        success: true,
        message: 'JWT Verified Successfully!',
        userId: req.userId
    });
});

module.exports = router;

