// /src/routes/feedRoutes.js

const express = require('express');
const feedController = require('../controllers/feedController');
const { protect } = require('../middleware/authMiddleware'); // protect middleware امپورٹ کریں

const router = express.Router();

// تمام روٹس کو 'protect' middleware سے محفوظ کریں

// 1. فیڈ شامل کرنا (آخری جواب میں بنایا گیا)
// POST /api/feeds/add 
router.post('/add', protect, feedController.addFeed); // <-- 'protect' شامل کیا گیا

// 2. تمام فیڈز دیکھنا (صرف لاگ ان یوزر کی)
// GET /api/feeds 
router.get('/', protect, feedController.getFeeds);

// 3. مخصوص فیڈ کو دیکھنا اور ڈیلیٹ کرنا
// GET /api/feeds/:id
router.get('/:id', protect, feedController.getFeedById);

// DELETE /api/feeds/:id
router.delete('/:id', protect, feedController.deleteFeed);

// 4. فیڈ کے تمام آرٹیکلز دیکھنا
// GET /api/feeds/:feedId/articles
router.get('/:feedId/articles', protect, feedController.getFeedArticles);


module.exports = router;
